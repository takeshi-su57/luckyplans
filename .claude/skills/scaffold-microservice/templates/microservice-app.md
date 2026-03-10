# Microservice App Template

Create `apps/service-<name>/` with the following files.

## Source Files (`src/`)

### `src/main.ts`

```typescript
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
  console.warn('<PascalName> Service is listening on Redis transport');
}

bootstrap();
```

### `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { <PascalName>Controller } from './<name>.controller';
import { <PascalName>Service } from './<name>.service';

@Module({
  controllers: [<PascalName>Controller],
  providers: [<PascalName>Service],
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
import { Injectable } from '@nestjs/common';
import type { ServiceResponse } from '@luckyplans/shared';

@Injectable()
export class <PascalName>Service {
  // Business logic here. Return plain objects or ServiceResponse<T>.
}
```

## Config Files (root of `apps/service-<name>/`)

### `package.json`

Copy from `apps/service-core/package.json`. Change `name` to `@luckyplans/service-<name>`.

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
