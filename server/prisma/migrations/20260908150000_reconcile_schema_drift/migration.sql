-- ── Reconcile migration history with schema.prisma ──────────────────
--
-- The committed migrations described only part of the real schema: the live
-- database was brought up to date with `prisma db push` at some point, so
-- `migrate deploy` has been a no-op against it while a database built purely
-- from migrations would come out missing 2 tables, 14 User columns/defaults
-- and 6 unique indexes, with two foreign keys behaving as RESTRICT instead of
-- CASCADE. Such a database applies all migrations cleanly and then fails at
-- runtime on the first signup — the failure is silent, which is what makes it
-- dangerous for a restore or a new environment.
--
-- Every statement here is idempotent. On the live database, where all of this
-- already exists, the whole file is a no-op and the only change is the row
-- Prisma writes into its own _prisma_migrations table. On a fresh database it
-- supplies exactly what init/… left out.
--
-- Deliberately additive: no existing migration is edited, nothing is dropped,
-- and no _prisma_migrations row is rewritten.

-- ── User: missing columns ────────────────────────────────────────────
-- Nullable columns and NOT NULL columns with a constant default are both
-- metadata-only in PostgreSQL 11+, so none of these rewrite the table.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "displayName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "appleId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "apiKey" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredBy" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bonusCredits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notifyConversion" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notifyWeekly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notifyPromo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);

-- ── User.password: missing default ───────────────────────────────────
-- schema.prisma declares `password String @default("")`, but the init
-- migration created the column without a default. OAuth signups never supply
-- a password, so on a migrations-built database creating a Google or Apple
-- user would fail with a NOT NULL violation. SET DEFAULT is catalog-only: it
-- does not rewrite the table and does not touch existing rows.
ALTER TABLE "User" ALTER COLUMN "password" SET DEFAULT '';

-- ── Missing tables ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ToolUsage" (
    "id" TEXT NOT NULL,
    "toolSlug" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ToolUsage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- ── Missing unique indexes ───────────────────────────────────────────
-- Names confirmed against the live database, so IF NOT EXISTS matches the
-- existing objects and cannot create duplicates under a different name.
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_appleId_key" ON "User"("appleId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_apiKey_key" ON "User"("apiKey");
CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode");
CREATE UNIQUE INDEX IF NOT EXISTS "User_resetToken_key" ON "User"("resetToken");
CREATE UNIQUE INDEX IF NOT EXISTS "ToolUsage_toolSlug_key" ON "ToolUsage"("toolSlug");

-- ── Foreign keys: Job and Subscription must cascade ──────────────────
-- schema.prisma declares onDelete: Cascade for both; the init migration
-- created them as RESTRICT. With RESTRICT, deleting an account that has any
-- job fails outright, so "delete my account" cannot complete.
--
-- Self-adjusting: each block reads the constraint's current delete rule from
-- pg_constraint (confdeltype 'c' = CASCADE) and rewrites it only when it is
-- not already CASCADE. On the live database, where db push already set these
-- to CASCADE, both blocks do nothing. This is correct whatever the current
-- state is, which is why it needed no prior knowledge of the live rule.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Job_userId_fkey'
      AND conrelid = '"Job"'::regclass
      AND confdeltype <> 'c'
  ) THEN
    ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";
    ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Subscription_userId_fkey'
      AND conrelid = '"Subscription"'::regclass
      AND confdeltype <> 'c'
  ) THEN
    ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";
    ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
