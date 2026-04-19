const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');
const crypto = require('crypto');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) { done(err); }
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);

      // Find by googleId or email
      let user = await prisma.user.findFirst({
        where: { OR: [{ googleId: profile.id }, { email }] },
      });

      if (user && !user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id, displayName: user.displayName || profile.displayName },
        });
      } else if (!user) {
        const referralCode = 'ref_' + crypto.randomBytes(6).toString('hex');
        user = await prisma.user.create({
          data: {
            email,
            googleId: profile.id,
            displayName: profile.displayName,
            referralCode,
            credits: 1,
          },
        });
      }

      done(null, user);
    } catch (err) { done(err); }
  }));
}

// Apple Sign In — configured when env vars are set
// Apple requires additional setup (key file, team ID, etc.)
// Placeholder: uses passport-apple when APPLE_CLIENT_ID is set
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID) {
  try {
    const AppleStrategy = require('passport-apple');
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: '/api/auth/apple/callback',
      scope: ['name', 'email'],
    }, async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        const email = profile.email || idToken?.email;
        if (!email) return done(null, false);

        let user = await prisma.user.findFirst({
          where: { OR: [{ appleId: profile.id }, { email }] },
        });

        if (user && !user.appleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { appleId: profile.id },
          });
        } else if (!user) {
          const referralCode = 'ref_' + crypto.randomBytes(6).toString('hex');
          user = await prisma.user.create({
            data: {
              email,
              appleId: profile.id,
              displayName: profile.name?.firstName || null,
              referralCode,
              credits: 1,
            },
          });
        }

        done(null, user);
      } catch (err) { done(err); }
    }));
  } catch {
    console.log('[passport] passport-apple not available, skipping Apple auth');
  }
}

module.exports = passport;
