# Skill: Add NestJS Module

Add a new sub-module to an existing NestJS app (api-gateway or a microservice).

## What This Skill Does

A NestJS module is a subdirectory within an app containing `module.ts`, `service.ts`, and either `resolver.ts` (gateway) or `controller.ts` (microservice).

## Where Things Are Defined

| What | Where | Import |
|------|-------|--------|
| Entity interfaces | `packages/shared/src/types/index.ts` | `import { Order } from '@luckyplans/shared'` |
| DTOs / payload types | `packages/shared/src/types/index.ts` | `import { CreateOrderDto } from '@luckyplans/shared'` |
| Message pattern enums | `packages/shared/src/types/index.ts` | `import { CoreMessagePattern } from '@luckyplans/shared'` |
| Utility functions | `packages/shared/src/utils/index.ts` | `import { generateId } from '@luckyplans/shared'` |
| Shared response types | `packages/shared/src/types/index.ts` | `import { ServiceResponse } from '@luckyplans/shared'` |
| GraphQL object types | In the resolver file (code-first) | Local to the resolver |
| Business logic | In the service file (`*.service.ts`) | Local to the module |

All cross-service types flow through `@luckyplans/shared`. Barrel export: `packages/shared/src/index.ts` re-exports `./types` and `./utils`.

## Two Module Types

### Gateway Module (apps/api-gateway)

For exposing a domain via GraphQL. Creates:
- `<name>.module.ts` — registers `ClientProxy` to target microservice
- `<name>.resolver.ts` — GraphQL types + query/mutation methods, imports entities from `@luckyplans/shared`

### Microservice Module (apps/service-*)

For adding functionality to a microservice. Creates:
- `<name>.module.ts` — registers controller + service
- `<name>.controller.ts` — `@MessagePattern` handlers, imports patterns from `@luckyplans/shared`
- `<name>.service.ts` — business logic, imports entities/utils from `@luckyplans/shared`

## Steps

1. Define entities and DTOs in `packages/shared/src/types/index.ts`
2. Add message patterns to the relevant enum in `packages/shared/src/types/index.ts`
3. Rebuild shared: `pnpm --filter @luckyplans/shared build`
4. Create module directory: `apps/<app>/src/<module-name>/`
5. Create module files (see `templates/` for patterns)
6. Import the new module in the app's `app.module.ts`
7. Verify: `pnpm lint && pnpm type-check && pnpm build`

## Reference

- See `templates/gateway-module.md` for gateway module pattern
- See `templates/microservice-module.md` for microservice module pattern
- See `examples/` for worked examples
