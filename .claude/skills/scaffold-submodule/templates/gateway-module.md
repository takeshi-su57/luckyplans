# Gateway Module Template

A gateway module lives in `apps/api-gateway/src/<name>/` and exposes a domain via GraphQL by forwarding requests to a microservice.

## Shared Types (define first)

Before creating the module, define entities and message patterns in `packages/shared/src/types/index.ts`:

```typescript
// Entity interface — used by both microservice and gateway
export interface <PascalName> {
  id: string;
  // ...fields
  createdAt: Date;
}

// DTO for create/update payloads
export interface Create<PascalName>Dto {
  // ...fields without id/createdAt
}

// Message patterns — add to existing enum or create new one
export enum <PascalName>MessagePattern {
  GET = '<camelName>.get',
  LIST = '<camelName>.list',
  CREATE = '<camelName>.create',
}
```

Then rebuild: `pnpm --filter @luckyplans/shared build`

## Module Files

### `<name>.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { <PascalName>Resolver } from './<name>.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: '<UPPER_NAME>_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [<PascalName>Resolver],
})
export class <PascalName>Module {}
```

### `<name>.resolver.ts`

```typescript
import { Inject } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ObjectType, Field, ID } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
// Import shared types — entities for type safety, patterns for message routing
import { <PascalName>MessagePattern } from '@luckyplans/shared';
import type { <PascalName> } from '@luckyplans/shared';

// GraphQL object types (code-first) — mirror the shared entity interface
@ObjectType()
class <PascalName>Type {
  @Field(() => ID)
  id!: string;

  // ... @Field() for each entity field
}

@Resolver()
export class <PascalName>Resolver {
  constructor(@Inject('<UPPER_NAME>_SERVICE') private readonly <camelName>Client: ClientProxy) {}

  @Query(() => <PascalName>Type, { nullable: true })
  async get<PascalName>(@Args('id') id: string): Promise<<PascalName>> {
    return firstValueFrom(
      this.<camelName>Client.send(<PascalName>MessagePattern.GET, { id }),
    );
  }
}
```

## Registration

Import in `apps/api-gateway/src/app.module.ts`:

```typescript
import { <PascalName>Module } from './<name>/<name>.module';
// Add <PascalName>Module to the imports array
```
