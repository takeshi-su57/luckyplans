-- CreateEnum
CREATE TYPE "WorkerRuntimeState" AS ENUM ('IDLE', 'BUSY', 'UPGRADING', 'ERROR');

-- AlterTable
ALTER TABLE "workers"
ADD COLUMN "runtimeState" "WorkerRuntimeState" NOT NULL DEFAULT 'IDLE',
ADD COLUMN "activeTaskId" TEXT,
ADD COLUMN "uptimeSeconds" INTEGER,
ADD COLUMN "lastError" TEXT;
