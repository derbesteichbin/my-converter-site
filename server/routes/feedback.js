const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { notifyFeedback } = require('../lib/notifyOwner');

const router = express.Router();

const MAX_MESSAGE = 1000;

// POST /api/feedback — send an improvement suggestion.
//
// The sibling of POST /api/report (bugs): same shape, same rate limit
// (emailLimiter, applied in index.js), separate table so ideas and problems
// never mix. Public on purpose: guests can suggest things too. Technical
// context (user agent, logged-in user) is captured server-side and never
// exposed back. There is intentionally NO GET/list endpoint — suggestions
// are private to the site owner (saved to the DB + emailed).
router.post('/', async (req, res) => {
  try {
    const { message, contactEmail, pageUrl } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A suggestion is required', code: 'feedback_required' });
    }

    const trimmedMessage = message.trim().slice(0, MAX_MESSAGE);
    const email =
      typeof contactEmail === 'string' && contactEmail.trim()
        ? contactEmail.trim().slice(0, 200)
        : null;
    const url = typeof pageUrl === 'string' ? pageUrl.slice(0, 1000) : '';
    const userAgent = String(req.headers['user-agent'] || '').slice(0, 1000);

    // Identify the sender if they happen to be logged in (optional).
    let userId = null;
    let userEmail = null;
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
        userEmail = user?.email || null;
      } catch {
        // Invalid/expired token — treat as a guest.
        userId = null;
      }
    }

    const feedback = await prisma.feedback.create({
      data: { message: trimmedMessage, contactEmail: email, pageUrl: url, userAgent, userId, userEmail },
    });

    // Fire-and-forget owner notification (never blocks the response).
    notifyFeedback({
      message: trimmedMessage,
      contactEmail: email,
      pageUrl: url,
      userAgent,
      userId,
      userEmail,
      createdAt: feedback.createdAt,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to send suggestion' });
  }
});

module.exports = router;
