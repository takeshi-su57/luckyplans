-- Convert Experience.description from String? to String[] with data preservation.
-- AlterTable (safe: backfill existing data before dropping old column)

-- Step 1: Add new array column with default empty array
ALTER TABLE "experiences" ADD COLUMN "description_new" TEXT[] DEFAULT '{}';

-- Step 2: Backfill existing single-string descriptions into single-element arrays
UPDATE "experiences" SET "description_new" = ARRAY["description"] WHERE "description" IS NOT NULL;

-- Step 3: Drop old column and rename new one
ALTER TABLE "experiences" DROP COLUMN "description";
ALTER TABLE "experiences" RENAME COLUMN "description_new" TO "description";
