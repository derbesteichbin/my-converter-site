const express = require('express');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { notifyNewReview } = require('../lib/notifyOwner');

const router = express.Router();

// A review may be changed this many times after it is first posted. The
// create itself is not an edit, so a user gets one review plus five
// revisions. Enforced server-side; the UI only mirrors it.
const MAX_REVIEW_EDITS = 5;

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
      // Drives the subtle "(edited)" label; null for reviews never changed.
      edited: Boolean(r.editedAt),
      editedAt: r.editedAt,
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

// GET /api/reviews/me — the caller's own review, or null.
//
// Exists so the edit form can be pre-filled. Scoped to req.userId, which
// comes from the verified JWT, so it can only ever return the caller's own
// row — there is no id or user parameter to point at anyone else.
router.get('/me', protect, async (req, res) => {
  try {
    const own = await prisma.review.findFirst({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, rating: true, comment: true, createdAt: true, editedAt: true, editCount: true },
    });
    res.json({
      maxEdits: MAX_REVIEW_EDITS,
      review: own
        ? {
            ...own,
            comment: own.comment || '',
            edited: Boolean(own.editedAt),
            // So the UI can disable the edit affordance and say why, without
            // the user discovering the limit only after retyping.
            editsLeft: Math.max(0, MAX_REVIEW_EDITS - own.editCount),
            canEdit: own.editCount < MAX_REVIEW_EDITS,
          }
        : null,
    });
  } catch (err) {
    console.error('Own review lookup error:', err);
    res.status(500).json({ error: 'Failed to load your review' });
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

    // One review per account. A second submission edits the existing one
    // instead of adding another, so a single user cannot flood the list or
    // move the public average by submitting repeatedly.
    const existing = await prisma.review.findFirst({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, editCount: true },
    });

    const data = { rating: r, comment: trimmed || null, language: lang };
    const include = { user: { select: { displayName: true, email: true } } };

    let created;
    if (existing) {
      // Claim one edit atomically. The `editCount: { lt: MAX }` guard and the
      // increment happen in a single statement, so two concurrent saves
      // cannot both pass a read-then-write check and push the count past the
      // limit. count === 0 means the allowance was already used up.
      const { count } = await prisma.review.updateMany({
        where: { id: existing.id, editCount: { lt: MAX_REVIEW_EDITS } },
        data: { ...data, editedAt: new Date(), editCount: { increment: 1 } },
      });

      if (count === 0) {
        return res.status(403).json({
          error: `You have reached the maximum of ${MAX_REVIEW_EDITS} edits for your review.`,
          code: 'edit_limit_reached',
          reasonCode: 'edit_limit_reached',
          maxEdits: MAX_REVIEW_EDITS,
          editsLeft: 0,
        });
      }

      // updateMany cannot `include`, so re-read for the response payload.
      created = await prisma.review.findUnique({ where: { id: existing.id }, include });
    } else {
      // A first submission is a create, not an edit: editedAt stays null and
      // editCount stays 0, so the full allowance is still available.
      created = await prisma.review.create({ data: { userId: req.userId, ...data }, include });
    }

    // Notify on both paths, worded so an edit cannot be mistaken for a new
    // review. The date reported is the one that actually just happened.
    notifyNewReview({
      email: created.user?.email || 'unknown@user',
      rating: r,
      comment: trimmed || '',
      createdAt: created.editedAt || created.createdAt,
      edited: Boolean(existing),
    });

    // Return the created review in the same shape as GET /api/reviews items,
    // so the client can append it to the list immediately without a reload.
    const review = {
      id: created.id,
      rating: created.rating,
      comment: created.comment,
      language: created.language,
      createdAt: created.createdAt,
      edited: Boolean(created.editedAt),
      editedAt: created.editedAt,
      author:
        created.user?.displayName ||
        (created.user?.email ? created.user.email.split('@')[0] : 'User'),
    };

    // Return the authoritative aggregate alongside the review. The client
    // used to increment the count and re-derive the average itself, which is
    // wrong for an edit — and was only ever an approximation for a new one.
    const [total, agg] = await Promise.all([
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    res.status(existing ? 200 : 201).json({
      ok: true,
      created: !existing,
      review,
      total,
      average: agg._avg.rating || 0,
      maxEdits: MAX_REVIEW_EDITS,
      editsLeft: Math.max(0, MAX_REVIEW_EDITS - (created.editCount || 0)),
      canEdit: (created.editCount || 0) < MAX_REVIEW_EDITS,
    });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
