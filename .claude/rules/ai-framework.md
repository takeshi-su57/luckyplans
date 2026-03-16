# AI Framework Maintenance Rules

How to maintain and evolve the AI engineering framework (`.claude/`, `AI_ENGINEERING.md`, related docs).

## Framework File Hierarchy

```
AI_ENGINEERING.md              ← Human-readable overview (entry point for developers)
.claude/
├── CLAUDE.md                  ← AI context (auto-loaded, concise index, < 200 lines)
├── rules/                     ← Detailed guidance documents
│   └── <topic>.md
├── skills/                    ← Reusable task patterns
│   └── <skill-name>/
│       ├── skill.md           ← Instructions and steps
│       ├── templates/         ← Pattern files (all .md)
│       └── examples/          ← Worked examples (all .md)
└── settings.local.json        ← Claude Code permissions (not manually edited)
```

## Sync Protocol

When the project evolves, multiple files must stay in sync. Follow this order:

### When architecture changes (new pattern, tech stack change, convention update)

1. Update `.claude/rules/architecture.md` — the source of truth
2. Update `.claude/CLAUDE.md` — the summary in Architecture Patterns section
3. Update `AI_ENGINEERING.md` — the Core Engineering Principles section
4. Update `README.md` — only if it affects project structure, tech stack, or commands

### When adding a new rule

1. Create `.claude/rules/<topic>.md`
2. Add one-line reference in `.claude/CLAUDE.md` under Rules section
3. Add row in `AI_ENGINEERING.md` Framework Structure table

### When adding a new skill

1. Create `.claude/skills/<skill-name>/` with `skill.md`, `templates/`, `examples/`
2. Add row in `AI_ENGINEERING.md` Framework Structure table
3. No change needed in `CLAUDE.md` unless it's a frequently used skill

### When modifying shared types or message patterns

1. Update `packages/shared/src/types/index.ts`
2. Check if `.claude/rules/architecture.md` examples still match
3. Check if skill examples still match

### When authentication or session management changes

1. Update `.claude/rules/security.md` — Authentication section (source of truth for auth rules)
2. Update `.claude/rules/architecture.md` — Gateway auth section
3. Update `.claude/rules/frontend.md` — if frontend auth patterns change (middleware, hooks, Apollo config)
4. Update `.claude/CLAUDE.md` — Architecture Patterns summary
5. Update `apps/web/content/system/api.mdx` — auth endpoints reference
6. Update `apps/web/content/system/configuration.mdx` — if env vars change

### When infrastructure or local dev setup changes (docker-compose, Keycloak, new services)

1. Update `apps/web/content/guides/developer.mdx` — developer setup instructions, container table, ports
2. Update `apps/web/content/guides/deployment.mdx` — deployment instructions, architecture diagram, manual steps
3. Update `infrastructure/scripts/deploy-local.sh` — if new images, namespaces, or Helm charts
4. Update `infrastructure/scripts/teardown.sh` — if new Helm releases or namespaces to clean up
5. Update `infrastructure/scripts/status.sh` — if new namespaces or services to report on
6. Update `.claude/CLAUDE.md` — Repository Layout and Architecture Patterns if new services/containers
7. Update `apps/web/content/system/configuration.mdx` — if new env vars or ports
8. Update `apps/web/content/architecture/overview.mdx` — if it changes the system diagram
9. Update `README.md` — if it changes the tech stack, project structure, or commands

### When environment variables change

1. Update `.env.example` — add/remove variables with descriptions
2. Update `apps/web/content/system/configuration.mdx` — env var reference table
3. Update `infrastructure/helm/luckyplans/values.yaml` + `configmap.yaml` — if applicable to K8s
4. Update `turbo.json` globalEnv — if the var affects build caching
5. Update `apps/web/content/guides/developer.mdx` — if it affects local dev setup

### When scripts or commands change

1. Update `README.md` Scripts table
2. Update `.claude/CLAUDE.md` Key Commands section
3. Update `apps/web/content/guides/developer.mdx` — All Commands table
4. Update `apps/web/content/guides/deployment.mdx` — if deploy commands changed

### When build system or package.json scripts change

1. Update `README.md` — if root scripts changed
2. Update `.claude/CLAUDE.md` Key Commands section
3. Update `apps/web/content/guides/developer.mdx` — All Commands table
4. Verify `pnpm build` passes (the full pipeline, not just individual packages)

### When frontend providers, layouts, or routing changes

