# Agent Guide (Codex)

This repository is configured for Codex-native workflows.

## Instruction Priority

1. Direct user request
2. Repository guidance in `AGENTS.md`
3. Local skills and rules under `.agents/rules/` and `.agents/skills/`
4. Default assistant behavior

## Cost-Aware Skill Workflow

This repository defaults to GPT-5.5-class coding work. Because the model is more capable and more expensive, `AGENTS.md` is the authoritative router for skill loading.

Required behavior:

1. Check the skill routing table before loading any full `SKILL.md` body.
2. Load **necessary** skills automatically only when their trigger clearly matches the task.
3. For **optional** skills, ask the user once before loading: "This may benefit from `<skill>`, but it adds workflow overhead. Load it?"
4. Never auto-load **deprecated** skills. Load them only when the user explicitly names the skill or requests that exact workflow.
5. When multiple skills could apply, load the smallest specific skill first and avoid stacking broad process skills unless the task genuinely needs them.
6. Do not edit `.agents/skills/*` just to change routing behavior. Keep routing and necessity decisions in `AGENTS.md`.

`using-superpowers` remains the startup router, but this table overrides its broad "1% chance" auto-load behavior inside this repository.

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

- `apps/web/`: Next.js frontend product app
- `apps/docs/`: standalone Docusaurus documentation SPA
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

### Necessary Skills (Auto-Load When Needed)

Use these without asking when the trigger clearly matches:

| Skill | Trigger |
| --- | --- |
| `using-superpowers` | Start of a new task, as a lightweight router governed by this table. |
| `systematic-debugging` | Bugs, failing tests, CI failures, unexpected behavior, or regressions. |
| `test-driven-development` | Production behavior changes, bug fixes, or refactors where behavior must remain stable. Skip for docs-only, routing-only, generated, or pure config edits unless behavior is affected. |
| `verification-before-completion` | Before claiming work is complete, fixed, passing, committed, or PR-ready. |
| `receiving-code-review` | User provides review feedback or asks to address comments. |
| `add-testing-foundation` | Adding or expanding tests, test utilities, or test conventions. |
| `maintain-project-docs` | Code, architecture, infrastructure, or public behavior changes require synchronized docs. |
| `prepare-pull-request` | User asks to open or update a PR. |
| `write-conventional-commit` | User asks for a commit or commit message. |
| `write-github-issue` | User asks to create or refine an issue. |
| `frontend/add-frontend-page` | Adding a Next.js App Router page in `apps/web`. |
| `frontend/apply-ui-baseline` | Implementing or changing visible UI in `apps/web`. |
| `frontend/create-graphql-hook` | Adding or changing frontend GraphQL operations/hooks. |
| `frontend/customize-frontend-component` | Modifying an existing frontend component. |
| `frontend/enforce-apollo-state-boundary` | Frontend GraphQL/cache state ownership changes. |
| `frontend/enforce-frontend-auth-boundary` | Frontend auth/session-adjacent behavior. |
| `frontend/follow-nextjs-route-conventions` | Creating or reorganizing `apps/web` routes. |
| `frontend/frontend-reference-minimal` | LuckyPlans frontend constraints not covered by a narrower frontend skill. |
| `frontend/implement-apollo-page-boundary` | Next.js pages consuming Apollo-backed client hooks. |
| `frontend/run-frontend-codegen` | Inline `graphql()` operations changed in `apps/web`. |
| `services/create-gateway-module` | Creating or extending API gateway modules. |
| `services/scaffold-microservice` | User explicitly requests a new microservice or decision matrix indicates one is justified. |
| `packages/update-shared-kernel` | Shared contracts, enums, message patterns, or cross-cutting utilities. |
| `packages/prisma-safe-migrations` | Prisma schema or migration changes. |

### Optional Skills (Ask Before Loading)

Ask the user before loading these because they add heavy process, subagents, or extra context:

| Skill | Ask when |
| --- | --- |
| `brainstorming` | Requirements are ambiguous, product/design direction is open, or the user asks for ideation. For small scoped edits, summarize assumptions and proceed without loading it. |
| `writing-plans` | Work spans several phases or the user wants a written implementation plan. Small changes do not need a formal plan. |
| `executing-plans` | A written plan exists and the user wants this session to execute it step-by-step. |
| `subagent-driven-development` | User wants agent delegation or a large approved plan has independent tasks. Requires explicit user approval for subagent cost. |
| `dispatching-parallel-agents` | Multiple independent failures/tasks could be delegated in parallel. Requires explicit user approval for subagent cost. |
| `requesting-code-review` | Major feature, risky refactor, or pre-merge review would benefit from a separate reviewer. Ask before spawning review agents. |
| `using-git-worktrees` | Isolation would help but the user did not explicitly request a new worktree. |
| `finishing-a-development-branch` | Implementation is complete and the user wants merge/PR/cleanup guidance. |
| `remembering-conversations` | Historical context might help, but the current repo context is enough to proceed. |
| `write-adr` | Architecture decision should be recorded but the user did not ask for an ADR. |

### Deprecated Skills (Explicit Mention Only)

Do not auto-load these:

| Skill | Replacement / reason |
| --- | --- |
| `writing-skills` | Skill files should not be refactored for normal LuckyPlans workflow tuning. Update `AGENTS.md` routing instead unless the user explicitly asks to create, edit, or test a skill. |
| `services/scaffold-submodule` | Legacy routing. Use `services/create-gateway-module` for gateway modules or `services/scaffold-microservice` for justified microservices. |

### Loading Discipline

- Do not load a skill because it has a broad trigger if this table classifies it as optional or deprecated.
- Do not load multiple process skills up front. Start with the narrowest necessary one, then load more only when the task reaches that phase.
- Prefer local file inspection and targeted commands over loading historical or subagent workflows.
- Subagents are cost-heavy under GPT-5.5. Use them only after explicit user approval or when the user directly asks for delegation/parallel agents.

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
- Prefer skills for repeatable implementation rules; keep workflow routing and cost policy in `AGENTS.md`.
- When architecture/security/workflow changes, update `AGENTS.md` and affected product docs. Do not edit `.agents/skills/*` unless the user explicitly requests skill authoring or skill refactoring.
- Before claiming completion, run the smallest verification that proves the touched surface:
  - Production code, package, infrastructure, or Prisma changes: `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.
  - Frontend GraphQL operation changes: `pnpm --filter @luckyplans/web codegen`, then the full gate above.
  - Tests changed: run the targeted test command first, then broader gates if production behavior or shared config changed.
  - Docs, `AGENTS.md`, or workflow-routing-only changes: inspect the diff and run `git diff --check`.

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

Existing process/system skills remain under `.agents/skills/`, but their presence does not imply automatic loading. Use the necessary/optional/deprecated routing table above.

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

Use risk-based verification:

- For production code, package, infrastructure, or Prisma changes, run:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm format:check
```

- For docs, `AGENTS.md`, or workflow-routing-only changes, run `git diff --check` and inspect the relevant diff.
- When tests exist for touched behavior, run them before claiming completion.

## Maintenance

- Treat `AGENTS.md` as the primary AI context file for Codex.
- Keep `.agents/rules/*` and `.agents/skills/*` in sync with real architecture decisions.
- If you update standards/workflows, update docs in `apps/docs/docs/` and related rules.
