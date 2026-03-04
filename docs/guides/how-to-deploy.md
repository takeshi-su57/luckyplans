# How to Deploy

All environments use the same Helm chart at `infrastructure/helm/luckyplans/` with per-environment values files. See [architecture/helm-deployment.md](../architecture/helm-deployment.md) for full design decisions.

---

## Architecture Overview

```
                     Traefik Ingress (k3d built-in)
                      │              │
                      │ /            │ /graphql
                      ▼              ▼
                    web:3000    api-gateway:3001
                                     │
                                     │ Redis transport
                                ┌────┴────┐
                                ▼         ▼
                          service-auth  service-core
                                │         │
                                └────┬────┘
                                     ▼
                                  Redis:6379
```

All services run in the `luckyplans` Kubernetes namespace.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker | Latest | [docker.com](https://www.docker.com) |
| k3d | Latest | [k3d.io](https://k3d.io) |
| kubectl | Latest | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |
| Helm | >= 3.0 | [helm.sh](https://helm.sh/docs/intro/install/) |

### Install k3d

```bash
# Linux/Mac
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Windows (via Chocolatey)
choco install k3d

k3d version
```

### Install Helm

```bash
# Linux/Mac
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Windows (via Chocolatey)
choco install kubernetes-helm

helm version
```

---

## Environments

| | local | dev | prod |
|---|---|---|---|
| Cluster | k3d on laptop | k3d on VPS | k3d on-premises |
| Values file | `values.yaml` | `values.yaml` + `values.dev.yaml` | `values.yaml` + `values.prod.yaml` |
| Image registry | none (k3d import) | `docker.io` | `docker.io` |
| Image tags | `latest` | `dev` | `1.0.0` (semver) |
| Replicas | 1 | 1 | 2 |
| Ingress host | any (localhost) | `dev.luckyplans.com` | `luckyplans.com` |
| TLS | off | off | on |

---

## Local Deployment (laptop)

### Single command

```bash
pnpm deploy:local
```

This handles everything: cluster creation, image builds, k3d import, and `helm upgrade --install`.

After completion:
- **Frontend**: http://localhost
- **GraphQL Playground**: http://localhost/graphql

### Teardown

```bash
pnpm deploy:teardown
```

### Status

```bash
pnpm deploy:status
```

### Manual step-by-step (if you need more control)

#### 1. Create the k3d cluster

```bash
k3d cluster create luckyplans-local \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer" \
  --agents 1

kubectl config use-context k3d-luckyplans-local
```

#### 2. Build Docker images

```bash
# Extract the GraphQL URL from values.yaml (baked into the Next.js image at build time)
WEB_GRAPHQL_URL=$(grep 'graphqlUrl:' infrastructure/helm/luckyplans/values.yaml \
  | head -1 | sed 's/.*graphqlUrl:[[:space:]]*//' | tr -d '"')

docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="$WEB_GRAPHQL_URL" \
  -t luckyplans/web:latest -f apps/web/Dockerfile .

docker build -t luckyplans/api-gateway:latest  -f apps/api-gateway/Dockerfile .
docker build -t luckyplans/service-auth:latest  -f apps/service-auth/Dockerfile .
docker build -t luckyplans/service-core:latest  -f apps/service-core/Dockerfile .
```

#### 3. Import images into k3d

```bash
docker pull redis:7-alpine
k3d image import redis:7-alpine              -c luckyplans-local
k3d image import luckyplans/web:latest       -c luckyplans-local
k3d image import luckyplans/api-gateway:latest  -c luckyplans-local
k3d image import luckyplans/service-auth:latest -c luckyplans-local
k3d image import luckyplans/service-core:latest -c luckyplans-local
```

#### 4. Deploy with Helm

```bash
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  --create-namespace \
  -f infrastructure/helm/luckyplans/values.yaml \
  --atomic --timeout 3m
```

---

## Dev Deployment (VPS)

### 1. Build and push images to Docker Hub

```bash
# Extract the dev GraphQL URL from values.dev.yaml
WEB_GRAPHQL_URL=$(grep 'graphqlUrl:' infrastructure/helm/luckyplans/values.dev.yaml \
  | head -1 | sed 's/.*graphqlUrl:[[:space:]]*//' | tr -d '"')

docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="$WEB_GRAPHQL_URL" \
  -t docker.io/luckyplans/web:dev -f apps/web/Dockerfile .

docker build -t docker.io/luckyplans/api-gateway:dev  -f apps/api-gateway/Dockerfile .
docker build -t docker.io/luckyplans/service-auth:dev  -f apps/service-auth/Dockerfile .
docker build -t docker.io/luckyplans/service-core:dev  -f apps/service-core/Dockerfile .

docker push docker.io/luckyplans/web:dev
docker push docker.io/luckyplans/api-gateway:dev
docker push docker.io/luckyplans/service-auth:dev
docker push docker.io/luckyplans/service-core:dev
```

### 2. Deploy on the VPS

SSH into the VPS, then:

```bash
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  --create-namespace \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.dev.yaml \
  --atomic --timeout 3m
```

---

## Prod Deployment (on-premises)

### 1. Build and push images with a semver tag

```bash
VERSION="1.0.0"

WEB_GRAPHQL_URL=$(grep 'graphqlUrl:' infrastructure/helm/luckyplans/values.prod.yaml \
  | head -1 | sed 's/.*graphqlUrl:[[:space:]]*//' | tr -d '"')

docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="$WEB_GRAPHQL_URL" \
  -t docker.io/luckyplans/web:$VERSION -f apps/web/Dockerfile .

docker build -t docker.io/luckyplans/api-gateway:$VERSION  -f apps/api-gateway/Dockerfile .
docker build -t docker.io/luckyplans/service-auth:$VERSION  -f apps/service-auth/Dockerfile .
docker build -t docker.io/luckyplans/service-core:$VERSION  -f apps/service-core/Dockerfile .

docker push docker.io/luckyplans/web:$VERSION
docker push docker.io/luckyplans/api-gateway:$VERSION
docker push docker.io/luckyplans/service-auth:$VERSION
docker push docker.io/luckyplans/service-core:$VERSION
```

Update `values.prod.yaml` image tags to the new version, then deploy:

```bash
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  --create-namespace \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.prod.yaml \
  --atomic --timeout 5m
```

---

## Verify the Deployment

```bash
# Check all pods are Running
kubectl -n luckyplans get pods

# Expected:
# redis-xxxxx          1/1     Running
# service-auth-xxxxx   1/1     Running
# service-core-xxxxx   1/1     Running
# api-gateway-xxxxx    1/1     Running
# web-xxxxx            1/1     Running

# Check services and ingress
kubectl -n luckyplans get svc
kubectl -n luckyplans get ingress

# Test the GraphQL health endpoint
curl -s http://localhost/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
# Expected: {"data":{"health":"API Gateway is running"}}
```

---

## Updating Configuration

All config lives in the values files. To change env vars, edit the relevant values file and re-run `helm upgrade`:

```bash
# Edit the config section in values.yaml (or values.dev.yaml / values.prod.yaml)
# Then apply:
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.yaml \
  --reuse-values
```

Helm automatically triggers rolling restarts of affected deployments.

> **Note on `NEXT_PUBLIC_GRAPHQL_URL`**: This is baked into the Next.js bundle at image build time — changing `web.buildArgs.graphqlUrl` in a values file only takes effect after rebuilding the web image. See [architecture/helm-deployment.md](../architecture/helm-deployment.md).

---

## Adding Secrets

Add sensitive values under `secrets:` in the relevant values file:

```yaml
# values.prod.yaml
secrets:
  JWT_SECRET: "your-secret-here"
  DB_PASSWORD: "your-password-here"
```

These are rendered into a Kubernetes `Secret` (type `Opaque`) and injected into all service containers via `secretRef`. Plain string values are used — Kubernetes handles base64 encoding automatically.

For production, prefer injecting secrets via an external secrets manager rather than storing them in values files.

---

## Scaling

Update `replicas` in the values file and run `helm upgrade`:

```yaml
# values.prod.yaml
apiGateway:
  replicas: 3

web:
  replicas: 2
```

```bash
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.prod.yaml
```

Or scale imperatively (not persisted across Helm upgrades):

```bash
kubectl -n luckyplans scale deployment/api-gateway --replicas=3
```

---

## Viewing Logs

```bash
kubectl -n luckyplans logs -f deployment/api-gateway
kubectl -n luckyplans logs -f deployment/service-auth
kubectl -n luckyplans logs -f deployment/service-core
kubectl -n luckyplans logs -f deployment/web

# Previous container logs (after crash)
kubectl -n luckyplans logs <pod-name> --previous
```

---

## Debugging

### Exec into a running pod

```bash
kubectl -n luckyplans exec -it deployment/api-gateway -- sh
```

### Describe a pod (check events and errors)

```bash
kubectl -n luckyplans describe pod <pod-name>
```

### Port-forward to bypass ingress

```bash
# Access API Gateway directly
kubectl -n luckyplans port-forward svc/api-gateway 3001:3001

# Access Redis directly
kubectl -n luckyplans port-forward svc/redis 6379:6379
```

### Inspect Helm state

```bash
# What values are deployed right now
helm -n luckyplans get values luckyplans

# Release history
helm -n luckyplans history luckyplans

# Rendered manifests for the current release
helm -n luckyplans get manifest luckyplans
```

### Dry-run a change before applying

```bash
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.yaml \
  --dry-run --debug
```

---

## Rollback

```bash
# Roll back to the previous release
helm -n luckyplans rollback luckyplans

# Roll back to a specific revision
helm -n luckyplans rollback luckyplans 2
```

---

## Teardown

### Uninstall the Helm release (keeps the namespace)

```bash
helm uninstall luckyplans -n luckyplans
```

The `luckyplans` namespace is annotated with `helm.sh/resource-policy: keep` and survives `helm uninstall`.

### Destroy the entire k3d cluster (local only)

```bash
pnpm deploy:teardown
```

Or manually:

```bash
helm uninstall luckyplans -n luckyplans
k3d cluster delete luckyplans-local
```

---

## Production Considerations

### TLS (HTTPS)

TLS is configured via `values.prod.yaml`. Create the TLS secret from your certificate:

```bash
kubectl -n luckyplans create secret tls luckyplans-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem
```

Traefik picks it up automatically via the ingress `tls:` spec in the Helm chart.

### Redis persistence

The current Redis Deployment has no PersistentVolumeClaim — data is lost on pod restart. For production, add a PVC manually or add a `redis.persistence` section to the chart in a future iteration.

### Resource limits

Adjust CPU/memory in the values files for your server capacity:

```yaml
# values.prod.yaml
apiGateway:
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"
```
