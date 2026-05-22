-- CreateEnum
CREATE TYPE "WorkerUpgradeStatus" AS ENUM ('IDLE', 'UPGRADE_PENDING', 'DOWNLOADING', 'VERIFYING', 'RESTARTING', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK');

-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "targetVersion" TEXT,
ADD COLUMN     "upgradeMessage" TEXT,
ADD COLUMN     "upgradeStatus" "WorkerUpgradeStatus" NOT NULL DEFAULT 'IDLE';

-- CreateTable
CREATE TABLE "edge_releases" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "windowsUrl" TEXT NOT NULL,
    "linuxUrl" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edge_releases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "edge_releases_version_key" ON "edge_releases"("version");
