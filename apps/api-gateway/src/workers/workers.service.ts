import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkers() {
    return this.prisma.worker.findMany({ orderBy: { createdAt: 'desc' } });
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
  }) {
    return this.prisma.worker.update({
      where: { id: data.workerId },
      data: {
        lastSeenAt: new Date(),
        version: data.version,
        platform: data.platform,
        arch: data.arch?.trim() || undefined,
      },
    });
  }
}
