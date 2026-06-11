import 'reflect-metadata';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { SessionGuard } from '../auth/session.guard';
import { BacktestResolver } from '../backtest/backtest.resolver';
import { CredentialsResolver } from './credentials.resolver';
import { EnrollmentTokensResolver } from './enrollment-tokens.resolver';
import { ReleasesResolver } from './releases.resolver';
import { WorkersResolver } from './workers.resolver';

const guardedMethods = [
  [
    CredentialsResolver,
    ['issueWorkerCredential', 'revokeWorkerCredential', 'rotateWorkerCredential'],
  ],
  [
    EnrollmentTokensResolver,
    ['edgeEnrollmentTokens', 'createEdgeEnrollmentToken', 'revokeEdgeEnrollmentToken'],
  ],
  [WorkersResolver, ['workers', 'createWorker', 'disableWorker']],
  [
    ReleasesResolver,
    [
      'createEdgeRelease',
      'edgeReleases',
      'setWorkerTargetVersion',
      'reportWorkerUpgradeStatus',
      'startUpgradeCampaign',
      'advanceUpgradeCampaign',
      'rollbackUpgradeCampaign',
    ],
  ],
  [
    BacktestResolver,
    [
      'createStrategyTemplate',
      'updateStrategyTemplate',
      'createBacktestTask',
      'cancelBacktestTask',
      'retryBacktestTask',
      'backtestTasks',
      'backtestTask',
      'backtestResults',
    ],
  ],
] as const;

describe('GraphQL resolver authorization', () => {
  it.each(guardedMethods)(
    'protects %s control-plane methods with SessionGuard',
    (ResolverClass, methods) => {
      for (const method of methods) {
        const guards = Reflect.getMetadata(GUARDS_METADATA, ResolverClass.prototype[method]) as
          | unknown[]
          | undefined;

        expect(guards, `${ResolverClass.name}.${method}`).toContain(SessionGuard);
      }
    },
  );
});
