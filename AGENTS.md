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
- `apps/api-gateway/`: GraphQL gateway, auth/session REST endpoints
- `apps/service-core/`: core microservice (CRUD + message-pattern handling)
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

## Prisma Safety

- Never add required columns to populated tables without defaults/backfills.
- Use nullable/default-first migrations, then backfill, then tighten constraints.

## Security Defaults

- Never expose access/refresh tokens to the browser.
- Use HttpOnly session cookie (`session_id`) patterns.
- Follow input validation and CI security rules from `.agents/rules/security.md`.

## Codex Rulebook

Converted Claude rules now live in `.agents/rules/`:

- `architecture.md`
- `frontend.md`
- `ui-baseline.md`
- `testing.md`
- `security.md`
- `documentation.md`
- `git-commit.md`
- `pull-request.md`
- `gh-issue.md`
- `ai-framework.md`

## Codex Skills

Converted Claude skills now live in `.agents/skills/`:

- `scaffold-submodule/SKILL.md`
- `scaffold-microservice/SKILL.md`
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



