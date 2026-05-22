---
name: add-frontend-page
description: Use when adding a new Next.js App Router page in apps/web, including route structure, data hooks usage, and auth/session-aware behavior.
---

# Add Frontend Page

## Overview
Create new pages in `apps/web` using App Router patterns and LuckyPlans data/auth boundaries.

## When To Use
- Add a new route/page in frontend.
- Add a protected app page behind session flow.
- Add a page consuming GraphQL data through existing hook patterns.

## Rules
1. Use App Router structure under `apps/web/src/app`.
2. Do not call `useQuery`/`useMutation` directly in page components; use custom hooks from `src/hooks`.
3. Use generated GraphQL client patterns (no manual `.graphql` files).
4. Keep frontend token-agnostic; auth is gateway-managed via `session_id` cookie.
5. Preserve existing design system and project UI conventions.

## Checklist
1. Add route files in `apps/web/src/app/<route>/`.
2. If data is needed, add/update hooks in `apps/web/src/hooks/`.
3. Use generated GraphQL types/operations pattern already used in repo.
4. Handle loading/error/empty states.
5. For protected pages, align behavior with middleware/session model.
6. Run `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Common Mistakes
- Querying directly inside page instead of hooks.
- Introducing auth token handling in frontend.
- Creating separate `.graphql` operation files against project convention.