1. Update `.claude/rules/frontend.md` — if provider order, Apollo config, or auth pattern changed
2. Verify `pnpm build` passes — Next.js prerendering is sensitive to layout/provider changes
3. Update `.claude/rules/architecture.md` — Frontend section if routing structure changed

## Post-Implementation Sync Checklist (Mandatory)

**This replaces the old "Automatic Sync Enforcement" section.** The old approach was advisory and repeatedly failed in practice — scripts, deployment guides, and build config were missed.

After completing ANY implementation task, you MUST run through this checklist **before** telling the user the task is done. This is not optional. Read each file listed and verify it matches reality.

### Step 1: Classify what changed

Read through every file you modified or created. Categorize each into one or more of these buckets:

- [ ] **App code** — NestJS services, Next.js pages, shared packages
- [ ] **Dependencies** — new packages in any `package.json`
- [ ] **Environment variables** — new/changed env vars
- [ ] **Infrastructure** — docker-compose, Helm charts, K8s manifests
- [ ] **Build system** — turbo.json, root package.json scripts, Dockerfiles
- [ ] **Deploy scripts** — anything in `infrastructure/scripts/`
- [ ] **Frontend structure** — layouts, providers, routing, middleware

### Step 2: For each bucket that applies, audit these files

#### If App code changed:
- [ ] `apps/web/content/system/api.mdx` — if APIs/endpoints changed
- [ ] `.claude/rules/architecture.md` — if patterns changed

#### If Dependencies changed:
- [ ] `pnpm-lock.yaml` — run `pnpm install` if needed
- [ ] Verify `pnpm build` passes end-to-end

#### If Environment variables changed:
- [ ] `.env.example`
- [ ] `turbo.json` globalEnv
- [ ] `infrastructure/helm/luckyplans/values.yaml`
- [ ] `infrastructure/helm/luckyplans/templates/configmap.yaml`
- [ ] `apps/web/content/system/configuration.mdx`

#### If Infrastructure changed:
- [ ] `docker-compose.yml` — local dev containers
- [ ] `infrastructure/scripts/deploy-local.sh` — image pulls, Helm installs
- [ ] `infrastructure/scripts/teardown.sh` — cleanup of new resources
- [ ] `infrastructure/scripts/status.sh` — reporting on new namespaces/services
- [ ] `apps/web/content/guides/developer.mdx` — container table, ports, observability
- [ ] `apps/web/content/guides/deployment.mdx` — deploy steps, architecture diagram
- [ ] `infrastructure/helm/luckyplans/values.prod.yaml` — prod overrides
- [ ] `infrastructure/argocd/` — if new ArgoCD Applications needed

#### If Build system changed:
- [ ] Root `package.json` scripts
- [ ] Verify `pnpm build` passes (full pipeline via turbo, not `--filter`)
- [ ] `README.md` commands section
- [ ] `apps/web/content/guides/developer.mdx` — All Commands table

#### If Deploy scripts changed:
- [ ] `apps/web/content/guides/deployment.mdx` — must match script behavior
- [ ] `apps/web/content/guides/developer.mdx` — if local deploy workflow changed
- [ ] `README.md` — if command names or flags changed
- [ ] `.claude/CLAUDE.md` Key Commands section

#### If Frontend structure changed:
- [ ] `.claude/rules/frontend.md`
- [ ] Verify `pnpm build` passes (Next.js prerendering is fragile with layout changes)

### Step 3: Cross-cutting files (ALWAYS check these)

These files are affected by almost every change. Always re-read them and verify:

- [ ] `.claude/CLAUDE.md` — Tech Stack, Repository Layout, Architecture Patterns, Key Commands, Known Gaps
- [ ] `README.md` — Tech stack table, project structure tree
- [ ] Write ADR if it's a significant architectural decision

### Step 4: Build verification

**Always** run the full build as the final step:

```bash
pnpm build       # NOT pnpm --filter, the FULL turbo pipeline
pnpm lint
pnpm type-check
```

If any step fails, fix it before declaring the task done. Do NOT tell the user "it's a pre-existing issue" without verifying — the change you just made may have exposed it.

### Step 5: Helm verification (if infrastructure changed)

```bash
helm lint infrastructure/helm/luckyplans/
helm lint infrastructure/helm/observability/   # if it exists
```

## Why This Matters

The old sync protocol had these failures:

