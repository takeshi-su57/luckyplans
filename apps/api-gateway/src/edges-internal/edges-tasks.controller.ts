import { Body, Controller, ForbiddenException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BacktestService } from '../backtest/backtest.service';
import { WorkerAuthGuard } from './worker-auth.guard';

@Controller('internal/edges/tasks')
@UseGuards(WorkerAuthGuard)
export class EdgesTasksController {
  constructor(private readonly backtestService: BacktestService) {}

  @Post('next')
  async next(@Body() body: { workerId: string }, @Req() req: { worker?: { workerId: string } }) {
    this.assertWorkerIdentity(body.workerId, req);
    const task = await this.backtestService.leaseNextTask(body.workerId);
    return { success: true, task };
  }

  @Post(':id/heartbeat')
  async heartbeat(
    @Param('id') id: string,
    @Body()
    body: {
      workerId: string;
      processedConfigs: number;
      totalConfigs: number;
      currentConfig?: string;
      trialProgress?: string;
    },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);
    const task = await this.backtestService.heartbeat(id, body.workerId, body);
    return {
      success: true,
      status: task.status,
      leaseExpiresAt: task.leaseExpiresAt,
      cancelRequested: false,
    };
  }

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body()
    body: {
      workerId: string;
      bestConfigIds: string[];
      processedConfigs: number;
      totalConfigs: number;
    },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);
    const result = await this.backtestService.complete(id, body.workerId, body);
    return { success: true, status: result.status };
  }

  @Post(':id/results')
  async results(
    @Param('id') id: string,
    @Body()
    body: {
      workerId: string;
      results: Array<{
        configId: string;
        strategyConfig: Record<string, unknown>;
        metrics: Record<string, unknown>;
        resultFolder?: string;
      }>;
    },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);
    const summary = await this.backtestService.ingestResults(id, body.workerId, body.results);
    return {
      success: true,
      accepted: summary.accepted,
      deduplicated: summary.deduplicated,
    };
  }

  @Post(':id/fail')
  async fail(
    @Param('id') id: string,
    @Body() body: { workerId: string; error: string },
    @Req() req: { worker?: { workerId: string } },
  ) {
    this.assertWorkerIdentity(body.workerId, req);
    const result = await this.backtestService.fail(id, body.workerId, body.error);
    return { success: true, status: result.status };
  }

  private assertWorkerIdentity(workerId: string, req: { worker?: { workerId: string } }) {
    if (!req.worker || req.worker.workerId !== workerId) {
      throw new ForbiddenException('workerId does not match authenticated worker');
    }
  }
}
