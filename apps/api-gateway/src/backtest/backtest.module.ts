import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BacktestLeaseRecoveryService } from './backtest-lease-recovery.service';
import { BacktestResolver } from './backtest.resolver';
import { BacktestService } from './backtest.service';

@Module({
  imports: [DatabaseModule],
  providers: [BacktestResolver, BacktestService, BacktestLeaseRecoveryService],
  exports: [BacktestService],
})
export class BacktestModule {}
