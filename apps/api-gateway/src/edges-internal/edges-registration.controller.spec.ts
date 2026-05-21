import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EdgesRegistrationController } from './edges-registration.controller';

describe('EdgesRegistrationController', () => {
  const workersService = {
    upsertWorkerByDeviceNumber: vi.fn(),
  };
  const credentialsService = {
    issueCredential: vi.fn(),
  };

  const controller = new EdgesRegistrationController(
    workersService as never,
    credentialsService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers edge and returns workerId credential and deviceNumber', async () => {
    workersService.upsertWorkerByDeviceNumber.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-seoul-a1b2c3',
    });
    credentialsService.issueCredential.mockResolvedValue({
      credential: 'wk_live_12345678_0123456789abcdef0123456789abcdef0123456789abcdef',
    });

    const result = await controller.register({
      token: 'reg_token',
      displayName: 'Seoul Lab',
      deviceNumber: 'edge-seoul-a1b2c3',
      platform: 'linux',
      arch: 'x64',
      edgeVersion: '0.1.0',
    });

    expect(result).toEqual({
      workerId: 'worker_1',
      deviceNumber: 'edge-seoul-a1b2c3',
      credential: 'wk_live_12345678_0123456789abcdef0123456789abcdef0123456789abcdef',
    });
  });

  it('rejects registration with invalid token', async () => {
    await expect(
      controller.register({
        token: 'wrong_token',
        displayName: 'Seoul Lab',
        deviceNumber: 'edge-seoul-a1b2c3',
        platform: 'linux',
        arch: 'x64',
        edgeVersion: '0.1.0',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
