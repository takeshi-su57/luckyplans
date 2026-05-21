import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BacktestTemplatesPage from './page';

const mutateMock = vi.fn();

vi.mock('@/hooks/backtests/use-backtests', () => ({
  useCreateTemplate: () => [mutateMock, { loading: false, data: null, error: null }],
}));

describe('BacktestTemplatesPage', () => {
  it('shows validation error for invalid json and skips mutation', async () => {
    render(<BacktestTemplatesPage />);

    fireEvent.change(screen.getByPlaceholderText('Template name'), { target: { value: 'T1' } });
    fireEvent.change(screen.getByDisplayValue('{"entry":"ema-cross"}'), {
      target: { value: '{bad' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Template' }));

    expect(screen.getByText('Factory config must be valid JSON.')).toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });
});
