import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

export type EdgeLocalConfig = {
  serverUrl: string;
  workerId: string;
  deviceNumber: string;
  credential: string;
  currentVersion: string;
};

const DEFAULT_CONFIG_FILE = 'config.json';

export function resolveEdgeConfigPath(baseDir = join(homedir(), '.luckyplans', 'edge-agent')): string {
  return join(baseDir, DEFAULT_CONFIG_FILE);
}

export async function saveEdgeConfig(
  config: EdgeLocalConfig,
  configPath = resolveEdgeConfigPath(),
): Promise<void> {
  await mkdir(dirname(configPath), { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2), {
    encoding: 'utf8',
    mode: 0o600,
  });
}

export async function loadEdgeConfig(
  configPath = resolveEdgeConfigPath(),
): Promise<EdgeLocalConfig> {
  const content = await readFile(configPath, 'utf8');
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Invalid edge config JSON at ${configPath}`);
  }

  if (!isEdgeLocalConfig(parsed)) {
    throw new Error(`Invalid edge config schema at ${configPath}`);
  }

  return parsed;
}

function isEdgeLocalConfig(value: unknown): value is EdgeLocalConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.serverUrl === 'string' &&
    typeof candidate.workerId === 'string' &&
    typeof candidate.deviceNumber === 'string' &&
    typeof candidate.credential === 'string' &&
    typeof candidate.currentVersion === 'string'
  );
}
