-- Add SocialLink model, SkillCategory model.
-- Remove fixed social URL columns from Profile (with backfill).
-- Change Skill.category from String to FK (with backfill).

-- Step 1: Create social_links table
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- Step 2: Backfill social links from existing Profile columns
INSERT INTO "social_links" ("id", "profileId", "platform", "url", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'website', "websiteUrl", 0, NOW(), NOW()
FROM "profiles" WHERE "websiteUrl" IS NOT NULL AND "websiteUrl" != '';

INSERT INTO "social_links" ("id", "profileId", "platform", "url", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'github', "githubUrl", 1, NOW(), NOW()
FROM "profiles" WHERE "githubUrl" IS NOT NULL AND "githubUrl" != '';

INSERT INTO "social_links" ("id", "profileId", "platform", "url", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'linkedin', "linkedinUrl", 2, NOW(), NOW()
FROM "profiles" WHERE "linkedinUrl" IS NOT NULL AND "linkedinUrl" != '';

INSERT INTO "social_links" ("id", "profileId", "platform", "url", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'twitter', "twitterUrl", 3, NOW(), NOW()
FROM "profiles" WHERE "twitterUrl" IS NOT NULL AND "twitterUrl" != '';

-- Step 3: Drop old fixed columns from Profile
ALTER TABLE "profiles" DROP COLUMN "websiteUrl",
DROP COLUMN "githubUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "twitterUrl";

-- Step 4: Add FK for social_links
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Create skill_categories table
CREATE TABLE "skill_categories" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "skill_categories_profileId_name_key" ON "skill_categories"("profileId", "name");

-- Step 6: Backfill skill categories from existing distinct Skill.category values
INSERT INTO "skill_categories" ("id", "profileId", "name", "sortOrder", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, sub."profileId", sub."category",
       ROW_NUMBER() OVER (PARTITION BY sub."profileId" ORDER BY sub."category") - 1,
       NOW(), NOW()
FROM (SELECT DISTINCT "profileId", "category" FROM "skills" WHERE "category" IS NOT NULL AND "category" != '') sub;

-- Step 7: Add categoryId column to skills
ALTER TABLE "skills" ADD COLUMN "categoryId" TEXT;

-- Step 8: Backfill categoryId from existing category text
UPDATE "skills" s SET "categoryId" = sc."id"
FROM "skill_categories" sc
WHERE s."profileId" = sc."profileId" AND s."category" = sc."name";

-- Step 9: Drop old category text column
ALTER TABLE "skills" DROP COLUMN "category";

-- Step 10: Add FKs
ALTER TABLE "skill_categories" ADD CONSTRAINT "skill_categories_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skills" ADD CONSTRAINT "skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "skill_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 11: Clean up experience description default from previous migration
ALTER TABLE "experiences" ALTER COLUMN "description" DROP DEFAULT;
