import type { GridCandidateResult } from './types';

export type LeaseTaskResponse = {
  success: boolean;
  task: {
    taskId: string;
    name: string;
    symbol: string;
    interval: string;
    searchStrategy: 'grid' | 'optuna';
    optimizationParams: Record<string, number[]>;
    optimizationMetrics: string[];
    trials: number;
    startTrial?: number;
    seed?: number;
  } | null;
};

export type RegisterEdgeInput = {
  serverUrl: string;
  deviceNumber: string;
  displayName: string;
  platform: string;
  arch: string;
  edgeVersion: string;
  token: string;
};

export type RegisterEdgeResponse = {
  workerId: string;
  credential: string;
  deviceNumber: string;
};

export type UpgradeLifecycleStatus =
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'RESTARTING'
  | 'SUCCEEDED'
  | 'FAILED';

export type WorkerUpgradeStatus =
  | 'IDLE'
  | 'UPGRADE_PENDING'
  | UpgradeLifecycleStatus
  | 'ROLLED_BACK';

export type RuntimeState = 'IDLE' | 'BUSY' | 'UPGRADING' | 'ERROR';

export type EdgeReleaseArtifactMetadata = {
  version: string;
  platform: string;
  arch: string;
  installType: string;
  url: string;
  checksum: string;
  signature: string;
  signatureAlgorithm: string;
  signingKeyId?: string | null;
  sizeBytes?: number | null;
};

export type ConnectivityHeartbeatInput = {
  activeTask: boolean;
  currentVersion: string;
  deviceNumber?: string;
  platform?: string;
  arch?: string;
  installType?: string;
  upgradeStatus?: UpgradeLifecycleStatus;
  reason?: string;
  runtimeState?: RuntimeState;
  activeTaskId?: string;
  uptimeSeconds?: number;
  lastError?: string;
};

export type ConnectivityHeartbeatResponse = {
  targetVersion?: string | null;
  release?: EdgeReleaseArtifactMetadata | null;
  upgradeStatus?: WorkerUpgradeStatus;
  upgradeMessage?: string | null;
};

export class EdgeApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly workerId: string,
    private readonly credential: string,
  ) {}

  async pollNextTask(): Promise<LeaseTaskResponse> {
    const response = await fetch(`${this.baseUrl}/internal/edges/tasks/next`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ workerId: this.workerId }),
    });
    return response.json() as Promise<LeaseTaskResponse>;
  }

  async registerEdge(input: RegisterEdgeInput): Promise<RegisterEdgeResponse> {
    const endpoint = `${input.serverUrl}/internal/edges/register`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${input.token}`,
      },
      body: JSON.stringify({
        deviceNumber: input.deviceNumber,
        displayName: input.displayName,
        platform: input.platform,
        arch: input.arch,
        edgeVersion: input.edgeVersion,
      }),
    });

    if (!response.ok) {
      const error = new Error(
        `Edge registration failed with status ${response.status}`,
      ) as Error & {
        status?: number;
      };
      error.status = response.status;
      throw error;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      const bodyPreview = (await response.text()).slice(0, 120).replace(/\s+/g, ' ');
      throw new Error(
        [
          `Edge registration expected JSON but received '${contentType || 'unknown'}' from ${endpoint}.`,
          `Response preview: ${bodyPreview}`,
          'Tip: in local dev, use API gateway URL like http://localhost:3001 (not web URL http://localhost:3000).',
        ].join(' '),
      );
    }

    return response.json() as Promise<RegisterEdgeResponse>;
  }

  async sendResults(taskId: string, results: GridCandidateResult[]) {
    const response = await fetch(`${this.baseUrl}/internal/edges/tasks/${taskId}/results`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ workerId: this.workerId, results }),
    });
    return response.json() as Promise<{ success: boolean; accepted: number; deduplicated: number }>;
  }

  async completeTask(taskId: string, bestConfigIds: string[], processedConfigs: number) {
    const response = await fetch(`${this.baseUrl}/internal/edges/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        workerId: this.workerId,
        bestConfigIds,
        processedConfigs,
        totalConfigs: processedConfigs,
      }),
    });
    return response.json() as Promise<{ success: boolean; status: string }>;
  }

  async sendHeartbeat(
    taskId: string,
    processedConfigs: number,
    totalConfigs: number,
    currentConfig?: string,
    trialProgress?: string,
  ) {
    const response = await fetch(`${this.baseUrl}/internal/edges/tasks/${taskId}/heartbeat`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        workerId: this.workerId,
        processedConfigs,
        totalConfigs,
        currentConfig,
        trialProgress,
      }),
    });
    return response.json() as Promise<{ success: boolean; status: string }>;
  }

  async failTask(taskId: string, error: string) {
    const response = await fetch(`${this.baseUrl}/internal/edges/tasks/${taskId}/fail`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        workerId: this.workerId,
        error,
      }),
    });
    return response.json() as Promise<{ success: boolean; status: string }>;
  }

  async sendConnectivityHeartbeat(
    input: ConnectivityHeartbeatInput,
  ): Promise<ConnectivityHeartbeatResponse> {
    const response = await fetch(`${this.baseUrl}/internal/edges/connectivity`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        workerId: this.workerId,
        deviceNumber: input.deviceNumber,
        currentVersion: input.currentVersion,
        platform: input.platform,
        arch: input.arch,
        installType: input.installType,
        activeTask: input.activeTask,
        upgradeStatus: input.upgradeStatus,
        reason: input.reason,
        runtimeState: input.runtimeState,
        activeTaskId: input.activeTaskId,
        uptimeSeconds: input.uptimeSeconds,
        lastError: input.lastError,
      }),
    });

    if (!response.ok) {
      return {};
    }

    return response.json() as Promise<ConnectivityHeartbeatResponse>;
  }

  private headers() {
    return {
      'content-type': 'application/json',
      authorization: `Bearer ${this.credential}`,
    };
  }
}
