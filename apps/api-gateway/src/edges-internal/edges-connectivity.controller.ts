import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReleasesService } from '../workers/releases.service';
import { WorkersService } from '../workers/workers.service';
import { WorkerAuthGuard } from './worker-auth.guard';

type UpgradeLifecycleStatus =
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'ROLLED_BACK';
type WorkerRuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';

@Controller('internal/edges')
@UseGuards(WorkerAuthGuard)
export class EdgesConnectivityController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly releasesService: ReleasesService,
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
      installType?: string;
      activeTask?: boolean;
      upgradeStatus?: UpgradeLifecycleStatus;
      reason?: string;
      runtimeState?: WorkerRuntimeState;
      activeTaskId?: string;
      uptimeSeconds?: number;
      lastError?: string;
    },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);
    if (!body.deviceNumber?.trim()) {
      throw new BadRequestException('deviceNumber is required');
    }

    const worker = await this.workersService.findWorkerById(body.workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    if (worker.deviceNumber !== body.deviceNumber) {
      throw new ForbiddenException('deviceNumber does not match worker');
    }

    const updatedWorker =
      (await this.workersService.markConnectivity({
        workerId: body.workerId,
        version: body.currentVersion,
        platform: body.platform,
        arch: body.arch,
        upgradeStatus: body.upgradeStatus,
        upgradeMessage: body.reason,
        runtimeState: body.runtimeState,
        activeTaskId: body.activeTaskId,
        uptimeSeconds: body.uptimeSeconds,
        lastError: body.lastError,
      })) ?? worker;

    const targetVersion = worker.targetVersion ?? null;
    const releaseResult = targetVersion
      ? await this.releasesService.getUpgradeArtifactForWorker({
          workerId: body.workerId,
          platform: body.platform ?? updatedWorker.platform ?? worker.platform,
          arch: body.arch ?? updatedWorker.arch ?? worker.arch,
          installType: body.installType,
        })
      : { artifact: null, message: null };

    return {
      targetVersion,
      release: releaseResult.artifact,
      upgradeStatus: body.upgradeStatus ?? updatedWorker.upgradeStatus,
      upgradeMessage: body.reason ?? releaseResult.message ?? updatedWorker.upgradeMessage,
    };
  }

  private assertWorkerIdentity(workerId: string, req: { worker?: { workerId: string } }) {
    if (!req.worker || req.worker.workerId !== workerId) {
      throw new ForbiddenException('workerId does not match authenticated worker');
    }
  }
}
