import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BacktestResolver } from './backtest.resolver';
import { BacktestService } from './backtest.service';

@Module({
  imports: [DatabaseModule],
  providers: [BacktestResolver, BacktestService],
  exports: [BacktestService],
})
export class BacktestModule {}
