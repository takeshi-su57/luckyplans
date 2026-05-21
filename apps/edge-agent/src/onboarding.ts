import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { buildDeviceNumber } from './device-number';
import { loadEdgeConfig, saveEdgeConfig, type EdgeLocalConfig } from './config';

export type RegisterEdgeInput = {
  serverUrl: string;
  token: string;
  displayName: string;
  deviceNumber: string;
  platform: string;
  arch: string;
  edgeVersion: string;
};

export type RegisterEdgeResult = {
  workerId: string;
  credential: string;
  deviceNumber: string;
};

export type OnboardingClient = {
  registerEdge(input: RegisterEdgeInput): Promise<RegisterEdgeResult>;
};

export type OnboardingOptions = {
  prompt?: (message: string) => Promise<string>;
  configPath?: string;
  shortIdFactory?: () => string;
  client: OnboardingClient;
  edgeVersion: string;
  platform: string;
  arch: string;
};

const MAX_DEVICE_NUMBER_RETRIES = 5;

export async function runOnboarding(options: OnboardingOptions): Promise<EdgeLocalConfig> {
  const prompt = options.prompt ?? defaultPrompt;

  const displayName = (await prompt('Display name: ')).trim();
  const serverUrl = normalizeServerUrl((await prompt('Server URL: ')).trim());
  const token = (await prompt('Registration token: ')).trim();

  if (!displayName || !serverUrl || !token) {
    throw new Error('Display name, server URL, and registration token are required');
  }

  const shortIdFactory = options.shortIdFactory ?? defaultShortIdFactory;

  // Retry on 409 collision by regenerating the device number suffix.
  for (let attempt = 1; attempt <= MAX_DEVICE_NUMBER_RETRIES; attempt += 1) {
    const deviceNumber = buildDeviceNumber(displayName, shortIdFactory);

    try {
      const registration = await options.client.registerEdge({
        displayName,
        serverUrl,
        token,
        deviceNumber,
        platform: options.platform,
        arch: options.arch,
        edgeVersion: options.edgeVersion,
      });

      const config: EdgeLocalConfig = {
        serverUrl,
        workerId: registration.workerId,
        deviceNumber: registration.deviceNumber,
        credential: registration.credential,
        currentVersion: options.edgeVersion,
      };

      await saveEdgeConfig(config, options.configPath);
      return config;
    } catch (error) {
      if (!isConflictError(error)) {
        throw error;
      }

      if (attempt === MAX_DEVICE_NUMBER_RETRIES) {
        throw new Error(
          `Unable to register edge after ${MAX_DEVICE_NUMBER_RETRIES} device number attempts due to conflicts`,
        );
      }
    }
  }

  throw new Error('Onboarding retry loop terminated unexpectedly');
}

export async function loadOrOnboard(options: OnboardingOptions): Promise<EdgeLocalConfig> {
  if (options.configPath) {
    try {
      return await loadEdgeConfig(options.configPath);
    } catch {
      return runOnboarding(options);
    }
  }

  try {
    return await loadEdgeConfig();
  } catch {
    return runOnboarding(options);
  }
}

function isConflictError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as { status?: unknown; code?: unknown };
  return candidate.status === 409 || candidate.code === 'EDGE_DEVICE_CONFLICT';
}

function normalizeServerUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function defaultShortIdFactory(): string {
  return Math.random().toString(36).slice(2, 8);
}

async function defaultPrompt(message: string): Promise<string> {
  const rl = createInterface({ input, output });
  try {
    return await rl.question(message);
  } finally {
    rl.close();
  }
}
