export type DeterministicBacktestConfig = {
  entryThresholdPct: number;
  stopLossPct: number;
  takeProfitPct: number;
  feePct: number;
};

export type DeterministicBacktestInput = {
  prices: number[];
  config: DeterministicBacktestConfig;
};

export type DeterministicBacktestMetrics = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnlPercent: number;
};

export function runDeterministicBacktest(
  input: DeterministicBacktestInput,
): DeterministicBacktestMetrics {
  const { prices, config } = input;
  if (prices.length < 2) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalPnlPercent: 0,
    };
  }

  let totalTrades = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let totalPnlPercent = 0;

  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1];
    const curr = prices[i];
    const movePct = ((curr - prev) / prev) * 100;

    if (movePct < config.entryThresholdPct) {
      continue;
    }

    totalTrades += 1;
    const grossPnl = movePct;
    const cappedPnl = Math.max(-config.stopLossPct, Math.min(config.takeProfitPct, grossPnl));
    const netPnl = cappedPnl - config.feePct;

    totalPnlPercent += netPnl;
    if (netPnl >= 0) {
      winningTrades += 1;
    } else {
      losingTrades += 1;
    }
  }

  const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalPnlPercent,
  };
}
