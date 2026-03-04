import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.API_GATEWAY_PORT || 3001;
  await app.listen(port);
  console.warn(`API Gateway running on http://localhost:${port}/graphql`);
}

bootstrap();
