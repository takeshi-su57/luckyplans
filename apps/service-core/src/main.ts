import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
  });

  await app.listen();
  console.warn('Core Service is listening on Redis transport');
}

bootstrap();
