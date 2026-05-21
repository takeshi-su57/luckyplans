import { BadRequestException, Injectable } from '@nestjs/common';
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
    this.validateReleaseInput(input);
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

  async reportWorkerUpgradeStatus(workerId: string, status: WorkerUpgradeStatus, message?: string) {
    return this.prisma.worker.update({
      where: { id: workerId },
      data: {
        upgradeStatus: status,
        upgradeMessage: message ?? null,
      },
    });
  }

  private validateReleaseInput(input: CreateReleaseInput) {
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(input.version)) {
      throw new BadRequestException('Invalid release version format');
    }
    if (!/^[a-f0-9]{64}$/i.test(input.checksum)) {
      throw new BadRequestException('Invalid release checksum format');
    }
    if (!input.signature.trim()) {
      throw new BadRequestException('Release signature is required');
    }
    if (!/^https:\/\//.test(input.windowsUrl) || !/^https:\/\//.test(input.linuxUrl)) {
      throw new BadRequestException('Release URLs must use HTTPS');
    }
  }
}
