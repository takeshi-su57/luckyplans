# [Chore]: Implement CI with GitHub Actions + Verify Dev/Prod Deployment

**Parent Issue:** [Chore]: Setup Monorepo Foundation (Frontend + Backend Microservices)
**Labels:** `enhancement`, `priority:high`
**Depends on:** Sub-Issue #1 (Microservice Architecture + k3s/Helm)

## Description

Implement a Continuous Integration (CI) pipeline using GitHub Actions. The pipeline should validate code quality, run tests, build Docker images, push them to a container registry, and verify deployments to Dev and Prod environments.

## Motivation

- Automate quality gates (lint, type-check, test) to catch issues early
- Ensure Docker images build correctly on every PR
- Validate that deployments succeed in Dev and Prod environments
- Leverage Turborepo's caching to speed up CI runs
- Establish a reliable pipeline before adding CD automation (Sub-Issue #3)

## Proposed Solution

### 1. GitHub Actions Workflow Structure

```
/.github
  /workflows
    ci.yml              (Main CI: lint, type-check, test, build)
    docker-build.yml    (Build & push Docker images)
    deploy-verify.yml   (Deploy to Dev/Prod and verify)
```

### 2. CI Pipeline (`ci.yml`)

Triggered on: `push` to `main`, `pull_request` to `main`

#### Steps

```
┌─────────────────────────────────────────────────┐
│  Checkout + Setup (Node, pnpm, Turbo cache)     │
├─────────────────────────────────────────────────┤
│  Install dependencies (pnpm install --frozen)   │
├─────────────────────────────────────────────────┤
│  Lint          (turbo run lint)                  │
│  Type-check    (turbo run type-check)            │
│  Test          (turbo run test)        [parallel]│
├─────────────────────────────────────────────────┤
│  Build         (turbo run build)                 │
├─────────────────────────────────────────────────┤
│  Affected filter — only run on changed packages  │
└─────────────────────────────────────────────────┘
```

#### Key Features

- **Turborepo Remote Caching** — cache build artifacts in GitHub Actions cache or Vercel Remote Cache
- **Affected-only runs** — use `turbo run build --filter=...[origin/main]` to only build changed packages
- **Matrix strategy** — run lint, type-check, and test jobs in parallel
- **Fail fast** — stop pipeline on first failure

### 3. Docker Build & Push (`docker-build.yml`)

Triggered on: `push` to `main` (after CI passes)

#### Steps

```
┌───────────────────────────────────────────────┐
│  Checkout + Setup Docker Buildx               │
├───────────────────────────────────────────────┤
│  Authenticate to Container Registry           │
│  (GitHub Container Registry — ghcr.io)        │
├───────────────────────────────────────────────┤
│  Build Docker images per service (parallel)   │
│  - web                                        │
│  - api-gateway                                │
│  - service-auth                               │
│  - service-core                               │
├───────────────────────────────────────────────┤
│  Tag with git SHA + "latest"                  │
├───────────────────────────────────────────────┤
│  Push to ghcr.io                              │
└───────────────────────────────────────────────┘
```

#### Key Features

- **Docker layer caching** via `docker/build-push-action` with GitHub Actions cache
- **Multi-platform builds** (linux/amd64, linux/arm64) if needed
- **Image scanning** (optional: Trivy or Snyk for vulnerability detection)

### 4. Deployment Verification (`deploy-verify.yml`)

Triggered on: manual dispatch (`workflow_dispatch`) or after Docker push

#### Dev Environment

```
┌───────────────────────────────────────────────┐
│  Connect to Dev cluster (kubeconfig secret)   │
├───────────────────────────────────────────────┤
│  helm upgrade --install (Dev values)          │
├───────────────────────────────────────────────┤
│  Wait for rollout (kubectl rollout status)    │
├───────────────────────────────────────────────┤
│  Smoke test (curl health endpoints)           │
├───────────────────────────────────────────────┤
│  Report status                                │
└───────────────────────────────────────────────┘
```

#### Prod Environment

```
┌───────────────────────────────────────────────┐
│  Require manual approval (environment gate)   │
├───────────────────────────────────────────────┤
│  Connect to Prod cluster (kubeconfig secret)  │
├───────────────────────────────────────────────┤
│  helm upgrade --install (Prod values)         │
├───────────────────────────────────────────────┤
│  Wait for rollout (kubectl rollout status)    │
├───────────────────────────────────────────────┤
│  Smoke test (curl health endpoints)           │
├───────────────────────────────────────────────┤
│  Report status                                │
└───────────────────────────────────────────────┘
```

### 5. GitHub Repository Configuration

- **Branch protection rules** on `main`:
  - Require CI to pass before merge
  - Require at least 1 review
  - No direct pushes
- **GitHub Environments**: `dev` and `prod`
  - `prod` requires manual approval
- **Secrets**:
  - `KUBECONFIG_DEV` / `KUBECONFIG_PROD`
  - `GHCR_TOKEN` (or use default `GITHUB_TOKEN`)

## Scope

### In Scope

- GitHub Actions workflow files
- CI pipeline: lint, type-check, test, build
- Docker image build and push to ghcr.io
- Dev deployment + smoke test verification
- Prod deployment (with manual approval gate) + smoke test verification
- Branch protection rule recommendations
- GitHub Environments setup documentation
- Turborepo remote caching configuration

### Out of Scope

- ArgoCD setup (see Sub-Issue #3)
- Observability and alerting
- Production cloud infrastructure provisioning
- Performance/load testing
- Secret management tooling (Vault, Sealed Secrets)

## Technical Considerations

- Use `pnpm install --frozen-lockfile` to ensure reproducible installs
- Pin GitHub Actions versions to SHA for supply-chain security
- Use `concurrency` groups to cancel superseded runs
- Keep workflow files DRY with reusable workflows or composite actions
- Store Docker image tags as outputs for downstream jobs
- Health check endpoints (`/healthz`) must exist in all services
- Use `kubectl wait` with timeouts to avoid hanging jobs

## Acceptance Criteria

- [ ] `ci.yml` runs lint, type-check, test, and build on every PR
- [ ] CI leverages Turborepo caching (affected-only, remote cache)
- [ ] `docker-build.yml` builds and pushes images for all services to ghcr.io
- [ ] Images are tagged with git SHA
- [ ] `deploy-verify.yml` deploys to Dev environment and passes smoke tests
- [ ] `deploy-verify.yml` deploys to Prod with manual approval gate
- [ ] Prod smoke tests pass after deployment
- [ ] Branch protection configured on `main`
- [ ] GitHub Environments (`dev`, `prod`) created with appropriate rules
- [ ] Pipeline documentation added to `README.md` or `docs/ci.md`
- [ ] No flaky or failing CI steps

## Definition of Done

- All three workflow files committed and functional
- CI blocks merge on failure
- Docker images build and push on merge to main
- Dev deployment verified via smoke test
- Prod deployment verified via smoke test (with approval)
- Documentation reviewed and merged
