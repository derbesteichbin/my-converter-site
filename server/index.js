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
const PORT = process.env.PORT || 3000;

// CORS — allow the Vite dev server (port 5173) to talk to this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
