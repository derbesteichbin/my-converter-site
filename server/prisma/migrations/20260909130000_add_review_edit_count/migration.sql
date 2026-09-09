-- AlterTable
-- NOT NULL with a constant default is metadata-only in PostgreSQL 11+: no
-- table rewrite and no backfill scan. Existing reviews get 0, meaning they
-- have their full allowance of edits left.
ALTER TABLE "Review" ADD COLUMN "editCount" INTEGER NOT NULL DEFAULT 0;
