# How to Deploy

All environments use the same Helm chart at `infrastructure/helm/luckyplans/` with per-environment values files. See [architecture/helm-deployment.md](../architecture/helm-deployment.md) for full design decisions.

Continuous delivery is handled by **ArgoCD** (pull-based GitOps). See [architecture/argocd.md](../architecture/argocd.md) for the operational guide.

---

## Architecture Overview

```
                     Traefik Ingress (k3d built-in)
                      │              │
                      │ /            │ /graphql, /health
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

| Tool         | Version | Install                                                       |
| ------------ | ------- | ------------------------------------------------------------- |
| Docker       | Latest  | [docker.com](https://www.docker.com)                          |
| k3d          | Latest  | [k3d.io](https://k3d.io)                                      |
| kubectl      | Latest  | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/)      |
| Helm         | >= 3.0  | [helm.sh](https://helm.sh/docs/intro/install/)                |
| cert-manager | v1.17.1 | See [Install cert-manager](#install-cert-manager) (prod only) |

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

### Install cert-manager

Required for prod deployment (automatic TLS via Let's Encrypt).
Not needed for local development.

```bash
# Install cert-manager CRDs and controller (pinned version for reproducibility)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.yaml

# Wait for all components to be ready
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector

# Verify
kubectl -n cert-manager get pods
```

cert-manager only needs to be installed **once per cluster**. The Helm chart
includes a `ClusterIssuer` template that is automatically deployed when
`certManager.enabled: true`.

See [architecture/tls-certificates.md](../architecture/tls-certificates.md) for full TLS documentation.

---

## Environments

|                | local             | prod                                  |
| -------------- | ----------------- | ------------------------------------- |
| Cluster        | k3d on laptop     | k3d on VPS / on-premises              |
| CD method      | Direct Helm       | ArgoCD (auto-sync)                    |
| Values file    | `values.yaml`     | `values.yaml` + `values.prod.yaml`    |
| Image registry | none (k3d import) | `ghcr.io`                             |
| Image tags     | `latest`          | `sha-<commit>` (CI) / semver (manual) |
| Replicas       | 1                 | 2                                     |
| Ingress host   | any (localhost)   | `luckyplans.xyz`                      |
| TLS            | off               | on (cert-manager)                     |
| ArgoCD UI      | n/a               | https://luckyplans.xyz/argocd         |

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
# Use a relative GraphQL URL so the image works on any domain
docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="/graphql" \
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
  --rollback-on-failure --timeout 3m
```

> **Note:** Helm automatically loads `values.yaml` from the chart directory,
> so there is no need to pass `-f values.yaml` explicitly. Only overlay files
> (e.g. `values.prod.yaml`) need an explicit `-f` flag.

---

## CI/CD with ArgoCD (recommended)

Prod deployments are handled by **ArgoCD GitOps**.
See [architecture/argocd.md](../architecture/argocd.md) for the full operational guide and [architecture/ci-cd-pipeline.md](../architecture/ci-cd-pipeline.md) for pipeline documentation.

### How it works

```
Push/merge to main
  │
  ▼
CI (lint, type-check, test, build)
  │ ✅
  ▼
Docker Build & Push (4 images → ghcr.io, tagged sha-<commit>)
  │ ✅
  ▼
Update Tags (commits new tags to values.prod.yaml) [skip ci]
  │
  ▼
ArgoCD detects Git change → auto-syncs → post-sync smoke tests
```

- **Prod** auto-syncs automatically when ArgoCD detects the tag update in Git

### Manual tag deployment

To deploy a specific image tag:

1. Go to **Actions → Update Image Tags → Run workflow**
2. Enter the image tag (e.g. `sha-abc1234`)
3. Click **Run workflow**

This commits the tag to `values.prod.yaml`. ArgoCD will auto-sync the new tag.

Alternatively, edit the values file directly and push:

```bash
# Edit tags in values.prod.yaml
git add infrastructure/helm/luckyplans/values.prod.yaml
git commit -m "chore: update image tags to sha-abc1234 [skip ci]"
git push origin main
```

### Smoke tests

Each deployment automatically runs smoke tests as **ArgoCD post-sync hooks** (Kubernetes Jobs running inside the cluster):

- API Gateway health: `http://api-gateway.luckyplans.svc:3001/health`
- Web frontend: `http://web.luckyplans.svc:3000/`
- GraphQL endpoint: `POST http://api-gateway.luckyplans.svc:3001/graphql` with `{"query":"{ health }"}`

