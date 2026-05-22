import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';
import { loadEdgeConfig, saveEdgeConfig } from './config';

describe('edge config persistence', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((path) => rm(path, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it('saves and reloads edge config', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-config-'));
    tempDirs.push(tempDir);

    const testPath = join(tempDir, 'edge-agent-config.json');
    const cfg = {
      serverUrl: 'https://api.example.com',
      workerId: 'w1',
      deviceNumber: 'edge-x-a1b2c3',
      credential: 'wk_live_x_y',
      currentVersion: '0.1.0',
    };

    await saveEdgeConfig(cfg, testPath);
    await expect(loadEdgeConfig(testPath)).resolves.toMatchObject(cfg);
  });

  it('throws clear error on invalid JSON config', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-config-'));
    tempDirs.push(tempDir);

    const testPath = join(tempDir, 'edge-agent-config.json');
    await writeFile(testPath, '{"serverUrl":', 'utf8');

    await expect(loadEdgeConfig(testPath)).rejects.toThrow(
      `Invalid edge config JSON at ${testPath}`,
    );
  });

  it('throws clear error on invalid config schema', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'edge-agent-config-'));
    tempDirs.push(tempDir);

    const testPath = join(tempDir, 'edge-agent-config.json');
    await writeFile(
      testPath,
      JSON.stringify({
        serverUrl: 'https://api.example.com',
        workerId: 1,
        deviceNumber: 'edge-x-a1b2c3',
        currentVersion: '0.1.0',
      }),
      'utf8',
    );

    await expect(loadEdgeConfig(testPath)).rejects.toThrow(
      `Invalid edge config schema at ${testPath}`,
    );
  });
});
