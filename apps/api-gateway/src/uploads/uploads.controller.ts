import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/session.guard';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('prefix') prefix?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const videoTypes = ['video/mp4', 'video/webm'];
    const allowedTypes = [...imageTypes, ...videoTypes];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image (JPEG, PNG, GIF, WebP, SVG) and video (MP4, WebM) files are allowed',
      );
    }

    const isVideo = videoTypes.includes(file.mimetype);
    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File too large. Max size: ${isVideo ? '25MB' : '5MB'} for ${isVideo ? 'video' : 'image'} files`,
      );
    }

    const key = await this.uploadsService.uploadFile(file, prefix || 'general');
    return { key };
  }

  @Get('*')
  async serve(@Req() req: Request, @Res() res: Response) {
    // Extract the file key from the URL path after /uploads/
    const key = req.path.replace(/^\/uploads\//, '');
    if (!key) {
      res.status(400).json({ error: 'No file key provided' });
      return;
    }

    try {
      const { stream, contentType } = await this.uploadsService.getFileStream(key);
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      stream.pipe(res);
    } catch {
      res.status(404).json({ error: 'File not found' });
    }
  }
}