Tests retry 5 times with 10-second intervals. Results are visible in the ArgoCD UI (sync status shows Healthy or Degraded).

```bash
# Check smoke test logs
kubectl -n luckyplans logs job/smoke-test
```

### Rolling back a deployment

**Option 1: Git revert** (recommended — permanent)

```bash
# Find the tag update commit
git log --oneline -5

# Revert it
git revert <commit-sha>
git push origin main
```

ArgoCD detects the revert and auto-syncs back to the previous image tags.

**Option 2: ArgoCD UI** (temporary — auto-sync will immediately re-sync to Git state)

1. Open the Application in ArgoCD UI
2. Click **History and Rollback**
3. Select a previous revision → **Rollback**

> **Warning:** With auto-sync enabled, ArgoCD UI rollbacks are overridden
> almost immediately. Use git revert for permanent rollbacks.

> **Note:** Direct `helm rollback` no longer works since ArgoCD manages the Helm release. ArgoCD self-heal would immediately revert any manual Helm changes.

### Private registry pull secrets

If your GHCR packages are private (not public), Kubernetes needs credentials to
pull images. Create a pull secret in the `luckyplans` namespace:

```bash
kubectl -n luckyplans create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username=<github-username> \
  --docker-password=<github-pat-with-read:packages>
```

Then enable it in your values file:

```yaml
image:
  pullSecrets:
    - name: ghcr-pull-secret
```

### Firewall

Ports that must remain open on the VPS:

| Port | Purpose                              | Open to                               |
| ---- | ------------------------------------ | ------------------------------------- |
| 22   | SSH                                  | Your IP only                          |
| 80   | HTTP (Let's Encrypt ACME + redirect) | `0.0.0.0` (required by Let's Encrypt) |
| 443  | HTTPS (Traefik ingress + ArgoCD UI)  | `0.0.0.0` (public traffic)            |

> **Note:** The Kubernetes API (port 6443) does not need to be exposed.
> ArgoCD runs in-cluster, and operators access kubectl via SSH to the server.

---

## Prod Deployment — first-time setup

> **Note:** This section covers **one-time cluster setup**. After ArgoCD is
> installed, all subsequent deployments happen automatically via ArgoCD auto-sync.

### Prerequisites

- DNS A record: `luckyplans.xyz → <your-server-ip>`
- Ports open on firewall: 22 (SSH), 80 (HTTP/ACME), 443 (HTTPS)
- A GitHub Personal Access Token (PAT) with `read:packages` and repo read access
- **CD push token:** If branch protection is enabled on `main`, create a fine-grained
  PAT with **Contents: read+write** scope and store it as a repository secret named
  `CD_PUSH_TOKEN`. The `update-tags` workflow needs this to push tag commits directly
  to `main`. Without it, the CD pipeline silently breaks.

### Part A: Server setup

SSH into the prod server to create the cluster and install dependencies.

#### 1. Create the k3d cluster

```bash
k3d cluster create luckyplans-prod \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer" \
  --agents 1
```

#### 2. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.yaml
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector
```

#### 3. Install ArgoCD

```bash
git clone https://github.com/takeshi-su57/platform-clients.git
cd platform-clients

./infrastructure/scripts/install-argocd.sh --github-token <your-github-pat>
```

#### 4. Bootstrap secrets

```bash
kubectl create namespace luckyplans 2>/dev/null || true

kubectl -n luckyplans create secret generic luckyplans-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -base64 48)" \
  --from-literal=DB_PASSWORD="your-db-password"
```

#### 5. Pin initial image tags

Before the first ArgoCD sync, ensure `values.prod.yaml` has pinned image tags
(not `latest`). Either wait for the CI pipeline to complete after your first
merge to `main`, or run the **Update Image Tags** workflow manually:

1. Go to **Actions → Update Image Tags → Run workflow**
2. Enter the tag of your latest Docker build (e.g. `sha-abc1234`)
3. Click **Run workflow**

This commits deterministic `sha-<commit>` tags to `values.prod.yaml`, ensuring
the first prod deployment is reproducible.

#### 6. Wait for auto-sync

ArgoCD will automatically detect the Application and sync the Helm chart.
Monitor progress in the ArgoCD UI at `https://luckyplans.xyz/argocd`.

