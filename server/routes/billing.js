const express = require('express');
const Stripe = require('stripe');
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

// Public-facing promo code → resolves to STRIPE_COUPON_ID at checkout time.
// The user types this; we map it to the Stripe coupon ID server-side so
// the actual coupon can be rotated without changing the customer-facing
// code. Comparison is case-insensitive.
const PROMO_CODES = {
  'convertanyformat2026': () => process.env.STRIPE_COUPON_ID,
};

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

    // Resolve promo code → Stripe coupon ID. We accept the friendly code
    // ("convertanyformat2026") and look up the real coupon ID from env.
    // Silently ignore unknown codes / unconfigured coupons so checkout
    // still proceeds at full price rather than failing.
    const discounts = [];
    if (promoCode && typeof promoCode === 'string') {
      const resolver = PROMO_CODES[promoCode.trim().toLowerCase()];
      const couponId = resolver && resolver();
      if (couponId) discounts.push({ coupon: couponId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: packDef.priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { pack, priceId: packDef.priceId, promoCode: promoCode || '' },
      ...(discounts.length > 0 ? { discounts } : {}),
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?purchased=1`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/billing/webhook — handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Billing is not configured' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const priceId = session.metadata?.priceId;

    if (userId && priceId) {
      const creditsToAdd = PRICE_TO_CREDITS[priceId] || 0;
      if (creditsToAdd > 0) {
        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: creditsToAdd } },
          });
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
          console.error('Failed to add credits:', err);
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
    } catch (err) {
      console.error('Failed to handle subscription deletion:', err);
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
