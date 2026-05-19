---
name: implement-apollo-page-boundary
description: Use when building or modifying Next.js pages that consume frontend hooks so server/client component boundaries and Apollo provider placement are correct.
---

# Implement Apollo Page Boundary

## Checklist
1. Default to server component pages unless hooks/state/browser APIs are needed.
2. Add `'use client'` only for pages/components using hooks/state/effects.
3. Consume data via project hooks from `apps/web/src/hooks`.
4. Handle loading/error/empty states using Next.js conventions.

## Public Route Special Case
- `(public)` layout has no providers.
- Public pages needing Apollo must wrap content with `<AppProviders>` inline.