On first deploy, cert-manager will automatically provision a TLS certificate
for `luckyplans.xyz` and store it in the `luckyplans-tls` Secret.

#### 7. Verify

```bash
kubectl -n luckyplans get pods
curl -s https://luckyplans.xyz/health
curl -s https://luckyplans.xyz/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
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

# Test the REST health endpoint (use your environment's URL)
# Local:   http://localhost/health
# Prod:    https://luckyplans.xyz/health
curl -s http://localhost/health | jq .
# Expected: {"status":"ok"}

# Test the GraphQL health endpoint
# Local:   http://localhost/graphql
# Prod:    https://luckyplans.xyz/graphql
curl -s http://localhost/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
# Expected: {"data":{"health":"API Gateway is running"}}
```

---

## Updating Configuration

All config lives in the values files. To make changes:

**Local** (no ArgoCD — direct Helm):

```bash
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans
```

**Prod** (ArgoCD GitOps):

1. Edit `values.prod.yaml`
2. Commit and push to `main`
3. ArgoCD auto-syncs the change

> **Warning:** Do not use `helm upgrade` directly on the prod cluster managed
> by ArgoCD — ArgoCD self-heal will revert manual Helm changes.

> **Note on `NEXT_PUBLIC_GRAPHQL_URL`**: This is baked into the Next.js bundle at image build time — changing `web.buildArgs.graphqlUrl` in a values file only takes effect after rebuilding the web image. See [architecture/helm-deployment.md](../architecture/helm-deployment.md).

---

## Adding Secrets

Secrets are rendered into a Kubernetes `Secret` (type `Opaque`) and injected into all service containers via `secretRef`. Plain string values are used — Kubernetes handles base64 encoding automatically.

### Auto-generated secrets

**`JWT_SECRET`** is automatically generated by the Helm chart on first install
(64 random alphanumeric characters) and reused across upgrades via Helm's
`lookup` function. No manual configuration is needed — each cluster gets its
own unique secret.

### Manual secrets

**Never commit real secrets to values files or version control.** Secrets are
managed directly in the cluster and preserved across ArgoCD syncs via Helm's
`lookup` function.

**First-time setup** (before first ArgoCD sync):

```bash
kubectl -n luckyplans create secret generic luckyplans-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -base64 48)" \
  --from-literal=DB_PASSWORD="your-db-password"
```

Once created, ArgoCD's Helm rendering detects the existing secret via `lookup`
and preserves the values — no `--set` flags or CI secrets needed.

> **Note:** `DB_PASSWORD` is reserved for future database use. The current
> architecture uses only Redis for inter-service transport. The secret is
> provisioned now to avoid workflow changes when a database is introduced.

### Rotating secrets

#### Rotating `JWT_SECRET`

`JWT_SECRET` is auto-generated by Helm and stored in the `luckyplans-secrets`
Kubernetes Secret. To rotate it:

1. **Delete the existing secret** so Helm generates a new one:
   ```bash
   kubectl -n luckyplans delete secret luckyplans-secrets
   ```
2. **Trigger a sync** in ArgoCD. ArgoCD will re-render the Helm chart,
   generating a new `JWT_SECRET`.
3. **Verify** the deployment is healthy (all existing JWTs will be invalidated).

#### Rotating `DB_PASSWORD` and other manual secrets

1. **Generate the new secret value** using a cryptographically secure method:

   ```bash
   openssl rand -base64 32
   ```

2. **Update the Kubernetes Secret directly**:

   ```bash
   kubectl -n luckyplans patch secret luckyplans-secrets \
     -p '{"stringData":{"DB_PASSWORD":"new-password-here"}}'
   ```

3. **Restart affected pods** to pick up the new value:

   ```bash
   kubectl -n luckyplans rollout restart deployment/api-gateway
   kubectl -n luckyplans rollout restart deployment/service-auth
   kubectl -n luckyplans rollout restart deployment/service-core
   ```

4. **Verify** the deployment is healthy.

> **Tip:** Rotate secrets on a regular schedule (e.g. quarterly) and immediately
> after any team member departure or suspected compromise.

---

## Scaling

Update `replicas` in the values file, commit, and push:

```yaml
# values.prod.yaml
apiGateway:
  replicas: 3

web:
  replicas: 2
```

```bash
git add infrastructure/helm/luckyplans/values.prod.yaml
git commit -m "scale: increase api-gateway to 3 replicas"
git push origin main
# ArgoCD auto-syncs the change
```

