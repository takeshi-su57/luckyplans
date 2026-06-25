import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookiesMock = vi.fn();
const redirectMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('Public home page', () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    redirectMock.mockReset();
  });

  it('redirects visitors without a session to login', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    const { default: PublicHomePage } = await import('./page');

    await PublicHomePage();

    expect(redirectMock).toHaveBeenCalledWith('/login');
  });

  it('redirects signed-in visitors to the dashboard', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'session-token' }),
    });

    const { default: PublicHomePage } = await import('./page');

    await PublicHomePage();

    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });
});
