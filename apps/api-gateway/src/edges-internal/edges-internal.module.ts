import { Module } from '@nestjs/common';
import { BacktestModule } from '../backtest/backtest.module';
import { WorkersModule } from '../workers/workers.module';
import { EdgesTasksController } from './edges-tasks.controller';
import { WorkerAuthGuard } from './worker-auth.guard';
import { WorkerAuthService } from './worker-auth.service';

@Module({
  imports: [WorkersModule, BacktestModule],
  controllers: [EdgesTasksController],
  providers: [WorkerAuthService, WorkerAuthGuard],
})
export class EdgesInternalModule {}
