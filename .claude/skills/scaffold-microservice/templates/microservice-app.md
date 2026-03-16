# Microservice App Template

Create `apps/service-<name>/` with the following files.

## Source Files (`src/`)

### `src/instrument.ts`

**MUST be the first import in `main.ts`.** Initializes OTel SDK before NestJS loads so auto-instrumentation captures all modules.

```typescript
import { bootstrapTelemetry } from '@luckyplans/shared';

export const otelSdk = bootstrapTelemetry({
  serviceName: 'service-<name>',
});
```

### `src/main.ts`

```typescript
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
  app.get(Logger).log('<PascalName> Service is listening on Redis transport');
}

process.on('SIGTERM', async () => {
  await otelSdk.shutdown();
});

bootstrap();
```

### `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { trace } from '@opentelemetry/api';
import { TraceContextExtractor } from '@luckyplans/shared';
import { <PascalName>Controller } from './<name>.controller';
import { <PascalName>Service } from './<name>.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        mixin: () => {
          const span = trace.getActiveSpan();
          if (!span) return {};
          const ctx = span.spanContext();
          return { traceId: ctx.traceId, spanId: ctx.spanId };
        },
      },
    }),
  ],
  controllers: [<PascalName>Controller],
  providers: [
    <PascalName>Service,
    { provide: APP_INTERCEPTOR, useClass: TraceContextExtractor },
  ],
})
export class AppModule {}
```

### `src/<name>.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { <PascalName>MessagePattern } from '@luckyplans/shared';
import { <PascalName>Service } from './<name>.service';

@Controller()
export class <PascalName>Controller {
  constructor(private readonly <camelName>Service: <PascalName>Service) {}

  @MessagePattern(<PascalName>MessagePattern.ACTION)
  async action(@Payload() data: { ... }) {
    return this.<camelName>Service.action(data);
  }
}
```

### `src/<name>.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import type { ServiceResponse } from '@luckyplans/shared';

@Injectable()
export class <PascalName>Service {
  private readonly logger = new Logger(<PascalName>Service.name);

  // Business logic here. Use this.logger for logging — never console.*.
  // Return plain objects or ServiceResponse<T>.
}
```

## Config Files (root of `apps/service-<name>/`)

### `package.json`

Copy from `apps/service-core/package.json`. Change `name` to `@luckyplans/service-<name>`. Ensure these dependencies are present:

```json
{
  "dependencies": {
    "@luckyplans/shared": "workspace:*",
    "@nestjs/common": "...",
    "@nestjs/core": "...",
    "@nestjs/microservices": "...",
    "@opentelemetry/api": "^1.9.0",
    "nestjs-pino": "^4.6.0",
    "pino": "^10.3.0",
    "pino-http": "^11.0.0",
    "rxjs": "..."
  },
  "devDependencies": {
    "pino-pretty": "^13.0.0"
  }
}
```

### `tsconfig.json`

```json
{
  "extends": "@luckyplans/config/tsconfig.nestjs.json",
  "compilerOptions": { "outDir": "./dist" },
  "include": ["src"]
}
```

### `nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": { "deleteOutDir": true }
}
```

### `eslint.config.mjs`

Copy from `apps/service-core/eslint.config.mjs` — it's identical for all NestJS apps.
