export type GridSearchTask = {
  taskId: string;
  searchStrategy: 'grid';
  symbol: string;
  interval: string;
  prices: number[];
  optimizationParams: Record<string, number[]>;
  optimizationMetrics: string[];
};

export type GridCandidateResult = {
  configId: string;
  strategyConfig: Record<string, number>;
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalPnlPercent: number;
  };
  resultFolder: string;
};
