-- AlterEnum
ALTER TYPE "WorkerStatus" ADD VALUE 'QUARANTINED';

-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quarantinedAt" TIMESTAMP(3);
