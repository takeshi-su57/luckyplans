-- CreateEnum
CREATE TYPE "WorkerCredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "worker_credentials" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "status" "WorkerCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "rotatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_credentials_keyPrefix_key" ON "worker_credentials"("keyPrefix");

-- CreateIndex
CREATE INDEX "worker_credentials_workerId_status_idx" ON "worker_credentials"("workerId", "status");

-- AddForeignKey
ALTER TABLE "worker_credentials" ADD CONSTRAINT "worker_credentials_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
