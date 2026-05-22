---
name: frontend-reference-minimal
description: Use when you need LuckyPlans-specific frontend reference constraints that are not covered by task-specific frontend skills.
---

# Frontend Reference (Minimal)

## Scope
Use this as a fallback reference after applying task skills like:
- `add-frontend-page`
- `create-graphql-hook`
- `run-frontend-codegen`
- `implement-apollo-page-boundary`
- `enforce-apollo-state-boundary`
- `enforce-frontend-auth-boundary`
- `apply-ui-baseline`

## Reference Constraints
1. GraphQL operations are inline via `graphql()`; no `.graphql` files.
2. Apollo hooks import from `@apollo/client/react`.
3. Frontend GraphQL endpoint stays relative (`/graphql`) with `credentials: 'include'`.
4. No frontend token handling (gateway-managed session model).
5. Use `@/` alias for `apps/web/src/*` imports.
6. `(public)` and `(app)` route group conventions must be preserved.
