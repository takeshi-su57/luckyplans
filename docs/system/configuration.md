# Configuration Reference

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_HOST` | `localhost` | Redis hostname |
| `REDIS_PORT` | `6379` | Redis port |
| `API_GATEWAY_PORT` | `4000` | API Gateway listen port |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL endpoint for frontend |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | `development` | Node environment |

Environment variables are accessed via `getEnvVar(key, defaultValue?)` from `@luckyplans/shared`. See `.env.example` for the full template.

## Helm Values

Helm values are defined in `infrastructure/helm/luckyplans/values.yaml`.

### Key Sections

| Section | Purpose |
|---------|---------|
| `config.*` | Application config rendered into ConfigMap |
| `secrets` | Sensitive values rendered into K8s Secret |
| `image.*` | Container registry and pull policy |
| `ingress.*` | Traefik ingress configuration |
| `certManager.*` | Let's Encrypt TLS automation |
| `redis.*` | Redis deployment config |
| `apiGateway.*` | API gateway deployment config |
| `serviceAuth.*` | Auth service deployment config |
| `serviceCore.*` | Core service deployment config |
| `web.*` | Frontend deployment config |

### Production Overrides

Production-specific values are in `infrastructure/helm/luckyplans/values.prod.yaml`. Image tags are automatically updated by the CI/CD pipeline via `.github/workflows/update-tags.yml`.
