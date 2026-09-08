// ── Rate limiting ────────────────────────────────────────────────────
//
// Limits are sized against how the real client behaves, not round numbers.
// The two shapes that matter:
//
//   * ToolPage polls GET /api/jobs/:id every 2s per job, and a batch polls
//     every job concurrently. A 20-file batch running 3 minutes is ~1800
//     status requests — so polling gets its own generous bucket and is
//     excluded from the global one, or ordinary batch use would 429.
//   * Everything else is human-paced: a page view makes a handful of calls.
//
// Keyed on req.ip, which is only the true client address once Express is
// told to trust Railway's proxy (see `trust proxy` in index.js).

const rateLimit = require('express-rate-limit');

const MIN = 60 * 1000;

function limiter({ windowMs, max, code, message, ...rest }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // RateLimit-* headers
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ error: message, code }),
    ...rest,
  });
}

// Password guessing. Only FAILED attempts count, so someone mistyping a
// password a few times is unaffected while brute force still stalls at 10
// wrong guesses per quarter hour.
const loginLimiter = limiter({
  windowMs: 15 * MIN,
  max: 10,
  skipSuccessfulRequests: true,
  code: 'rate_limited_login',
  message: 'Too many sign-in attempts. Please wait 15 minutes and try again.',
});

// Account creation is a rare act for a real person.
const registerLimiter = limiter({
  windowMs: 60 * MIN,
  max: 5,
  code: 'rate_limited_register',
  message: 'Too many accounts created from this network. Please try again in an hour.',
});

// Every one of these sends mail through Resend: real money, our sending
// reputation, and a way to bomb a third party's inbox. Kept deliberately low.
const emailLimiter = limiter({
  windowMs: 60 * MIN,
  max: 5,
  code: 'rate_limited_email',
  message: 'Too many requests. Please try again in an hour.',
});

// Conversions cost CloudConvert/OpenAI money and write files to disk before
// the credit check, so this is a floor under abuse rather than a usage cap —
// credits are the real limit for legitimate users.
const conversionLimiter = limiter({
  windowMs: 15 * MIN,
  max: 100,
  code: 'rate_limited_convert',
  message: 'Too many conversion requests. Please wait a few minutes and try again.',
});

// Job-status polling. 3000/15min sustains ~3.3 req/s, which covers a large
// concurrent batch with room to spare while still capping a runaway client.
const pollLimiter = limiter({
  windowMs: 15 * MIN,
  max: 3000,
  code: 'rate_limited_poll',
  message: 'Too many status checks. Please wait a moment.',
});

// Is this the 2-second job-status poll? Matched on originalUrl because the
// router is mounted at both /api and /api/convert. /api/jobs (the list) is
// deliberately NOT matched — only /jobs/<id>.
function isJobStatusPoll(req) {
  return req.method === 'GET' && /^\/api\/(convert\/)?jobs\/[^/?]+/.test(req.originalUrl);
}

// Stripe delivers webhooks from many addresses and retries on non-2xx. It is
// already signature-verified and idempotent, so a 429 here would only create
// pointless retries.
function isStripeWebhook(req) {
  return req.originalUrl === '/api/billing/webhook';
}

// Backstop for everything else on /api.
const globalLimiter = limiter({
  windowMs: 15 * MIN,
  max: 600,
  code: 'rate_limited',
  message: 'Too many requests. Please slow down and try again shortly.',
  skip: (req) => isJobStatusPoll(req) || isStripeWebhook(req),
});

module.exports = {
  loginLimiter,
  registerLimiter,
  emailLimiter,
  conversionLimiter,
  pollLimiter,
  globalLimiter,
  isJobStatusPoll,
  isStripeWebhook,
};
