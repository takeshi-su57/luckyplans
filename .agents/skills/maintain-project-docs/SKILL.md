---
name: maintain-project-docs
description: Use when code or infrastructure changes require synchronized updates to docs under apps/web/content and related architecture references.
---

# Maintain Project Docs

## When To Use
- Architecture, infra, auth, API, or env var behavior changed.
- Developer/deployment workflow changed.
- New service or major capability added.

## Required Docs Targets
- `apps/web/content/architecture/overview.mdx`
- `apps/web/content/architecture/decisions/*.mdx` (ADR when significant)
- `apps/web/content/guides/developer.mdx`
- `apps/web/content/guides/deployment.mdx`
- `apps/web/content/system/api.mdx`
- `apps/web/content/system/configuration.mdx`

## Checklist
1. Identify what changed (architecture, API, config, workflow).
2. Update the matching docs in the same PR.
3. If architectural decision is significant, add ADR + `decisions/_meta.ts`.
4. Keep docs factual (current state, not roadmap).
5. Run: `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.
