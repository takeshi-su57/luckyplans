import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type HeartbeatInput = {
  processedConfigs: number;
  totalConfigs: number;
  currentConfig?: string;
  trialProgress?: string;
};

type TaskRecord = {
  id: string;
  name?: string;
  symbol?: string;
  interval?: string;
  status: 'AWAIT' | 'ASSIGNED' | 'PROCESSING' | 'DONE' | 'FAILED' | 'CANCELLED';
  assignedWorkerId?: string | null;
  processedConfigs?: number | null;
  totalConfigs?: number | null;
  leaseExpiresAt?: Date | null;
  createdAt?: Date;
};

type BacktestTaskDelegate = {
  findFirst: (args: unknown) => Promise<TaskRecord | null>;
  findUnique: (args: unknown) => Promise<TaskRecord | null>;
  findMany: (args?: unknown) => Promise<Array<TaskRecord & Record<string, unknown>>>;
  update: (args: unknown) => Promise<TaskRecord & Record<string, unknown>>;
  updateMany: (args: unknown) => Promise<{ count: number }>;
  create: (args: unknown) => Promise<TaskRecord & Record<string, unknown>>;
};

type BacktestResultDelegate = {
  createMany: (args: unknown) => Promise<{ count: number }>;
  findMany: (args?: unknown) => Promise<Array<Record<string, unknown>>>;
};

type StrategyTemplateDelegate = {
  findFirst: (args?: unknown) => Promise<{ id: string } | null>;
  findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
  create: (args: unknown) => Promise<Record<string, unknown>>;
  update: (args: unknown) => Promise<Record<string, unknown>>;
};

type ResultInput = {
  configId: string;
  strategyConfig: Record<string, unknown>;
  metrics: Record<string, unknown>;
  resultFolder?: string;
};

export type StrategyTemplateView = {
  id: string;
  name: string;
  category?: string;
  factoryConfig: string;
  isActive: boolean;
};

export type BacktestTaskView = {
  id: string;
  name: string;
  symbol: string;
  interval: string;
  status: string;
  assignedWorkerId?: string;
  processedConfigs?: number;
  totalConfigs?: number;
  createdAt: Date;
};

export type BacktestResultView = {
  id: string;
  configId: string;
  metrics: string;
  createdAt: Date;
};

@Injectable()
export class BacktestService {
  private readonly leaseDurationMs = 60_000;
  private readonly logger = new Logger(BacktestService.name);

  constructor(private readonly prisma: PrismaService) {}

  private get tasks(): BacktestTaskDelegate {
    return (this.prisma as unknown as { backtestTask: BacktestTaskDelegate }).backtestTask;
  }

  private get results(): BacktestResultDelegate {
    return (this.prisma as unknown as { backtestResult: BacktestResultDelegate }).backtestResult;
  }

  private get templates(): StrategyTemplateDelegate {
    return (this.prisma as unknown as { strategyTemplate: StrategyTemplateDelegate })
      .strategyTemplate;
  }

  async createStrategyTemplate(input: {
    name: string;
    category?: string;
    factoryConfig: unknown;
  }): Promise<StrategyTemplateView> {
    const payload =
      typeof input.factoryConfig === 'string'
        ? input.factoryConfig
        : JSON.stringify(input.factoryConfig);

    const created = await this.templates.create({
      data: {
        name: input.name,
        category: input.category ?? null,
        factoryConfig: payload,
        isActive: true,
      },
    });
    return {
      id: String(created.id),
      name: String(created.name),
      category: (created.category as string | null) ?? undefined,
      factoryConfig: String(created.factoryConfig),
      isActive: Boolean(created.isActive),
    };
  }

