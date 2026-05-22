---
name: run-frontend-codegen
description: Use when adding or changing inline graphql() operations in apps/web so generated client types remain in sync.
---

# Run Frontend Codegen

## When To Use
- Added or modified any `graphql()` operation in `apps/web/**/*.ts(x)`.
- Updated gateway schema and frontend types must refresh.

## Checklist
1. Keep operations inline in hook files (no `.graphql` files).
2. Run: `pnpm --filter @luckyplans/web codegen`.
3. Verify generated artifacts in `apps/web/src/generated/`.
4. Run: `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Rules
- Use `@graphql-codegen/client-preset`.
- Do not use `typescript-react-apollo` plugin patterns.

