import { Module } from '@nestjs/common';
import { BacktestModule } from '../backtest/backtest.module';
import { DatabaseModule } from '../database/database.module';
import { WorkersModule } from '../workers/workers.module';
import { EdgesConnectivityController } from './edges-connectivity.controller';
import { EdgesRegistrationController } from './edges-registration.controller';
import { EdgesTasksController } from './edges-tasks.controller';
import { WorkerAuthGuard } from './worker-auth.guard';
import { WorkerAuthService } from './worker-auth.service';

@Module({
  imports: [WorkersModule, BacktestModule, DatabaseModule],
  controllers: [EdgesTasksController, EdgesRegistrationController, EdgesConnectivityController],
  providers: [WorkerAuthService, WorkerAuthGuard],
})
export class EdgesInternalModule {}
