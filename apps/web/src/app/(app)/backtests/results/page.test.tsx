import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BacktestResultsPage from './page';

const { useBacktestResultsMock } = vi.hoisted(() => ({
  useBacktestResultsMock: vi.fn(() => ({
    data: { backtestResults: [] as Array<Record<string, unknown>> },
    loading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/backtests/use-backtests', () => ({
  useBacktestResults: useBacktestResultsMock,
}));

describe('BacktestResultsPage', () => {
  it('renders empty state when no results are available', () => {
    render(<BacktestResultsPage />);
    expect(screen.getByText('No results yet.')).toBeInTheDocument();
  });

  it('renders fallback values when metrics json is invalid', () => {
    vi.mocked(useBacktestResultsMock).mockReturnValue({
      data: {
        backtestResults: [
          {
            id: 'r1',
            configId: 'cfg_1',
            metrics: '{bad json',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<BacktestResultsPage />);
    expect(screen.getByText(/pnl% - \| winRate - \| sharpe -/)).toBeInTheDocument();
  });
});
