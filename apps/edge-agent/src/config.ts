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
  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
}

export async function loadEdgeConfig(
  configPath = resolveEdgeConfigPath(),
): Promise<EdgeLocalConfig> {
  const content = await readFile(configPath, 'utf8');
  return JSON.parse(content) as EdgeLocalConfig;
}
