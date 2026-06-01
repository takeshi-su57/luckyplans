import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile as writeFileFs, rm as rmFs } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadEdgeConfig } from './config';

export const LUCKYPLANS_EDGE_SERVICE_NAME = 'luckyplans-edge-agent';
export const LUCKYPLANS_EDGE_SERVICE_DISPLAY_NAME = 'LuckyPlans Edge Agent';
export const LINUX_SYSTEMD_UNIT_PATH = '/etc/systemd/system/luckyplans-edge-agent.service';

export type CommandInvocation = {
  command: string;
  args: string[];
};

export type ServicePaths = {
  nodePath: string;
  packageDir: string;
  mainScriptPath: string;
  unitPath?: string;
};

export function buildLinuxSystemdUnit(paths: ServicePaths): string {
  return [
    '[Unit]',
    `Description=${LUCKYPLANS_EDGE_SERVICE_DISPLAY_NAME}`,
    'After=network-online.target',
    'Wants=network-online.target',
    '',
    '[Service]',
    'Type=simple',
    `WorkingDirectory=${paths.packageDir}`,
    `ExecStart=${paths.nodePath} ${paths.mainScriptPath}`,
    'Restart=always',
    'RestartSec=10',
    'Environment=NODE_ENV=production',
    '',
    '[Install]',
    'WantedBy=multi-user.target',
    '',
  ].join('\n');
}

export function buildWindowsCreateServiceCommand(input: {
  nodePath: string;
  mainScriptPath: string;
}): CommandInvocation {
  return {
    command: 'sc.exe',
    args: [
      'create',
      LUCKYPLANS_EDGE_SERVICE_NAME,
      'binPath=',
      `"${input.nodePath}" "${input.mainScriptPath}"`,
      'start=',
      'auto',
      'DisplayName=',
      `"${LUCKYPLANS_EDGE_SERVICE_DISPLAY_NAME}"`,
    ],
  };
}

export function redactServiceText(text: string, secrets: Array<string | undefined>): string {
  return secrets.reduce<string>((next, secret) => {
    if (!secret) {
      return next;
    }
    return next.split(secret).join('[REDACTED]');
  }, text);
}

type CommandRunner = (
  command: string,
  args: string[],
) => Promise<{ stdout: string; stderr: string }>;

type WriteFileFn = (path: string, content: string, encoding: BufferEncoding) => Promise<void>;

type RemoveFileFn = (path: string) => Promise<void>;

type LoadConfigFn = () => Promise<unknown>;

type ServiceOperationInput = {
  platform: NodeJS.Platform;
  paths: ServicePaths;
  runCommand: CommandRunner;
  writeFile?: WriteFileFn;
  removeFile?: RemoveFileFn;
  loadConfig?: LoadConfigFn;
};

type PartialServiceOperationInput = Partial<ServiceOperationInput>;

const execFileAsync = promisify(execFile);

function defaultServicePaths(): ServicePaths {
  const packageDir = resolve(__dirname, '..');
  return {
    nodePath: process.execPath,
    packageDir,
    mainScriptPath: join(__dirname, 'main.js'),
  };
}

function defaultCommandRunner(
  command: string,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync(command, args, { encoding: 'utf8' }) as Promise<{
    stdout: string;
    stderr: string;
  }>;
}

function resolveOperationInput(input: PartialServiceOperationInput = {}): ServiceOperationInput {
  return {
    platform: input.platform ?? process.platform,
    paths: input.paths ?? defaultServicePaths(),
    runCommand: input.runCommand ?? defaultCommandRunner,
    writeFile: input.writeFile ?? writeFileFs,
    removeFile: input.removeFile ?? rmFs,
    loadConfig: input.loadConfig ?? loadEdgeConfig,
  };
}

function ensureSupportedPlatform(platform: NodeJS.Platform): void {
  if (platform !== 'linux' && platform !== 'win32') {
    throw new Error(
      `Unsupported platform "${platform}" for edge service operations. Expected "linux" or "win32".`,
    );
  }
}

