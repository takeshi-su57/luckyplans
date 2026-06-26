import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('Landing SPA', () => {
  it('renders real product-feature landing sections', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /simulate copy-trading plans before risking capital/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /blind copy trading hides risk/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /plan, simulate, then decide/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /discover traders, generate plans, and analyze results in one system/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /backtest follower behavior, accumulated pnl, and risk exposure before live copy execution/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /ready to make trading plans testable/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/auto simulations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/manual plans/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/hero product preview/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/leaderboard preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/platform preview/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /docs/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /open app/i }).length).toBeGreaterThan(0);
  });
});
