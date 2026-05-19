---
name: scaffold-microservice
description: Use when deciding whether a new NestJS microservice is justified and, if justified, creating the full LuckyPlans microservice stack from app bootstrap through Docker, Helm, and ArgoCD deployment.
---

# Skill: Scaffold Microservice (LuckyPlans)

Create a new NestJS microservice only when workload and operations justify a separate deployable unit.

## When To Use

Use this skill when a feature has one or more of these traits:
- CPU-heavy processing that can degrade API gateway responsiveness.
- Background or long-running workloads (workers, async pipelines, queue-like behavior).
- Cron or scheduled jobs requiring independent lifecycle.
- Independent scaling/SLO needs versus existing services.
- Operational isolation requirement (deploy cadence, rollback, observability boundaries).

## Do Not Use

Do not use this skill for:
- Basic CRUD entity expansion. Add to `apps/service-core` instead.
- Domain-driven service sprawl (`service-orders`, `service-users`) without performance or ops justification.
- Splitting code only for style preference.

## Architecture Guardrails (Non-Negotiable)

1. Gateway remains a thin client-facing interface (`apps/api-gateway`).
2. New microservice must represent meaningful functional isolation, not entity naming.
3. Business logic in `*.service.ts`; controllers are transport-only.
4. Shared contracts and enums live in `packages/shared/src/types/index.ts`.
5. Use `getEnvVar()` from `@luckyplans/shared`; no raw `process.env` reads in app code.
6. No cross-app imports between `apps/*`.
7. New microservice must include telemetry bootstrap and trace extraction wiring.

## Decision Gate (Must Pass Before Scaffolding)

Proceed only if all checks pass:
1. The feature cannot be reasonably handled in `service-core` or gateway module form.
2. There is explicit workload justification (CPU, cron, independent scaling, or ops lifecycle).
3. Service boundary is functional and stable (clear ownership + message contract).
4. Team accepts added platform cost (Docker, Helm, ArgoCD, CI updates, observability).

If any check fails, stop and use `scaffold-submodule` or `create-gateway-module` instead.

## Output Scope

This skill creates all required layers:
- Shared contracts: enum patterns + types in `packages/shared/src/types/index.ts`
- Microservice app: `apps/service-<name>/` bootstrap and module structure
- Containerization: `apps/service-<name>/Dockerfile`
- Deployment: Helm templates/values + ArgoCD manifests
- CI/CD references: workflow matrix/tag-update paths used by repository
- Gateway integration is intentionally excluded from this skill; handle it with `create-gateway-module`.

## Implementation Checklist

1. Confirm service name and responsibility statement.
2. Add shared message pattern enum and payload/response types in `packages/shared/src/types/index.ts`.
3. Build shared package: `pnpm --filter @luckyplans/shared build`.
4. Scaffold `apps/service-<name>/` from `service-core` structure:
   - `src/instrument.ts` (OTel bootstrap; first import in `main.ts`)
   - `src/main.ts` (Redis microservice bootstrap)
   - `src/app.module.ts` (module wiring, logger, interceptors)
   - `src/<name>.controller.ts` (thin `@MessagePattern` handlers)
   - `src/<name>.service.ts` (business logic)
   - project configs (`package.json`, `tsconfig*`, `nest-cli.json`, `eslint.config.mjs`)
5. Ensure dependencies align with existing service pattern (`nestjs-pino`, `pino`, `pino-http`, `@opentelemetry/api`).
6. Add `apps/service-<name>/Dockerfile` by copying `apps/service-core/Dockerfile` and replacing service identifiers.
7. Add Helm resources in `infrastructure/helm/luckyplans/`:
   - deployment/service template for `service-<name>`
   - values entry (image, resources, env, probes)
8. Add/update ArgoCD manifests in `infrastructure/argocd/apps/` (for example `luckyplans-prod.yaml`) or repository-specific app manifests used by this repo.
9. Update CI/CD workflows if service matrix/tag automation requires explicit entries.
10. Verify local quality gates:
    - `pnpm lint`
    - `pnpm type-check`
    - `pnpm build`
    - `pnpm format:check`

## Minimal File Map

- `packages/shared/src/types/index.ts`
- `apps/service-<name>/src/instrument.ts`
- `apps/service-<name>/src/main.ts`
- `apps/service-<name>/src/app.module.ts`
- `apps/service-<name>/src/<name>.controller.ts`
- `apps/service-<name>/src/<name>.service.ts`
- `apps/service-<name>/package.json`
- `apps/service-<name>/Dockerfile`
- `infrastructure/helm/luckyplans/templates/...`
- `infrastructure/helm/luckyplans/values.yaml`
- ArgoCD app/overlay files used by this repository

## Definition of Done

- Decision gate documented in PR/summary (why new service is justified).
- Shared contracts compile and are available for downstream integration.
- Service has Docker + Helm + ArgoCD path ready for deployment.
- Lint, type-check, build, and format checks pass.
- Gateway module integration is tracked as a separate task via `create-gateway-module`.

## Anti-Patterns

- Creating new service for plain CRUD entities.
- Putting business logic in microservice controller.
- Defining duplicate types outside `packages/shared`.
- Direct `process.env` usage in application code.
- Omitting `instrument.ts` or trace extraction setup.
