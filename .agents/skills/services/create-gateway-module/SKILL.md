---
name: create-gateway-module
description: Use when creating a standard NestJS module in the API gateway, and when a new service is not justified by CPU-heavy, cron, or independent scaling requirements.
---

# Create Gateway Module

## Overview
Create one module in `apps/api-gateway` per run using standard NestJS module patterns. Keep resolver/service boundaries clean and keep cross-app contracts in `@luckyplans/shared`.

## When To Use
- A new GraphQL-facing domain area is needed in `apps/api-gateway`.
- The feature does not justify a new deployable microservice.
- You want standard NestJS module boundaries with thin resolvers.

## Do Not Use
- Creating modules directly in `apps/service-core` via this skill.
- Any case that needs a new microservice app, Docker, Helm, or ArgoCD setup.
- Multi-app scaffolding in one step.
- Refactoring unrelated existing modules.
- Adding new frameworks or major dependencies.

If the work is CPU-heavy, cron/scheduled, long-running, or needs independent scaling/ops lifecycle, use `scaffold-microservice` instead.

## Target Rules
1. Scaffold only one gateway module at a time.
2. Use constructor-based dependency injection.
3. Keep module wiring in `*.module.ts`.
4. Keep business logic in `*.service.ts`.
5. Keep `*.resolver.ts` thin transport layers.
6. Place shared contracts/types in `packages/shared/src/types/index.ts` when cross-app.
7. Register a Redis client only when this module must call a microservice.
8. When using `ClientProxy.send()`, wrap payloads with `injectTraceContext()`.

## Standard Structure
Create folder: `apps/api-gateway/src/<module-name>/`

Required files:
- `<module-name>.module.ts`
- `<module-name>.service.ts`
- `<module-name>.resolver.ts`

Optional (when needed):
- `dto/`
- `constants/`
- `guards/`

## Implementation Checklist
1. Confirm module name and that a new microservice is not required.
2. Create gateway module folder.
3. Add `*.module.ts` with providers/imports registration.
4. Add `*.service.ts` with injectable business logic class.
5. Add `*.resolver.ts` for GraphQL handlers that delegate to service.
6. If microservice communication is needed, register Redis client with `ClientsModule.register()` and `getRedisConfig()`.
7. If `ClientProxy.send()` is used, ensure every payload is wrapped with `injectTraceContext()`.
8. Register module in gateway `app.module.ts`.
9. If cross-app contract is needed, add types/enums to `@luckyplans/shared`.
10. Verify with `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Templates

### Module Template
```ts
import { Module } from '@nestjs/common';
import { <PascalName>Resolver } from './<kebab-name>.resolver';
import { <PascalName>Service } from './<kebab-name>.service';

@Module({
  providers: [<PascalName>Service, <PascalName>Resolver],
  exports: [<PascalName>Service],
})
export class <PascalName>Module {}
```

Optional `imports` for microservice calls:

```ts
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getRedisConfig } from '@luckyplans/shared';

const redisConfig = getRedisConfig();

imports: [
  ClientsModule.register([
    {
      name: '<UPPER_NAME>_SERVICE',
      transport: Transport.REDIS,
      options: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    },
  ]),
],
```

### Service Template
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class <PascalName>Service {
  // Put core business logic here.
}
```

### Resolver Template
```ts
import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { <PascalName>MessagePattern, injectTraceContext } from '@luckyplans/shared';
import { <PascalName>Service } from './<kebab-name>.service';

@Resolver()
export class <PascalName>Resolver {
  constructor(
    private readonly service: <PascalName>Service,
    @Inject('<UPPER_NAME>_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sampleOperation(id: string) {
    return firstValueFrom(
      this.client.send(
        <PascalName>MessagePattern.GET,
        injectTraceContext({ id }),
      ),
    );
  }
}
```

## Common Mistakes
- Choosing this skill when the feature should be a new microservice.
- Putting orchestration or business logic in resolver.
- Skipping module registration in gateway `app.module.ts`.
- Duplicating contract types instead of sharing via `@luckyplans/shared`.
- Adding Redis client registration by default when no microservice call exists.
- Sending Redis messages without `injectTraceContext()`.

