const express = require('express');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// POST /api/billing/create-checkout — create a Stripe Checkout Session
router.post('/create-checkout', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${process.env.CLIENT_URL}/dashboard?upgraded=1`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/billing/webhook — handle Stripe webhook events
// NOTE: this route needs the raw body, not JSON-parsed
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // No webhook secret configured — parse directly (dev only)
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'pro' },
        });

        // Create or update subscription record
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer,
            plan: 'pro',
            status: 'active',
          },
          update: {
            stripeCustomerId: session.customer,
            plan: 'pro',
            status: 'active',
          },
        });

        console.log(`User ${userId} upgraded to pro`);
      } catch (err) {
        console.error('Failed to update user plan:', err);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
