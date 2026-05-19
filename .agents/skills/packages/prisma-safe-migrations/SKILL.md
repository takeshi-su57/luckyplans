---
name: prisma-safe-migrations
description: Use when modifying Prisma schema or creating migrations on tables with existing data, especially when adding columns or tightening constraints.
---

# Prisma Safe Migrations

## Overview
Apply migration changes safely so production deploys do not fail under Helm/ArgoCD automation.

## When To Use
- Adding columns to existing tables.
- Changing nullable fields to required.
- Introducing defaults or backfills.
- Editing generated migration SQL for data safety.

## Rules
1. Never add required columns to populated tables without default/backfill.
2. Prefer nullable/default-first migration, then backfill, then tighten.
3. Test migration logic locally before merge.
4. Treat generated `migration.sql` as editable source-of-truth when needed.

## Safe Patterns
- Nullable first: `field String?`
- Default first: `field String @default("...")`
- Two-step tighten:
1. Add nullable
2. Backfill data
3. Make required in follow-up migration

## Checklist
1. Update Prisma schema in `packages/prisma`.
2. Create migration: `pnpm --filter @luckyplans/prisma db:migrate:dev -- --name <name>`.
3. Review/edit migration SQL when backfill/default sequencing is needed.
4. Re-run migration on realistic local data.
5. Run `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Common Mistakes
- Required column without default on non-empty table.
- Assuming Prisma auto-backfills data.
- Tightening constraints in one step without data preparation.
