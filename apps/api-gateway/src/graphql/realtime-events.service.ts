import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const REALTIME_EVENTS = {
  BACKTEST_TASK_UPDATED: 'BACKTEST_TASK_UPDATED',
  BACKTEST_RESULT_CREATED: 'BACKTEST_RESULT_CREATED',
  WORKER_STATUS_UPDATED: 'WORKER_STATUS_UPDATED',
  WORKER_UPGRADE_STATUS_UPDATED: 'WORKER_UPGRADE_STATUS_UPDATED',
} as const;

@Injectable()
export class RealtimeEventsService {
  private readonly pubsub = new PubSub();

  async publishBacktestTaskUpdated(payload: unknown) {
    await this.pubsub.publish(REALTIME_EVENTS.BACKTEST_TASK_UPDATED, { backtestTaskUpdated: payload });
  }

  async publishBacktestResultCreated(payload: unknown) {
    await this.pubsub.publish(REALTIME_EVENTS.BACKTEST_RESULT_CREATED, {
      backtestResultCreated: payload,
    });
  }

  async publishWorkerStatusUpdated(payload: unknown) {
    await this.pubsub.publish(REALTIME_EVENTS.WORKER_STATUS_UPDATED, { workerStatusUpdated: payload });
  }

  async publishWorkerUpgradeStatusUpdated(payload: unknown) {
    await this.pubsub.publish(REALTIME_EVENTS.WORKER_UPGRADE_STATUS_UPDATED, {
      workerUpgradeStatusUpdated: payload,
    });
  }

  backtestTaskUpdatedIterator() {
    return this.pubsub.asyncIterableIterator(REALTIME_EVENTS.BACKTEST_TASK_UPDATED);
  }

  backtestResultCreatedIterator() {
    return this.pubsub.asyncIterableIterator(REALTIME_EVENTS.BACKTEST_RESULT_CREATED);
  }

  workerStatusUpdatedIterator() {
    return this.pubsub.asyncIterableIterator(REALTIME_EVENTS.WORKER_STATUS_UPDATED);
  }

  workerUpgradeStatusUpdatedIterator() {
    return this.pubsub.asyncIterableIterator(REALTIME_EVENTS.WORKER_UPGRADE_STATUS_UPDATED);
  }
}