> **Warning:** Do not use `kubectl scale` on ArgoCD-managed clusters — ArgoCD
> self-heal will revert the change back to the Git-defined replica count
> within seconds.
> For local clusters (no ArgoCD), imperative scaling still works:
>
> ```bash
> kubectl -n luckyplans scale deployment/api-gateway --replicas=3
> ```

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
  --dry-run --debug
```

### Check ArgoCD sync status

```bash
# Via ArgoCD UI: https://luckyplans.xyz/argocd

# Via kubectl (check Application resource):
kubectl -n argocd get application luckyplans-prod -o wide
```

---

## Rollback

### ArgoCD-managed environment (prod)

**Git revert** (recommended — permanent):

```bash
git log --oneline -5
git revert <commit-sha>
git push origin main
```

ArgoCD auto-syncs the revert to the previous state.

**ArgoCD UI** (temporary — auto-sync overrides immediately):

1. Open the Application in ArgoCD UI → **History and Rollback**
2. Select a previous revision → **Rollback**

> **Warning:** With auto-sync + self-heal enabled, UI rollbacks are reverted
> almost immediately. Use git revert for permanent rollbacks.

### Local environment (no ArgoCD)

```bash
# Roll back to the previous Helm release
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

### Uninstall ArgoCD

```bash
helm uninstall argocd -n argocd
kubectl delete namespace argocd
```

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

TLS certificates are managed automatically by **cert-manager + Let's Encrypt**.
The prod environment uses the `letsencrypt-prod` ClusterIssuer with HTTP-01
challenges. Certificates auto-renew ~30 days before expiry.

| Environment | Domain           | Secret           | Issuer             |
| ----------- | ---------------- | ---------------- | ------------------ |
| prod        | `luckyplans.xyz` | `luckyplans-tls` | `letsencrypt-prod` |

```bash
# Check certificate status
kubectl -n luckyplans get certificate

# Check certificate details and renewal
kubectl -n luckyplans describe certificate luckyplans-tls

# Troubleshoot cert-manager
kubectl -n cert-manager logs deploy/cert-manager --tail=50
```

For full TLS documentation, see [architecture/tls-certificates.md](../architecture/tls-certificates.md).

### Redis security

The current Redis deployment has the following limitations that should be
addressed before production use:

- **No persistence:** No PersistentVolumeClaim — data is lost on pod restart.
  Add a PVC or use a `redis.persistence` section in the chart.
- **No authentication:** Redis is accessible without a password. Enable
  `requirepass` via a Redis config or use the `--requirepass` flag and inject
  the password from a Kubernetes Secret.
- **Network policy:** A `NetworkPolicy` is included in the chart at
  `templates/redis/networkpolicy.yaml` — it restricts ingress to only the
  `api-gateway`, `service-auth`, and `service-core` pods on port 6379.
  Verify it is active: `kubectl -n luckyplans get networkpolicy`.

### Resource limits and namespace quotas

Adjust CPU/memory in the values files for your server capacity:

```yaml
# values.prod.yaml
apiGateway:
  resources:
    requests:
      memory: '512Mi'
      cpu: '500m'
    limits:
      memory: '1Gi'
      cpu: '1000m'
```

Consider adding a `ResourceQuota` and `LimitRange` for the `luckyplans`
namespace to prevent any single deployment from consuming all node resources.
This is especially important on resource-constrained servers:

```bash
# Example: cap the namespace at 4 CPU and 8Gi memory
kubectl -n luckyplans create quota luckyplans-quota \
  --hard=requests.cpu=4,requests.memory=8Gi,limits.cpu=8,limits.memory=16Gi
```

### Monitoring and alerting

For production, set up monitoring to catch issues before users do:

- **Prometheus + Grafana:** Scrape pod metrics and visualize dashboards for
  CPU, memory, request latency, and error rates.
- **cert-manager alerts:** Monitor `certmanager_certificate_expiration_timestamp_seconds`
  to alert if certificate renewal fails silently.
- **Pod restart alerts:** Alert on `kube_pod_container_status_restarts_total`
  to catch crash loops early.
- **Uptime monitoring:** Use an external service (e.g. UptimeRobot, Pingdom)
  to monitor `https://luckyplans.xyz/health` from outside the cluster.
- **ArgoCD sync alerts:** Monitor ArgoCD Application health status for
  Degraded or OutOfSync states that persist beyond expected sync intervals.
