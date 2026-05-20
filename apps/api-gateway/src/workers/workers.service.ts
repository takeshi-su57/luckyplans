import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkers() {
    return this.prisma.worker.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createWorker(data: { name: string; platform?: string; version?: string }) {
    const name = data.name.trim();
    if (!name) {
      throw new Error('Worker name is required');
    }

    return this.prisma.worker.create({
      data: {
        name,
        platform: data.platform,
        version: data.version,
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
}
