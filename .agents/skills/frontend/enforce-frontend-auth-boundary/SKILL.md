---
name: enforce-frontend-auth-boundary
description: Use when implementing frontend auth-adjacent behavior to preserve gateway-managed session architecture and avoid token handling in the browser.
---

# Enforce Frontend Auth Boundary

## Rules
1. Frontend never stores/accesses access/refresh/id tokens.
2. Frontend never sends Bearer headers for app auth.
3. Auth requests use cookie-based flow with `credentials: 'include'`.
4. Route UX protection uses `session_id` cookie middleware checks.

## Allowed Frontend Auth Surface
- Login/Register pages calling `/auth/login` and `/auth/register`.
- Logout action calling `/auth/logout`.
- `useCurrentUser` based on GraphQL `me` query.

## Anti-Patterns
- Adding next-auth or custom token refresh in frontend.
- Storing tokens in localStorage/sessionStorage.

