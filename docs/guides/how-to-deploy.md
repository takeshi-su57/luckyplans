# How to Deploy

All environments use the same Helm chart at `infrastructure/helm/luckyplans/` with per-environment values files. See [architecture/helm-deployment.md](../architecture/helm-deployment.md) for full design decisions.

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

| Tool | Version | Install |
|------|---------|---------|
| Docker | Latest | [docker.com](https://www.docker.com) |
| k3d | Latest | [k3d.io](https://k3d.io) |
| kubectl | Latest | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |
| Helm | >= 3.0 | [helm.sh](https://helm.sh/docs/intro/install/) |
| cert-manager | v1.17.1 | See [Install cert-manager](#install-cert-manager) (dev/prod only) |

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

Required for dev and prod deployments (automatic TLS via Let's Encrypt).
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

| | local | dev | prod |
|---|---|---|---|
| Cluster | k3d on laptop | k3d on VPS | k3d on-premises |
| Values file | `values.yaml` | `values.yaml` + `values.dev.yaml` | `values.yaml` + `values.prod.yaml` |
| Image registry | none (k3d import) | `ghcr.io` | `ghcr.io` |
| Image tags | `latest` | `sha-<commit>` (CI) / `dev` (manual) | `sha-<commit>` (CI) / semver (manual) |
| Replicas | 1 | 1 | 2 |
| Ingress host | any (localhost) | `dev.luckyplans.xyz` | `luckyplans.xyz` |
| TLS | off | on (cert-manager) | on (cert-manager) |

> **Note:** During early development, both dev and prod share the same VPS
> (`<your-vps-ip>`). When prod moves to dedicated on-premises hardware, update
> the DNS A record for `luckyplans.xyz` and the `KUBECONFIG_PROD` secret to
> point to the new cluster.

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
> (e.g. `values.dev.yaml`, `values.prod.yaml`) need an explicit `-f` flag.

---

## CI/CD Automated Deployment (recommended)

Dev and prod deployments are handled automatically by GitHub Actions.
See [architecture/ci-cd-pipeline.md](../architecture/ci-cd-pipeline.md) for full pipeline documentation.

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
Deploy & Verify
  ├── Dev  → auto-deploy → smoke tests
  └── Prod → manual approval → deploy → smoke tests
```

- **Dev** deploys automatically after every successful CI + Docker build on `main`
- **Prod** requires manual approval via the GitHub Environment protection rule

### Manual dispatch

To deploy a specific image tag manually, see [ci-cd-pipeline.md — Manual Deployment](../architecture/ci-cd-pipeline.md#manual-deployment).

### Required GitHub configuration

See [architecture/ci-cd-pipeline.md](../architecture/ci-cd-pipeline.md#secrets) for the full secrets reference and [Environments](../architecture/ci-cd-pipeline.md#environments) for environment setup.

#### Generating `KUBECONFIG_DEV` / `KUBECONFIG_PROD`

SSH into the VPS and extract the kubeconfig from k3d:

```bash
# 1. List clusters to find the exact name
k3d cluster list

# 2. Export the kubeconfig (replace "luckyplans-dev" with your cluster name)
k3d kubeconfig get luckyplans-dev > /tmp/kubeconfig-dev.yaml

# 3. IMPORTANT: Replace the local address with the VPS public IP.
#    k3d outputs server: https://0.0.0.0:6443 which is unreachable from
#    a GitHub Actions runner. Replace it with the VPS public IP:
sed -i 's|server: https://0.0.0.0:|server: https://<your-vps-ip>:|' /tmp/kubeconfig-dev.yaml

# 4. Verify the server address looks correct
grep server /tmp/kubeconfig-dev.yaml
# Expected: server: https://<your-vps-ip>:6443

# 5. Base64-encode (single line, no wrapping)
# Linux:
base64 -w 0 < /tmp/kubeconfig-dev.yaml
# macOS (BSD base64 does not support -w):
# base64 -i /tmp/kubeconfig-dev.yaml
# Copy this output — it becomes the KUBECONFIG_DEV secret value

# 6. Clean up
rm /tmp/kubeconfig-dev.yaml
```

Then in GitHub: **Settings → Secrets and variables → Actions → New repository secret**,
paste the base64 string as the value for `KUBECONFIG_DEV`. Repeat the same process
for `KUBECONFIG_PROD`.

> **Security:** For CI, create a dedicated service account with RBAC scoped to the `luckyplans` namespace rather than encoding your full admin kubeconfig. This limits blast radius if the secret is compromised.
>
> **Creating a scoped service account:**
>
> First, pre-create the namespace (required because `--create-namespace` is a
> cluster-level operation that a namespace-scoped Role cannot grant):
>
> ```bash
> kubectl create namespace luckyplans
> ```
>
> Then create the service account, Role, and RoleBinding:
>
> ```bash
> kubectl -n luckyplans create serviceaccount github-actions
> kubectl -n luckyplans create role deployer \
>   --verb=get,list,watch,create,update,patch,delete \
>   --resource=deployments,replicasets,services,pods,secrets,configmaps,ingresses,networkpolicies,poddisruptionbudgets
> kubectl -n luckyplans create rolebinding deployer \
>   --role=deployer --serviceaccount=luckyplans:github-actions
> ```
>
> The chart also creates Traefik `Middleware` and cert-manager `ClusterIssuer`
> CRDs. These are cluster-scoped or custom resources, so they need a
> `ClusterRole`:
>
> ```bash
> kubectl create clusterrole github-actions-crd-access \
>   --verb=get,list,watch,create,update,patch,delete \
>   --resource=middlewares.traefik.io,clusterissuers.cert-manager.io
> kubectl create clusterrolebinding github-actions-crd-access \
>   --clusterrole=github-actions-crd-access \
>   --serviceaccount=luckyplans:github-actions
> ```
>
> **Note:** Remove `--create-namespace` from the `helm upgrade` command when
> using this scoped service account — the namespace must already exist.
> Alternatively, add a ClusterRole with `create` on `namespaces`, but
> pre-creating the namespace is simpler and more secure.
>
> Then generate a kubeconfig using that ServiceAccount's token instead of the
> cluster-admin credentials.

#### Firewall: securing the Kubernetes API port

The kubeconfig lets the GitHub Actions runner connect to port **6443** on your VPS.
Without firewall rules, this port would be open to the entire internet.

**Recommended approach:** Use a **self-hosted GitHub Actions runner** on the VPS
itself, or set up a **WireGuard/Tailscale tunnel** between the runner and the VPS.
Both approaches eliminate the need to maintain IP allowlists entirely and avoid
the fragility of tracking GitHub's rotating runner IP ranges.

<details>
<summary>Fallback: IP-based allowlisting with ufw (fragile)</summary>

If you cannot use a self-hosted runner or tunnel, lock down port 6443 by IP:

```bash
# On the VPS (ufw example)
# IMPORTANT: UFW evaluates rules in order. Add allow rules BEFORE the deny rule,
# otherwise the deny will shadow all subsequent allows.

# Allow your own IP (for local kubectl access)
sudo ufw allow from <your-ip>/32 to any port 6443 proto tcp

# Allow GitHub Actions runner IP ranges.
# Fetch the current list from GitHub's meta API:
curl -s https://api.github.com/meta | jq -r '.actions[]' > /tmp/gh-actions-cidrs.txt

# Add each CIDR:
while IFS= read -r cidr; do
  sudo ufw allow from "$cidr" to any port 6443 proto tcp
done < /tmp/gh-actions-cidrs.txt

# Deny all other access to 6443 (added last so allow rules take precedence)
sudo ufw deny 6443/tcp

# Verify rules (allow rules should appear before deny)
sudo ufw status | grep 6443
```

> **Warning:** GitHub's runner IPs change periodically. Check
> `https://api.github.com/meta` and update the firewall rules if deployments
> start timing out. Consider a cron job on the VPS that refreshes rules daily.

</details>

Ports that must remain open on the VPS:

| Port | Purpose | Open to |
|------|---------|---------|
| 22 | SSH | Your IP only |
| 80 | HTTP (Let's Encrypt ACME + redirect) | `0.0.0.0` (required by Let's Encrypt) |
| 443 | HTTPS (Traefik ingress) | `0.0.0.0` (public traffic) |
| 6443 | Kubernetes API | Your IP + GitHub Actions IPs only |

### Smoke tests

Each deployment automatically runs smoke tests:
- API Gateway health check: `https://dev.luckyplans.xyz/health` (dev) / `https://luckyplans.xyz/health` (prod)
- Web frontend check: `https://dev.luckyplans.xyz/` (dev) / `https://luckyplans.xyz/` (prod)
- GraphQL endpoint check: `POST /graphql` with `{"query":"{ health }"}` — verifies backend connectivity

Tests retry 5 times with 10-second intervals. Results are reported to the GitHub Actions step summary.

### Rolling back a CI deployment

To rollback to a previous version deployed by CI:

1. Find the previous image tag in the **Actions → Docker Build & Push** run history (e.g. `sha-abc1234`)
2. Go to **Actions → Deploy & Verify → Run workflow**
3. Enter the previous image tag
4. Select the target environment (`dev`, `prod`, or `both`)
5. Click **Run workflow**

This deploys the older image tag. Helm will create a new release revision, so
`helm rollback` is also available as a fallback:

```bash
# From the cluster directly:
helm -n luckyplans rollback luckyplans
```

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

Or pass it at deploy time:

```bash
helm upgrade --install luckyplans ... \
  --set image.pullSecrets[0].name=ghcr-pull-secret
```

---

## Dev Deployment (VPS) — manual

> **Note:** This is only needed for first-time cluster setup or if CI/CD is unavailable.
> Normal dev deployments happen automatically via GitHub Actions (see above).

### Prerequisites

- DNS A record: `dev.luckyplans.xyz → <your-vps-ip>`
- Ports open on VPS firewall: 22 (SSH), 80 (HTTP/ACME), 443 (HTTPS), 6443 (k8s API)
- A GitHub Personal Access Token (PAT) with `read:packages` and `write:packages` scope

### Part A: VPS setup (first time only)

SSH into the VPS to create the cluster and export the kubeconfig.

#### 1. Create the k3d cluster

```bash
ssh your-user@<your-vps-ip>

# Install k3d if not already installed
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Create cluster with port mappings and TLS SAN for external access
k3d cluster create luckyplans-dev \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer" \
  --api-port 6443 \
  --k3s-arg "--tls-san=<your-vps-ip>@server:0" \
  --agents 1

# Verify
kubectl get nodes
```

#### 2. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.yaml

# Wait for all components to be ready
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector
```

#### 3. Export the kubeconfig

```bash
# Export kubeconfig from k3d
k3d kubeconfig get luckyplans-dev > /tmp/kubeconfig-dev.yaml

# Replace the local address with the VPS public IP
# (k3d outputs server: https://0.0.0.0:6443 which is unreachable from outside)
sed -i 's|server: https://0.0.0.0:|server: https://<your-vps-ip>:|' /tmp/kubeconfig-dev.yaml

# Verify the server address
grep server /tmp/kubeconfig-dev.yaml
# Expected: server: https://<your-vps-ip>:6443

# Base64-encode (single line, no wrapping) and print
base64 -w 0 < /tmp/kubeconfig-dev.yaml && echo

# Copy the base64 string output — you'll decode it on your local machine
rm /tmp/kubeconfig-dev.yaml
```

On your **local machine**, decode the base64 string and save it:

```bash
mkdir -p ~/.kube
echo "<paste-base64-string-here>" | base64 -d > ~/.kube/luckyplans-dev.yaml
chmod 600 ~/.kube/luckyplans-dev.yaml
```

> **macOS note:** Use `base64 -D` instead of `base64 -d` if decoding fails.

You can now disconnect from the VPS. All remaining steps run on your local machine.

### Part B: Deploy from local machine

#### 4. Build and push images to GHCR

```bash
# Authenticate with GitHub Container Registry
docker login ghcr.io -u <your-github-username> -p <your-github-pat>

# Build images (use MSYS_NO_PATHCONV=1 on Windows/Git Bash to prevent path expansion)
MSYS_NO_PATHCONV=1 docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="/graphql" \
  -t ghcr.io/<your-github-username>/web:dev \
  -f apps/web/Dockerfile .

docker build -t ghcr.io/<your-github-username>/api-gateway:dev   -f apps/api-gateway/Dockerfile .
docker build -t ghcr.io/<your-github-username>/service-auth:dev  -f apps/service-auth/Dockerfile .
docker build -t ghcr.io/<your-github-username>/service-core:dev  -f apps/service-core/Dockerfile .

# Push all images
docker push ghcr.io/<your-github-username>/web:dev
docker push ghcr.io/<your-github-username>/api-gateway:dev
docker push ghcr.io/<your-github-username>/service-auth:dev
docker push ghcr.io/<your-github-username>/service-core:dev
```

#### 5. Deploy with Helm

Run this from your local machine (where the repo is checked out). The
`--kubeconfig` flag tells Helm to target the remote VPS cluster:

```bash
OWNER="<your-github-username>"

helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --kubeconfig ~/.kube/luckyplans-dev.yaml \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.dev.yaml \
  --set image.registry=ghcr.io \
  --set "apiGateway.image.repository=$OWNER/api-gateway" \
  --set "serviceAuth.image.repository=$OWNER/service-auth" \
  --set "serviceCore.image.repository=$OWNER/service-core" \
  --set "web.image.repository=$OWNER/web" \
  --namespace luckyplans --create-namespace \
  --rollback-on-failure --timeout 5m
```

> **Note:** Image tags default to `dev` in `values.dev.yaml`. To deploy a
> specific version, add `--set apiGateway.image.tag=sha-abc1234` (and the
> same for the other 3 services).

On first deploy, cert-manager will automatically:
1. Create a `ClusterIssuer` for Let's Encrypt
2. Request a TLS certificate for `dev.luckyplans.xyz`
3. Store it in the `luckyplans-dev-tls` Secret
4. Traefik starts serving HTTPS

#### 6. Verify

```bash
# Check all pods are Running
kubectl --kubeconfig ~/.kube/luckyplans-dev.yaml -n luckyplans get pods

# Check certificate status (may take 1-2 minutes on first deploy)
kubectl --kubeconfig ~/.kube/luckyplans-dev.yaml -n luckyplans get certificate

# Test endpoints
curl -s https://dev.luckyplans.xyz/health
curl -s https://dev.luckyplans.xyz/ | head -20

# Test GraphQL
curl -s https://dev.luckyplans.xyz/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
```

> **Tip:** To avoid passing `--kubeconfig` every time, set the environment variable:
> ```bash
> export KUBECONFIG=~/.kube/luckyplans-dev.yaml
> ```

---

## Prod Deployment (on-premises) — manual

> **Note:** This is only needed for first-time cluster setup or if CI/CD is unavailable.
> Normal prod deployments happen via GitHub Actions with manual approval (see above).

### Prerequisites

- DNS A record: `luckyplans.xyz → <your-vps-ip>` *(currently shares the dev VPS — update when on-premises cluster is ready)*
- Ports open on firewall: 22 (SSH), 80 (HTTP/ACME), 443 (HTTPS), 6443 (k8s API)
- A GitHub Personal Access Token (PAT) with `read:packages` and `write:packages` scope

### Part A — VPS setup (first time only)

SSH into the prod server to create the cluster and export the kubeconfig.

#### 1. Create the k3d cluster

```bash
k3d cluster create luckyplans-prod \
  --port "80:80@loadbalancer" \
  --port "443:443@loadbalancer" \
  --api-port 6443 \
  --k3s-arg "--tls-san=<your-server-ip>@server:0" \
  --agents 1
```

#### 2. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.yaml
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector
```

#### 3. Export the kubeconfig

```bash
# Export kubeconfig and replace the internal IP with the VPS public IP
k3d kubeconfig get luckyplans-prod > /tmp/luckyplans-prod.yaml
sed -i 's|0\.0\.0\.0|<your-server-ip>|g' /tmp/luckyplans-prod.yaml

# Verify the server address
grep server /tmp/luckyplans-prod.yaml
# Expected: server: https://<your-server-ip>:6443

# Base64-encode (single line, no wrapping) and print
base64 -w 0 < /tmp/luckyplans-prod.yaml && echo

# Copy the base64 string output — you'll decode it on your local machine
rm /tmp/luckyplans-prod.yaml
```

On your **local machine**, decode the base64 string and save it:

```bash
mkdir -p ~/.kube
echo "<paste-base64-string-here>" | base64 -d > ~/.kube/luckyplans-prod.yaml
chmod 600 ~/.kube/luckyplans-prod.yaml
```

> **macOS note:** Use `base64 -D` instead of `base64 -d` if decoding fails.

Verify connectivity from your local machine:

```bash
kubectl --kubeconfig ~/.kube/luckyplans-prod.yaml get nodes
```

### Part B — Deploy from local machine

All remaining steps run on your **local machine** (where the repo is checked out).

#### 4. Build and push images with a semver tag

```bash
VERSION="1.0.0"

# Authenticate with GitHub Container Registry
docker login ghcr.io -u <your-github-username> -p <your-github-pat>

# Build images (run from repo root)
MSYS_NO_PATHCONV=1 docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="/graphql" \
  -t ghcr.io/<your-github-username>/web:$VERSION \
  -f apps/web/Dockerfile .

docker build -t ghcr.io/<your-github-username>/api-gateway:$VERSION   -f apps/api-gateway/Dockerfile .
docker build -t ghcr.io/<your-github-username>/service-auth:$VERSION  -f apps/service-auth/Dockerfile .
docker build -t ghcr.io/<your-github-username>/service-core:$VERSION  -f apps/service-core/Dockerfile .

# Push all images
docker push ghcr.io/<your-github-username>/web:$VERSION
docker push ghcr.io/<your-github-username>/api-gateway:$VERSION
docker push ghcr.io/<your-github-username>/service-auth:$VERSION
docker push ghcr.io/<your-github-username>/service-core:$VERSION
```

#### 5. Deploy with Helm

Run this from your local machine. The `--kubeconfig` flag tells Helm to target
the remote prod cluster:

```bash
OWNER="<your-github-username>"
VERSION="1.0.0"

helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --kubeconfig ~/.kube/luckyplans-prod.yaml \
  -f infrastructure/helm/luckyplans/values.yaml \
  -f infrastructure/helm/luckyplans/values.prod.yaml \
  --set image.registry=ghcr.io \
  --set "apiGateway.image.repository=$OWNER/api-gateway" \
  --set "apiGateway.image.tag=$VERSION" \
  --set "serviceAuth.image.repository=$OWNER/service-auth" \
  --set "serviceAuth.image.tag=$VERSION" \
  --set "serviceCore.image.repository=$OWNER/service-core" \
  --set "serviceCore.image.tag=$VERSION" \
  --set "web.image.repository=$OWNER/web" \
  --set "web.image.tag=$VERSION" \
  --namespace luckyplans --create-namespace \
  --rollback-on-failure --timeout 5m
```

> **Note:** Passing image tags via `--set` avoids manually editing
> `values.prod.yaml` for each release. The values file keeps sensible defaults;
> the deploy command overrides them.

On first deploy, cert-manager will automatically provision a TLS certificate
for `luckyplans.xyz` and store it in the `luckyplans-tls` Secret.

#### 6. Verify

```bash
# Check all pods are Running
kubectl --kubeconfig ~/.kube/luckyplans-prod.yaml -n luckyplans get pods

# Check certificate status
kubectl --kubeconfig ~/.kube/luckyplans-prod.yaml -n luckyplans get certificate

# Test endpoints
curl -s https://luckyplans.xyz/health
curl -s https://luckyplans.xyz/ | head -20

# Test GraphQL
curl -s https://luckyplans.xyz/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
```

> **Tip:** To avoid passing `--kubeconfig` every time, set the environment variable:
> ```bash
> export KUBECONFIG=~/.kube/luckyplans-prod.yaml
> ```

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

# Test the GraphQL health endpoint (use your environment's URL)
# Local:   http://localhost/graphql
# Dev:     https://dev.luckyplans.xyz/graphql
# Prod:    https://luckyplans.xyz/graphql
curl -s http://localhost/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ health }"}' | jq .
# Expected: {"data":{"health":"API Gateway is running"}}
```

---

## Updating Configuration

All config lives in the values files. To change env vars, edit the relevant values file and re-run `helm upgrade`:

```bash
# Local:
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans

# Dev:
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.dev.yaml

# Prod:
helm upgrade luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.prod.yaml
```

> **Warning:** Do not use `--reuse-values`. It merges the previous release's values
> with the new chart, which silently preserves stale defaults when the chart changes.
> Always pass the full set of `-f` values files explicitly.

Helm automatically triggers rolling restarts of affected deployments.

> **Note on `NEXT_PUBLIC_GRAPHQL_URL`**: This is baked into the Next.js bundle at image build time — changing `web.buildArgs.graphqlUrl` in a values file only takes effect after rebuilding the web image. See [architecture/helm-deployment.md](../architecture/helm-deployment.md).

---

## Adding Secrets

Secrets are rendered into a Kubernetes `Secret` (type `Opaque`) and injected into all service containers via `secretRef`. Plain string values are used — Kubernetes handles base64 encoding automatically.

### Auto-generated secrets

**`JWT_SECRET`** is automatically generated by the Helm chart on first install
(64 random alphanumeric characters) and reused across upgrades. No manual
configuration is needed — each cluster gets its own unique secret.

### Manual secrets

**Never commit real secrets to values files or version control.** Pass them via `--set` flags at deploy time from environment variables:

```bash
# Set secrets as environment variables (e.g. from a password manager or CI secret store)
export DB_PASSWORD="your-password-here"

# Pass them to Helm at deploy time
helm upgrade --install luckyplans infrastructure/helm/luckyplans \
  --namespace luckyplans \
  -f infrastructure/helm/luckyplans/values.prod.yaml \
  --set secrets.DB_PASSWORD="$DB_PASSWORD"
```

For production, prefer an external secrets manager (e.g. Sealed Secrets, External Secrets Operator) to avoid manual `--set` flags entirely.

> **Note:** `DB_PASSWORD` is reserved for future database use. The current
> architecture uses only Redis for inter-service transport. The secret is passed
> through the pipeline to avoid workflow changes when a database is introduced.

### Rotating secrets

#### Rotating `JWT_SECRET`

`JWT_SECRET` is auto-generated by Helm and stored in the `luckyplans-secrets`
Kubernetes Secret. To rotate it:

1. **Delete the existing secret** so Helm generates a new one:
   ```bash
   kubectl -n luckyplans delete secret luckyplans-secrets
   ```
2. **Re-deploy** to regenerate:
   ```bash
   helm upgrade luckyplans infrastructure/helm/luckyplans \
     --namespace luckyplans \
     -f infrastructure/helm/luckyplans/values.prod.yaml
   ```
3. **Verify** the deployment is healthy (all existing JWTs will be invalidated).

#### Rotating `DB_PASSWORD` and other manual secrets

1. **Generate the new secret value** using a cryptographically secure method:
   ```bash
   openssl rand -base64 32
   ```

2. **Update the GitHub Actions secret** in **Settings → Secrets and variables → Actions**.

3. **Re-deploy** via the Deploy & Verify workflow (manual dispatch) to propagate
   the new value. Helm will update the Kubernetes Secret and trigger a rolling
   restart of affected pods.

4. **Verify** the deployment is healthy after rotation (check smoke tests in the
   workflow run).

#### Rotating `KUBECONFIG_DEV` / `KUBECONFIG_PROD`

1. Regenerate the kubeconfig on the VPS (see [Generating KUBECONFIG](#generating-kubeconfig_dev--kubeconfig_prod))
2. Update the GitHub Actions secret
3. Trigger a test deployment to verify connectivity

> **Tip:** Rotate secrets on a regular schedule (e.g. quarterly) and immediately
> after any team member departure or suspected compromise.

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

TLS certificates are managed automatically by **cert-manager + Let's Encrypt**.
Both dev and prod environments use the `letsencrypt-prod` ClusterIssuer with
HTTP-01 challenges. Certificates auto-renew ~30 days before expiry.

| Environment | Domain | Secret | Issuer |
|-------------|--------|--------|--------|
| dev | `dev.luckyplans.xyz` | `luckyplans-dev-tls` | `letsencrypt-prod` |
| prod | `luckyplans.xyz` | `luckyplans-tls` | `letsencrypt-prod` |

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
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
      cpu: "1000m"
```

Consider adding a `ResourceQuota` and `LimitRange` for the `luckyplans`
namespace to prevent any single deployment from consuming all node resources.
This is especially important when dev and prod share the same VPS:

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
