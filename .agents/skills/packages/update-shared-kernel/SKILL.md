---
name: update-shared-kernel
description: Use when adding or changing shared contracts or cross-cutting utilities in packages/shared, including entity types, message patterns, and reusable helper functions.
---

# Update Shared Kernel

## Overview
Use this skill when changing `packages/shared` so all apps keep a single source of truth for contracts and utilities.

## When To Use
- Add or update shared entity interfaces.
- Add or update message pattern enums.
- Add cross-cutting utility helpers used by multiple apps.
- Remove duplicate types/utilities from app-level code.

## Do Not Use
- App-local types only used by one module.
- One-off helper logic that does not need reuse.

## Required Targets
- Types/enums: `packages/shared/src/types/index.ts`
- Utilities: `packages/shared/src/utils/index.ts`

## Rules
1. Keep shared contracts in `types/index.ts`; do not duplicate in `apps/*`.
2. Keep shared helpers in `utils/index.ts`; avoid app-specific behavior here.
3. Use stable naming for message patterns: `'service.actionName'`.
4. When env access is needed in app code, use `getEnvVar()` from shared utils.

## Checklist
1. Add/update types, enums, or utility functions in the correct shared file.
2. Update consuming app code to import from `@luckyplans/shared`.
3. Rebuild shared package: `pnpm --filter @luckyplans/shared build`.
4. Run quality gates: `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Common Mistakes
- Defining same type in gateway and service separately.
- Adding app-specific logic into shared utilities.
- Forgetting to rebuild shared package after changes.

