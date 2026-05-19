---
name: create-graphql-hook
description: Use when adding a new GraphQL query or mutation in apps/web so the operation is defined inline in a hook and consumed by components.
---

# Create GraphQL Hook

## Target
`apps/web/src/hooks/use-<name>.ts`

## Checklist
1. Define operation with `graphql()` from `@/generated`.
2. Use `useQuery`/`useMutation` from `@apollo/client/react`.
3. Export a typed hook function with focused API.
4. Always request `id` fields where entity lists/details are queried.
5. Re-run `run-frontend-codegen`.

## Rules
- Components/pages consume hooks; they do not call `graphql()` or Apollo hooks directly.
- Do not add explicit generic type parameters to Apollo hooks when inference is available.

