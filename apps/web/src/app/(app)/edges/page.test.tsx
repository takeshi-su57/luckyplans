import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EdgesPage from './page';

const useQueryMock = vi.fn();
const useMutationMock = vi.fn();

vi.mock('@apollo/client/react', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useMutation: (...args: unknown[]) => useMutationMock(...args),
}));

vi.mock('@apollo/client', () => ({
  gql: (parts: TemplateStringsArray) => parts.join(''),
}));

describe('EdgesPage', () => {
  it('renders query error state when workers query fails', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('Network down'),
      refetch: vi.fn(),
    });
    useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

    render(<EdgesPage />);

    expect(screen.getByText('Failed to load edges. Please try again.')).toBeInTheDocument();
  });
});
