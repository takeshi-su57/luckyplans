import { mkdtemp, rm } from 'node:fs/promises';
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
});
