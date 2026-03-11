# Frontend Rules

Rules for the Next.js frontend at `apps/web/`.

## GraphQL Codegen

Use `@graphql-codegen/client-preset` to generate a typed `graphql()` function and schema types. Operations are written inline in hook files — no separate `.graphql` files needed.

- **Config:** `apps/web/codegen.ts`
- **Output:** `apps/web/src/generated/` (directory with `graphql.ts`, `gql.ts`, `index.ts`)
- **Schema source:** Local `schema.graphql` file (mirrors gateway's code-first schema)
- **Preset:** `client` with `fragmentMasking: false`
- **Run:** `pnpm --filter @luckyplans/web codegen`

The generated files are committed to the repo so CI builds work without a running gateway.

After adding or modifying a `graphql()` call in any `.ts`/`.tsx` file, re-run codegen to update the generated types.

## How It Works

The `graphql()` function from `@/generated` uses TypeScript string literal types to provide full type inference for inline operations:

```typescript
import { graphql } from '@/generated';

// TypeScript infers the exact query/mutation type from the string
const GetItemsQuery = graphql(`
  query GetItems($page: Float = 1, $limit: Float = 10) {
    getItems(page: $page, limit: $limit) {
      items {
        id
        name
        description
        createdAt
      }
      total
    }
  }
`);
```

Codegen scans all `.ts`/`.tsx` files for `graphql()` calls and generates typed overloads. No separate `.graphql` files needed.

## Custom Hook Layer

Every GraphQL operation gets a custom hook in `apps/web/src/hooks/`. The hook file contains the inline `graphql()` call and the hook function:

```typescript
// src/hooks/use-items.ts
import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetItemsQuery = graphql(`
  query GetItems($page: Float = 1, $limit: Float = 10) {
    getItems(page: $page, limit: $limit) {
      items {
        id
        name
        description
        createdAt
      }
      total
    }
  }
`);

export function useItems(variables?: { page?: number; limit?: number }) {
  return useQuery(GetItemsQuery, { variables });
}
```

```typescript
// src/hooks/use-create-item.ts
import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateItemMutation = graphql(`
  mutation CreateItem($name: String!, $description: String) {
    createItem(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`);

export function useCreateItem() {
  return useMutation(CreateItemMutation, {
    refetchQueries: ['GetItems'],
  });
}
```

Hook naming: **`use-<name>.ts`** (kebab-case file, camelCase export).

No explicit generic type parameters needed — `graphql()` provides full type inference to `useQuery`/`useMutation` via `TypedDocumentNode`.

Components consume these hooks — they never import `useQuery`, `useMutation`, or `graphql` directly.

Always request `id` fields in queries — Apollo cache normalization depends on them.

## Component Patterns

- **Server components** are the default in Next.js App Router
- Add `'use client'` only to components that use hooks, state, effects, or browser APIs
- Landing page sections (static content) remain server components
- Pages that fetch data are `'use client'` and consume custom hooks

```typescript
// src/app/(app)/dashboard/page.tsx
'use client';

import { useHealth } from '@/hooks/use-health';

export default function DashboardPage() {
  const { data, loading, error } = useHealth();
  // ...
}
```

## State Management

- **Apollo cache** is the source of truth for all GraphQL/server state
- **React Query** (`@tanstack/react-query`) is reserved for non-GraphQL async operations (REST APIs, external services). Do not use React Query for data that comes from the GraphQL gateway
- Do not mix: a piece of data should come from either Apollo or React Query, never both

## Next.js App Router Conventions

- Route groups: `(public)` for unauthenticated pages, `(app)` for authenticated pages
- `@/` path alias maps to `apps/web/src/`
- Layouts are server components (no `'use client'`)
- Error boundaries and loading states use Next.js conventions (`error.tsx`, `loading.tsx`)

## Environment Variables

`NEXT_PUBLIC_*` variables are inlined at build time by Next.js. Using `process.env.NEXT_PUBLIC_GRAPHQL_URL` directly is acceptable — `getEnvVar()` from `@luckyplans/shared` is for server-side Node.js only.

Canonical example: `apps/web/src/lib/apollo/client.ts`

## Apollo Client Setup

The Apollo Client is configured at `apps/web/src/lib/apollo/client.ts`:
- `InMemoryCache` with default type policies
- `HttpLink` pointing to `NEXT_PUBLIC_GRAPHQL_URL`
- Default fetch policy: `cache-and-network`
- `dataMasking: false` (fragment masking disabled)
- Wrapped by `ApolloWrapper` in `apps/web/src/lib/apollo/provider.tsx`

Provider order in `apps/web/src/providers/app-providers.tsx`:
```
QueryProvider > ApolloWrapper > RouterProvider
```

## Anti-Patterns (Do NOT)

- Create separate `.graphql` files — write operations inline with `graphql()` in hook files
- Define GraphQL response interfaces manually — use codegen-generated types
- Call `useQuery`/`useMutation` directly in page components — wrap in custom hooks
- Use `typescript-react-apollo` codegen plugin — use `client-preset` instead
- Use React Query for GraphQL data — use Apollo Client
- Mix server and client concerns — server components don't use hooks
- Skip `id` fields in queries — breaks Apollo cache normalization
- Import from `@apollo/client` for hooks — use `@apollo/client/react`
- Pass explicit generic type parameters to `useQuery`/`useMutation` — `graphql()` provides inference