async function validateInstallConfig(loadConfig?: LoadConfigFn): Promise<void> {
  if (!loadConfig) {
    return;
  }

  try {
    await loadConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot install edge service: ${message}`);
  }
}

export async function installEdgeService(input: PartialServiceOperationInput = {}): Promise<void> {
  const resolved = resolveOperationInput(input);
  ensureSupportedPlatform(resolved.platform);
  await validateInstallConfig(resolved.loadConfig);

  if (resolved.platform === 'linux') {
    const unitPath = resolved.paths.unitPath ?? LINUX_SYSTEMD_UNIT_PATH;
    const writeFile = resolved.writeFile;

    if (!writeFile) {
      throw new Error('writeFile helper is required to install Linux service.');
    }

    await writeFile(unitPath, buildLinuxSystemdUnit(resolved.paths), 'utf8');
    await resolved.runCommand('systemctl', ['daemon-reload']);
    await resolved.runCommand('systemctl', ['enable', LUCKYPLANS_EDGE_SERVICE_NAME]);
    await resolved.runCommand('systemctl', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]);
    return;
  }

  const create = buildWindowsCreateServiceCommand({
    nodePath: resolved.paths.nodePath,
    mainScriptPath: resolved.paths.mainScriptPath,
  });

  await resolved.runCommand(create.command, create.args);
  await resolved.runCommand('sc.exe', [
    'description',
    LUCKYPLANS_EDGE_SERVICE_NAME,
    'Runs the LuckyPlans edge-agent daemon.',
  ]);
  await resolved.runCommand('sc.exe', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

function isAlreadyStoppedServiceError(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  const normalized = text.toLowerCase();
  return (
    normalized.includes('1062') ||
    normalized.includes('has not been started') ||
    normalized.includes('is not started') ||
    normalized.includes('not running') ||
    normalized.includes('not loaded') ||
    normalized.includes('does not exist') ||
    normalized.includes('not found') ||
    normalized.includes('inactive')
  );
}

async function runIfServiceExists(
  runCommand: CommandRunner,
  command: string,
  args: string[],
): Promise<void> {
  try {
    await runCommand(command, args);
  } catch (error) {
    if (!isAlreadyStoppedServiceError(error)) {
      throw error;
    }
  }
}

export async function uninstallEdgeService(
  input: PartialServiceOperationInput = {},
): Promise<void> {
  const resolved = resolveOperationInput(input);
  ensureSupportedPlatform(resolved.platform);

  if (resolved.platform === 'linux') {
    await runIfServiceExists(resolved.runCommand, 'systemctl', [
      'stop',
      LUCKYPLANS_EDGE_SERVICE_NAME,
    ]);
    await runIfServiceExists(resolved.runCommand, 'systemctl', [
      'disable',
      LUCKYPLANS_EDGE_SERVICE_NAME,
    ]);

    const unitPath = resolved.paths.unitPath ?? LINUX_SYSTEMD_UNIT_PATH;
    if (!resolved.removeFile) {
      throw new Error('removeFile helper is required to uninstall Linux service.');
    }
    await resolved.removeFile(unitPath);

    await resolved.runCommand('systemctl', ['daemon-reload']);
    return;
  }

  await runIfServiceExists(resolved.runCommand, 'sc.exe', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]);
  await resolved.runCommand('sc.exe', ['delete', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

export async function restartEdgeService(
  input: Partial<Pick<ServiceOperationInput, 'platform' | 'runCommand'>> = {},
): Promise<void> {
  const resolved = resolveOperationInput(input);
  ensureSupportedPlatform(resolved.platform);

  if (resolved.platform === 'linux') {
    await resolved.runCommand('systemctl', ['restart', LUCKYPLANS_EDGE_SERVICE_NAME]);
    return;
  }

  await runIfServiceExists(resolved.runCommand, 'sc.exe', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]);
  await resolved.runCommand('sc.exe', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

export async function statusEdgeService(
  input: Partial<Pick<ServiceOperationInput, 'platform' | 'runCommand'>> = {},
): Promise<{ stdout: string; stderr: string }> {
  const resolved = resolveOperationInput(input);
  ensureSupportedPlatform(resolved.platform);

  if (resolved.platform === 'linux') {
    return resolved.runCommand('systemctl', ['status', LUCKYPLANS_EDGE_SERVICE_NAME, '--no-pager']);
  }

  return resolved.runCommand('sc.exe', ['query', LUCKYPLANS_EDGE_SERVICE_NAME]);
}
