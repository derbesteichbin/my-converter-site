const express = require('express');
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { Resend } = require('resend');
const { notifyNewPurchase, notifyBusinessInquiry } = require('../lib/notifyOwner');

const router = express.Router();

// Credit packs: pack name -> { priceId, credits }
const CREDIT_PACKS = {
  pack1:  { priceId: 'price_1TRK6TCwJPjxuD4WYNtCJfDp', credits: 1 },
  pack10: { priceId: 'price_1TRK79CwJPjxuD4WylY1TID5', credits: 10 },
  pack30: { priceId: 'price_1TRKADCwJPjxuD4WbeKGz1n0', credits: 30 },
};

// Customer-facing promo codes we accept. Membership here only decides whether
// we bother asking Stripe — Stripe remains the authority on whether the
// discount is real, still active, and applicable to this customer.
const PROMO_CODES = new Set(['convertanyformat2026']);

// Reverse lookup: Stripe priceId -> credits
const PRICE_TO_CREDITS = {};
for (const [, pack] of Object.entries(CREDIT_PACKS)) {
  PRICE_TO_CREDITS[pack.priceId] = pack.credits;
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  try { return new Stripe(process.env.STRIPE_SECRET_KEY); }
  catch { return null; }
}

// ── Promotions ───────────────────────────────────────────────────────

// Resolve the configured discount to a Stripe *promotion code* object.
//
// Restrictions such as first_time_transaction live on the promotion code,
// not on the coupon underneath it, so a promotion code is what checkout must
// be given. STRIPE_COUPON_ID may hold either form, so accept both: a
// "promo_..." id is used directly, a bare coupon id is resolved to the active
// promotion code that wraps it, and as a last resort we look the code up by
// the customer-facing string.
//
// Returns { promotionCode } or { error } — never throws.
//
// Deliberately does NOT filter on active:true. A deactivated promotion code
// still reports its `restrictions`, and we need those to tell a returning
// customer "you already used this" instead of a generic failure. Whether the
// promotion is still usable is decided separately, by promotionUnusableReason().
async function resolvePromotionCode(stripe, typedCode) {
  const configured = (process.env.STRIPE_COUPON_ID || '').trim();
  if (!configured) return { error: 'not_configured' };

  // Prefer an active promotion code, but fall back to an inactive one so the
  // caller can explain *why* rather than treating it as misconfiguration.
  const pick = (list) => list.find((p) => p.active) || list[0] || null;

  try {
    if (configured.startsWith('promo_')) {
      const pc = await stripe.promotionCodes.retrieve(configured);
      if (!pc) return { error: 'not_found' };
      return { promotionCode: pc };
    }

    const byCoupon = pick((await stripe.promotionCodes.list({ coupon: configured, limit: 100 })).data);
    if (byCoupon) return { promotionCode: byCoupon };

    const byCode = pick(
      (await stripe.promotionCodes.list({ code: String(typedCode || '').toUpperCase(), limit: 100 })).data
    );
    if (byCode) return { promotionCode: byCode };

    return { error: 'not_found' };
  } catch (err) {
    console.error('[billing] Promotion code lookup failed:', err.message);
    return { error: 'lookup_failed' };
  }
}

// Why a promotion cannot be used right now, or null if it can.
//
// These are "the offer is over" conditions — distinct from the server being
// misconfigured, and they must never share a message with it. Note that a
// coupon carrying max_redemptions is exhausted *globally* after that many
// redemptions (a common mix-up with per-customer limits), which deactivates
// the promotion code for everyone.
function promotionUnusableReason(promotionCode, coupon) {
  if (promotionCode.active === false) return 'inactive';
  if (promotionCode.expires_at && promotionCode.expires_at * 1000 < Date.now()) return 'expired';
  if (
    promotionCode.max_redemptions != null &&
    promotionCode.times_redeemed >= promotionCode.max_redemptions
  ) {
    return 'exhausted';
  }
  if (coupon && coupon.valid === false) return 'coupon_exhausted';
  return null;
}

