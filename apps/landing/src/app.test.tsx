import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('Landing SPA', () => {
  it('renders the migrated landing sections', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /the analytics layer for perpetual dex trading/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /perpetual dex trading lacks infrastructure/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /lab notes/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /docs/i }).length).toBeGreaterThan(0);
  });
});
