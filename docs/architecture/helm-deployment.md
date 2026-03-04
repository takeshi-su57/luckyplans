# Helm Deployment Architecture

## Overview

The platform uses a single Helm chart (`infrastructure/helm/luckyplans/`) to deploy all services across three k3d environments. Docker Compose has been removed — Helm + k3d is the only deployment approach.

| Environment | Cluster | Image Registry | Image Tag |
|---|---|---|---|
| **local** | k3d on laptop | none (k3d import) | `latest` |
| **dev** | k3d on VPS | `docker.io` | `dev` |
| **prod** | k3d on-premises | `docker.io` | semver e.g. `1.0.0` |

---

## Services

| Service | Type | Port | Transport |
|---|---|---|---|
| `web` | Next.js frontend | 3000 | HTTP |
| `api-gateway` | NestJS GraphQL | 3001 | HTTP |
| `service-auth` | NestJS microservice | — | Redis RPC |
| `service-core` | NestJS microservice | — | Redis RPC |
| `redis` | Message broker / cache | 6379 | Redis protocol |

`service-auth` and `service-core` have no Kubernetes Service resources — they communicate exclusively via Redis message patterns and are not reachable over HTTP.

---

## Chart Structure

```
infrastructure/helm/luckyplans/
  Chart.yaml
  values.yaml             # defaults + local k3d config
  values.dev.yaml         # dev VPS overrides (merged on top of values.yaml)
  values.prod.yaml        # prod on-prem overrides
  templates/
    _helpers.tpl          # shared label/selector/fullname helpers
    namespace.yaml
    configmap.yaml        # luckyplans-config (NODE_ENV, REDIS_HOST, etc.)
    secret.yaml           # luckyplans-secrets (empty skeleton by default)
    ingress.yaml          # Traefik ingress
    redis/
      deployment.yaml
      service.yaml
    api-gateway/
      deployment.yaml
      service.yaml
    service-auth/
      deployment.yaml
    service-core/
      deployment.yaml
    web/
      deployment.yaml
      service.yaml
```

---

## Key Design Decisions

### 1. Redis: plain template, not Bitnami subchart

Redis runs as a simple `redis:7-alpine` Deployment + ClusterIP Service. The Bitnami subchart adds 400+ configurable values and auth machinery that is unnecessary for a k3d-only shop. If you migrate to managed Redis (Upstash, ElastiCache etc.) later, remove the `redis/` templates and point `config.redisHost` at the managed host.

### 2. NEXT_PUBLIC_GRAPHQL_URL is a build-time constraint

Next.js bakes `NEXT_PUBLIC_*` variables into the JavaScript bundle at `docker build` time. Helm **cannot** inject this at `helm upgrade` time.

**How it's handled:**

1. The URL is stored in `values.yaml` under `web.buildArgs.graphqlUrl` — single source of truth.
2. `deploy-local.sh` extracts it from `values.yaml` with grep+sed and passes it as `--build-arg NEXT_PUBLIC_GRAPHQL_URL=<value>` to `docker build`.
3. The web Deployment template renders a `luckyplans/baked-graphql-url` annotation on the Deployment object — visible in `kubectl describe deployment web` — so operators can always see what URL was baked into the running image.

**Rule:** changing `web.buildArgs.graphqlUrl` in a values file only takes effect if you rebuild and redeploy the web image. Helm alone does not update it.

### 3. Namespace is chart-managed with `keep` annotation

The chart creates the `luckyplans` namespace annotated with `helm.sh/resource-policy: keep`. This prevents `helm uninstall` from deleting the namespace and any PVCs or secrets inside it.

### 4. Secrets skeleton is always rendered

`templates/secret.yaml` renders a `luckyplans-secrets` Secret even when `secrets: {}` in values. This ensures CI/CD pipelines can reference the secret name reliably before any sensitive values are added. Use `stringData` in values (not base64) — Kubernetes handles encoding on apply.

For production, inject secrets via an external secrets manager (Vault, External Secrets Operator) rather than storing them in values files.

### 5. Image registry prefix is conditional

Every Deployment template uses:

```yaml
image: {{ if .Values.image.registry }}{{ .Values.image.registry }}/{{ end }}{{ $img.repository }}:{{ $img.tag }}
```

| env | `image.registry` | rendered |
|---|---|---|
| local | `""` | `luckyplans/api-gateway:latest` |
| dev | `docker.io` | `docker.io/luckyplans/api-gateway:dev` |
| prod | `docker.io` | `docker.io/luckyplans/api-gateway:1.0.0` |

---

## Environment Differences

| Key | local | dev | prod |
|---|---|---|---|
| `config.nodeEnv` | `development` | `development` | `production` |
| `config.corsOrigin` | `http://localhost` | `http://dev.luckyplans.com` | `https://luckyplans.com` |
| `ingress.host` | `""` (any) | `dev.luckyplans.com` | `luckyplans.com` |
| `ingress.tls.enabled` | `false` | `false` | `true` |
| `image.registry` | `""` | `docker.io` | `docker.io` |
| `image.pullPolicy` | `IfNotPresent` | `Always` | `IfNotPresent` |
| image tags | `latest` | `dev` | `1.0.0` |
| replicas | `1` | `1` | `2` |
| resources | small | small | doubled |
| `web.buildArgs.graphqlUrl` | `http://localhost/graphql` | `http://dev.luckyplans.com/graphql` | `https://luckyplans.com/graphql` |

---

## Deployment Commands

### Local (laptop)

```bash
pnpm deploy:local
# Builds images, imports into k3d, helm upgrade --install with values.yaml
```

### Dev (VPS)

```bash
# Build and push images first
docker build --build-arg NEXT_PUBLIC_GRAPHQL_URL=http://dev.luckyplans.com/graphql \
  -t docker.io/luckyplans/web:dev -f apps/web/Dockerfile .
docker push docker.io/luckyplans/web:dev
# ... repeat for other services ...

# Deploy
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.dev.yaml \
  --namespace luckyplans --create-namespace --atomic --timeout 3m
```

### Prod (on-prem)

```bash
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.prod.yaml \
  --namespace luckyplans --create-namespace --atomic --timeout 5m
```

### Teardown (local only)

```bash
pnpm deploy:teardown
# helm uninstall + k3d cluster delete
```

---

## Useful Commands

```bash
# Lint the chart
helm lint infrastructure/helm/luckyplans/

# Render templates locally (dry run)
helm template luckyplans infrastructure/helm/luckyplans/

# Check release status
pnpm deploy:status

# View what Helm has deployed
helm -n luckyplans get values luckyplans
helm -n luckyplans history luckyplans

# Pod logs
kubectl -n luckyplans logs -f deployment/api-gateway
kubectl -n luckyplans logs -f deployment/service-auth

# Verify health
curl -X POST http://localhost/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health }"}' | jq .
```