// User-facing messages. Kept as named constants so the three failure modes
// can never drift into sharing wording again.
const MSG_INVALID_CODE = "This promo code doesn't exist or is no longer valid.";
const MSG_ALREADY_USED = "You've already used this code — it's valid only on your first purchase.";
const MSG_PROMO_ENDED = 'This promotion has ended and is no longer available.';
const MSG_PROMO_MISCONFIGURED = 'This promotion is temporarily unavailable. Please try again later.';

// Load the Coupon behind a promotion code.
//
// The promotion code object exposes it differently across Stripe API
// versions: older versions embed an expanded `coupon` object, current ones
// return `promotion: { coupon: '<id>', type: 'coupon' }` carrying only an id
// and no `coupon` field at all. Resolve every shape to a real Coupon instead
// of trusting one — reading percent_off off the wrong shape yields undefined,
// which would quietly quote an undiscounted price.
async function loadCoupon(stripe, promotionCode) {
  const direct = promotionCode.coupon;
  if (direct && typeof direct === 'object') return direct;

  const couponId =
    (typeof direct === 'string' && direct) ||
    (typeof promotionCode.promotion?.coupon === 'string' && promotionCode.promotion.coupon) ||
    null;

  if (!couponId) return null;
  try {
    return await stripe.coupons.retrieve(couponId);
  } catch (err) {
    console.error('[billing] Could not load coupon for promotion code:', err.message);
    return null;
  }
}

// Mirror Stripe's own discount arithmetic: the *discount* is rounded to the
// nearest minor unit (ties up) and then subtracted, which is not the same as
// rounding the discounted total. For 799 at 50% off that is 799 - 400 = 399,
// not 400. Getting this backwards is a one-cent mismatch between the quoted
// and charged price, which is the whole bug this endpoint exists to prevent.
function applyCoupon(amountMinor, coupon) {
  if (coupon.percent_off != null) {
    const discount = Math.round((amountMinor * coupon.percent_off) / 100);
    return Math.max(0, amountMinor - discount);
  }
  if (coupon.amount_off != null) {
    return Math.max(0, amountMinor - coupon.amount_off);
  }
  return amountMinor;
}

const formatMinor = (minor) => (minor / 100).toFixed(2);

// Has this user ever paid us before?
//
// Local order history is authoritative when it exists, but the Purchase table
// only starts from its migration: accounts that bought earlier have no rows,
// and older accounts also have no stripeCustomerId, so a purely local check
// would call them first-time buyers. Fall back to Stripe's own record, by
// stored customer id or by email.
//
// Fails open on a lookup error: Stripe still enforces first_time_transaction
// when the session is created, so the worst case is a clear refusal at
// checkout rather than an unearned discount.
async function hasPurchasedBefore(stripe, user) {
  const local = await prisma.purchase.count({ where: { userId: user.id } });
  if (local > 0) return true;

  try {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const found = await stripe.customers.list({ email: user.email, limit: 1 });
      customerId = found.data[0]?.id || null;
    }
    if (!customerId) return false;

    const charges = await stripe.charges.list({ customer: customerId, limit: 10 });
    return charges.data.some((c) => c.paid && !c.refunded);
  } catch (err) {
    console.error('[billing] Stripe purchase-history lookup failed:', err.message);
    return false;
  }
}

