import { EdgeApiClient } from './client';
import { loadEdgeConfig } from './config';
import { runOnboarding } from './onboarding';
import { runSinglePollExecution } from './runner';

async function main() {
  const envBaseUrl = process.env.API_GATEWAY_URL;
  const envWorkerId = process.env.EDGE_WORKER_ID;
  const envCredential = process.env.EDGE_WORKER_CREDENTIAL;

  const runtimeConfig =
    envBaseUrl && envWorkerId && envCredential
      ? {
          serverUrl: envBaseUrl,
          workerId: envWorkerId,
          credential: envCredential,
          currentVersion: process.env.EDGE_VERSION ?? '0.0.0',
          deviceNumber: process.env.EDGE_DEVICE_NUMBER ?? 'edge-env',
        }
      : await resolveLocalConfig();

  const client = new EdgeApiClient(
    runtimeConfig.serverUrl,
    runtimeConfig.workerId,
    runtimeConfig.credential,
  );
  await runSinglePollExecution(client);
}

async function resolveLocalConfig() {
  try {
    return await loadEdgeConfig();
  } catch {
    const tempClient = new EdgeApiClient('', '', '');
    return runOnboarding({
      client: tempClient,
      edgeVersion: process.env.EDGE_VERSION ?? '0.0.0',
      platform: process.platform,
      arch: process.arch,
    });
  }
}

main().catch((error) => {
  console.error('[edge-agent] fatal', error);
  process.exitCode = 1;
});
