# Edge Agent OS Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tested native Linux systemd and Windows Service install/status/restart/uninstall commands for the edge-agent daemon.

**Architecture:** Add a pure `service-manager.ts` module that renders native commands, validates config through injected dependencies, redacts sensitive output, and orchestrates service operations without calling real OS commands in tests. Add a thin `service-cli.ts` entrypoint for command-line use after build, plus package scripts and docs.

**Tech Stack:** TypeScript, Node.js child_process/fs/path APIs, Vitest, existing edge-agent config loader.

---

## Scope

Implements `EDGE-UPG-005`.

In scope:

- Linux systemd install/status/restart/uninstall orchestration.
- Windows `sc.exe` install/status/restart/uninstall orchestration.
- Config validation before install.
- Secret redaction for CLI-visible text.
- Edge-agent package scripts for service commands.
- Developer docs and manual smoke checklist.

Out of scope:

- Automatic upgrade or updater behavior.
- Deleting local credentials/config during uninstall.
- macOS launchd support.
- New service-wrapper dependencies.
- Running privileged service commands during tests.

## File Map

- Create: `apps/edge-agent/src/service-manager.ts`
  - Pure service rendering, platform dispatch, injected command/file/config dependencies.
- Create: `apps/edge-agent/src/service-manager.spec.ts`
  - Unit tests for systemd/sc.exe generation, dispatch, validation, redaction, non-destructive uninstall.
- Create: `apps/edge-agent/src/service-cli.ts`
  - Thin CLI entrypoint that parses action and delegates to `service-manager`.
- Create: `apps/edge-agent/src/service-cli.spec.ts`
  - CLI parsing and failure-exit behavior tests.
- Modify: `apps/edge-agent/package.json`
  - Add service scripts.
- Modify: `apps/web/content/guides/developer.mdx`
  - Add service command docs and smoke checklists.
- Modify: `docs/issues/edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md`
  - Add outcome and verification notes after implementation.

## Design Decisions

1. Use native `systemctl` and `sc.exe`; no new dependency.
2. Tests inject `runCommand`, `writeFile`, `removeFile`, `loadConfig`, `platform`, `nodePath`, and paths.
3. Service install validates config by calling `loadConfig` before any service mutation.
4. Service uninstall does not call config deletion and does not remove the edge config path.
5. Windows stop during restart/uninstall can be tolerated when command output indicates the service is not running; creation/deletion failures are not tolerated.
6. Linux unit file is generated as a string and written to `/etc/systemd/system/luckyplans-edge-agent.service` by default.
7. CLI supports only `install`, `status`, `restart`, and `uninstall`.

## Task 1: Add Service Manager Command Generation Tests

**Files:**

- Create: `apps/edge-agent/src/service-manager.spec.ts`

- [ ] **Step 1: Write failing systemd rendering test**

Create `apps/edge-agent/src/service-manager.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import {
  LUCKYPLANS_EDGE_SERVICE_NAME,
  buildLinuxSystemdUnit,
  buildWindowsCreateServiceCommand,
  redactServiceText,
} from './service-manager';

describe('service-manager', () => {
  it('renders a Linux systemd unit for the built edge-agent daemon', () => {
    const unit = buildLinuxSystemdUnit({
      nodePath: '/usr/bin/node',
      packageDir: '/opt/luckyplans/edge-agent',
      mainScriptPath: '/opt/luckyplans/edge-agent/dist/main.js',
    });

    expect(unit).toContain('Description=LuckyPlans Edge Agent');
    expect(unit).toContain('WorkingDirectory=/opt/luckyplans/edge-agent');
    expect(unit).toContain('ExecStart=/usr/bin/node /opt/luckyplans/edge-agent/dist/main.js');
    expect(unit).toContain('Restart=always');
    expect(unit).toContain('WantedBy=multi-user.target');
  });
});
```

