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
import { Inject } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, ObjectType, Field } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { <PascalName>MessagePattern } from '@luckyplans/shared';

// Define @ObjectType() classes mirroring shared entity interfaces

@Resolver()
export class <PascalName>Resolver {
  constructor(
    @Inject('<UPPER_NAME>_SERVICE') private readonly <camelName>Client: ClientProxy,
  ) {}

  // Use firstValueFrom(this.<camelName>Client.send(Pattern, payload))
}
```

### Register in `apps/api-gateway/src/app.module.ts`

```typescript
import { <PascalName>Module } from './<name>/<name>.module';
// Add <PascalName>Module to the imports array
```
