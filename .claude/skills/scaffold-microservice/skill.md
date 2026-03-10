# Skill: Scaffold Microservice

Create a new NestJS microservice for complex business logic that goes beyond CRUD.

**When to use:** Only when the functionality justifies a separate deployable service (e.g., trading engine, notification delivery, ML pipeline). For new domain entities, use `scaffold-submodule` to add them to `service-core` instead.

## What Gets Created

| Layer | Files |
|-------|-------|
| Shared types | Message pattern enum + entity types in `packages/shared/src/types/index.ts` |
| Microservice app | `apps/service-<name>/` — source code, package.json, configs |
| Gateway submodule | `apps/api-gateway/src/<name>/` — module + resolver |
| Docker | `apps/service-<name>/Dockerfile` |
| Kubernetes | Helm deployment + values entry |
| CI/CD | Add to `docker-build.yml` matrix + `update-tags.yml` |

## Steps

### 1. Define shared types

In `packages/shared/src/types/index.ts`, add message pattern enum and entity types.

Then: `pnpm --filter @luckyplans/shared build`

### 2. Create microservice app

Create `apps/service-<name>/` with the 4-file source pattern plus config files.

See `templates/microservice-app.md` for the full file list and patterns.

### 3. Create gateway submodule

Create `apps/api-gateway/src/<name>/` with module + resolver.

Register in `apps/api-gateway/src/app.module.ts`.

See `templates/gateway-submodule.md` for the pattern.

### 4. Add Dockerfile

Copy from `apps/service-core/Dockerfile`, replace all `service-core` with `service-<name>`.

### 5. Add Helm deployment

- Create `infrastructure/helm/luckyplans/templates/service-<name>/deployment.yaml`
- Add values entry in `infrastructure/helm/luckyplans/values.yaml`

See `templates/helm.md` for the patterns.

### 6. Add to CI/CD

- Add `service-<name>` to the matrix in `.github/workflows/docker-build.yml`
- Add image tag update in `.github/workflows/update-tags.yml`

See `templates/ci.md` for what to change.

### 7. Install and verify

```bash
pnpm install
pnpm lint
pnpm type-check
pnpm build
```

## Reference

- See `templates/` for patterns for each layer
- See `examples/` for a complete worked example (trading service)
