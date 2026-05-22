-- CreateEnum
CREATE TYPE "EdgeEnrollmentTokenStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateTable
CREATE TABLE "edge_enrollment_tokens" (
  "id" TEXT NOT NULL,
  "label" TEXT,
  "tokenPrefix" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" "EdgeEnrollmentTokenStatus" NOT NULL DEFAULT 'ACTIVE',
  "expiresAt" TIMESTAMP(3),
  "maxUses" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "lastUsedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "edge_enrollment_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "edge_enrollment_tokens_tokenPrefix_key" ON "edge_enrollment_tokens"("tokenPrefix");

-- CreateIndex
CREATE INDEX "edge_enrollment_tokens_status_expiresAt_idx" ON "edge_enrollment_tokens"("status", "expiresAt");
