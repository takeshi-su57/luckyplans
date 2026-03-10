# Testing Rules

## Current State

No tests exist yet. The Turborepo `test` task is configured in `turbo.json` and the CI pipeline runs `pnpm turbo run test`. This document establishes the standards for when tests are introduced.

## Testing Strategy

| Layer | Target | Tool | Priority |
|-------|--------|------|----------|
| Unit | Service classes (`*.service.ts`) | Jest or Vitest | High |
| Unit | Shared utilities (`packages/shared/src/utils/`) | Jest or Vitest | High |
| Integration | Controllers with mocked services | NestJS Testing | Medium |
| Integration | Resolvers with mocked `ClientProxy` | NestJS Testing | Medium |
| E2E | API gateway GraphQL endpoints | Supertest + NestJS | Low |
| Component | React components | Testing Library | Low |

## File Conventions

- Test files co-located with source: `<name>.service.spec.ts` next to `<name>.service.ts`
- Test naming pattern:
  ```typescript
  describe('CoreService', () => {
    it('should return paginated items', async () => { ... });
  });
  ```
- Use NestJS testing utilities for DI container setup:
  ```typescript
  const module = await Test.createTestingModule({
    providers: [CoreService],
  }).compile();
  const service = module.get<CoreService>(CoreService);
  ```

## What to Test First (Priority Order)

1. **`packages/shared/src/utils/index.ts`** — Pure functions (`generateId`, `getEnvVar`, `getRedisConfig`), easiest to test
2. **`apps/service-core/src/core.service.ts`** — Core business logic (CRUD operations)
3. **`apps/service-auth/src/auth.service.ts`** — Auth business logic
4. **`apps/service-core/src/core.controller.ts`** — Message pattern routing with mocked service
5. **`apps/api-gateway/src/core/core.resolver.ts`** — GraphQL resolver with mocked `ClientProxy`

## Mocking Patterns

### Mock a service in controller tests
```typescript
const mockCoreService = {
  getItems: jest.fn().mockResolvedValue({ items: [], total: 0 }),
  createItem: jest.fn().mockResolvedValue({ id: '1', name: 'test' }),
};

const module = await Test.createTestingModule({
  controllers: [CoreController],
  providers: [{ provide: CoreService, useValue: mockCoreService }],
}).compile();
```

### Mock ClientProxy in resolver tests
```typescript
const mockClient = {
  send: jest.fn().mockReturnValue(of({ items: [], total: 0 })),
};

const module = await Test.createTestingModule({
  providers: [
    CoreResolver,
    { provide: 'CORE_SERVICE', useValue: mockClient },
  ],
}).compile();
```

### Environment variable mocking
```typescript
beforeEach(() => {
  process.env.REDIS_HOST = 'test-host';
});
afterEach(() => {
  delete process.env.REDIS_HOST;
});
```

## Coverage Targets

When tests exist, aim for:
- **Service classes:** 80%+ line coverage
- **Shared utilities:** 100% line coverage
- **Controllers:** 80%+ (verify each message pattern routes correctly)
- **Resolvers:** 70%+ (verify forwarding logic)

## Rules for AI-Generated Tests

- Always test the public API of a class, not implementation details
- Each test should have a single assertion focus
- Use descriptive test names that explain the expected behavior
- Do not test NestJS framework internals (DI, decorators, etc.)
- Do not create test utilities or helpers until there are at least 3 tests that need them
- Do not add snapshot tests for service responses
