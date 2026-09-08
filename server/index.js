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
const {
  loginLimiter,
  registerLimiter,
  emailLimiter,
  conversionLimiter,
  pollLimiter,
  globalLimiter,
  isJobStatusPoll,
} = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 8080;

// Railway terminates TLS at a single proxy hop. Without this req.ip is the
// proxy's address and every visitor would share one rate-limit bucket.
// Deliberately 1, not `true`: trusting every hop lets a client forge
// X-Forwarded-For and sidestep the limits entirely.
app.set('trust proxy', 1);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// ── CORS ─────────────────────────────────────────────────────────────
//
// Exact-match allowlist only. This previously accepted any origin ending in
// ".vercel.app" alongside credentials:true and SameSite=None cookies — and
// anyone can deploy a free site to *.vercel.app, so any attacker page could
// make credentialed requests as a signed-in user. Wildcards are gone; add a
// preview deployment by listing it in EXTRA_ALLOWED_ORIGINS instead.
const allowedOrigins = new Set(
  [
    // Production
    'https://www.convertanyformat.com',
    'https://convertanyformat.com',
    // The Vercel deployments actually in use for this project
    'https://my-converter-site.vercel.app',
    'https://my-converter-site-git-main-derbesteichbin391-9585s-projects.vercel.app',
    // Local development (Vite dev server, and its fallback ports)
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    // Wherever this deployment says its frontend lives
    process.env.CLIENT_URL,
    // Comma-separated exact origins, e.g. one-off Vercel preview URLs
    ...String(process.env.EXTRA_ALLOWED_ORIGINS || '').split(','),
  ]
    .map((o) => (o || '').trim().replace(/\/$/, ''))
    .filter(Boolean)
);

console.log(`[CORS] ${allowedOrigins.size} allowed origins:`, [...allowedOrigins].join(', '));

function isAllowedOrigin(origin) {
  // No Origin header: same-origin navigations, curl, Stripe webhooks. These
  // are not cross-site browser requests, so CORS has nothing to say about them.
  if (!origin) return true;
  return allowedOrigins.has(origin.replace(/\/$/, ''));
}

app.use(
  cors({
    // Report the decision rather than throwing: an Error here surfaces as a
    // 500, which is a confusing way to say "not allowed".
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
  })
);

// Refuse disallowed cross-origin requests outright.
//
// Withholding CORS headers only stops the *browser* from reading the
// response; a simple request (a multipart POST, say) would still have run on
// the server with the victim's cookies attached. Rejecting here means it
// never reaches a route.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin)) {
    console.log('[CORS] Blocked origin:', origin);
    return res.status(403).json({ error: 'Origin not allowed', code: 'cors_forbidden' });
  }
  next();
});
app.use(cookieParser());

// Parse JSON for all routes except the Stripe webhook (which needs raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') return next();
  express.json()(req, res, next);
});

// ── Rate limiting ────────────────────────────────────────────────────
// Mounted before the routes. Specific limiters first, then the global
// backstop, so an endpoint gets the tighter of the two.
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/forgot-password', emailLimiter);

// Endpoints that send mail on every successful call.
app.use('/api/contact', emailLimiter);
app.use('/api/report', emailLimiter);
app.use('/api/billing/contact', emailLimiter);

// Paid, expensive work.
app.use('/api/convert', conversionLimiter);
app.use('/api/smart', conversionLimiter);
app.use('/api/metadata', conversionLimiter);

// The 2-second job poll, which is far chattier than anything else.
app.use((req, res, next) => (isJobStatusPoll(req) ? pollLimiter(req, res, next) : next()));

// Everything else on /api.
app.use('/api', globalLimiter);

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