// A persistent Stripe Customer per user. first_time_transaction is evaluated
// against a customer's charge history, so a fresh per-session customer_email
// would make every purchase look like a first purchase.
async function getOrCreateStripeCustomer(stripe, user) {
  if (user.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(user.stripeCustomerId);
      if (existing && !existing.deleted) return existing.id;
    } catch {
      // Customer was deleted in Stripe — fall through and make a new one.
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

// POST /api/billing/validate-promo — verify a promo code against Stripe and
// return the real price of every pack under it.
//
// This is the single source of pricing truth: base amounts come from the
// Stripe Price objects and the discount from the Stripe Coupon, so the
// browser never invents a number. Auth is optional — a signed-out visitor
// still gets accurate prices; only the eligibility flag needs an account.
router.post('/validate-promo', async (req, res) => {
  try {
    const stripe = getStripe();
    // Every response on this route carries a `code` the client maps to a
    // localized string, so nothing here reaches the user as fixed English.
    if (!stripe) {
      return res.status(503).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
    }

    const raw = typeof req.body?.promoCode === 'string' ? req.body.promoCode.trim() : '';
    if (!raw) return res.status(400).json({ error: 'Enter a promo code', code: 'invalid_promo' });

    // Unknown code: reject clearly. Never fall through to full price.
    if (!PROMO_CODES.has(raw.toLowerCase())) {
      return res.status(400).json({ error: MSG_INVALID_CODE, code: 'invalid_promo' });
    }

    const resolved = await resolvePromotionCode(stripe, raw);
    if (resolved.error) {
      // Genuine server-side misconfiguration: the env var is missing, or it
      // names a promotion Stripe does not have. Distinct from "the offer
      // ended" and from "you already used it".
      console.error(`[billing] Promo "${raw}" could not be resolved (${resolved.error}). Check STRIPE_COUPON_ID.`);
      return res.status(503).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
    }

    const { promotionCode } = resolved;
    const firstPurchaseOnly = Boolean(promotionCode.restrictions?.first_time_transaction);

    // Who is asking? Needed before the checks below, because "you already used
    // this" must win over any global state of the promotion.
    let viewer = null;
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        viewer = await prisma.user.findUnique({ where: { id: decoded.userId } });
      } catch {
        // Signed out or stale token — eligibility is decided at checkout.
      }
    }

    // ── User-specific rejection comes FIRST ──────────────────────────
    // A returning customer must be told they already used the code, even when
    // the promotion has since been exhausted or deactivated globally. Checking
    // the promotion's own state first is what made this report a misleading
    // "temporarily unavailable".
    if (firstPurchaseOnly && viewer && (await hasPurchasedBefore(stripe, viewer))) {
      return res.json({
        valid: true,
        code: promotionCode.code,
        firstPurchaseOnly: true,
        eligible: false,
        ineligibleReason: MSG_ALREADY_USED,
        reasonCode: 'promo_already_used',
        packs: null,
      });
    }

    const coupon = await loadCoupon(stripe, promotionCode);

    // ── The offer itself is over (ended, expired, fully redeemed) ────
    const unusable = promotionUnusableReason(promotionCode, coupon);
    if (unusable) {
      console.warn(`[billing] Promotion ${promotionCode.id} is not usable (${unusable}).`);
      return res.status(400).json({ error: MSG_PROMO_ENDED, code: 'promo_ended' });
    }

    // ── Actual misconfiguration: no discount attached ────────────────
    if (!coupon || (coupon.percent_off == null && coupon.amount_off == null)) {
      console.error(`[billing] Promotion ${promotionCode.id} has no usable discount attached.`);
      return res.status(503).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
    }

    // Real amounts, straight from Stripe.
    const entries = Object.entries(CREDIT_PACKS);
    const prices = await Promise.all(entries.map(([, p]) => stripe.prices.retrieve(p.priceId)));

    const packs = {};
    let currency = 'eur';
    entries.forEach(([packId], i) => {
      const price = prices[i];
      const base = price.unit_amount;
      const final = applyCoupon(base, coupon);
      currency = price.currency || currency;
      packs[packId] = {
        base,
        final,
        baseFormatted: formatMinor(base),
        finalFormatted: formatMinor(final),
      };
    });

    // Reaching here means the promotion is live and this viewer is eligible
    // (ineligible viewers returned above).
    res.json({
      valid: true,
      code: promotionCode.code,
      currency,
      firstPurchaseOnly,
      eligible: true,
      ineligibleReason: null,
      reasonCode: null,
      discount: {
        percentOff: coupon.percent_off ?? null,
        amountOff: coupon.amount_off ?? null,
      },
      packs,
    });
  } catch (err) {
    console.error('Validate promo error:', err);
    // Transient failure. Reuses the "try again later" code so the client can
    // localize it, rather than surfacing an English string.
    res.status(500).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
  }
});

