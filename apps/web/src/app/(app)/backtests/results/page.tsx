'use client';

import { useMemo, useState } from 'react';
import { useBacktestResults } from '@/hooks/backtests/use-backtests';

type ResultRow = {
  id: string;
  configId: string;
  metrics: string;
  createdAt: string;
};

type ParsedMetrics = {
  totalPnlPercent?: number;
  winRate?: number;
  sharpeRatio?: number;
};

export default function BacktestResultsPage() {
  const [taskId, setTaskId] = useState('');
  const { data, loading, error } = useBacktestResults(taskId.trim());
  const rows = (data?.backtestResults ?? []) as ResultRow[];

  const sorted = useMemo(() => {
    const enriched = rows.map((row) => ({ row, metrics: parseMetrics(row.metrics) }));
    return enriched.sort(
      (a, b) =>
        (b.metrics.totalPnlPercent ?? Number.NEGATIVE_INFINITY) -
        (a.metrics.totalPnlPercent ?? Number.NEGATIVE_INFINITY),
    );
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Backtest Results</h1>
        <p className="text-sm text-[#6b7280]">Inspect and sort candidate performance by task.</p>
      </div>

      <input
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
        placeholder="Task id"
        className="w-full rounded-md border border-[#d1d5db] px-3 py-2 text-sm"
      />

      <section className="space-y-2 rounded-lg border border-[#e5e7eb] bg-white p-4">
        {loading ? <p className="text-sm text-[#6b7280]">Loading results...</p> : null}
        {error ? <p className="text-sm text-red-600">Failed to load results.</p> : null}
        {!loading && !error && sorted.length === 0 ? (
          <p className="text-sm text-[#6b7280]">No results yet.</p>
        ) : null}
        {sorted.map(({ row, metrics }) => (
          <div key={row.id} className="rounded-md border border-[#e5e7eb] p-3">
            <p className="font-medium text-[#111827]">{row.configId}</p>
            <p className="text-xs text-[#6b7280]">
              pnl% {metrics.totalPnlPercent ?? '-'} | winRate {metrics.winRate ?? '-'} | sharpe{' '}
              {metrics.sharpeRatio ?? '-'}
            </p>
            <p className="text-xs text-[#9ca3af]">{new Date(row.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function parseMetrics(raw: string): ParsedMetrics {
  try {
    const parsed = JSON.parse(raw) as ParsedMetrics;
    return parsed ?? {};
  } catch {
    return {};
  }
}
