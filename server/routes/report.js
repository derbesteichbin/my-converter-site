const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { notifyProblemReport } = require('../lib/notifyOwner');

const router = express.Router();

// POST /api/report — submit a problem report.
//
// Public on purpose: guests can report problems too. Technical context
// (browser user agent, logged-in user) is captured server-side and is never
// exposed back to any user. There is intentionally NO GET/list endpoint —
// reports are private to the site owner (saved to the DB + emailed).
router.post('/', async (req, res) => {
  try {
    const { message, contactEmail, pageUrl } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A description of the problem is required' });
    }

    const trimmedMessage = message.trim().slice(0, 1000);
    const email =
      typeof contactEmail === 'string' && contactEmail.trim()
        ? contactEmail.trim().slice(0, 200)
        : null;
    const url = typeof pageUrl === 'string' ? pageUrl.slice(0, 1000) : '';
    const userAgent = String(req.headers['user-agent'] || '').slice(0, 1000);

    // Identify the reporter if they happen to be logged in (optional).
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
        // Invalid/expired token — treat as a guest report.
        userId = null;
      }
    }

    const report = await prisma.problemReport.create({
      data: { message: trimmedMessage, contactEmail: email, pageUrl: url, userAgent, userId, userEmail },
    });

    // Fire-and-forget owner notification (never blocks the response).
    notifyProblemReport({
      message: trimmedMessage,
      contactEmail: email,
      pageUrl: url,
      userAgent,
      userId,
      userEmail,
      createdAt: report.createdAt,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Problem report error:', err);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

module.exports = router;