// POST /api/billing/create-checkout — create a Stripe Checkout Session for credit packs
router.post('/create-checkout', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ error: 'Billing is not configured' });

    const { pack, promoCode } = req.body;
    const packDef = CREDIT_PACKS[pack];
    if (!packDef) return res.status(400).json({ error: 'Invalid pack. Use pack1, pack10, or pack30.' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Resolve the promo code, if one was supplied. Every failure below is
    // surfaced to the user — a discount that cannot be applied must stop the
    // purchase, never quietly proceed at full price.
    const discounts = [];
    let appliedCode = '';
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const raw = promoCode.trim();

      if (!PROMO_CODES.has(raw.toLowerCase())) {
        return res.status(400).json({ error: MSG_INVALID_CODE, code: 'invalid_promo' });
      }

      const resolved = await resolvePromotionCode(stripe, raw);
      if (resolved.error) {
        console.error(`[billing] Promo "${raw}" could not be resolved (${resolved.error}). Check STRIPE_COUPON_ID.`);
        return res.status(503).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
      }

      const { promotionCode } = resolved;

      // Same ordering as validate-promo: the user-specific answer wins, so a
      // returning customer is never told the promotion is "unavailable".
      if (promotionCode.restrictions?.first_time_transaction && (await hasPurchasedBefore(stripe, user))) {
        return res.status(400).json({ error: MSG_ALREADY_USED, code: 'promo_already_used' });
      }

      const coupon = await loadCoupon(stripe, promotionCode);
      const unusable = promotionUnusableReason(promotionCode, coupon);
      if (unusable) {
        console.warn(`[billing] Promotion ${promotionCode.id} is not usable (${unusable}).`);
        return res.status(400).json({ error: MSG_PROMO_ENDED, code: 'promo_ended' });
      }
      if (!coupon || (coupon.percent_off == null && coupon.amount_off == null)) {
        console.error(`[billing] Promotion ${promotionCode.id} has no usable discount attached.`);
        return res.status(503).json({ error: MSG_PROMO_MISCONFIGURED, code: 'promo_not_configured' });
      }

      discounts.push({ promotion_code: promotionCode.id });
      appliedCode = promotionCode.code;
    }

    // Persistent customer, so Stripe can evaluate first_time_transaction
    // against real charge history. Note `customer` and `customer_email` are
    // mutually exclusive in the Checkout API.
    const customerId = await getOrCreateStripeCustomer(stripe, user);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: packDef.priceId, quantity: 1 }],
      customer: customerId,
      client_reference_id: user.id,
      metadata: { pack, priceId: packDef.priceId, promoCode: appliedCode },
      ...(discounts.length > 0 ? { discounts } : {}),
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?purchased=1`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    // Stripe refuses the session when a promotion code's restrictions are not
    // met (e.g. the customer already has a charge). Translate that into a
    // clear message instead of a generic failure.
    if (err?.type === 'StripeInvalidRequestError' && /promotion|coupon|discount/i.test(err.message || '')) {
      console.error('Checkout rejected the promotion:', err.message);
      return res.status(400).json({ error: MSG_ALREADY_USED, code: 'promo_already_used' });
    }
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/billing/webhook — handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Billing is not configured' });

  // Signature verification is mandatory. Without the secret we cannot tell a
  // real Stripe event from a forged POST, and this endpoint grants credits —
  // so refuse outright rather than trusting unsigned input.
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[billing] STRIPE_WEBHOOK_SECRET is not set — refusing to process webhook');
    return res.status(500).json({ error: 'Webhook signature verification is not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Idempotency: Stripe retries on timeouts and non-2xx responses, so an
  // event may arrive more than once. Every handled event is recorded in the
  // same transaction as its side effect — see below.
  try {
    const seen = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
    if (seen) {
      console.log(`[billing] Event ${event.id} already processed — skipping`);
      return res.json({ received: true, duplicate: true });
    }
  } catch (err) {
    console.error('[billing] Idempotency lookup failed:', err);
    return res.status(500).json({ error: 'Could not verify event state' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const priceId = session.metadata?.priceId;

    if (userId && priceId) {
      const creditsToAdd = PRICE_TO_CREDITS[priceId] || 0;
      if (creditsToAdd > 0) {
        try {
          // Recording the event, the order and the credits in one transaction
          // makes this exactly-once: a concurrent retry hits a unique
          // constraint (event id or session id) and the whole thing rolls
          // back, granting nothing and recording nothing.
          const [, , user] = await prisma.$transaction([
            prisma.stripeEvent.create({ data: { id: event.id, type: event.type } }),
            prisma.purchase.create({
              data: {
                userId,
                stripeSessionId: session.id,
                paymentIntentId:
                  typeof session.payment_intent === 'string' ? session.payment_intent : null,
                pack: session.metadata?.pack || 'unknown',
                credits: creditsToAdd,
                // What was actually paid, after any discount — the audit trail
                // must reflect Stripe, not our quote.
                amountPaid: typeof session.amount_total === 'number' ? session.amount_total : 0,
                currency: session.currency || 'eur',
                promoCodeUsed: session.metadata?.promoCode || null,
              },
            }),
            prisma.user.update({
              where: { id: userId },
              data: { credits: { increment: creditsToAdd } },
            }),
          ]);
          console.log(`User ${userId} purchased ${creditsToAdd} credits`);

          const amountEuros = typeof session.amount_total === 'number'
            ? session.amount_total / 100
            : null;
          notifyNewPurchase({
            email: user.email,
            pack: session.metadata?.pack,
            amountEuros,
          });
        } catch (err) {
          if (err.code === 'P2002') {
            // A concurrent delivery of the same event already committed.
            console.log(`[billing] Event ${event.id} processed concurrently — skipping`);
            return res.json({ received: true, duplicate: true });
          }
          // Nothing was committed. Return non-2xx so Stripe retries, rather
          // than reporting success on a purchase that granted no credits.
          console.error('Failed to add credits:', err);
          return res.status(500).json({ error: 'Failed to apply purchase' });
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    try {
      const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
      if (sub) {
        const user = await prisma.user.findUnique({ where: { id: sub.userId } });
        await prisma.subscription.delete({ where: { id: sub.id } });
        await prisma.user.update({ where: { id: sub.userId }, data: { plan: 'free' } });
        console.log(`Subscription cancelled for user ${sub.userId}`);

        // Notify owner
        if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL && user) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          resend.emails.send({
            from: 'ConvertAnyFormat <noreply@convertanyformat.com>',
            to: process.env.OWNER_EMAIL,
            subject: 'User cancelled subscription on ConvertAnyFormat',
            html: `<p>A user cancelled their subscription:</p><ul><li><strong>Email:</strong> ${user.email}</li><li><strong>Date:</strong> ${new Date().toISOString()}</li></ul>`,
          }).catch((err) => console.error('[billing] Cancel notification failed:', err.message));
        }
      }
      await prisma.stripeEvent.create({ data: { id: event.id, type: event.type } });
    } catch (err) {
      if (err.code === 'P2002') {
        return res.json({ received: true, duplicate: true });
      }
      console.error('Failed to handle subscription deletion:', err);
      return res.status(500).json({ error: 'Failed to apply subscription change' });
    }
  }

  res.json({ received: true });
});

// POST /api/billing/contact — Business plan contact form
router.post('/contact', protect, async (req, res) => {
  try {
    const { name, company, companyEmail, description } = req.body;
    if (!name || !companyEmail || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await notifyBusinessInquiry({
      name,
      company,
      email: companyEmail,
      message: description,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
