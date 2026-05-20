-- CreateEnum
CREATE TYPE "SearchStrategy" AS ENUM ('GRID', 'OPTUNA');

-- CreateEnum
CREATE TYPE "BacktestTaskStatus" AS ENUM ('AWAIT', 'ASSIGNED', 'PROCESSING', 'DONE', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "strategy_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "factoryConfig" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backtest_tasks" (
    "id" TEXT NOT NULL,
    "strategyTemplateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "searchStrategy" "SearchStrategy" NOT NULL,
    "optimizationParams" JSONB NOT NULL,
    "optimizationMetrics" TEXT[],
    "trials" INTEGER NOT NULL,
    "status" "BacktestTaskStatus" NOT NULL DEFAULT 'AWAIT',
    "assignedWorkerId" TEXT,
    "leaseExpiresAt" TIMESTAMP(3),
    "lastHeartbeat" TIMESTAMP(3),
    "totalConfigs" INTEGER,
    "processedConfigs" INTEGER,
    "currentConfig" TEXT,
    "trialProgress" TEXT,
    "bestConfigIds" TEXT[],
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backtest_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backtest_results" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "strategyConfig" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "resultFolder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "backtest_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backtest_tasks_status_assignedWorkerId_idx" ON "backtest_tasks"("status", "assignedWorkerId");

-- CreateIndex
CREATE INDEX "backtest_tasks_leaseExpiresAt_idx" ON "backtest_tasks"("leaseExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "backtest_results_taskId_configId_key" ON "backtest_results"("taskId", "configId");

-- AddForeignKey
ALTER TABLE "backtest_tasks" ADD CONSTRAINT "backtest_tasks_strategyTemplateId_fkey" FOREIGN KEY ("strategyTemplateId") REFERENCES "strategy_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backtest_results" ADD CONSTRAINT "backtest_results_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "backtest_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
