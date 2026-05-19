---
name: add-testing-foundation
description: Use when introducing or expanding tests in LuckyPlans, especially service logic, shared utilities, controllers, and resolvers.
---

# Add Testing Foundation

## Priority Order
1. `packages/shared/src/utils/*` (pure utility tests first)
2. `apps/service-core/src/*.service.ts`
3. `apps/service-core/src/*.controller.ts`
4. `apps/api-gateway/src/*/*.resolver.ts`

## Rules
- Test public behavior, not framework internals.
- Keep tests focused and clearly named.
- Co-locate tests as `*.spec.ts`.
- Mock dependencies (`CoreService`, `ClientProxy`) in controller/resolver tests.

## Checklist
1. Add/extend tests in touched areas.
2. Mock external dependencies and transport boundaries.
3. Verify expected routing/delegation in controllers/resolvers.
4. Run project validation commands before completion.
