export type UpgradeStatus =
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED';

export type MaybeUpgradeInput = {
  activeTask: boolean;
  currentVersion: string;
  targetVersion?: string | null;
  reportStatus: (status: UpgradeStatus, details?: { reason?: string }) => Promise<void> | void;
  download: () => Promise<unknown>;
  verify: (artifact: unknown) => Promise<boolean>;
  install: (artifact: unknown) => Promise<void>;
};

export type MaybeUpgradeResult = {
  performed: boolean;
  nextVersion: string;
  status?: UpgradeStatus;
  reason?: string;
};

export async function maybeUpgrade(input: MaybeUpgradeInput): Promise<MaybeUpgradeResult> {
  const target = input.targetVersion;
  if (input.activeTask || !target || compareVersions(target, input.currentVersion) <= 0) {
    return { performed: false, nextVersion: input.currentVersion };
  }

  let artifact: unknown;
  try {
    await input.reportStatus('DOWNLOADING');
    artifact = await input.download();
    await input.reportStatus('VERIFYING');
    const verified = await input.verify(artifact);
    if (!verified) {
      await input.reportStatus('FAILED', { reason: 'verification failed' });
      return {
        performed: true,
        nextVersion: input.currentVersion,
        status: 'FAILED',
        reason: 'verification failed',
      };
    }

    await input.reportStatus('RESTARTING');
    await input.install(artifact);
    await input.reportStatus('SUCCEEDED');
    return { performed: true, nextVersion: target, status: 'SUCCEEDED' };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    await input.reportStatus('FAILED', { reason });
    return { performed: true, nextVersion: input.currentVersion, status: 'FAILED', reason };
  }
}

function compareVersions(a: string, b: string): number {
  const aParts = normalize(a);
  const bParts = normalize(b);
  const max = Math.max(aParts.length, bParts.length);
  for (let index = 0; index < max; index += 1) {
    const aValue = aParts[index] ?? 0;
    const bValue = bParts[index] ?? 0;
    if (aValue > bValue) {
      return 1;
    }
    if (aValue < bValue) {
      return -1;
    }
  }
  return 0;
}

function normalize(version: string): number[] {
  return version
    .split('.')
    .map((segment) => Number.parseInt(segment, 10))
    .map((value) => (Number.isFinite(value) ? value : 0));
}
