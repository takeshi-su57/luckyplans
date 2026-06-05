# Agent Guide (Codex)

This repository is configured for Codex-native workflows.

## Instruction Priority

1. Direct user request
2. Repository guidance in `AGENTS.md`
3. Local skills and rules under `.agents/rules/` and `.agents/skills/`
4. Default assistant behavior

## Mandatory Skill Workflow

Use `.agents/skills/using-superpowers/SKILL.md` at the start of every new task.

Required behavior:

1. Check for relevant skills before implementation work.
2. Prioritize process skills first (`brainstorming`, `systematic-debugging`, `test-driven-development`).
3. If a skill has a checklist, track and complete it step-by-step.
4. Do not skip skill flow because a task looks simple.

## Project Context

- Project: `LuckyPlans`
- Repo: `https://github.com/takeshi-su57/luckyplans`
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 16 + React 19 + Apollo Client
- Backend: NestJS API Gateway + NestJS Redis microservices
- Database: PostgreSQL + Prisma (`packages/prisma`)
- Observability: OTel + Prometheus + Grafana + Loki + Tempo
- Deployment: Docker + Helm + ArgoCD (k3s)

## Repository Layout

- `apps/web/`: Next.js frontend and public docs content
- `apps/api-gateway/`: GraphQL gateway plus core domain logic modules
- `packages/shared/`: shared types, enums, utils, telemetry helpers
- `packages/prisma/`: schema, migrations, generated client
- `packages/config/`: lint and tsconfig presets
- `infrastructure/`: Helm charts, ArgoCD manifests, local scripts

## Architecture Rules (Non-Negotiable)

1. Functional decomposition over domain microservice sprawl.
2. Shared domain types belong in `packages/shared`.
3. Business logic stays in `*.service.ts`; controllers/resolvers stay thin.
4. Use constructor-based NestJS dependency injection.
5. GraphQL is code-first in the API gateway.
6. Inter-service communication uses Redis pub/sub message patterns.
7. Use `getEnvVar()` from `@luckyplans/shared`; avoid direct `process.env`.
8. No cross-app imports between `apps/*`.
9. Gateway manages auth/session lifecycle; frontend handles no tokens.
10. Do not introduce major dependencies/frameworks without explicit approval.

## Service Decomposition

- Default path is extending existing services.
- `api-gateway` currently owns shared CRUD-style domain operations.
- `api-gateway` is the single client-facing API interface.
- Create a new microservice only when justified by workload/operations:
  - CPU-heavy workload
  - cron/scheduled workload
  - long-running/background processing
  - independent scaling/SLO needs
  - distinct operational lifecycle needs
- Do not split microservices by domain naming alone (`service-orders`, `service-users`, etc.).

## Skill Routing

- `create-gateway-module`: create or extend gateway modules.
- `scaffold-microservice`: create new microservice app + Docker + Helm + ArgoCD path.
- `docs/architecture/microservice-decision-matrix.md`: required decision reference before new service creation.

### Skill Routing Matrix (Always Check Before Work)

Process skills (run first when applicable):

- `using-superpowers`: mandatory at task start.
- `brainstorming`: before creative feature/design work.
- `systematic-debugging`: before fixing bugs/failures.
- `test-driven-development`: before implementing feature/behavior changes.
- `writing-plans`: after spec approval, before implementation.
- `executing-plans` or `subagent-driven-development`: when executing an approved plan.
- `verification-before-completion`: before claiming done.

Implementation skills:

- Frontend: use relevant `frontend/*` skills for page/component/hook/route/auth/apollo changes.
- Services: `create-gateway-module` for gateway module work.
- Microservices: `scaffold-microservice` only after decision matrix justification.
- Packages: `update-shared-kernel` for shared contracts/utils, `prisma-safe-migrations` for schema changes.

Completion and collaboration skills:

- `add-testing-foundation`: when adding or expanding tests.
- `maintain-project-docs`: when behavior/contracts/docs diverge.
- `requesting-code-review` and `receiving-code-review`: for review loops.
- `prepare-pull-request`: before opening/updating PR.
- `write-conventional-commit`: before any commit message.
- `write-github-issue`: when creating scope/feature/bug issues.

## Prisma Safety

- Never add required columns to populated tables without defaults/backfills.
- Use nullable/default-first migrations, then backfill, then tighten constraints.

## Security Defaults

- Never expose access/refresh tokens to the browser.
- Use HttpOnly session cookie (`session_id`) patterns.
- Never hardcode secrets/keys/tokens/passwords; use env-based config.
- Use `getEnvVar()` from `@luckyplans/shared` instead of direct `process.env` in app code.
- Keep CI security scanning enforced (Trivy CRITICAL/HIGH gates).
- Do not log tokens, passwords, API keys, or full PII payloads.
- Keep gateway-managed auth/session model (no frontend token handling).

## Framework Sync

- `AGENTS.md` is the primary source of truth for architecture and process.
- Prefer skills for repeatable workflows; keep rules only for stable reference constraints.
- When architecture/security/workflow changes, update `AGENTS.md` and affected skills/docs in the same change.
- Before claiming completion, run and verify:
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm build`
  - `pnpm format:check`

## Codex Rulebook

Converted Claude rules now live in `.agents/rules/`:

No active rule files are required; architecture/security/process guidance is in `AGENTS.md` and skills.

## Codex Skills

Converted Claude skills now live in `.agents/skills/`:

Frontend scope:

- `frontend/add-frontend-page/SKILL.md`
- `frontend/apply-ui-baseline/SKILL.md`
- `frontend/create-graphql-hook/SKILL.md`
- `frontend/customize-frontend-component/SKILL.md`
- `frontend/enforce-apollo-state-boundary/SKILL.md`
- `frontend/enforce-frontend-auth-boundary/SKILL.md`
- `frontend/follow-nextjs-route-conventions/SKILL.md`
- `frontend/frontend-reference-minimal/SKILL.md`
- `frontend/implement-apollo-page-boundary/SKILL.md`
- `frontend/run-frontend-codegen/SKILL.md`

Services scope:

- `services/create-gateway-module/SKILL.md`
- `services/scaffold-submodule/SKILL.md`
- `services/scaffold-microservice/SKILL.md`

Packages scope:

- `packages/update-shared-kernel/SKILL.md`
- `packages/prisma-safe-migrations/SKILL.md`

Cross-cutting:

- `add-testing-foundation/SKILL.md`
- `maintain-project-docs/SKILL.md`
- `prepare-pull-request/SKILL.md`
- `write-conventional-commit/SKILL.md`
- `write-github-issue/SKILL.md`
- `write-adr/SKILL.md`

Existing process/system skills remain under `.agents/skills/`.

## Key Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm type-check`
- `pnpm format:check`
- `pnpm --filter @luckyplans/web codegen`
- `pnpm --filter @luckyplans/prisma db:migrate:dev -- --name <name>`

## Before Completing Any Change

Run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

When tests exist for touched areas, run them before claiming completion.

## Maintenance

- Treat `AGENTS.md` as the primary AI context file for Codex.
- Keep `.agents/rules/*` and `.agents/skills/*` in sync with real architecture decisions.
- If you update standards/workflows, update docs in `apps/web/content/` and related rules.
