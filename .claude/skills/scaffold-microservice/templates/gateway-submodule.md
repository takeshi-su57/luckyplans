# Gateway Submodule Template

Create `apps/api-gateway/src/<name>/` to expose the new microservice via GraphQL.

This is the same pattern as `scaffold-submodule` — refer to that skill's gateway template for details.

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
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ObjectType, Field, ID } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { <PascalName>MessagePattern } from '@luckyplans/shared';
import type { <PascalName>, AuthUser } from '@luckyplans/shared';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// Define @ObjectType() classes mirroring shared entity interfaces

@Resolver()
export class <PascalName>Resolver {
  constructor(
    @Inject('<UPPER_NAME>_SERVICE') private readonly <camelName>Client: ClientProxy,
  ) {}

  // Protected resolver — requires authenticated session
  @UseGuards(SessionGuard)
  @Query(() => <PascalName>Type, { nullable: true })
  async get<PascalName>(
    @Args('id') id: string,
    @CurrentUser() _user: AuthUser,
  ): Promise<<PascalName>> {
    return firstValueFrom(
      this.<camelName>Client.send(<PascalName>MessagePattern.GET, { id }),
    );
  }
}
```

> **Auth:** Use `@UseGuards(SessionGuard)` + `@CurrentUser()` for protected resolvers. Omit for public endpoints (like `health`).

### Register in `apps/api-gateway/src/app.module.ts`

```typescript
import { <PascalName>Module } from './<name>/<name>.module';
// Add <PascalName>Module to the imports array
```
