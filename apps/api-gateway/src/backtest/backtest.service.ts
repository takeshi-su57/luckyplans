import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type HeartbeatInput = {
  processedConfigs: number;
  totalConfigs: number;
  currentConfig?: string;
  trialProgress?: string;
};

type TaskRecord = {
  id: string;
  status: 'AWAIT' | 'ASSIGNED' | 'PROCESSING' | 'DONE' | 'FAILED' | 'CANCELLED';
  assignedWorkerId?: string | null;
  leaseExpiresAt?: Date | null;
};

type BacktestTaskDelegate = {
  findFirst: (args: unknown) => Promise<TaskRecord | null>;
  findUnique: (args: unknown) => Promise<TaskRecord | null>;
  update: (args: unknown) => Promise<TaskRecord & Record<string, unknown>>;
  updateMany: (args: unknown) => Promise<{ count: number }>;
};

type BacktestResultDelegate = {
  createMany: (args: unknown) => Promise<{ count: number }>;
};

type ResultInput = {
  configId: string;
  strategyConfig: Record<string, unknown>;
  metrics: Record<string, unknown>;
  resultFolder?: string;
};

@Injectable()
export class BacktestService {
  private readonly leaseDurationMs = 60_000;

  constructor(private readonly prisma: PrismaService) {}

  private get tasks(): BacktestTaskDelegate {
    return (this.prisma as unknown as { backtestTask: BacktestTaskDelegate }).backtestTask;
  }

  private get results(): BacktestResultDelegate {
    return (this.prisma as unknown as { backtestResult: BacktestResultDelegate }).backtestResult;
  }

  async leaseNextTask(workerId: string) {
    const task = await this.tasks.findFirst({
      where: {
        status: 'AWAIT',
        assignedWorkerId: workerId,
      },
      orderBy: { createdAt: 'asc' },
    });
    if (!task) return null;

    const leaseExpiresAt = new Date(Date.now() + this.leaseDurationMs);
    return this.tasks.update({
      where: { id: task.id },
      data: {
        status: 'ASSIGNED',
        leaseExpiresAt,
      },
    });
  }

  async heartbeat(taskId: string, workerId: string, payload: HeartbeatInput) {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.assignedWorkerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }
    if (!['ASSIGNED', 'PROCESSING'].includes(task.status)) {
      throw new BadRequestException('Task cannot receive heartbeat in current state');
    }

    const leaseExpiresAt = new Date(Date.now() + this.leaseDurationMs);
    return this.tasks.update({
      where: { id: taskId },
      data: {
        status: 'PROCESSING',
        processedConfigs: payload.processedConfigs,
        totalConfigs: payload.totalConfigs,
        currentConfig: payload.currentConfig ?? null,
        trialProgress: payload.trialProgress ?? null,
        lastHeartbeat: new Date(),
        leaseExpiresAt,
      },
    });
  }

  async complete(
    taskId: string,
    workerId: string,
    payload: { bestConfigIds: string[]; processedConfigs: number; totalConfigs: number },
  ) {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status === 'DONE' || task.status === 'FAILED' || task.status === 'CANCELLED') {
      return { status: task.status };
    }
    if (task.assignedWorkerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }

    const updated = await this.tasks.update({
      where: { id: taskId },
      data: {
        status: 'DONE',
        completedAt: new Date(),
        processedConfigs: payload.processedConfigs,
        totalConfigs: payload.totalConfigs,
        bestConfigIds: payload.bestConfigIds,
      },
    });
    return { status: updated.status };
  }

  async fail(taskId: string, workerId: string, errorMessage: string) {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status === 'DONE' || task.status === 'FAILED' || task.status === 'CANCELLED') {
      return { status: task.status };
    }
    if (task.assignedWorkerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }

    const updated = await this.tasks.update({
      where: { id: taskId },
      data: {
        status: 'FAILED',
        errorMessage,
        completedAt: new Date(),
      },
    });

    await this.prisma.worker.update({
      where: { id: workerId },
      data: {
        consecutiveFailures: { increment: 1 },
        status: 'QUARANTINED',
        quarantinedAt: new Date(),
      },
    });

    return { status: updated.status };
  }

  async requeueExpiredTasks(now: Date) {
    const result = await this.tasks.updateMany({
      where: {
        status: { in: ['ASSIGNED', 'PROCESSING'] },
        leaseExpiresAt: { lt: now },
      },
      data: {
        status: 'AWAIT',
        currentConfig: null,
      },
    });

    return result.count;
  }

  async ingestResults(taskId: string, workerId: string, payload: ResultInput[]) {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.assignedWorkerId !== workerId) {
      throw new BadRequestException('Task is not assigned to this worker');
    }
    if (task.status === 'DONE' || task.status === 'FAILED' || task.status === 'CANCELLED') {
      return { accepted: 0, deduplicated: payload.length };
    }

    const created = await this.results.createMany({
      data: payload.map((result) => ({
        taskId,
        configId: result.configId,
        strategyConfig: result.strategyConfig,
        metrics: result.metrics,
        resultFolder: result.resultFolder ?? null,
      })),
      skipDuplicates: true,
    });

    return {
      accepted: created.count,
      deduplicated: payload.length - created.count,
    };
  }
}