1. **Scripts forgotten** — `deploy-local.sh`, `teardown.sh`, `status.sh` were never in the trigger table, so they were never updated when infrastructure changed.
2. **Deployment guide skipped** — `deployment.mdx` wasn't listed under infrastructure changes, only `developer.mdx` was.
3. **Build verification skipped** — the old protocol didn't require running the full `pnpm build` pipeline. Individual package builds passed but the turbo+dotenv pipeline failed.
4. **turbo.json forgotten** — new env vars were added to `.env.example` and configmap but not to `turbo.json` globalEnv.
5. **Advisory, not procedural** — saying "you MUST" without a concrete checklist means steps get skipped under time pressure.

The checklist approach forces a file-by-file audit instead of relying on memory to identify which protocols apply.

## CLAUDE.md Principles

`CLAUDE.md` is loaded into every AI interaction. It must be:

- **Under 200 lines** — bloating it degrades AI tool performance
- **An index, not a manual** — summarize patterns, point to rules for details
- **Factual, not aspirational** — describe what IS, not what should be. Update when reality changes
- **No duplicated content** — if it's in a rule file, CLAUDE.md links to it, doesn't repeat it

What belongs in CLAUDE.md:
- Project identity and tech stack
- Repository layout (one-liner per directory)
- Architecture patterns (one paragraph each)
- Key commands
- CI pipeline summary
- Conventions (one line each)
- Links to rule files
- Known gaps

What does NOT belong in CLAUDE.md:
- Code examples (put in rules or skills)
- Step-by-step procedures (put in skills)
- Detailed explanations (put in rules)
- Historical context or rationale

## Rule Design Principles

A good rule file:

- **References real code** — points to actual files and patterns in this codebase, not generic advice
- **Shows don't tell** — includes concrete examples from existing code
- **States anti-patterns explicitly** — "do NOT" is clearer than only describing the happy path
- **Stays current** — outdated rules are worse than no rules. Remove or update when code changes
- **Has a single focus** — one topic per file (architecture, testing, security — not "misc guidelines")

Naming: `kebab-case.md` (e.g., `architecture.md`, `git-commit.md`, `ai-framework.md`)

## Skill Design Principles

A good skill:

- **Solves a repeatable task** — something done more than once with the same pattern
- **Has a clear "when to use"** — explicitly states when to use this skill vs. alternatives
- **Uses .md for everything** — templates and examples are markdown files with code blocks, not raw source files
- **Templates show the pattern** — use placeholders like `<PascalName>`, `<name>`, `<camelName>`
- **Examples show a real scenario** — a complete worked example with a concrete domain (Order, Trading, etc.)
- **Includes all layers** — from shared types through to the final integration point
- **Shows what to import and from where** — imports are the most common source of errors

Skill folder structure:
```
<skill-name>/
├── skill.md           ← Required. What, when, steps
├── templates/         ← Required. Reusable patterns as .md files
└── examples/          ← Required. At least one worked example as .md
```

## Evolution Guidelines

### Adding

- New rules/skills should be reviewed before merging, like code
- Every new file must be referenced from the appropriate parent (CLAUDE.md or AI_ENGINEERING.md)
- Don't create a rule until a pattern has been confirmed across at least 2 instances

### Updating

- When you find a rule is wrong, fix it immediately — wrong rules cause compounding errors
- When code changes make an example outdated, update the example in the same PR
- Periodically check that CLAUDE.md line count is under 200

### Deprecating / Removing

- Delete rules that no longer apply — don't leave stale guidance
- Remove skill examples that reference patterns no longer in use
- Clean up references in CLAUDE.md and AI_ENGINEERING.md when removing

## Verification

To check if the framework is healthy:

- `CLAUDE.md` is under 200 lines
- Every rule file is referenced in CLAUDE.md or AI_ENGINEERING.md
- Every skill folder has `skill.md`, `templates/`, and `examples/`
- No rule references files or patterns that no longer exist
- Architecture rules match the actual code patterns in the repository
- Security rules reflect the current auth implementation (not aspirational)
- Frontend rules match the current Apollo Client config and auth pattern
- Developer guide (`apps/web/content/guides/developer.mdx`) matches the current local dev setup
- Deployment guide (`apps/web/content/guides/deployment.mdx`) matches the current deploy scripts
- Deploy scripts (`infrastructure/scripts/`) match the current infrastructure (Helm charts, namespaces, images)
- Known Gaps in `CLAUDE.md` are accurate — remove items that have been implemented
