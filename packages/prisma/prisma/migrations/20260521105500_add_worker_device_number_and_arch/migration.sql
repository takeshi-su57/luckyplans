ALTER TABLE "workers" ADD COLUMN "deviceNumber" TEXT;
ALTER TABLE "workers" ADD COLUMN "arch" TEXT;
CREATE UNIQUE INDEX "workers_deviceNumber_key" ON "workers"("deviceNumber");
CREATE INDEX "workers_lastSeenAt_idx" ON "workers"("lastSeenAt");
