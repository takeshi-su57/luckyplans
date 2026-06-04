import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type WorkerUpgradeStatus =
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'ROLLED_BACK';
type WorkerRuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';
type WorkerConnectivityStatus = 'ONLINE' | 'STALE' | 'OFFLINE';

const STALE_AFTER_MS = 60_000;
const OFFLINE_AFTER_MS = 5 * 60_000;
const MAX_LAST_ERROR_LENGTH = 500;
const WORKER_RUNTIME_STATES = new Set<WorkerRuntimeState>(['IDLE', 'BUSY', 'UPGRADING', 'ERROR']);

@Injectable()
export class WorkersService {
  private now: () => Date = () => new Date();

  constructor(private readonly prisma: PrismaService) {}

  setClockForTesting(now: () => Date) {
    this.now = now;
  }

  async getWorkers() {
    const workers = await this.prisma.worker.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        credentials: {
          where: {
            status: 'ACTIVE',
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    return workers.map((worker) => ({
      ...worker,
      hasActiveCredential: worker.credentials.length > 0,
      connectivityStatus: this.getConnectivityStatus(worker.lastSeenAt),
    }));
  }

  async createWorker(data: {
    name: string;
    platform?: string;
    version?: string;
    deviceNumber?: string;
    arch?: string;
  }) {
    const name = data.name.trim();
    const deviceNumber = data.deviceNumber?.trim() || undefined;
    const arch = data.arch?.trim() || undefined;
    if (!name) {
      throw new Error('Worker name is required');
    }

    return this.prisma.worker.create({
      data: {
        name,
        platform: data.platform,
        version: data.version,
        deviceNumber,
        arch,
      },
    });
  }

  async disableWorker(id: string) {
    const existing = await this.prisma.worker.findUnique({ where: { id } });
    if (!existing) return null;

    return this.prisma.worker.update({
      where: { id },
      data: { status: 'DISABLED' },
    });
  }

  async upsertWorkerByDeviceNumber(data: {
    deviceNumber: string;
    name: string;
    platform?: string;
    arch?: string;
    version?: string;
  }) {
    const name = data.name.trim();
    const deviceNumber = data.deviceNumber.trim();
    if (!name) {
      throw new Error('Worker name is required');
    }
    if (!deviceNumber) {
      throw new Error('Worker deviceNumber is required');
    }

    return this.prisma.worker.upsert({
      where: { deviceNumber },
      create: {
        name,
        deviceNumber,
        platform: data.platform,
        arch: data.arch?.trim() || undefined,
        version: data.version,
        lastSeenAt: new Date(),
      },
      update: {
        name,
        platform: data.platform,
        arch: data.arch?.trim() || undefined,
        version: data.version,
        lastSeenAt: new Date(),
      },
    });
  }

  async findWorkerById(id: string) {
    return this.prisma.worker.findUnique({ where: { id } });
  }

  async markConnectivity(data: {
    workerId: string;
    version?: string;
    platform?: string;
    arch?: string;
    upgradeStatus?: WorkerUpgradeStatus;
    upgradeMessage?: string;
    runtimeState?: WorkerRuntimeState;
    activeTaskId?: string;
    uptimeSeconds?: number;
    lastError?: string;
  }) {
    return this.prisma.worker.update({
      where: { id: data.workerId },
      data: {
        lastSeenAt: this.now(),
        version: data.version,
        platform: data.platform,
        arch: data.arch?.trim() || undefined,
        upgradeStatus: data.upgradeStatus,
        upgradeMessage: data.upgradeMessage,
        runtimeState: this.normalizeRuntimeState(data.runtimeState),
        activeTaskId: this.normalizeActiveTaskId(data.runtimeState, data.activeTaskId),
        uptimeSeconds: this.normalizeUptimeSeconds(data.uptimeSeconds),
        lastError: this.normalizeLastError(data.lastError),
      },
    });
  }

  private getConnectivityStatus(lastSeenAt: Date | null | undefined): WorkerConnectivityStatus {
    if (!lastSeenAt) {
      return 'OFFLINE';
    }

    const ageMs = this.now().getTime() - lastSeenAt.getTime();
    if (ageMs <= STALE_AFTER_MS) {
      return 'ONLINE';
    }
    if (ageMs <= OFFLINE_AFTER_MS) {
      return 'STALE';
    }
    return 'OFFLINE';
  }

  private normalizeRuntimeState(
    state: WorkerRuntimeState | undefined,
  ): WorkerRuntimeState | undefined {
    return state && WORKER_RUNTIME_STATES.has(state) ? state : undefined;
  }

  private normalizeActiveTaskId(
    state: WorkerRuntimeState | undefined,
    value: string | undefined,
  ): string | null | undefined {
    const runtimeState = this.normalizeRuntimeState(state);
    if (runtimeState === 'IDLE') {
      return null;
    }
    return this.normalizeOptionalString(value);
  }

  private normalizeOptionalString(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  private normalizeUptimeSeconds(value: number | undefined): number | undefined {
    if (value === undefined || !Number.isFinite(value) || value < 0) {
      return undefined;
    }
    return Math.floor(value);
  }

  private normalizeLastError(value: string | undefined): string | undefined {
    const singleLine = value?.replace(/\s+/g, ' ').trim();
    return singleLine ? singleLine.slice(0, MAX_LAST_ERROR_LENGTH) : undefined;
  }
}
