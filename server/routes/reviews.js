const express = require('express');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { notifyNewReview } = require('../lib/notifyOwner');

const router = express.Router();

// GET /api/reviews — public list with pagination and aggregate
// Query: ?limit=6&offset=0
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 6, 50);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const [reviews, total, agg] = await Promise.all([
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: { user: { select: { displayName: true, email: true } } },
      }),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    const items = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      language: r.language,
      createdAt: r.createdAt,
      author: r.user?.displayName || (r.user?.email ? r.user.email.split('@')[0] : 'User'),
    }));

    res.json({
      items,
      total,
      average: agg._avg.rating || 0,
    });
  } catch (err) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// POST /api/reviews — protected, create or update own review
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment, language } = req.body;
    const r = parseInt(rating, 10);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: 'Rating must be an integer from 1 to 5' });
    }
    const trimmed = typeof comment === 'string' ? comment.trim() : '';
    if (trimmed.length > 280) {
      return res.status(400).json({ error: 'Comment must be 280 characters or fewer' });
    }
    const lang = typeof language === 'string' && language.length <= 8 ? language : null;

    const created = await prisma.review.create({
      data: {
        userId: req.userId,
        rating: r,
        comment: trimmed || null,
        language: lang,
      },
    });

    const author = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { email: true },
    });
    notifyNewReview({
      email: author?.email || 'unknown@user',
      rating: r,
      comment: trimmed || '',
      createdAt: created.createdAt,
    });

    res.json({ ok: true, id: created.id });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
