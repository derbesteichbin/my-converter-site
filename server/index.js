console.log('DB:' + (process.env.DATABASE_URL ? 'SET' : 'MISSING') + ' JWT:' + (process.env.JWT_SECRET ? 'SET' : 'MISSING') + ' STRIPE:' + (process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING'));
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
app.use(cookieParser());

// Billing routes — mounted before express.json() so the webhook
// route's express.raw() middleware receives the unparsed body
app.use('/api/billing', billingRoutes);

app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Conversion + job routes
app.use('/api/convert', convertRoutes);
app.use('/api', convertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ── Auto-delete files older than 24 hours ────────────────────────────
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const OUTPUT_DIR = path.join(__dirname, 'outputs');
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanOldFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const now = Date.now();
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > MAX_AGE_MS) {
        fs.unlinkSync(filePath);
        console.log(`[cleanup] Deleted ${filePath}`);
      }
    } catch (err) {
      console.error(`[cleanup] Failed to delete ${filePath}:`, err.message);
    }
  }
}

function runCleanup() {
  console.log('[cleanup] Running file cleanup...');
  cleanOldFiles(UPLOAD_DIR);
  cleanOldFiles(OUTPUT_DIR);
}

// Run cleanup on startup and every hour
runCleanup();
setInterval(runCleanup, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
