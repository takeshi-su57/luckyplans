import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { BacktestLeaseRecoveryService } from './backtest-lease-recovery.service';
import { BacktestResolver } from './backtest.resolver';
import { BacktestService } from './backtest.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [BacktestResolver, BacktestService, BacktestLeaseRecoveryService],
  exports: [BacktestService],
})
export class BacktestModule {}
