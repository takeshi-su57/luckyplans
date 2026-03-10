# Helm Deployment Architecture

## Overview

The platform uses a single Helm chart (`infrastructure/helm/luckyplans/`) to deploy all services across two k3d environments. Docker Compose has been removed — Helm + k3d is the only deployment approach.

| Environment | Cluster                  | Image Registry    | Image Tag                    |
| ----------- | ------------------------ | ----------------- | ---------------------------- |
| **local**   | k3d on laptop            | none (k3d import) | `latest`                     |
| **prod**    | k3d on VPS / on-premises | `ghcr.io`         | `sha-<commit>` (CI) / semver |

---

## Services

| Service        | Type                   | Port | Transport      |
| -------------- | ---------------------- | ---- | -------------- |
| `web`          | Next.js frontend       | 3000 | HTTP           |
| `api-gateway`  | NestJS GraphQL         | 3001 | HTTP           |
| `service-auth` | NestJS microservice    | —    | Redis RPC      |
| `service-core` | NestJS microservice    | —    | Redis RPC      |
| `redis`        | Message broker / cache | 6379 | Redis protocol |

`service-auth` and `service-core` have no Kubernetes Service resources — they communicate exclusively via Redis message patterns and are not reachable over HTTP.

---

## Chart Structure

```
infrastructure/helm/luckyplans/
  Chart.yaml
  values.yaml             # defaults + local k3d config
  values.prod.yaml        # prod overrides (merged on top of values.yaml)
  templates/
    _helpers.tpl          # shared label/selector/fullname helpers
    namespace.yaml
    configmap.yaml        # luckyplans-config (NODE_ENV, REDIS_HOST, etc.)
    secret.yaml           # luckyplans-secrets (auto-generates JWT_SECRET)
    ingress.yaml          # Traefik ingress
    cluster-issuer.yaml   # cert-manager ClusterIssuer (prod only)
    middleware-redirect.yaml  # Traefik HTTPS redirect + HSTS (prod only)
    pdb.yaml              # PodDisruptionBudgets
    smoke-test-job.yaml   # ArgoCD post-sync smoke tests (prod only)
    redis/
      deployment.yaml
      service.yaml
      networkpolicy.yaml  # restricts Redis access to app pods
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

### 5. Image registry prefix is conditional

Every Deployment template uses:

```yaml
image: {{ if .Values.image.registry }}{{ .Values.image.registry }}/{{ end }}{{ $img.repository }}:{{ $img.tag }}
```

| env   | `image.registry` | rendered                                       |
| ----- | ---------------- | ---------------------------------------------- |
| local | `""`             | `luckyplans/api-gateway:latest`                |
| prod  | `ghcr.io`        | `ghcr.io/takeshi-su57/api-gateway:sha-abc1234` |

---

## Environment Differences

| Key                        | local              | prod                     |
| -------------------------- | ------------------ | ------------------------ |
| `config.nodeEnv`           | `development`      | `production`             |
| `config.corsOrigin`        | `http://localhost` | `https://luckyplans.xyz` |
| `ingress.host`             | `""` (any)         | `luckyplans.xyz`         |
| `ingress.tls.enabled`      | `false`            | `true`                   |
| `image.registry`           | `""`               | `ghcr.io`                |
| `image.pullPolicy`         | `IfNotPresent`     | `Always`                 |
| image tags                 | `latest`           | `sha-<commit>`           |
| replicas                   | `1`                | `2`                      |
| resources                  | small              | doubled                  |
| `web.buildArgs.graphqlUrl` | `/graphql`         | `/graphql`               |

---

## Deployment Commands

### Local (laptop)

```bash
pnpm deploy:local
# Builds images, imports into k3d, helm upgrade --install with values.yaml
```

### Prod (ArgoCD GitOps)

Prod is managed by **ArgoCD** — do not run `helm upgrade` directly.
See [argocd.md](argocd.md) for the operational guide and [../guides/deployment.md](../guides/deployment.md) for first-time setup.

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
