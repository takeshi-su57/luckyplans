import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { BacktestService } from './backtest.service';

@Injectable()
export class BacktestLeaseRecoveryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BacktestLeaseRecoveryService.name);
  private readonly intervalMs = 10_000;
  private timer?: NodeJS.Timeout;

  constructor(private readonly backtestService: BacktestService) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      void this.runOnce();
    }, this.intervalMs);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private async runOnce() {
    try {
      const requeued = await this.backtestService.requeueExpiredTasks(new Date());
      if (requeued > 0) {
        this.logger.log(`requeued ${requeued} expired backtest task(s)`);
      }
    } catch (error) {
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('failed to requeue expired backtest tasks', trace);
    }
  }
}
