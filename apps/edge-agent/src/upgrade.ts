export type UpgradeStatus = 'DOWNLOADING' | 'VERIFYING' | 'RESTARTING' | 'SUCCEEDED' | 'FAILED';

export type MaybeUpgradeInput = {
  activeTask: boolean;
  currentVersion: string;
  targetVersion?: string | null;
  reportStatus: (status: UpgradeStatus, details?: { reason?: string }) => Promise<void> | void;
  download?: (() => Promise<unknown>) | undefined;
  verify?: ((artifact: unknown) => Promise<boolean>) | undefined;
  install?: ((artifact: unknown) => Promise<void>) | undefined;
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
  if (!input.download || !input.verify || !input.install) {
    const reason = sanitizeFailureReason('upgrade handlers not configured');
    await input.reportStatus('FAILED', { reason });
    return {
      performed: false,
      nextVersion: input.currentVersion,
      status: 'FAILED',
      reason,
    };
  }

  let artifact: unknown;
  try {
    await input.reportStatus('DOWNLOADING');
    artifact = await input.download();
    await input.reportStatus('VERIFYING');
    const verified = await input.verify(artifact);
    if (!verified) {
      const reason = sanitizeFailureReason('verification failed');
      await input.reportStatus('FAILED', { reason });
      return {
        performed: true,
        nextVersion: input.currentVersion,
        status: 'FAILED',
        reason: 'verification failed',
      };
    }

    await input.reportStatus('RESTARTING');
    await input.install(artifact);
    return { performed: true, nextVersion: target, status: 'RESTARTING' };
  } catch (error) {
    const reason = sanitizeFailureReason(error instanceof Error ? error.message : String(error));
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
  const cleaned = version.trim().replace(/^[vV]/, '');
  return cleaned
    .split('.')
    .map((segment) => {
      const match = segment.match(/^\d+/);
      return match ? Number.parseInt(match[0], 10) : 0;
    })
    .map((value) => (Number.isFinite(value) ? value : 0));
}

function sanitizeFailureReason(reason: string): string {
  return reason.replace(/https?:\/\/[^\s"'`<>]+/g, (value) => {
    const credentialRedacted = value.replace(/(https?:\/\/)[^/?#\s"'`<>@]+@/i, '$1');
    try {
      const url = new URL(credentialRedacted);
      url.username = '';
      url.password = '';
      url.search = '';
      url.hash = '';
      return url.toString();
    } catch {
      return credentialRedacted.replace(/[?#].*$/, '');
    }
  });
}
