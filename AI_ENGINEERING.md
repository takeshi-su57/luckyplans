# AI Engineering Framework

This repository uses AI-assisted development with structured guidelines to ensure that both human developers and AI coding tools produce code that follows consistent architecture, testing, and security standards.

## Philosophy

- AI tools operate within defined architectural boundaries — they follow this project's patterns, not generic best practices
- All AI-generated code must pass the same CI pipeline as human-written code (lint, type-check, build, Trivy security scan)
- AI follows existing conventions by referencing documented rules, not by guessing
- Human review is required for all changes

## Framework Structure

| File | Audience | Purpose |
|------|----------|---------|
| `.claude/CLAUDE.md` | AI tools (auto-loaded) | Concise project context: tech stack, layout, patterns, commands |
| `.claude/rules/architecture.md` | AI tools (on-demand) | Module structure, service layer, gateway, DI, anti-patterns |
| `.claude/rules/testing.md` | AI tools (on-demand) | Testing strategy, conventions, mocking patterns, coverage |
| `.claude/rules/security.md` | AI tools (on-demand) | Env vars, CI security, Docker, auth, dependency management |
| `.claude/rules/git-commit.md` | Both | Git commit message conventions |
| `.claude/rules/pull-request.md` | Both | Pull request conventions and templates |
| `.claude/rules/gh-issue.md` | Both | GitHub issue conventions and templates |
| `.claude/rules/ai-framework.md` | Both | How to maintain this framework: sync protocol, design principles, evolution |
| `.claude/rules/documentation.md` | Both | Docs folder structure, ADR conventions, sync protocol |
| `.claude/rules/frontend.md` | AI tools (on-demand) | Apollo Client, GraphQL Codegen, hooks, component patterns, anti-patterns |
| `.claude/skills/scaffold-submodule/` | AI tools | Scaffold a submodule within a gateway or microservice |
| `.claude/skills/scaffold-microservice/` | AI tools | Scaffold a new functional microservice (app + gateway + Docker + Helm + CI) |
| `.claude/skills/write-adr/` | AI tools | Write an Architecture Decision Record |
| `apps/web/content/` | Both | Public docs source (MDX): architecture, ADRs, guides, system reference — served at `/docs` |

## Core Engineering Principles

These rules apply to all code in this repository, whether written by humans or AI:

1. **Functional decomposition** — Services are split by functionality (CRUD, auth, trading), not by domain. `service-core` handles CRUD for all entities. New microservices are only created for distinct complex logic. Do not create a microservice per domain.

2. **Domain models in shared packages** — All entity types, interfaces, and enums live in `packages/shared`. Services import from `@luckyplans/shared`, never define their own domain types.

3. **Business logic in services only** — All logic lives in `*.service.ts` files (`@Injectable()`). Controllers and resolvers are thin routing layers that delegate to services.

4. **Constructor injection** — Use NestJS dependency injection via constructor parameters. Never manually instantiate services with `new`.

5. **GraphQL code-first** — Use `@ObjectType()`, `@Field()`, `@Query()`, `@Mutation()` decorators. Do not create `.graphql` schema files manually. Only the API gateway exposes GraphQL to the frontend.

6. **Message pattern communication** — Services communicate via Redis pub/sub using enum-based message patterns (e.g., `CoreMessagePattern.GET_ITEMS`). Gateway resolvers convert Observable responses with `firstValueFrom()`.

7. **Environment config via utility** — Always use `getEnvVar(key, defaultValue?)` from `@luckyplans/shared`. Never access `process.env` directly.

8. **TypeScript strict mode** — No `any` types without written justification. All packages extend the shared base `tsconfig.base.json` with strict mode enabled.

9. **No cross-app imports** — Apps never import from other apps. All shared code goes through `packages/shared` or `packages/config`. Inter-app communication is exclusively via Redis messages.

## AI Coding Expectations

When AI generates code for this repository, it must:

- Follow the architecture patterns documented in `.claude/rules/architecture.md`
- Include tests when adding business logic (see `.claude/rules/testing.md` for standards)
- Never introduce new frameworks or major dependencies without explicit approval
- Respect the repository structure — new services follow the established 4-file pattern
- Update documentation when changing public interfaces or adding services
- Never break existing message pattern contracts between services
- Follow security rules in `.claude/rules/security.md`

## Maintaining This Framework

- Update `.claude/CLAUDE.md` when the tech stack, project structure, or key commands change
- Update rules files when architectural decisions change or new patterns are adopted
- Keep `.claude/CLAUDE.md` under 200 lines — it is loaded into every AI interaction
- Add reusable AI skills to `.claude/skills/` as common patterns emerge
- Review and update this framework during major architectural changes

## Related Documentation

- [Development Guide](apps/web/content/guides/developer.mdx) — Setup, commands, adding services
- [Deployment Guide](apps/web/content/guides/deployment.mdx) — Docker, Kubernetes, ArgoCD
- [Git Commit Conventions](.claude/rules/git-commit.md)
- [PR Conventions](.claude/rules/pull-request.md)
- [Issue Conventions](.claude/rules/gh-issue.md)
