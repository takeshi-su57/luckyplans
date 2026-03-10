# How to Develop Locally

## Prerequisites

| Tool    | Version   | Install                              |
| ------- | --------- | ------------------------------------ |
| Node.js | >= 20.0.0 | [nodejs.org](https://nodejs.org)     |
| pnpm    | >= 9.0.0  | `npm install -g pnpm@9.15.4`         |
| Docker  | Latest    | [docker.com](https://www.docker.com) |

---

## Quick Start

```bash
# First time — installs deps, sets up .env, builds shared packages:
pnpm setup

# Start Redis (required for inter-service communication):
docker run -d --name luckyplans-redis -p 6379:6379 redis:7-alpine

# Start all services with hot reload:
pnpm dev
```

Frontend at http://localhost:3000, GraphQL at http://localhost:3001/graphql.

---

## Step-by-Step Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Default values work out of the box for local development.

### 3. Start Redis

Redis is required for inter-service communication (NestJS microservices use Redis transport):

```bash
docker run -d --name luckyplans-redis -p 6379:6379 redis:7-alpine
```

Verify it's running:

```bash
docker exec luckyplans-redis redis-cli ping
# Should return: PONG
```

To start it again after a machine restart:

```bash
docker start luckyplans-redis
```

### 4. Build shared packages

```bash
pnpm --filter @luckyplans/shared build
```

### 5. Start all services

```bash
pnpm dev
```

Turborepo starts everything in parallel with hot reload:

| Service      | URL                           | Description        |
| ------------ | ----------------------------- | ------------------ |
| Frontend     | http://localhost:3000         | Next.js app        |
| API Gateway  | http://localhost:3001/graphql | GraphQL Playground |
| service-auth | — (Redis transport)           | No HTTP endpoint   |
| service-core | — (Redis transport)           | No HTTP endpoint   |

### 6. Verify everything works

1. Open http://localhost:3001/graphql — you should see the GraphQL Playground
2. Run a health check query:

   ```graphql
   query {
     health
   }
   ```

   Expected: `"API Gateway is running"`

3. Open http://localhost:3000 — the frontend should load and show the API connection status

---

## Working on Specific Services

### Run a single service

```bash
# Frontend only
pnpm --filter @luckyplans/web dev

# API Gateway only
pnpm --filter @luckyplans/api-gateway dev

# Auth service only
pnpm --filter @luckyplans/service-auth dev

# Core service only
pnpm --filter @luckyplans/service-core dev
```

### Build a single service

```bash
pnpm --filter @luckyplans/web build
pnpm --filter @luckyplans/api-gateway build
```

### Build only shared packages

```bash
pnpm --filter @luckyplans/shared build
```

---

## Working with Shared Packages

Shared packages are in `packages/` and used as workspace dependencies (`workspace:*` in package.json).
pnpm symlinks them into `node_modules` — no publishing to npm required.

### `@luckyplans/shared` — Types and utilities

Location: `packages/shared/`

Exports:

- **Types**: `User`, `ServiceResponse`, `PaginatedResponse`, etc.
- **Enums**: `AuthMessagePattern`, `CoreMessagePattern` (Redis message patterns)
- **Utilities**: `generateId()`, `getRedisConfig()`, `getEnvVar()`

Usage in any app:

```typescript
import { AuthMessagePattern, ServiceResponse, getRedisConfig } from '@luckyplans/shared';
```

After making changes to shared packages, Turborepo picks them up automatically in dev mode (it watches for changes and rebuilds).

### `@luckyplans/config` — ESLint and TypeScript configs

Location: `packages/config/`

Shared presets that apps extend:

- `tsconfig.nextjs.json` — for Next.js apps
- `tsconfig.nestjs.json` — for NestJS services
- `tsconfig.base.json` — for shared packages
- `eslint-preset.js` — base ESLint rules

---

## Adding a New Microservice

### 1. Create the service directory

```bash
mkdir -p apps/service-<name>/src
```

### 2. Copy boilerplate from an existing service

Use `service-core` as a template:

```bash
cp apps/service-core/package.json apps/service-<name>/
cp apps/service-core/tsconfig.json apps/service-<name>/
cp apps/service-core/tsconfig.build.json apps/service-<name>/
cp apps/service-core/nest-cli.json apps/service-<name>/
```

### 3. Update `package.json`

Change the name to `@luckyplans/service-<name>`.

### 4. Define message patterns

Add patterns in `packages/shared/src/types/index.ts`:

```typescript
export enum NewServiceMessagePattern {
  GET_SOMETHING = 'new-service.getSomething',
  CREATE_SOMETHING = 'new-service.createSomething',
}
```

### 5. Create the service files

- `src/main.ts` — Bootstrap with Redis transport
- `src/app.module.ts` — Module definition
- `src/<name>.controller.ts` — `@MessagePattern` handlers
- `src/<name>.service.ts` — Business logic

### 6. Register in the API Gateway

Create a new module in `apps/api-gateway/src/<name>/`:

- `<name>.module.ts` — Register `ClientsModule` with Redis transport
- `<name>.resolver.ts` — GraphQL resolvers

Import the module in `apps/api-gateway/src/app.module.ts`.

### 7. Add a Helm template

Add a Deployment template at `infrastructure/helm/luckyplans/templates/service-<name>/deployment.yaml`.
Copy from `templates/service-core/deployment.yaml` and add values in `values.yaml` under `service<Name>:`.

### 8. Install dependencies and test

```bash
pnpm install
pnpm build
pnpm dev
```

---

## All Commands

| Command                     | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| **Setup**                   |                                                            |
| `pnpm setup`                | First-time project setup (deps, .env, build shared pkgs)   |
| **Development**             |                                                            |
| `pnpm dev`                  | Start all services with hot reload (Redis must be running) |
| **Build & Quality**         |                                                            |
| `pnpm build`                | Build all packages and apps                                |
| `pnpm lint`                 | Lint all packages                                          |
| `pnpm type-check`           | Type-check all packages                                    |
| `pnpm format`               | Format all files with Prettier                             |
| `pnpm format:check`         | Check formatting without modifying                         |
| `pnpm clean`                | Remove all build artifacts and node_modules                |
| **Deployment (k3d + Helm)** |                                                            |
| `pnpm deploy:local`         | Build images and deploy to local k3d cluster via Helm      |
| `pnpm deploy:teardown`      | Destroy the local k3d cluster                              |
| `pnpm deploy:status`        | Show cluster, Helm release, and pod status                 |

---

## Troubleshooting

### Redis connection refused

Make sure Redis is running:

```bash
docker ps | grep luckyplans-redis
```

If not running:

```bash
docker start luckyplans-redis
# or create a new container:
docker run -d --name luckyplans-redis -p 6379:6379 redis:7-alpine
```

### Port already in use

Check what's using the port:

```bash
# Linux/Mac
lsof -i :3000
lsof -i :3001

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Turborepo cache issues

Clear the cache and rebuild:

```bash
pnpm clean
pnpm install
pnpm build
```

### Shared package changes not reflected

If changes in `packages/shared` aren't picked up:

1. Rebuild the package: `pnpm --filter @luckyplans/shared build`
2. Restart the dev server: `pnpm dev`
