# Switch GraphQL Codegen to client-preset with Inline Operations

**Date:** 2026-03-11
**Status:** accepted

## Context

The frontend (`apps/web`) used three separate `@graphql-codegen` plugins (`typescript`, `typescript-operations`, `typed-document-node`) with a workflow that required maintaining separate `.graphql` files for every query, mutation, and fragment in `src/graphql/{queries,mutations,fragments}/`. Each new GraphQL operation required:

1. A `.graphql` file defining the operation
2. Running codegen to generate `TypedDocumentNode` exports
3. A custom hook importing the generated document and passing explicit generic type parameters to `useQuery`/`useMutation`

This created significant boilerplate — three files per operation — and made it tedious to add or modify GraphQL operations. The fragment files added another layer of indirection that didn't provide meaningful value at the current scale.

## Decision

Switch to `@graphql-codegen/client-preset` with `fragmentMasking: false`. This preset generates a typed `graphql()` function that provides full type inference from inline operation strings.

Operations are now written inline inside hook files using `graphql()` from `@/generated`:

```typescript
import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetItemsQuery = graphql(`
  query GetItems($page: Float = 1, $limit: Float = 10) {
    getItems(page: $page, limit: $limit) {
      items { id name description createdAt }
      total
    }
  }
`);

export function useItems(variables?: { page?: number; limit?: number }) {
  return useQuery(GetItemsQuery, { variables });
}
```

Key changes:
- **Removed** `src/graphql/` directory (all `.graphql` files and fragments)
- **Replaced** three codegen plugins with `client-preset`
- **Codegen output** changed from a single `src/generated/graphql.ts` to a `src/generated/` directory
- **Apollo Client** configured with `dataMasking: false` to match `fragmentMasking: false`
- **Hooks** no longer need explicit generic type parameters — `graphql()` provides inference via `TypedDocumentNode`

## Consequences

**What becomes easier:**
- Adding a new query/mutation is a single file change (the hook file)
- No need to manage separate `.graphql` files or fragment dependencies
- Type inference is automatic — less boilerplate, fewer places for type mismatches
- Codegen scans `.ts`/`.tsx` files directly, so operations and their types stay co-located

**What becomes harder:**
- Operations are no longer centralized in one directory — they're spread across hook files (mitigated by keeping all hooks in `src/hooks/`)
- Fragment reuse across operations requires more deliberate coordination (not currently needed at this scale)
- The `graphql()` function uses string literal type matching, which means the exact string must match between source and generated overloads — re-run codegen after any operation change

**Trade-offs:**
- Disabled fragment masking to keep Apollo Client's `useQuery`/`useMutation` return types simple. If fragment masking becomes valuable at larger scale, this can be revisited
- The generated `gql.ts` includes a string map of all operations, which is not tree-shakeable without the babel/swc plugin (acceptable at current scale, add plugin if bundle size becomes a concern)
