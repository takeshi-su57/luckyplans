---
name: customize-frontend-component
description: Use when modifying or extending an existing frontend component in apps/web while preserving project styling conventions, hook boundaries, and accessibility.
---

# Customize Frontend Component

## Overview
Adjust existing components without breaking architecture boundaries or UI consistency.

## When To Use
- Change component behavior, layout, or styling.
- Add props/variants to existing components.
- Improve UX states (loading, error, empty, disabled).

## Rules
1. Follow established component patterns in `apps/web`.
2. Keep data fetching in hooks; components consume hook outputs.
3. Maintain accessibility semantics (labels, roles, keyboard behavior).
4. Reuse existing style tokens/utilities; avoid ad-hoc visual drift.
5. Keep component responsibilities focused; avoid hidden side effects.

## Checklist
1. Identify source component and related hook/state files.
2. Implement focused prop/API changes with backward compatibility when possible.
3. Update/loading/error states and interaction behavior as needed.
4. Update tests/stories if present in touched area.
5. Run `pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm format:check`.

## Common Mistakes
- Embedding fetch/mutation logic directly into presentational components.
- Breaking existing props contract without migration.
- Styling changes that ignore existing UI baseline.
