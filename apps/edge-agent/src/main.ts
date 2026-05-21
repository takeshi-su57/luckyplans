import { EdgeApiClient } from './client';
import { runSinglePollExecution } from './runner';

async function main() {
  const baseUrl = process.env.API_GATEWAY_URL;
  const workerId = process.env.EDGE_WORKER_ID;
  const credential = process.env.EDGE_WORKER_CREDENTIAL;

  if (!baseUrl || !workerId || !credential) {
    throw new Error(
      'Missing required env: API_GATEWAY_URL, EDGE_WORKER_ID, EDGE_WORKER_CREDENTIAL',
    );
  }

  const client = new EdgeApiClient(baseUrl, workerId, credential);
  await runSinglePollExecution(client);
}

main().catch((error) => {
  console.error('[edge-agent] fatal', error);
  process.exitCode = 1;
});
