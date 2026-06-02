CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "edge_release_artifacts" (
    "id" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "arch" TEXT NOT NULL,
    "installType" TEXT NOT NULL DEFAULT 'service',
    "url" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "signatureAlgorithm" TEXT NOT NULL DEFAULT 'ed25519',
    "signingKeyId" TEXT,
    "sizeBytes" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edge_release_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "edge_release_artifacts_platform_arch_installType_idx" ON "edge_release_artifacts"("platform", "arch", "installType");

-- CreateIndex
CREATE UNIQUE INDEX "edge_release_artifacts_releaseId_platform_arch_installType_key" ON "edge_release_artifacts"("releaseId", "platform", "arch", "installType");

-- Backfill existing Windows artifacts
INSERT INTO "edge_release_artifacts" (
    "id",
    "releaseId",
    "platform",
    "arch",
    "installType",
    "url",
    "checksum",
    "signature",
    "signatureAlgorithm",
    "signingKeyId",
    "createdAt",
    "updatedAt"
)
SELECT
    concat('era_', replace(gen_random_uuid()::text, '-', '')),
    "id",
    'win32',
    'x64',
    'service',
    "windowsUrl",
    "checksum",
    "signature",
    "signatureAlgorithm",
    "signingKeyId",
    now(),
    now()
FROM "edge_releases"
WHERE "windowsUrl" IS NOT NULL
ON CONFLICT DO NOTHING;

-- Backfill existing Linux artifacts
INSERT INTO "edge_release_artifacts" (
    "id",
    "releaseId",
    "platform",
    "arch",
    "installType",
    "url",
    "checksum",
    "signature",
    "signatureAlgorithm",
    "signingKeyId",
    "createdAt",
    "updatedAt"
)
SELECT
    concat('era_', replace(gen_random_uuid()::text, '-', '')),
    "id",
    'linux',
    'x64',
    'service',
    "linuxUrl",
    "checksum",
    "signature",
    "signatureAlgorithm",
    "signingKeyId",
    now(),
    now()
FROM "edge_releases"
WHERE "linuxUrl" IS NOT NULL
ON CONFLICT DO NOTHING;

-- AddForeignKey
ALTER TABLE "edge_release_artifacts" ADD CONSTRAINT "edge_release_artifacts_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "edge_releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
