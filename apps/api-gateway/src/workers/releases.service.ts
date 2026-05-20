import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

type CreateReleaseInput = {
  version: string;
  windowsUrl: string;
  linuxUrl: string;
  checksum: string;
  signature: string;
  notes?: string;
};

type WorkerUpgradeStatus =
  | 'IDLE'
  | 'UPGRADE_PENDING'
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'ROLLED_BACK';

type EdgeReleaseRecord = {
  id: string;
  version: string;
  windowsUrl: string;
  linuxUrl: string;
  checksum: string;
  signature: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ReleasesService {
  constructor(private readonly prisma: PrismaService) {}

  private get releases() {
    return (
      this.prisma as unknown as {
        edgeRelease: {
          create: (args: unknown) => Promise<EdgeReleaseRecord>;
          findMany: (args: unknown) => Promise<EdgeReleaseRecord[]>;
        };
      }
    ).edgeRelease;
  }

  async createRelease(input: CreateReleaseInput): Promise<EdgeReleaseRecord> {
    return this.releases.create({
      data: input,
    });
  }

  async listReleases(): Promise<EdgeReleaseRecord[]> {
    return this.releases.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async setWorkerTargetVersion(workerIds: string[], targetVersion: string) {
    const result = await this.prisma.worker.updateMany({
      where: { id: { in: workerIds } },
      data: {
        targetVersion,
        upgradeStatus: 'UPGRADE_PENDING',
      },
    });
    return result.count;
  }

  async reportWorkerUpgradeStatus(
    workerId: string,
    status: WorkerUpgradeStatus,
    message?: string,
  ) {
    return this.prisma.worker.update({
      where: { id: workerId },
      data: {
        upgradeStatus: status,
        upgradeMessage: message ?? null,
      },
    });
  }
}
