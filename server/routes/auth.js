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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    // Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('[forgot-password] RESEND_API_KEY is not set — cannot send email');
      console.log('[forgot-password] Reset link (for dev):', resetLink);
      return res.json({ ok: true });
    }

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('[forgot-password] Sending reset email to:', email);
    const emailResult = await resend.emails.send({
      from: 'Converter <noreply@resend.dev>',
      to: email,
      subject: 'Reset your password — Converter',
      html: [
        '<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">',
        '<h2 style="margin: 0 0 1rem;">Reset your password</h2>',
        '<p>We received a request to reset the password for your Converter account.</p>',
        `<p style="margin: 1.5rem 0;"><a href="${resetLink}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset password</a></p>`,
        `<p style="font-size: 0.875rem; color: #888;">Or copy this link: ${resetLink}</p>`,
        '<p style="font-size: 0.875rem; color: #888;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>',
        '</div>',
      ].join(''),
    });

    console.log('[forgot-password] Email sent successfully:', emailResult);
    res.json({ ok: true });
  } catch (err) {
    console.error('[forgot-password] Error:', err.message);
    if (err.statusCode) console.error('[forgot-password] Status code:', err.statusCode);
    res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ error: 'Password must be 6+ characters with one uppercase letter and one special character (!@#$%^&*)' });
    }

    const user = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
