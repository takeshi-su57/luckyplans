-- Convert Project.imageUrl (String?) to Project.images (String[]) with data preservation.

-- Step 1: Add new array column with default empty array
ALTER TABLE "projects" ADD COLUMN "images" TEXT[] DEFAULT '{}';

-- Step 2: Backfill existing single imageUrl into single-element array
UPDATE "projects" SET "images" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL AND "imageUrl" != '';

-- Step 3: Drop old column
ALTER TABLE "projects" DROP COLUMN "imageUrl";