- [ ] **Step 2: Run service manager test to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts
```

Expected: FAIL because `./service-manager` does not exist.

- [ ] **Step 3: Add failing Windows command generation and redaction tests**

Append inside the same `describe` block:

```ts
it('builds the Windows sc.exe create command for the daemon', () => {
  const command = buildWindowsCreateServiceCommand({
    nodePath: 'C:\\Program Files\\nodejs\\node.exe',
    mainScriptPath: 'C:\\LuckyPlans\\edge-agent\\dist\\main.js',
  });

  expect(command.command).toBe('sc.exe');
  expect(command.args).toEqual([
    'create',
    LUCKYPLANS_EDGE_SERVICE_NAME,
    'binPath=',
    '"C:\\Program Files\\nodejs\\node.exe" "C:\\LuckyPlans\\edge-agent\\dist\\main.js"',
    'start=',
    'auto',
    'DisplayName=',
    '"LuckyPlans Edge Agent"',
  ]);
});

it('redacts worker credentials from service text', () => {
  const text =
    'Installing worker worker_1 with credential wk_live_secret and token enroll_secret';

  expect(
    redactServiceText(text, ['wk_live_secret', 'enroll_secret']),
  ).toBe('Installing worker worker_1 with credential [REDACTED] and token [REDACTED]');
});
```

- [ ] **Step 4: Run service manager test to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts
```

Expected: FAIL because service manager exports are missing.

## Task 2: Implement Service Manager Rendering Helpers

**Files:**

- Create: `apps/edge-agent/src/service-manager.ts`
- Modify: `apps/edge-agent/src/service-manager.spec.ts`

- [ ] **Step 1: Implement minimal rendering helpers**

Create `apps/edge-agent/src/service-manager.ts`:

```ts
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
  return secrets.reduce((next, secret) => {
    if (!secret) {
      return next;
    }
    return next.split(secret).join('[REDACTED]');
  }, text);
}
```

