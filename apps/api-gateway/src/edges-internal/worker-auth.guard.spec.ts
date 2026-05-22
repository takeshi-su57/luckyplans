import type { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { WorkerAuthGuard } from './worker-auth.guard';

describe('WorkerAuthGuard', () => {
  it('allows request when bearer credential is valid', async () => {
    const verifyCredential = vi.fn().mockResolvedValue({
      workerId: 'worker_1',
      credentialId: 'cred_1',
    });
    const guard = new WorkerAuthGuard({ verifyCredential } as never);

    const req = { headers: { authorization: 'Bearer wk_live_xxx_yyy' } } as Record<string, unknown>;
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.worker).toEqual({ workerId: 'worker_1', credentialId: 'cred_1' });
  });

  it('rejects request when bearer credential is missing', async () => {
    const verifyCredential = vi.fn();
    const guard = new WorkerAuthGuard({ verifyCredential } as never);

    const context = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
