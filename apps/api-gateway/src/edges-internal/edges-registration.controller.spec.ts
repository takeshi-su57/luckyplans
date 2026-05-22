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
  const enrollmentTokensService = {
    verifyAndConsume: vi.fn(),
  };

  const controller = new EdgesRegistrationController(
    workersService as never,
    credentialsService as never,
    enrollmentTokensService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    enrollmentTokensService.verifyAndConsume.mockResolvedValue({ ok: true });
  });

  it('registers edge and returns workerId credential and deviceNumber', async () => {
    workersService.upsertWorkerByDeviceNumber.mockResolvedValue({
      id: 'worker_1',
      deviceNumber: 'edge-seoul-a1b2c3',
    });
    credentialsService.issueCredential.mockResolvedValue({
      credential: 'wk_live_12345678_0123456789abcdef0123456789abcdef0123456789abcdef',
    });

    const result = await controller.register(
      {
        token: 'etr_live_12345678_abcdef0123456789abcdef0123456789abcdef0123456789',
        displayName: 'Seoul Lab',
        deviceNumber: 'edge-seoul-a1b2c3',
        platform: 'linux',
        arch: 'x64',
        edgeVersion: '0.1.0',
      },
      undefined,
    );

    expect(result).toEqual({
      workerId: 'worker_1',
      deviceNumber: 'edge-seoul-a1b2c3',
      credential: 'wk_live_12345678_0123456789abcdef0123456789abcdef0123456789abcdef',
    });
  });

  it('accepts EDGE_REGISTRATION_TOKEN via Authorization bearer header', async () => {
    workersService.upsertWorkerByDeviceNumber.mockResolvedValue({
      id: 'worker_2',
      deviceNumber: 'edge-seoul-z9y8x7',
    });
    credentialsService.issueCredential.mockResolvedValue({
      credential: 'wk_live_87654321_abcdef0123456789abcdef0123456789abcdef0123456789',
    });

    const result = await controller.register(
      {
        displayName: 'Seoul Lab 2',
        deviceNumber: 'edge-seoul-z9y8x7',
        platform: 'windows',
        arch: 'x64',
        edgeVersion: '0.1.0',
      },
      'Bearer etr_live_12345678_abcdef0123456789abcdef0123456789abcdef0123456789',
    );

    expect(result).toEqual({
      workerId: 'worker_2',
      deviceNumber: 'edge-seoul-z9y8x7',
      credential: 'wk_live_87654321_abcdef0123456789abcdef0123456789abcdef0123456789',
    });
  });

  it('rejects registration with invalid token', async () => {
    enrollmentTokensService.verifyAndConsume.mockResolvedValue({ ok: false });

    await expect(
      controller.register(
        {
          token: 'wrong_token',
          displayName: 'Seoul Lab',
          deviceNumber: 'edge-seoul-a1b2c3',
          platform: 'linux',
          arch: 'x64',
          edgeVersion: '0.1.0',
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects registration when token is missing', async () => {
    await expect(
      controller.register(
        {
          displayName: 'Seoul Lab',
          deviceNumber: 'edge-seoul-a1b2c3',
          platform: 'linux',
          arch: 'x64',
          edgeVersion: '0.1.0',
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
