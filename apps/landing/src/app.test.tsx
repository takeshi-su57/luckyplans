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
    expect(screen.getByLabelText(/problem and solution preview/i)).toBeInTheDocument();
    expect(screen.getByAltText(/problem risk dashboard preview/i)).toBeInTheDocument();
    expect(screen.getByAltText(/solution simulation results preview/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /discover traders, generate plans, and analyze results in one system/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /core product features/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/core product features preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsive feature cards/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/simulation workflow feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/simulation engine feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/copy trading intelligence feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/leaderboard analysis feature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/multi-platform architecture feature/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /ready to make trading plans testable/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/simulation lab/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/trading plan product preview/i)).toBeInTheDocument();
    expect(screen.getByAltText(/trading plan workflow preview/i)).toBeInTheDocument();
    expect(screen.getByText(/real platform data/i)).toBeInTheDocument();
    expect(screen.getByText(/deterministic engine/i)).toBeInTheDocument();
    expect(screen.getByText(/metrics that matter/i)).toBeInTheDocument();
    expect(screen.getByText(/for traders & builders/i)).toBeInTheDocument();
    expect(screen.getAllByText(/discover traders/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/generate plans/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/analyze results/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/hero product preview/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/roadmap progress timeline/i)).toBeInTheDocument();
    expect(screen.getByAltText(/roadmap progress timeline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/roadmap status legend/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /docs/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /open app/i }).length).toBeGreaterThan(0);
  });
});
