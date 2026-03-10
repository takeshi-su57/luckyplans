# CI/CD Pipeline

Automated pipeline using GitHub Actions + ArgoCD for the LuckyPlans monorepo.

## Pipeline Overview

```
  PR / Push to main          Merge to main             After Docker push
  ┌──────────────┐      ┌───────────────────┐      ┌───────────────────┐
  │     CI       │──ok──│  Docker Build     │──ok──│  Update Tags      │
  │              │      │  & Push           │      │                   │
  │ lint         │      │ build 4 images    │      │ commit new tags   │
  │ type-check   │      │ push to ghcr.io   │      │ to values files   │
  │ test         │      │ tag: sha + latest │      │ [skip ci]         │
  │ build        │      │ Trivy image scan  │      │                   │
  │ Trivy scans  │      │                   │      │                   │
  │ Helm lint    │      │                   │      │                   │
  └──────────────┘      └───────────────────┘      └───────────────────┘
                                                            │
                                                            ▼
                                                   ArgoCD detects change
                                                   └── Prod: auto-sync
```

## Workflows

### 1. CI (`.github/workflows/ci.yml`)

**Triggers:** Push to `main` (excluding values file changes), pull requests to `main`.

Runs lint, type-check, test, and build using Turborepo. On PRs, only affected
packages are checked via `--filter=...[origin/main]`.

Concurrency groups cancel superseded PR runs automatically.

