-- CreateEnum
CREATE TYPE "UpgradeCampaignStatus" AS ENUM ('RUNNING', 'PAUSED', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "UpgradeCampaignWorkerStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK');

-- AlterTable
ALTER TABLE "edge_releases" ADD COLUMN     "signatureAlgorithm" TEXT NOT NULL DEFAULT 'ed25519',
ADD COLUMN     "signingKeyId" TEXT;

-- CreateTable
CREATE TABLE "upgrade_campaigns" (
    "id" TEXT NOT NULL,
    "targetVersion" TEXT NOT NULL,
    "previousVersion" TEXT,
    "forceMode" BOOLEAN NOT NULL DEFAULT false,
    "phaseSize" INTEGER NOT NULL DEFAULT 1,
    "currentPhase" INTEGER NOT NULL DEFAULT 0,
    "successThreshold" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "failureThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "status" "UpgradeCampaignStatus" NOT NULL DEFAULT 'RUNNING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upgrade_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upgrade_campaign_workers" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "status" "UpgradeCampaignWorkerStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upgrade_campaign_workers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "upgrade_campaigns_status_targetVersion_idx" ON "upgrade_campaigns"("status", "targetVersion");

-- CreateIndex
CREATE INDEX "upgrade_campaign_workers_campaignId_phase_status_idx" ON "upgrade_campaign_workers"("campaignId", "phase", "status");

-- CreateIndex
CREATE UNIQUE INDEX "upgrade_campaign_workers_campaignId_workerId_key" ON "upgrade_campaign_workers"("campaignId", "workerId");

-- AddForeignKey
ALTER TABLE "upgrade_campaign_workers" ADD CONSTRAINT "upgrade_campaign_workers_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "upgrade_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upgrade_campaign_workers" ADD CONSTRAINT "upgrade_campaign_workers_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
