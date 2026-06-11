import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { UploadsController } from './uploads.controller';

describe('UploadsController', () => {
  it('rejects SVG uploads instead of serving scriptable images from the app origin', async () => {
    const controller = new UploadsController({
      uploadFile: vi.fn(),
    } as never);

    await expect(
      controller.upload({
        mimetype: 'image/svg+xml',
        size: 128,
        originalname: 'payload.svg',
        buffer: Buffer.from('<svg></svg>'),
      } as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
