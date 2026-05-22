import { otelSdk } from './instrument';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = process.env.API_GATEWAY_PORT || 3001;
  await app.listen(port);
  app.get(Logger).log(`API Gateway running on http://localhost:${port}/graphql`);
}

process.on('SIGTERM', async () => {
  await otelSdk.shutdown();
});

bootstrap();
