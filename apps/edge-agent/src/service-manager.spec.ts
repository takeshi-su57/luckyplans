import { describe, expect, it, vi } from 'vitest';
import {
  LUCKYPLANS_EDGE_SERVICE_NAME,
  buildLinuxSystemdUnit,
  buildWindowsCreateServiceCommand,
  installEdgeService,
  redactServiceText,
  restartEdgeService,
  statusEdgeService,
  uninstallEdgeService,
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

    expect(redactServiceText(text, ['wk_live_secret', 'enroll_secret'])).toBe(
      'Installing worker worker_1 with credential [REDACTED] and token [REDACTED]',
    );
  });

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
    expect(runCommand.mock.calls[2]).toEqual(['sc.exe', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]]);
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

  it('continues Linux uninstall when service is already absent', async () => {
    const runCommand = vi
      .fn()
      .mockRejectedValueOnce(new Error('Unit luckyplans-edge-agent.service not loaded.'))
      .mockRejectedValueOnce(
        new Error(
          'Failed to disable unit: Unit file luckyplans-edge-agent.service does not exist.',
        ),
      )
      .mockResolvedValueOnce({ stdout: '', stderr: '' });
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
    expect(runCommand.mock.calls).toEqual([
      ['systemctl', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]],
      ['systemctl', ['disable', LUCKYPLANS_EDGE_SERVICE_NAME]],
      ['systemctl', ['daemon-reload']],
    ]);
  });

  it('blocks install when config validation fails', async () => {
    const runCommand = vi.fn();
    const writeFile = vi.fn();
    const loadConfig = vi
      .fn()
      .mockRejectedValue(new Error('Invalid edge config schema at /tmp/config.json'));

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
    ).rejects.toThrow(
      'Cannot install edge service: Invalid edge config schema at /tmp/config.json',
    );

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

  it('restarts service for the selected platform', async () => {
    const runCommand = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });

    await restartEdgeService({ platform: 'win32', runCommand });
    await restartEdgeService({ platform: 'linux', runCommand });

    expect(runCommand.mock.calls).toEqual([
      ['sc.exe', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]],
      ['sc.exe', ['start', LUCKYPLANS_EDGE_SERVICE_NAME]],
      ['systemctl', ['restart', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ]);
  });

  it('continues Windows uninstall when stop reports already stopped', async () => {
    const runCommand = vi
      .fn()
      .mockRejectedValueOnce(new Error('FAILED 1062: The service has not been started.'))
      .mockResolvedValueOnce({ stdout: '', stderr: '' });

    await uninstallEdgeService({
      platform: 'win32',
      paths: {
        nodePath: 'C:\\Program Files\\nodejs\\node.exe',
        packageDir: 'C:\\LuckyPlans\\edge-agent',
        mainScriptPath: 'C:\\LuckyPlans\\edge-agent\\dist\\main.js',
      },
      runCommand,
    });

    expect(runCommand.mock.calls).toEqual([
      ['sc.exe', ['stop', LUCKYPLANS_EDGE_SERVICE_NAME]],
      ['sc.exe', ['delete', LUCKYPLANS_EDGE_SERVICE_NAME]],
    ]);
  });
});
