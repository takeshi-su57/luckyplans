import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { BacktestService } from '../backtest/backtest.service';
import { WorkerAuthGuard } from './worker-auth.guard';

@Controller('internal/edges/tasks')
@UseGuards(WorkerAuthGuard)
export class EdgesTasksController {
  constructor(private readonly backtestService: BacktestService) {}

  @Post('next')
  async next(@Body() body: { workerId: string }) {
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
  ) {
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
    @Body() body: { workerId: string; bestConfigIds: string[]; processedConfigs: number; totalConfigs: number },
  ) {
    const result = await this.backtestService.complete(id, body.workerId, body);
    return { success: true, status: result.status };
  }

  @Post(':id/fail')
  async fail(@Param('id') id: string, @Body() body: { workerId: string; error: string }) {
    const result = await this.backtestService.fail(id, body.workerId, body.error);
    return { success: true, status: result.status };
  }
}
