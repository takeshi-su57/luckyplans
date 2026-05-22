import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WorkersService } from '../workers/workers.service';
import { WorkerAuthGuard } from './worker-auth.guard';

@Controller('internal/edges')
@UseGuards(WorkerAuthGuard)
export class EdgesConnectivityController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('connectivity')
  async connectivity(
    @Body()
    body: {
      workerId: string;
      deviceNumber: string;
      currentVersion?: string;
      platform?: string;
      arch?: string;
    },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);

    const worker = await this.workersService.findWorkerById(body.workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    if (worker.deviceNumber !== body.deviceNumber) {
      throw new ForbiddenException('deviceNumber does not match worker');
    }

    await this.workersService.markConnectivity({
      workerId: body.workerId,
      version: body.currentVersion,
      platform: body.platform,
      arch: body.arch,
    });

    const targetVersion = worker.targetVersion ?? null;
    const release = targetVersion
      ? await this.prisma.edgeRelease.findFirst({
          where: { version: targetVersion },
          select: {
            version: true,
            windowsUrl: true,
            linuxUrl: true,
            checksum: true,
            signature: true,
            signatureAlgorithm: true,
            signingKeyId: true,
            notes: true,
          },
        })
      : null;

    return {
      targetVersion,
      release,
      upgradeStatus: worker.upgradeStatus,
      upgradeMessage: worker.upgradeMessage,
    };
  }

  private assertWorkerIdentity(workerId: string, req: { worker?: { workerId: string } }) {
    if (!req.worker || req.worker.workerId !== workerId) {
      throw new ForbiddenException('workerId does not match authenticated worker');
    }
  }
}
