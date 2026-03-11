# Architecture Rules

## Service Decomposition: Functional Split

Microservices are split by **functionality**, not by domain:

- `service-core` — generic CRUD operations for all domain entities
- `service-auth` — authentication and authorization
- Future services for specific business logic (e.g., `service-trading` for trading engine)

**When to add a new entity:** Add it to `service-core`. Define the entity type in `packages/shared`, add message patterns, and extend the core controller/service.

**When to create a new microservice:** Only when the functionality has complex business logic beyond CRUD that justifies isolation (e.g., a trading engine, notification delivery system).

**Do not** create a new microservice per domain (no `service-orders`, `service-users`, etc.). Domain entities share `service-core`.

## Domain Models in Shared Packages

All entity types, interfaces, and enums live in `packages/shared` — not in individual services:

- `packages/shared/src/types/index.ts` — entity interfaces, `ServiceResponse<T>`, message pattern enums
- Services import types from `@luckyplans/shared`, never define their own domain types

This is a **shared kernel** approach: all services agree on the same domain models.

## Microservice Structure

Each NestJS microservice follows the 4-file pattern. Canonical example: `apps/service-core/src/`:

```
apps/service-<name>/src/
├── main.ts              # Bootstrap: createMicroservice() with Redis transport
├── app.module.ts        # Root module: imports, controllers, providers
├── <name>.controller.ts # Thin: @MessagePattern handlers that delegate to service
└── <name>.service.ts    # All business logic lives here (@Injectable)
```

As a service grows, it may have multiple controllers/services organized by concern — but the pattern stays the same.

## Service Layer

- All business logic belongs in `*.service.ts` files decorated with `@Injectable()`
- Services return plain objects or use `ServiceResponse<T>` from `@luckyplans/shared`
- Services must not import NestJS transport types (`ClientProxy`, `@MessagePattern`, etc.)
- Use `async/await` for all asynchronous operations

## Controllers (Microservices)

- Controllers are thin routing layers — destructure `@Payload()` and call the corresponding service method
- One `@MessagePattern()` handler per message pattern enum value
- Never put business logic, validation, or transformation in controllers

## API Gateway

The gateway (`apps/api-gateway/`) is the only service that communicates with the frontend via GraphQL.

### Resolvers
- Inject `ClientProxy` via `@Inject('SERVICE_NAME')` (e.g., `@Inject('CORE_SERVICE')`)
- Convert Observable to Promise with `firstValueFrom()` from `rxjs`
- Define GraphQL types in the resolver file using code-first decorators

### Gateway Modules
- Register microservice clients using `ClientsModule.register()` with `Transport.REDIS`
- Each functional domain in the gateway gets its own module (e.g., `auth.module.ts`, `core.module.ts`)

### GraphQL
- Code-first approach only — use `@ObjectType()`, `@Field()`, `@Resolver()`, `@Query()`, `@Mutation()`
- Schema auto-generated via `autoSchemaFile: true` in `GraphQLModule.forRoot()`
- Do not create `.graphql` schema files manually

## Shared Package (`packages/shared`)

### Types (`packages/shared/src/types/index.ts`)
- All entity interfaces, message pattern enums, and shared types defined here
- Pattern naming convention: `'service.actionName'` with camelCase action (e.g., `'core.getItems'`)
- Shared interfaces: `ServiceResponse<T>`, `PaginatedResponse<T>`, `PaginationParams`, `User`

### Utilities (`packages/shared/src/utils/index.ts`)
- `getEnvVar(key, defaultValue?)` — always use this instead of raw `process.env`
- `getRedisConfig()` — returns `{ host, port }` from env vars
- `generateId()` — timestamp + random string ID generation
- Add new cross-cutting utilities here, not in individual apps

After changes to shared: `pnpm --filter @luckyplans/shared build`

## Adding a New Entity (Common Path)

To add a new domain entity (e.g., `Order`) to `service-core`:

1. Define entity interface in `packages/shared/src/types/index.ts`
2. Add message pattern entries to `CoreMessagePattern` enum
3. Add service methods in `apps/service-core/src/core.service.ts`
4. Add controller handlers in `apps/service-core/src/core.controller.ts`
5. Add GraphQL types and resolver methods in the gateway
6. Rebuild shared: `pnpm --filter @luckyplans/shared build`

## Adding a New Functional Service (Rare)

Only when business logic justifies a separate service:

1. Create `apps/service-<name>/` following the 4-file pattern
2. Add `package.json`, `tsconfig.json`, `nest-cli.json`, `eslint.config.mjs` (copy from `service-core`)
3. Add message pattern enum in `packages/shared/src/types/index.ts`
4. Create gateway module in `apps/api-gateway/src/<name>/`
5. Import new module in `apps/api-gateway/src/app.module.ts`
6. Add `Dockerfile` (copy from `apps/service-core/Dockerfile`)
7. Add Helm templates in `infrastructure/helm/luckyplans/templates/`

## Frontend (`apps/web`)

- Next.js 16 App Router with `'use client'` directive for interactive components
- Apollo Client 4 configured in `apps/web/src/lib/apollo/client.ts` (dataMasking disabled)
- ApolloWrapper in `apps/web/src/lib/apollo/provider.tsx`
- GraphQL Codegen with `client-preset` — config at `apps/web/codegen.ts`, output at `apps/web/src/generated/`
- Operations written inline using `graphql()` from `@/generated` in hook files (no separate `.graphql` files)
- Custom hooks in `apps/web/src/hooks/` use `graphql()` + `useQuery`/`useMutation` with automatic type inference
- Components consume hooks — never import `useQuery`, `useMutation`, or `graphql` directly
- Fetch policy: `cache-and-network` (configured in Apollo Client defaults)
- See `.claude/rules/frontend.md` for full details

## Dependency Injection

- Always use constructor injection
- Services registered as `providers` in their module
- Controllers registered as `controllers` in their module
- Cross-service clients registered via `ClientsModule.register()` in module `imports`
- Never manually instantiate services with `new`

## Anti-Patterns (Do NOT)

- Create a new microservice per domain — use `service-core` for CRUD entities
- Put business logic in controllers or resolvers
- Define entity types in individual services — put them in `packages/shared`
- Use `process.env` directly — use `getEnvVar()` from `@luckyplans/shared`
- Create REST endpoints — the project uses GraphQL exclusively via the API gateway
- Duplicate types across apps — put shared types in `packages/shared`
- Use `any` without a comment explaining the justification
- Use `console.log` — use `console.warn` or `console.error` only
- Import from one app into another — apps communicate only via Redis messages
- Create separate `.graphql` operation files — use inline `graphql()` calls in hook files
- Define GraphQL response types manually in frontend — use codegen-generated types
- Call `useQuery`/`useMutation` directly in page components — wrap in custom hooks in `src/hooks/`
