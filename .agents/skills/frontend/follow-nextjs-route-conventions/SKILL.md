---
name: follow-nextjs-route-conventions
description: Use when creating or reorganizing routes in apps/web so route groups, layout behavior, and path conventions remain consistent.
---

# Follow Next.js Route Conventions

## Rules
1. Use `(public)` for unauthenticated routes and `(app)` for authenticated routes.
2. Keep layouts as server components.
3. Use `@/` alias for imports from `apps/web/src/`.
4. Use `error.tsx` and `loading.tsx` conventions for route UX states.

## Checklist
1. Place new route under correct route group.
2. Verify middleware and auth UX assumptions still hold.
3. Ensure imports use `@/` alias and structure matches existing patterns.

