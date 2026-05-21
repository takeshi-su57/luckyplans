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

  private headers() {
    return {
      'content-type': 'application/json',
      authorization: `Bearer ${this.credential}`,
    };
  }
}
