console.log('DB:' + (process.env.DATABASE_URL ? 'SET' : 'MISSING') + ' JWT:' + (process.env.JWT_SECRET ? 'SET' : 'MISSING') + ' STRIPE:' + (process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING') + ' RESEND:' + (process.env.RESEND_API_KEY ? 'SET' : 'MISSING'));
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const convertRoutes = require('./routes/convert');
const billingRoutes = require('./routes/billing');
const metadataRoutes = require('./routes/metadata');
const profileRoutes = require('./routes/profile');
const smartFunctionsRoutes = require('./routes/smartFunctions');
const reviewsRoutes = require('./routes/reviews');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 8080;

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// CORS — allow convertanyformat.com (and subdomains), legacy Vercel URLs,
// and localhost. Vercel URLs remain allowed so old links keep working.
const allowedOrigins = [
  'http://localhost:5173',
  'https://convertanyformat.com',
  'https://www.convertanyformat.com',
  'https://my-converter-site.vercel.app',
  'https://my-converter-site-git-main-derbesteichbin391-9585s-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.endsWith('.convertanyformat.com') ||
        origin.endsWith('.vercel.app') ||
        allowedOrigins.includes(origin)
      ) {
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

// Parse JSON for all routes except the Stripe webhook (which needs raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') return next();
  express.json()(req, res, next);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Billing routes
app.use('/api/billing', billingRoutes);

// Conversion + job routes
app.use('/api/convert', convertRoutes);
app.use('/api', convertRoutes);

// Metadata route
app.use('/api/metadata', metadataRoutes);

// Profile route
app.use('/api/profile', profileRoutes);

// Smart Functions (OpenAI TTS / Whisper) routes
app.use('/api/smart', smartFunctionsRoutes);

// User reviews
app.use('/api/reviews', reviewsRoutes);

// Problem reports (owner-only; never displayed publicly)
app.use('/api/report', reportRoutes);

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const prisma = require('./lib/prisma');
    await prisma.contact.create({ data: { name, email, subject, message } });
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

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
