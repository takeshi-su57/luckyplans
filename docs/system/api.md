# API Reference

## GraphQL Endpoint

- **URL:** `/graphql` (via API gateway)
- **Playground:** Available in development at `http://localhost:4000/graphql`
- **Schema:** Auto-generated (code-first), not committed to repo

## Message Patterns

All message patterns are defined in `packages/shared/src/types/index.ts`.

### Auth Service (`service-auth`)

| Pattern | Description |
|---------|-------------|
| `auth.login` | Authenticate user with email/password |
| `auth.register` | Register new user |
| `auth.validate` | Validate a token |
| `auth.profile` | Get user profile by ID |

### Core Service (`service-core`)

| Pattern | Description |
|---------|-------------|
| `core.getItems` | List items (paginated) |
| `core.getItem` | Get single item by ID |
| `core.createItem` | Create a new item |
| `core.updateItem` | Update an existing item |
| `core.deleteItem` | Delete an item |

## Response Format

All microservice responses use `ServiceResponse<T>`:

```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Pagination

Paginated endpoints accept `page` and `limit` parameters and return:

```typescript
{
  items: T[];
  total: number;
}
```
