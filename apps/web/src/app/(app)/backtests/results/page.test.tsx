import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BacktestResultsPage from './page';

vi.mock('@/hooks/backtests/use-backtests', () => ({
  useBacktestResults: vi.fn(() => ({
    data: { backtestResults: [] },
    loading: false,
    error: null,
  })),
}));

describe('BacktestResultsPage', () => {
  it('renders empty state when no results are available', () => {
    render(<BacktestResultsPage />);
    expect(screen.getByText('No results yet.')).toBeInTheDocument();
  });
});
