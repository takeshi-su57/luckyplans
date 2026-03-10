# Microservice Module Template

A microservice module lives in `apps/service-<app>/src/<name>/` and handles a set of message patterns.

## Shared Types (define first)

Before creating the module, define entities and message patterns in `packages/shared/src/types/index.ts`:

```typescript
// Entity interface — the domain model
export interface <PascalName> {
  id: string;
  // ...fields
  createdAt: Date;
}

// DTO for create/update payloads
export interface Create<PascalName>Dto {
  // ...fields without id/createdAt
}

// Message patterns — add to existing enum (e.g., CoreMessagePattern) or create new one
// Use existing enum when entity belongs to that service's domain
```

Then rebuild: `pnpm --filter @luckyplans/shared build`

## Module Files

### `<name>.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { <PascalName>Controller } from './<name>.controller';
import { <PascalName>Service } from './<name>.service';

@Module({
  controllers: [<PascalName>Controller],
  providers: [<PascalName>Service],
})
export class <PascalName>Module {}
```

### `<name>.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
// Import message patterns and DTOs from shared
import { <MessagePatternEnum> } from '@luckyplans/shared';
import type { Create<PascalName>Dto } from '@luckyplans/shared';
import { <PascalName>Service } from './<name>.service';

@Controller()
export class <PascalName>Controller {
  constructor(private readonly <camelName>Service: <PascalName>Service) {}

  @MessagePattern(<MessagePatternEnum>.CREATE)
  async create(@Payload() data: Create<PascalName>Dto) {
    return this.<camelName>Service.create(data);
  }
}
```

### `<name>.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
// Import entities, DTOs, response types, and utils from shared
import { generateId } from '@luckyplans/shared';
import type { <PascalName>, Create<PascalName>Dto, ServiceResponse } from '@luckyplans/shared';

@Injectable()
export class <PascalName>Service {
  async create(dto: Create<PascalName>Dto): Promise<ServiceResponse<<PascalName>>> {
    const entity: <PascalName> = {
      id: generateId(),
      ...dto,
      createdAt: new Date(),
    };
    return { success: true, data: entity };
  }
}
```

## Registration

Import in the app's `app.module.ts`:

```typescript
import { <PascalName>Module } from './<name>/<name>.module';
// Add <PascalName>Module to the imports array
```
