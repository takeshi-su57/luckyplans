import 'reflect-metadata';
import { GUARDS_METADATA, MODULE_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { AuthModule } from '../auth/auth.module';
import { SessionGuard } from '../auth/session.guard';
import { BacktestModule } from '../backtest/backtest.module';
import { BacktestResolver } from '../backtest/backtest.resolver';
import { CredentialsResolver } from './credentials.resolver';
import { EnrollmentTokensResolver } from './enrollment-tokens.resolver';
import { ReleasesResolver } from './releases.resolver';
import { WorkersResolver } from './workers.resolver';
import { WorkersModule } from './workers.module';

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
        const handler = (ResolverClass.prototype as unknown as Record<string, object>)[method];
        const guards = Reflect.getMetadata(GUARDS_METADATA, handler) as unknown[] | undefined;

        expect(guards, `${ResolverClass.name}.${method}`).toContain(SessionGuard);
      }
    },
  );

  it.each([WorkersModule, BacktestModule])(
    'imports AuthModule where %s providers use SessionGuard',
    (ModuleClass) => {
      const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, ModuleClass) as unknown[];

      expect(imports).toContain(AuthModule);
    },
  );
});
