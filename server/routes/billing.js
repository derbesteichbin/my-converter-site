const express = require('express');
const Stripe = require('stripe');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { Resend } = require('resend');

const router = express.Router();

// Credit packs: priceId -> credits to add
const CREDIT_PACKS = {
  [process.env.STRIPE_PRICE_SINGLE || 'price_single']: 1,
  [process.env.STRIPE_PRICE_10 || 'price_10pack']: 10,
  [process.env.STRIPE_PRICE_30 || 'price_30pack']: 30,
};

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

    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId is required' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { priceId },
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
      const creditsToAdd = CREDIT_PACKS[priceId] || 0;
      if (creditsToAdd > 0) {
        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: creditsToAdd } },
          });
          console.log(`User ${userId} purchased ${creditsToAdd} credits`);

          // Notify owner
          if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A';
            const currency = (session.currency || 'eur').toUpperCase();
            resend.emails.send({
              from: 'ConvertAnything <noreply@resend.dev>',
              to: process.env.OWNER_EMAIL,
              subject: 'New Pro upgrade on ConvertAnything',
              html: `<p>A user just purchased credits:</p><ul><li><strong>Email:</strong> ${user.email}</li><li><strong>Credits:</strong> ${creditsToAdd}</li><li><strong>Amount:</strong> ${amount} ${currency}</li><li><strong>Date:</strong> ${new Date().toISOString()}</li></ul>`,
            }).catch((err) => console.error('[billing] Owner notification failed:', err.message));
          }
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
            from: 'ConvertAnything <noreply@resend.dev>',
            to: process.env.OWNER_EMAIL,
            subject: 'User cancelled subscription on ConvertAnything',
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
    const { name, companyEmail, description } = req.body;
    if (!name || !companyEmail || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (resend) {
      await resend.emails.send({
        from: 'Converter <noreply@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'noreply@resend.dev',
        subject: `Business inquiry from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Company Email:</strong> ${companyEmail}</p><p><strong>Description:</strong></p><p>${description}</p>`,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