**Security scanning** is integrated into CI via [Trivy](https://trivy.dev/):

- **Dependency scan** (`fs` mode): Scans `pnpm-lock.yaml` and other dependency
  manifests for known CRITICAL/HIGH vulnerabilities. Fails the build if found.
- **IaC/Dockerfile config scan** (`config` mode): Checks Dockerfiles, Helm
  templates, and Kubernetes manifests for misconfigurations (e.g. missing
  `readOnlyRootFilesystem`, running as root). Fails on CRITICAL/HIGH.
- **SARIF upload**: A vulnerability report is uploaded to GitHub Security tab
  (Advanced Security → Code Scanning) for persistent tracking.

Additionally validates Helm chart templates by piping `helm template` output
through `kubeconform` for all environment variants (base, prod) to catch
Kubernetes schema errors that `helm lint` alone would miss.

> **Note:** `ci.yml` has `paths-ignore` for `values.prod.yaml`
> to prevent CI from re-triggering when the Update Tags workflow commits image
> tag changes.

### 2. Docker Build & Push (`.github/workflows/docker-build.yml`)

**Triggers:** After CI passes on `main`, or manual dispatch.

Builds Docker images for all four services in parallel via a matrix strategy:

| Service      | Dockerfile                     | Image                          |
| ------------ | ------------------------------ | ------------------------------ |
| web          | `apps/web/Dockerfile`          | `ghcr.io/<owner>/web`          |
| api-gateway  | `apps/api-gateway/Dockerfile`  | `ghcr.io/<owner>/api-gateway`  |
| service-auth | `apps/service-auth/Dockerfile` | `ghcr.io/<owner>/service-auth` |
| service-core | `apps/service-core/Dockerfile` | `ghcr.io/<owner>/service-core` |

Images are tagged with:

- `sha-<7-char-commit-sha>` — immutable, used for deployments
- `latest` — convenience pointer to the most recent build

Docker layer caching uses the GitHub Actions cache backend (`type=gha`).
Concurrency is set to `cancel-in-progress: false` to prevent partial image
pushes — if two pushes to `main` happen in quick succession, the first build
completes before the second starts, ensuring all 4 images share the same SHA tag.

Images are pushed with **SBOM** and **provenance** attestations enabled via
`docker/build-push-action`, providing supply chain transparency.

**Post-push security scanning:** Each image is scanned with
[Trivy](https://trivy.dev/) after push. Builds fail on CRITICAL/HIGH
vulnerabilities, which prevents the Update Tags workflow from triggering
(it requires `conclusion == 'success'`), so vulnerable images are never
deployed. A SARIF report is also uploaded to GitHub Security for each image.

### 3. Update Image Tags (`.github/workflows/update-tags.yml`)

**Triggers:** After Docker build completes on `main`, or manual dispatch with a
specific image tag.

This workflow replaces the previous push-based `deploy-verify.yml` and
`deploy-reusable.yml` workflows (decommissioned as part of the ArgoCD migration).

The workflow:

1. Computes the image tag (`sha-<7char>` from the triggering commit)
2. Uses `yq` to update all 4 service image tags in `values.prod.yaml`
3. Commits with `[skip ci]` to prevent re-triggering CI
4. Pushes to `main`

ArgoCD then detects the change:

- **Prod:** ArgoCD auto-syncs the new image tags to the cluster

A concurrency group (`update-tags`) prevents race conditions between concurrent
tag update runs.

### 4. ArgoCD Sync & Post-Sync Hooks

ArgoCD is not a GitHub Actions workflow but the final stage of the CD pipeline.
See [argocd.md](argocd.md) for full operational documentation.

After ArgoCD syncs the Helm chart, **post-sync hooks** run as Kubernetes Jobs:

- **Smoke tests** verify API Gateway health, web frontend, and GraphQL endpoint
  via in-cluster service DNS
- Job results are visible in the ArgoCD UI (sync status: Healthy or Degraded)
- Failed smoke tests mark the sync as Degraded but do not auto-rollback
  (use `git revert` or ArgoCD UI rollback)

> **Tip — initial setup:** When first configuring TLS, use the Let's Encrypt
> staging issuer (`certManager.issuer: letsencrypt-staging`) to avoid hitting
> rate limits. Staging certificates are not trusted by browsers but validate
> that the ACME flow works. Switch to `letsencrypt-prod` once verified.
> See [tls-certificates.md](tls-certificates.md) for details.

> **First deploy TLS delay:** On the very first deployment to a new environment,
> cert-manager needs 1-2 minutes to complete the ACME HTTP-01 challenge and
> provision the TLS certificate. The post-sync smoke test retries 5 times with
> 10-second intervals, which usually covers this delay.

## Required GitHub Configuration

### Secrets

| Secret          | Scope      | Description                                                                                                                                                                              |
| --------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`  | Automatic  | Provided by GitHub Actions. Used for ghcr.io auth.                                                                                                                                       |
| `CD_PUSH_TOKEN` | Repository | **Required with branch protection.** Fine-grained PAT with Contents: read+write scope. Used by `update-tags.yml` to push tag commits to `main`. Falls back to `GITHUB_TOKEN` if not set. |

> **Note — no kubeconfig secrets needed:** ArgoCD runs in-cluster and manages
> deployments directly. The previous `KUBECONFIG_DEV` and `KUBECONFIG_PROD`
> secrets are no longer required.

> **Note — `JWT_SECRET` and `DB_PASSWORD` are cluster-managed:** These secrets
> are created directly in the Kubernetes cluster (not in GitHub Actions) and
> preserved across ArgoCD syncs via Helm's `lookup` function. See
> [deployment.md — Adding Secrets](../guides/deployment.md#adding-secrets).

> **Note — ArgoCD repo access:** ArgoCD needs a GitHub token to read the
> repository. This is configured during ArgoCD installation via
> `install-argocd.sh --github-token <token>`, not as a GitHub Actions secret.

### Environments

GitHub Environments are no longer used for deployment approval (ArgoCD handles
this via auto-sync). However, you may keep them for organizational purposes.

### Branch Protection (recommended)

Configure on the `main` branch under **Settings → Branches**:

- [x] Require a pull request before merging
- [x] Require at least 1 approval
- [x] Require status checks to pass (select the `ci` job)
- [x] Do not allow bypassing the above settings

> **Important:** With branch protection enabled, `GITHUB_TOKEN` cannot push
> tag update commits to `main`. You **must** create a `CD_PUSH_TOKEN` secret
> (fine-grained PAT with Contents: read+write scope) so the `update-tags`
> workflow can bypass protection rules. See
> [ArgoCD troubleshooting](argocd.md#update-tags-workflow-fails-to-push-to-main).

## Turborepo Caching

The CI workflow caches Turborepo artifacts in `.turbo/` using `actions/cache`.
On PRs, the `--filter=...[origin/main]` flag limits execution to packages
affected by the changes, significantly reducing CI time.

The cache key includes the OS and lockfile hash, with a restore fallback to the
most recent cache for the same OS.

## Manual Deployment

To deploy a specific image tag:

1. Go to **Actions → Update Image Tags → Run workflow**
2. Enter the image tag (e.g. `sha-abc1234`)
3. Click **Run workflow**

This commits the tag to `values.prod.yaml`. ArgoCD will auto-sync the new tag.

Alternatively, edit `values.prod.yaml` directly, commit with `[skip ci]`,
and push.

## Troubleshooting

### CI fails on lint/type-check

Check the Turbo output for the specific failing package. Run locally:

```bash
pnpm turbo run lint --filter=<package-name>
pnpm turbo run type-check --filter=<package-name>
```

### Docker build fails

Ensure the Dockerfile's `turbo prune` step matches the package name.
Rebuild locally:

```bash
docker build -f apps/<service>/Dockerfile .
```

### ArgoCD sync fails or shows Degraded

Check the ArgoCD UI for sync error details, then investigate:

```bash
# Check pod status
kubectl -n luckyplans get pods
kubectl -n luckyplans describe pod <pod-name>
kubectl -n luckyplans logs <pod-name>

# Check ArgoCD Application status
kubectl -n argocd get application luckyplans-prod -o yaml
```

Common causes:

- **Image pull errors:** Wrong tag or registry auth issues
- **Resource limits:** Pod OOMKilled — increase memory limits in values file
- **Probe failures:** Service not starting in time — check logs and increase `initialDelaySeconds`

### Smoke tests fail (post-sync hook)

The post-sync smoke test Job runs inside the cluster. Check its logs:

```bash
kubectl -n luckyplans logs job/smoke-test
```

If tests fail, the ArgoCD sync shows as Degraded. The smoke tests retry 5 times
with 10-second intervals. Common causes:

- Pod readiness probes not passing (`kubectl -n luckyplans get pods`)
- Service DNS not resolving (check service exists: `kubectl -n luckyplans get svc`)
- API Gateway not returning expected response (check logs)
