-- AlterTable
-- Nullable with no default: a metadata-only change, so no table rewrite and
-- no backfill. Existing reviews get NULL, which correctly reads as "never
-- edited" — we have no edit history for them.
ALTER TABLE "Review" ADD COLUMN "editedAt" TIMESTAMP(3);
