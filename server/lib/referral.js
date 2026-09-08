// ── Referral program ─────────────────────────────────────────────────
//
// A referral is worth 5 credits, so signup-time payouts were free money:
// register N throwaway accounts with your own ?ref= code and mint 5N credits.
// Nothing stopped it — no email verification, no self-referral check, no cap.
//
// Credits are now paid when the REFERRED account makes its first purchase.
// A throwaway that never pays is worth nothing, which removes the farm
// entirely. It does not make abuse free-of-charge impossible, though: a
// pack1 costs €0.99 and yields the referrer 5 credits, which is cheaper per
// credit than buying a pack. Hence the per-referrer cap below — the payout
// is bounded even if someone is willing to spend real money (and burn a
// distinct card per throwaway) to game it.

const prisma = require('./prisma');

const REFERRAL_CREDITS = 5;

// Lifetime ceiling on paid referrals per referrer. Far above any plausible
// real user, low enough that farming cannot scale.
const MAX_REFERRALS_PER_REFERRER = 10;

// Collapse the addresses that reach one inbox: "me+throwaway@gmail.com" and
// "m.e@gmail.com" are the same person as "me@gmail.com". The cheapest
// same-account signal available without email verification.
function normalizeEmail(email) {
  const raw = String(email || '').trim().toLowerCase();
  const at = raw.lastIndexOf('@');
  if (at === -1) return raw;

  let local = raw.slice(0, at);
  const domain = raw.slice(at + 1);

  local = local.split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
  }
  return `${local}@${domain}`;
}

function sameIdentity(a, b) {
  return normalizeEmail(a) === normalizeEmail(b);
}

// Validate a referral code offered at signup. Returns the referrer, or null
// if the code is unknown or the signup is an obvious self-referral.
async function resolveReferrer(code, signupEmail) {
  if (!code || typeof code !== 'string') return null;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: code.trim() },
    select: { id: true, email: true, referralCode: true },
  });
  if (!referrer) return null;
  if (sameIdentity(referrer.email, signupEmail)) return null;

  return referrer;
}

// Pay the referrer, if this account was referred and has not been paid for.
// Called after a purchase is recorded. Safe to call on every purchase: the
// referralCreditedAt guard means only the first one pays.
async function awardReferralIfEligible(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, referredBy: true, referralCreditedAt: true },
  });
  if (!user || !user.referredBy || user.referralCreditedAt) return null;

  // Claim the payout for this referred account exactly once. The conditional
  // UPDATE is the guard: a concurrent or retried webhook finds the timestamp
  // already set and does nothing.
  const { count } = await prisma.user.updateMany({
    where: { id: userId, referredBy: { not: null }, referralCreditedAt: null },
    data: { referralCreditedAt: new Date() },
  });
  if (count === 0) return null;

  // From here the referral is adjudicated either way: refusing below leaves
  // the timestamp set, so a rejected referral is not retried on every
  // subsequent purchase.
  const referrer = await prisma.user.findUnique({
    where: { referralCode: user.referredBy },
    select: { id: true, email: true },
  });
  if (!referrer) return null;

  if (referrer.id === user.id || sameIdentity(referrer.email, user.email)) {
    console.warn(`[referral] Refused self-referral payout for user ${user.id}`);
    return null;
  }

  const alreadyPaid = await prisma.user.count({
    where: {
      referredBy: user.referredBy,
      referralCreditedAt: { not: null },
      id: { not: user.id },
    },
  });
  if (alreadyPaid >= MAX_REFERRALS_PER_REFERRER) {
    console.warn(`[referral] Referrer ${referrer.id} is at the ${MAX_REFERRALS_PER_REFERRER}-referral cap`);
    return null;
  }

  await prisma.user.update({
    where: { id: referrer.id },
    data: {
      credits: { increment: REFERRAL_CREDITS },
      // Display counter for the dashboard/profile "bonus credits" line.
      bonusCredits: { increment: REFERRAL_CREDITS },
    },
  });

  console.log(`[referral] Referrer ${referrer.id} earned ${REFERRAL_CREDITS} credits (referred user ${user.id} made a purchase)`);
  return { referrerId: referrer.id, credits: REFERRAL_CREDITS };
}

module.exports = {
  REFERRAL_CREDITS,
  MAX_REFERRALS_PER_REFERRER,
  normalizeEmail,
  resolveReferrer,
  awardReferralIfEligible,
};
