import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client as MinioClient } from 'minio';
import { getEnvVar } from '@luckyplans/shared';
import { Readable } from 'stream';

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly logger = new Logger(UploadsService.name);
  private readonly client: MinioClient;
  private readonly bucket: string;

  constructor() {
    this.bucket = getEnvVar('MINIO_BUCKET', 'luckyplans-uploads');
    this.client = new MinioClient({
      endPoint: getEnvVar('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(getEnvVar('MINIO_PORT', '9000'), 10),
      useSSL: getEnvVar('MINIO_USE_SSL', 'false') === 'true',
      accessKey: getEnvVar('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: getEnvVar('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        this.logger.log(`Created MinIO bucket: ${this.bucket}`);
      }
    } catch (error) {
      this.logger.warn(
        `Failed to connect to MinIO — file uploads will not work until MinIO is available. Error: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string },
    prefix: string,
  ): Promise<string> {
    const ext = file.originalname.split('.').pop() || 'bin';
    const key = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    await this.client.putObject(this.bucket, key, file.buffer, file.buffer.length, {
      'Content-Type': file.mimetype,
    });

    this.logger.log(`Uploaded file: ${key} (${file.buffer.length} bytes)`);
    return key;
  }

  async getFileStream(key: string): Promise<{ stream: Readable; contentType: string }> {
    const stat = await this.client.statObject(this.bucket, key);
    const stream = await this.client.getObject(this.bucket, key);
    return {
      stream: stream as Readable,
      contentType: (stat.metaData?.['content-type'] as string) || 'application/octet-stream',
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
    this.logger.log(`Deleted file: ${key}`);
  }
}
