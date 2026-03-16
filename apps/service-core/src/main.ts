import { otelSdk } from './instrument';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { getRedisConfig } from '@luckyplans/shared';

async function bootstrap() {
  const redisConfig = getRedisConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  await app.listen();
  app.get(Logger).log('Core Service is listening on Redis transport');
}

process.on('SIGTERM', async () => {
  await otelSdk.shutdown();
});

bootstrap();
