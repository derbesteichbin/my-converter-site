-- Jobs that produce several files (PDF to Images: one image per page) record
-- the additional files here, so the download ownership check can cover every
-- one of them. outputFile still holds the primary download (the ZIP).
ALTER TABLE "Job" ADD COLUMN "extraOutputs" TEXT[] DEFAULT ARRAY[]::TEXT[];
