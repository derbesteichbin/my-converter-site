const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile — get user profile + stats
router.get('/', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalJobs = await prisma.job.count({ where: { userId: req.userId } });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyJobs = await prisma.job.count({
      where: { userId: req.userId, createdAt: { gte: startOfMonth } },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayJobs = await prisma.job.count({
      where: { userId: req.userId, createdAt: { gte: startOfDay } },
    });

    // Generate referral code if missing
    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = 'ref_' + crypto.randomBytes(6).toString('hex');
      await prisma.user.update({ where: { id: req.userId }, data: { referralCode } });
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      plan: user.plan,
      referralCode,
      credits: user.credits,
      notifyConversion: user.notifyConversion,
      notifyWeekly: user.notifyWeekly,
      notifyPromo: user.notifyPromo,
      createdAt: user.createdAt,
      stats: {
        totalJobs,
        monthlyJobs,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// PATCH /api/profile — update display name
router.patch('/', protect, async (req, res) => {
  try {
    const { displayName, email } = req.body;
    const data = {};
    if (displayName !== undefined) data.displayName = displayName || null;
    if (email) data.email = email;
    await prisma.user.update({ where: { id: req.userId }, data });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PATCH /api/profile/notifications — update notification prefs
router.patch('/notifications', protect, async (req, res) => {
  try {
    const { notifyConversion, notifyWeekly, notifyPromo } = req.body;
    const data = {};
    if (typeof notifyConversion === 'boolean') data.notifyConversion = notifyConversion;
    if (typeof notifyWeekly === 'boolean') data.notifyWeekly = notifyWeekly;
    if (typeof notifyPromo === 'boolean') data.notifyPromo = notifyPromo;

    await prisma.user.update({ where: { id: req.userId }, data });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update notifications error:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// DELETE /api/profile — delete account and all data
router.delete('/', protect, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.clearCookie('token');
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
