---
name: enforce-apollo-state-boundary
description: Use when introducing or modifying frontend state management to keep GraphQL data in Apollo cache and avoid mixed-state ownership.
---

# Enforce Apollo State Boundary

## Rules
1. GraphQL/server state lives in Apollo cache.
2. React Query is only for non-GraphQL async sources.
3. Do not represent the same data in both Apollo and React Query.
4. Keep Apollo endpoint relative (`/graphql`) with `credentials: 'include'`.

## Checklist
1. Confirm data source type (GraphQL vs non-GraphQL).
2. Route GraphQL data through GraphQL hooks + Apollo.
3. Use React Query only when source is not the gateway GraphQL API.