  async updateStrategyTemplate(input: {
    id: string;
    name?: string;
    category?: string;
    factoryConfig?: unknown;
    isActive?: boolean;
  }): Promise<StrategyTemplateView> {
    const payload =
      input.factoryConfig === undefined
        ? undefined
        : typeof input.factoryConfig === 'string'
          ? input.factoryConfig
          : JSON.stringify(input.factoryConfig);

    const updated = await this.templates.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(payload !== undefined ? { factoryConfig: payload } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    });
    return {
      id: String(updated.id),
      name: String(updated.name),
      category: (updated.category as string | null) ?? undefined,
      factoryConfig: String(updated.factoryConfig),
      isActive: Boolean(updated.isActive),
    };
  }

  async createBacktestTask(input: {
    name: string;
    symbol: string;
    interval: string;
    assignedWorkerId: string;
    searchStrategy: string;
    strategyTemplateId?: string;
  }): Promise<BacktestTaskView> {
    const fallbackTemplate = input.strategyTemplateId
      ? { id: input.strategyTemplateId }
      : await this.templates.findFirst({
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        });
    if (!fallbackTemplate) {
      throw new BadRequestException('Active strategy template is required before creating task');
    }

    const now = new Date();
    const startDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

    const created = await this.tasks.create({
      data: {
        strategyTemplateId: fallbackTemplate.id,
        name: input.name,
        symbol: input.symbol,
        interval: input.interval,
        startDate,
        endDate: now,
        searchStrategy: input.searchStrategy.toUpperCase(),
        optimizationParams: {},
        optimizationMetrics: ['sharpeRatio'],
        trials: 50,
        status: 'AWAIT',
        assignedWorkerId: input.assignedWorkerId || null,
        bestConfigIds: [],
      },
    });
    return this.toTaskView(created);
  }

  async cancelBacktestTask(taskId: string): Promise<BacktestTaskView> {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (!['AWAIT', 'ASSIGNED', 'PROCESSING'].includes(task.status)) {
      throw new BadRequestException('Task cannot be cancelled in current state');
    }

    const updated = await this.tasks.update({
      where: { id: taskId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });
    this.logger.log(`audit task.cancel taskId=${taskId}`);
    return this.toTaskView(updated);
  }

  async retryBacktestTask(taskId: string): Promise<BacktestTaskView> {
    const task = await this.tasks.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (!['FAILED', 'CANCELLED'].includes(task.status)) {
      throw new BadRequestException('Task cannot be retried in current state');
    }

    const updated = await this.tasks.update({
      where: { id: taskId },
      data: {
        status: 'AWAIT',
        errorMessage: null,
        leaseExpiresAt: null,
        lastHeartbeat: null,
        processedConfigs: null,
        totalConfigs: null,
        currentConfig: null,
        trialProgress: null,
        completedAt: null,
        startedAt: null,
        bestConfigIds: [],
      },
    });
    return this.toTaskView(updated);
  }

  async listBacktestTasks(): Promise<BacktestTaskView[]> {
    const tasks = await this.tasks.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map((task) => this.toTaskView(task));
  }

  async getBacktestTask(taskId: string): Promise<BacktestTaskView | null> {
    const task = await this.tasks.findUnique({
      where: { id: taskId },
    });
    if (!task) return null;
    return this.toTaskView(task as TaskRecord & Record<string, unknown>);
  }

  async listBacktestResults(
    taskId: string,
    options?: {
      sort?: 'createdAt' | 'totalPnlPercent';
      order?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    },
  ): Promise<BacktestResultView[]> {
    const results = await this.results.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });
    const mapped = results.map((result) => ({
      id: String(result.id),
      configId: String(result.configId),
      metrics:
        typeof result.metrics === 'string' ? result.metrics : JSON.stringify(result.metrics ?? {}),
      createdAt: result.createdAt as Date,
    }));

    const sort = options?.sort ?? 'createdAt';
    const order = options?.order ?? 'desc';
    const sorted = [...mapped].sort((a, b) => {
      if (sort === 'totalPnlPercent') {
        const aValue = this.extractTotalPnlPercent(a.metrics);
        const bValue = this.extractTotalPnlPercent(b.metrics);
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return order === 'asc' ? aTime - bTime : bTime - aTime;
    });

    const offset = Math.max(0, options?.offset ?? 0);
    const end = options?.limit ? offset + options.limit : undefined;
    return sorted.slice(offset, end);
  }

  private toTaskView(task: TaskRecord & Record<string, unknown>): BacktestTaskView {
    return {
      id: task.id,
      name: String(task.name),
      symbol: String(task.symbol),
      interval: String(task.interval),
      status: task.status,
      assignedWorkerId: (task.assignedWorkerId ?? undefined) as string | undefined,
      processedConfigs: (task.processedConfigs as number | null) ?? undefined,
      totalConfigs: (task.totalConfigs as number | null) ?? undefined,
      createdAt: task.createdAt as Date,
    };
  }

  private extractTotalPnlPercent(metrics: string): number {
    try {
      const parsed = JSON.parse(metrics) as { totalPnlPercent?: unknown };
      const value = parsed.totalPnlPercent;
      return typeof value === 'number' ? value : Number.NEGATIVE_INFINITY;
    } catch {
      return Number.NEGATIVE_INFINITY;
    }
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
    const leased = await this.tasks.update({
      where: { id: task.id },
      data: {
        status: 'ASSIGNED',
        leaseExpiresAt,
      },
    });
    this.logger.log(`audit task.lease taskId=${task.id} workerId=${workerId}`);
    return leased;
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
    if (task.status !== 'PROCESSING') {
      throw new BadRequestException('Task cannot be completed in current state');
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
    this.logger.log(`audit task.complete taskId=${taskId} workerId=${workerId}`);
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
    if (task.status !== 'PROCESSING') {
      throw new BadRequestException('Task cannot fail in current state');
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
    this.logger.log(`audit task.fail taskId=${taskId} workerId=${workerId}`);

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
