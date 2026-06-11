import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('renders device number and connectivity last seen details', () => {
    useQueryMock.mockReturnValue({
      data: {
        workers: [
          {
            id: 'worker-1',
            name: 'test Lab',
            platform: 'windows-x64',
            version: '1.0.0',
            status: 'ACTIVE',
            hasActiveCredential: false,
            deviceNumber: 'edge-test-lab-a7k29f',
            lastSeenAt: '2026-05-21T12:00:00.000Z',
            connectivityStatus: 'ONLINE',
            runtimeState: 'IDLE',
            activeTaskId: null,
            uptimeSeconds: null,
            lastError: null,
            targetVersion: '1.0.1',
            upgradeStatus: 'UPGRADE_PENDING',
            upgradeMessage: null,
            createdAt: '2026-05-20T12:00:00.000Z',
            updatedAt: '2026-05-21T12:00:00.000Z',
          },
        ],
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });
    useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

    render(<EdgesPage />);

    expect(screen.getByText(/Device Number:/i)).toBeInTheDocument();
    expect(screen.getByText(/Connectivity \(Last Seen\):/i)).toBeInTheDocument();
    expect(screen.getByText(/edge-test-lab-a7k29f/i)).toBeInTheDocument();
    expect(screen.getByText(/last seen/i)).toBeInTheDocument();
  });

  it('renders worker connectivity and runtime health details', () => {
    useQueryMock.mockReturnValue({
      data: {
        workers: [
          {
            id: 'worker-1',
            name: 'test Lab',
            platform: 'linux',
            version: '1.0.0',
            status: 'ACTIVE',
            hasActiveCredential: true,
            deviceNumber: 'edge-test-lab-a7k29f',
            lastSeenAt: '2026-06-01T12:00:00.000Z',
            connectivityStatus: 'STALE',
            runtimeState: 'BUSY',
            activeTaskId: 'task_123',
            uptimeSeconds: 125,
            lastError: 'previous gateway timeout',
            targetVersion: '1.0.1',
            upgradeStatus: 'UPGRADE_PENDING',
            upgradeMessage: null,
            createdAt: '2026-05-20T12:00:00.000Z',
            updatedAt: '2026-06-01T12:00:00.000Z',
          },
        ],
        edgeEnrollmentTokens: [],
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });
    useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

    render(<EdgesPage />);

    expect(screen.getByText(/Connectivity Status: STALE/i)).toBeInTheDocument();
    expect(screen.getByText(/Runtime State: BUSY/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Task: task_123/i)).toBeInTheDocument();
    expect(screen.getByText(/Uptime: 2m 5s/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Error: previous gateway timeout/i)).toBeInTheDocument();
  });

  it('distinguishes failed and rolled back upgrade statuses', () => {
    useQueryMock.mockReturnValue({
      data: {
        workers: [
          {
            id: 'worker-failed',
            name: 'failed edge',
            platform: 'linux',
            version: '1.0.0',
            status: 'ACTIVE',
            hasActiveCredential: true,
            deviceNumber: 'edge-failed-a1b2c3',
            lastSeenAt: '2026-06-01T12:00:00.000Z',
            connectivityStatus: 'ONLINE',
            runtimeState: 'ERROR',
            activeTaskId: null,
            uptimeSeconds: 125,
            lastError: 'install failed',
            targetVersion: '1.0.1',
            upgradeStatus: 'FAILED',
            upgradeMessage: 'install failed',
            createdAt: '2026-05-20T12:00:00.000Z',
            updatedAt: '2026-06-01T12:00:00.000Z',
          },
          {
            id: 'worker-rolled-back',
            name: 'rolled back edge',
            platform: 'linux',
            version: '1.0.0',
            status: 'ACTIVE',
            hasActiveCredential: true,
            deviceNumber: 'edge-rolled-back-a1b2c3',
            lastSeenAt: '2026-06-01T12:00:00.000Z',
            connectivityStatus: 'ONLINE',
            runtimeState: 'IDLE',
            activeTaskId: null,
            uptimeSeconds: 125,
            lastError: null,
            targetVersion: '1.0.1',
            upgradeStatus: 'ROLLED_BACK',
            upgradeMessage: 'rolled back to 1.0.0',
            createdAt: '2026-05-20T12:00:00.000Z',
            updatedAt: '2026-06-01T12:00:00.000Z',
          },
        ],
        edgeEnrollmentTokens: [],
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });
    useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

    render(<EdgesPage />);

    expect(screen.getByText('Upgrade Status: Failed')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Status: Rolled Back')).toBeInTheDocument();
  });

  it('disables Issue when worker already has active credential', () => {
    useQueryMock.mockReturnValue({
      data: {
        workers: [
          {
            id: 'worker-1',
            name: 'test Lab',
            platform: 'windows-x64',
            version: '1.0.0',
            status: 'ACTIVE',
            hasActiveCredential: true,
            deviceNumber: 'edge-test-lab-a7k29f',
            lastSeenAt: '2026-05-21T12:00:00.000Z',
            connectivityStatus: 'ONLINE',
            runtimeState: 'IDLE',
            activeTaskId: null,
            uptimeSeconds: null,
            lastError: null,
            targetVersion: '1.0.1',
            upgradeStatus: 'UPGRADE_PENDING',
            upgradeMessage: null,
            createdAt: '2026-05-20T12:00:00.000Z',
            updatedAt: '2026-05-21T12:00:00.000Z',
          },
        ],
      },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });
    useMutationMock.mockReturnValue([vi.fn(), { loading: false }]);

    render(<EdgesPage />);

    const issueButtons = screen.getAllByRole('button', { name: 'Issue' });
    expect(issueButtons.some((button) => button.hasAttribute('disabled'))).toBe(true);
  });
});
