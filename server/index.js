require('dotenv').config();
console.log('ENV CHECK:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
  NODE_ENV: process.env.NODE_ENV,
});
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const convertRoutes = require('./routes/convert');
const billingRoutes = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS — allow any Vercel subdomain and localhost
const allowedOrigins = [
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('[CORS] Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// Stripe webhook needs raw body — mount before express.json()
app.use('/api/billing/webhook', billingRoutes);

app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRoutes);

// Billing routes (non-webhook)
app.use('/api/billing', billingRoutes);

// Conversion + job routes
app.use('/api/convert', convertRoutes);
app.use('/api', convertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
