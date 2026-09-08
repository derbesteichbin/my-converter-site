-- AlterTable
-- Nullable with no default: metadata-only change, safe on a populated "User".
ALTER TABLE "User" ADD COLUMN "referralCreditedAt" TIMESTAMP(3);
