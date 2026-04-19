const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const passport = require('../lib/passport');

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function setTokenCookie(res, userId) {
  const token = signToken(userId);
  res.cookie('token', token, COOKIE_OPTIONS);
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, ref } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = 'ref_' + crypto.randomBytes(6).toString('hex');

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, referralCode, referredBy: ref || null, credits: 1 },
    });

    // Give referrer 5 bonus credits
    if (ref) {
      prisma.user.updateMany({
        where: { referralCode: ref },
        data: { credits: { increment: 5 } },
      }).catch(() => {});
    }

    setTokenCookie(res, user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, plan: user.plan } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setTokenCookie(res, user.id);
    res.json({ user: { id: user.id, email: user.email, plan: user.plan } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Google OAuth ────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login` }),
  (req, res) => {
    setTokenCookie(res, req.user.id);
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// ── Apple OAuth ─────────────────────────────────────────────────────
router.get('/apple', passport.authenticate('apple', { session: false }));

router.post('/apple/callback', passport.authenticate('apple', { session: false, failureRedirect: `${CLIENT_URL}/login` }),
  (req, res) => {
    setTokenCookie(res, req.user.id);
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ user: null });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: decoded.userId } });
  } catch {
    res.json({ user: null });
  }
});

// POST /api/auth/generate-api-key
router.post('/generate-api-key', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const apiKey = 'cvt_' + crypto.randomBytes(24).toString('hex');
    await prisma.user.update({ where: { id: decoded.userId }, data: { apiKey } });
    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// GET /api/auth/api-key
router.get('/api-key', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    res.json({ apiKey: user?.apiKey || null });
  } catch {
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
});

module.exports = router;