- [ ] **Step 2: Run service manager tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts
```

Expected: PASS for rendering/redaction tests.

- [ ] **Step 3: Commit rendering helpers if using per-task commits**

```bash
git add apps/edge-agent/src/service-manager.ts apps/edge-agent/src/service-manager.spec.ts
git commit -m "feat(edge-agent): add service command rendering"
```

## Task 3: Add Service Operation Orchestration Tests

**Files:**

- Modify: `apps/edge-agent/src/service-manager.spec.ts`
- Modify: `apps/edge-agent/src/service-manager.ts`

- [ ] **Step 1: Add failing Linux install orchestration test**

Append to `apps/edge-agent/src/service-manager.spec.ts`:

```ts
it('validates config before installing Linux systemd service', async () => {
  const runCommand = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
  const writeFile = vi.fn().mockResolvedValue(undefined);
  const loadConfig = vi.fn().mockResolvedValue({
    serverUrl: 'https://api.example.com',
    workerId: 'worker_1',
    deviceNumber: 'edge-test-a1b2c3',
    credential: 'wk_live_secret',
    currentVersion: '1.0.0',
  });

  await installEdgeService({
    platform: 'linux',
    paths: {
      nodePath: '/usr/bin/node',
      packageDir: '/opt/luckyplans/edge-agent',
      mainScriptPath: '/opt/luckyplans/edge-agent/dist/main.js',
      unitPath: '/tmp/luckyplans-edge-agent.service',
    },
    loadConfig,
    runCommand,
    writeFile,
  });

  expect(loadConfig).toHaveBeenCalledBefore(writeFile);
  expect(writeFile).toHaveBeenCalledWith(
    '/tmp/luckyplans-edge-agent.service',
    expect.stringContaining('ExecStart=/usr/bin/node /opt/luckyplans/edge-agent/dist/main.js'),
    'utf8',
  );
  expect(runCommand.mock.calls.map((call) => [call[0], call[1]])).toEqual([
    ['systemctl', ['daemon-reload']],
    ['systemctl', ['enable', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ['systemctl', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]],
  ]);
});
```

- [ ] **Step 2: Add failing Windows install/status/uninstall tests**

Append:

```ts
it('validates config before installing Windows service', async () => {
  const runCommand = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
  const loadConfig = vi.fn().mockResolvedValue({
    serverUrl: 'https://api.example.com',
    workerId: 'worker_1',
    deviceNumber: 'edge-test-a1b2c3',
    credential: 'wk_live_secret',
    currentVersion: '1.0.0',
  });

  await installEdgeService({
    platform: 'win32',
    paths: {
      nodePath: 'C:\\Program Files\\nodejs\\node.exe',
      packageDir: 'C:\\LuckyPlans\\edge-agent',
      mainScriptPath: 'C:\\LuckyPlans\\edge-agent\\dist\\main.js',
    },
    loadConfig,
    runCommand,
  });

  expect(loadConfig).toHaveBeenCalled();
  expect(runCommand.mock.calls[0]).toEqual([
    'sc.exe',
    [
      'create',
      LUCKYPLANS_EDGE_SERVICE_NAME,
      'binPath=',
      '"C:\\Program Files\\nodejs\\node.exe" "C:\\LuckyPlans\\edge-agent\\dist\\main.js"',
      'start=',
      'auto',
      'DisplayName=',
      '"LuckyPlans Edge Agent"',
    ],
  ]);
  expect(runCommand.mock.calls[1]).toEqual([
    'sc.exe',
    ['description', LUCKYPLANS_EDGE_SERVICE_NAME, 'Runs the LuckyPlans edge-agent daemon.'],
  ]);
  expect(runCommand.mock.calls[2]).toEqual([
    'sc.exe',
    ['start', LUCKYPLANS_EDGE_SERVICE_NAME],
  ]);
});

it('does not delete local config during service uninstall', async () => {
  const runCommand = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
  const removeFile = vi.fn().mockResolvedValue(undefined);

  await uninstallEdgeService({
    platform: 'linux',
    paths: {
      nodePath: '/usr/bin/node',
      packageDir: '/opt/luckyplans/edge-agent',
      mainScriptPath: '/opt/luckyplans/edge-agent/dist/main.js',
      unitPath: '/tmp/luckyplans-edge-agent.service',
    },
    runCommand,
    removeFile,
  });

  expect(removeFile).toHaveBeenCalledWith('/tmp/luckyplans-edge-agent.service');
  expect(runCommand.mock.calls.map((call) => [call[0], call[1]])).toEqual([
    ['systemctl', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ['systemctl', ['disable', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ['systemctl', ['daemon-reload']],
  ]);
});
```

- [ ] **Step 3: Add failing config validation and status tests**

Append:

```ts
it('blocks install when config validation fails', async () => {
  const runCommand = vi.fn();
  const writeFile = vi.fn();
  const loadConfig = vi.fn().mockRejectedValue(new Error('Invalid edge config schema at /tmp/config.json'));

  await expect(
    installEdgeService({
      platform: 'linux',
      paths: {
        nodePath: '/usr/bin/node',
        packageDir: '/opt/luckyplans/edge-agent',
        mainScriptPath: '/opt/luckyplans/edge-agent/dist/main.js',
      },
      loadConfig,
      runCommand,
      writeFile,
    }),
  ).rejects.toThrow('Cannot install edge service: Invalid edge config schema at /tmp/config.json');

  expect(runCommand).not.toHaveBeenCalled();
  expect(writeFile).not.toHaveBeenCalled();
});

it('queries service status for the selected platform', async () => {
  const runCommand = vi.fn().mockResolvedValue({ stdout: 'running', stderr: '' });

  await statusEdgeService({ platform: 'win32', runCommand });
  await statusEdgeService({ platform: 'linux', runCommand });

  expect(runCommand.mock.calls).toEqual([
    ['sc.exe', ['query', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ['systemctl', ['status', LUCKYPLANS_EDGE_SERVICE_NAME, '--no-pager']],
  ]);
});
```

- [ ] **Step 4: Run tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts
```

Expected: FAIL because operation functions are not implemented.

## Task 4: Implement Service Operation Orchestration

**Files:**

- Modify: `apps/edge-agent/src/service-manager.ts`

- [ ] **Step 1: Add operation types and default helpers**

Add to `service-manager.ts`:

```ts
import { rm, writeFile as writeFileImpl } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { loadEdgeConfig } from './config';

const execFileAsync = promisify(execFile);

type SupportedServicePlatform = 'linux' | 'win32';

export type RunCommand = (
  command: string,
  args: string[],
) => Promise<{ stdout: string; stderr: string }>;

export type ServiceOperationDeps = {
  platform?: NodeJS.Platform | SupportedServicePlatform;
  paths?: Partial<ServicePaths>;
  loadConfig?: typeof loadEdgeConfig;
  runCommand?: RunCommand;
  writeFile?: (path: string, content: string, encoding: BufferEncoding) => Promise<void>;
  removeFile?: (path: string) => Promise<void>;
};

export function resolveDefaultServicePaths(): ServicePaths {
  const distDir = dirname(fileURLToPath(import.meta.url));
  const packageDir = dirname(distDir);
  return {
    nodePath: process.execPath,
    packageDir,
    mainScriptPath: join(distDir, 'main.js'),
    unitPath: LINUX_SYSTEMD_UNIT_PATH,
  };
}

async function defaultRunCommand(command: string, args: string[]) {
  const { stdout, stderr } = await execFileAsync(command, args);
  return { stdout, stderr };
}

function resolveDeps(deps: ServiceOperationDeps) {
  return {
    platform: deps.platform ?? process.platform,
    paths: { ...resolveDefaultServicePaths(), ...deps.paths },
    loadConfig: deps.loadConfig ?? loadEdgeConfig,
    runCommand: deps.runCommand ?? defaultRunCommand,
    writeFile: deps.writeFile ?? writeFileImpl,
    removeFile: deps.removeFile ?? ((path: string) => rm(path, { force: true })),
  };
}
```

- [ ] **Step 2: Add platform guard and config validation**

Add:

```ts
function assertSupportedPlatform(platform: NodeJS.Platform | SupportedServicePlatform): asserts platform is SupportedServicePlatform {
  if (platform !== 'linux' && platform !== 'win32') {
    throw new Error(`Unsupported edge service platform: ${platform}`);
  }
}

async function validateInstallConfig(loadConfig: typeof loadEdgeConfig): Promise<void> {
  try {
    await loadConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot install edge service: ${message}`);
  }
}
```

- [ ] **Step 3: Implement install/status/restart/uninstall**

Add:

```ts
export async function installEdgeService(deps: ServiceOperationDeps = {}): Promise<void> {
  const resolved = resolveDeps(deps);
  assertSupportedPlatform(resolved.platform);
  await validateInstallConfig(resolved.loadConfig);

  if (resolved.platform === 'linux') {
    await resolved.writeFile(
      resolved.paths.unitPath ?? LINUX_SYSTEMD_UNIT_PATH,
      buildLinuxSystemdUnit(resolved.paths),
      'utf8',
    );
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

export async function statusEdgeService(deps: ServiceOperationDeps = {}) {
  const resolved = resolveDeps(deps);
  assertSupportedPlatform(resolved.platform);
  if (resolved.platform === 'linux') {
    return resolved.runCommand('systemctl', [
      'status',
      LUCKYPLANS_EDGE_SERVICE_NAME,
      '--no-pager',
    ]);
  }
  return resolved.runCommand('sc.exe', ['query', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

export async function restartEdgeService(deps: ServiceOperationDeps = {}): Promise<void> {
  const resolved = resolveDeps(deps);
  assertSupportedPlatform(resolved.platform);
  if (resolved.platform === 'linux') {
    await resolved.runCommand('systemctl', ['restart', LUCKYPLANS_EDGE_SERVICE_NAME]);
    return;
  }
  await runToleratingStoppedService(resolved.runCommand, 'sc.exe', [
    'stop',
    LUCKYPLANS_EDGE_SERVICE_NAME,
  ]);
  await resolved.runCommand('sc.exe', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

export async function uninstallEdgeService(deps: ServiceOperationDeps = {}): Promise<void> {
  const resolved = resolveDeps(deps);
  assertSupportedPlatform(resolved.platform);
  if (resolved.platform === 'linux') {
    await runToleratingStoppedService(resolved.runCommand, 'systemctl', [
      'stop',
      LUCKYPLANS_EDGE_SERVICE_NAME,
    ]);
    await resolved.runCommand('systemctl', ['disable', LUCKYPLANS_EDGE_SERVICE_NAME]);
    await resolved.removeFile(resolved.paths.unitPath ?? LINUX_SYSTEMD_UNIT_PATH);
    await resolved.runCommand('systemctl', ['daemon-reload']);
    return;
  }
  await runToleratingStoppedService(resolved.runCommand, 'sc.exe', [
    'stop',
    LUCKYPLANS_EDGE_SERVICE_NAME,
  ]);
  await resolved.runCommand('sc.exe', ['delete', LUCKYPLANS_EDGE_SERVICE_NAME]);
}

async function runToleratingStoppedService(
  runCommand: RunCommand,
  command: string,
  args: string[],
): Promise<void> {
  try {
    await runCommand(command, args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/not running|not been started|inactive|failed to stop/i.test(message)) {
      return;
    }
    throw error;
  }
}
```

- [ ] **Step 4: Run service manager tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run edge-agent type-check**

Run:

```bash
pnpm --filter @luckyplans/edge-agent type-check
```

Expected: PASS.

- [ ] **Step 6: Commit service manager orchestration if using per-task commits**

```bash
git add apps/edge-agent/src/service-manager.ts apps/edge-agent/src/service-manager.spec.ts
git commit -m "feat(edge-agent): orchestrate native service commands"
```

## Task 5: Add Service CLI Entrypoint

**Files:**

- Create: `apps/edge-agent/src/service-cli.ts`
- Create: `apps/edge-agent/src/service-cli.spec.ts`

- [ ] **Step 1: Write failing CLI parsing tests**

Create `apps/edge-agent/src/service-cli.spec.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { runServiceCli } from './service-cli';

describe('runServiceCli', () => {
  it('runs the selected service action', async () => {
    const install = vi.fn().mockResolvedValue(undefined);
    const logger = { log: vi.fn(), error: vi.fn() };

    const exitCode = await runServiceCli(['install'], {
      install,
      status: vi.fn(),
      restart: vi.fn(),
      uninstall: vi.fn(),
      logger,
    });

    expect(exitCode).toBe(0);
    expect(install).toHaveBeenCalledOnce();
    expect(logger.log).toHaveBeenCalledWith('Edge service install completed.');
  });

  it('returns failure for unknown service action', async () => {
    const logger = { log: vi.fn(), error: vi.fn() };

    const exitCode = await runServiceCli(['bogus'], {
      install: vi.fn(),
      status: vi.fn(),
      restart: vi.fn(),
      uninstall: vi.fn(),
      logger,
    });

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(
      'Usage: service-cli <install|status|restart|uninstall>',
    );
  });

  it('redacts service command errors before logging', async () => {
    const logger = { log: vi.fn(), error: vi.fn() };

    const exitCode = await runServiceCli(['install'], {
      install: vi.fn().mockRejectedValue(new Error('failed with wk_live_secret')),
      status: vi.fn(),
      restart: vi.fn(),
      uninstall: vi.fn(),
      logger,
      secrets: ['wk_live_secret'],
    });

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith('failed with [REDACTED]');
  });
});
```

- [ ] **Step 2: Run CLI tests to verify red**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-cli.spec.ts
```

Expected: FAIL because `service-cli.ts` does not exist.

- [ ] **Step 3: Implement CLI entrypoint**

Create `apps/edge-agent/src/service-cli.ts`:

```ts
import {
  installEdgeService,
  restartEdgeService,
  statusEdgeService,
  uninstallEdgeService,
  redactServiceText,
} from './service-manager';

type Logger = {
  log: (message: string) => void;
  error: (message: string) => void;
};

type ServiceCliDeps = {
  install?: () => Promise<void>;
  status?: () => Promise<unknown>;
  restart?: () => Promise<void>;
  uninstall?: () => Promise<void>;
  logger?: Logger;
  secrets?: string[];
};

const USAGE = 'Usage: service-cli <install|status|restart|uninstall>';

export async function runServiceCli(args: string[], deps: ServiceCliDeps = {}): Promise<number> {
  const logger = deps.logger ?? console;
  const action = args[0];
  const actions = {
    install: deps.install ?? installEdgeService,
    status: deps.status ?? statusEdgeService,
    restart: deps.restart ?? restartEdgeService,
    uninstall: deps.uninstall ?? uninstallEdgeService,
  };

  if (action !== 'install' && action !== 'status' && action !== 'restart' && action !== 'uninstall') {
    logger.error(USAGE);
    return 1;
  }

  try {
    await actions[action]();
    logger.log(`Edge service ${action} completed.`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(redactServiceText(message, deps.secrets ?? []));
    return 1;
  }
}

if (process.env.NODE_ENV !== 'test') {
  runServiceCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
```

- [ ] **Step 4: Run CLI tests to verify green**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-cli.spec.ts service-manager.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run edge-agent build**

Run:

```bash
pnpm --filter @luckyplans/edge-agent build
```

Expected: PASS and `apps/edge-agent/dist/service-cli.js` exists.

- [ ] **Step 6: Commit CLI if using per-task commits**

```bash
git add apps/edge-agent/src/service-cli.ts apps/edge-agent/src/service-cli.spec.ts
git commit -m "feat(edge-agent): add service cli"
```

## Task 6: Add Package Scripts And Docs

**Files:**

- Modify: `apps/edge-agent/package.json`
- Modify: `apps/web/content/guides/developer.mdx`

- [ ] **Step 1: Add package scripts**

Modify `apps/edge-agent/package.json` scripts:

```json
"service:install": "node dist/service-cli.js install",
"service:status": "node dist/service-cli.js status",
"service:restart": "node dist/service-cli.js restart",
"service:uninstall": "node dist/service-cli.js uninstall"
```

- [ ] **Step 2: Update developer docs**

In `apps/web/content/guides/developer.mdx`, under "Running the Edge Agent Locally", add:

```md
### Running as an OS service

Build the edge-agent before installing the service:

```bash
pnpm --filter @luckyplans/edge-agent build
```

Run onboarding once before installing the service, or provide a valid edge config file. Service install validates local config and fails before creating the service if config is missing or invalid.

Linux systemd:

```bash
sudo pnpm --filter @luckyplans/edge-agent service:install
sudo pnpm --filter @luckyplans/edge-agent service:status
sudo pnpm --filter @luckyplans/edge-agent service:restart
sudo pnpm --filter @luckyplans/edge-agent service:uninstall
```

Windows PowerShell, run as Administrator:

```powershell
pnpm --filter @luckyplans/edge-agent service:install
pnpm --filter @luckyplans/edge-agent service:status
pnpm --filter @luckyplans/edge-agent service:restart
pnpm --filter @luckyplans/edge-agent service:uninstall
```

Uninstall removes the OS service only. It does not delete local edge config or worker credentials.

Linux smoke checklist:

1. Build edge-agent.
2. Run onboarding once.
3. Install service with privileges.
4. Confirm `systemctl status luckyplans-edge-agent` reports running.
5. Confirm the Edges page receives heartbeats.
6. Restart service.
7. Uninstall service.
8. Confirm local config remains.

Windows smoke checklist:

1. Build edge-agent.
2. Run onboarding once.
3. Install service from an elevated PowerShell session.
4. Confirm `sc.exe query luckyplans-edge-agent` reports running.
5. Confirm the Edges page receives heartbeats.
6. Restart service.
7. Uninstall service.
8. Confirm local config remains.
```

- [ ] **Step 3: Run formatting checks for changed docs/package**

Run:

```bash
pnpm exec prettier --check apps/edge-agent/package.json apps/web/content/guides/developer.mdx
```

Expected: PASS.

- [ ] **Step 4: Commit package/docs if using per-task commits**

```bash
git add apps/edge-agent/package.json apps/web/content/guides/developer.mdx
git commit -m "docs(edge-agent): document os service commands"
```

## Task 7: Close EDGE-UPG-005 Issue Documentation

**Files:**

- Modify: `docs/issues/edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md`

- [ ] **Step 1: Add outcome section**

Append before `## Definition of Done`:

```md
## Outcome

Implemented native OS service management for edge-agent:

- Added Linux systemd install/status/restart/uninstall orchestration.
- Added Windows `sc.exe` install/status/restart/uninstall orchestration.
- Added config validation before install.
- Kept uninstall non-destructive; config and credentials remain in place.
- Added service CLI and package scripts.
- Documented Linux and Windows service commands and smoke checklists.

Verification notes:

- `pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts service-cli.spec.ts` passed.
- `pnpm --filter @luckyplans/edge-agent build` passed.
- Full repository gates passed.
```

- [ ] **Step 2: Update Definition of Done**

Change checklist to:

```md
- [x] Unit tests cover command generation and validation.
- [x] Manual smoke checklist exists for Windows and Linux.
- [x] Docs include install, status, restart, and uninstall commands.
```

- [ ] **Step 3: Commit issue doc if using per-task commits**

```bash
git add docs/issues/edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md
git commit -m "docs(edge): close os service issue"
```

## Task 8: Verification Gate

**Files:**

- No planned file changes.

- [ ] **Step 1: Run targeted edge-agent tests**

Run:

```bash
pnpm --filter @luckyplans/edge-agent test -- service-manager.spec.ts service-cli.spec.ts config.spec.ts main.spec.ts
```

Expected: PASS.

- [ ] **Step 2: Run edge-agent build and type-check**

Run:

```bash
pnpm --filter @luckyplans/edge-agent type-check
pnpm --filter @luckyplans/edge-agent build
```

Expected: PASS.

- [ ] **Step 3: Run full repository gates**

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
git diff --check
```

Expected: all PASS. If `pnpm build` rewrites `apps/web/next-env.d.ts`, run:

```bash
pnpm exec prettier --write apps/web/next-env.d.ts
pnpm format:check
```

- [ ] **Step 4: Commit verification doc adjustment if needed**

If verification notes need updates:

```bash
git add docs/issues/edge-upg-005-add-os-service-install-and-uninstall-commands-for-edge-agent.md
git commit -m "docs(edge): record os service verification"
```

## Self-Review

Spec coverage:

- Linux systemd install/status/restart/uninstall: Tasks 1-4.
- Windows Service install/status/restart/uninstall: Tasks 1-5.
- Config validation before install: Tasks 3-4.
- Non-destructive uninstall: Tasks 3-4 and docs in Task 6.
- Secret redaction: Tasks 1-2 and CLI error handling in Task 5.
- Docs and smoke checklists: Task 6.

Plan completeness:

- Every production behavior has a failing test before implementation.
- Commands use injected dependencies in tests and do not call real service managers.
- No new runtime dependency is introduced.
