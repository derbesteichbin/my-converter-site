require('dotenv').config();
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

// CORS — allow the frontend origin (Vercel in production, localhost in dev)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://my-converter-site.vercel.app',
  'https://my-converter-site-git-main-derbesteichbin391-9585s-projects.vercel.app',
  'https://my-converter-site-gav4214wy-derbesteichbin391-9585s-projects.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
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
