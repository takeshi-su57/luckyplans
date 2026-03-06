# CI/CD Pipeline

Automated pipeline using GitHub Actions for the LuckyPlans monorepo.

## Pipeline Overview

```
  PR / Push to main          Merge to main             After Docker push
  ┌──────────────┐      ┌───────────────────┐      ┌───────────────────┐
  │     CI       │──ok──│  Docker Build     │──ok──│  Deploy & Verify  │
  │              │      │  & Push           │      │                   │
  │ lint         │      │ build 4 images    │      │ Dev  → smoke test │
  │ type-check   │      │ push to ghcr.io   │      │ Prod → approval   │
  │ test         │      │ tag: sha + latest │      │      → smoke test │
  │ build        │      │                   │      │                   │
  └──────────────┘      └───────────────────┘      └───────────────────┘
```

## Workflows

### 1. CI (`.github/workflows/ci.yml`)

**Triggers:** Push to `main`, pull requests to `main`.

Runs lint, type-check, test, and build using Turborepo. On PRs, only affected
packages are checked via `--filter=...[origin/main]`.

Concurrency groups cancel superseded PR runs automatically.

Additionally validates Helm chart templates with `helm template --validate` for
all environment variants (base, dev, prod) to catch Kubernetes schema errors
that `helm lint` alone would miss.

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
`docker/build-push-action`, providing supply chain transparency. Each image
is scanned with Trivy before push — builds fail on CRITICAL/HIGH
vulnerabilities.

### Supply Chain Security (TODO)

Images are currently built with SBOM and provenance attestations, and scanned
with Trivy before push. To further harden the supply chain:

1. **Sign images with cosign** after push in the Docker Build workflow:
   ```yaml
   - name: Sign image
     run: cosign sign --yes "$IMAGE_NAME:sha-$SHORT_SHA"
   ```
2. **Verify signatures at deploy time** in the reusable deploy workflow before
   `helm upgrade`:
   ```yaml
   - name: Verify image signature
     run: cosign verify "$IMAGE_NAME:$IMAGE_TAG"
   ```

This ensures only images built by the CI pipeline can be deployed, even if an
attacker gains write access to the container registry.

### 3. Deploy & Verify (`.github/workflows/deploy-verify.yml` + `deploy-reusable.yml`)

**Triggers:** After Docker build completes, or manual dispatch with image tag and
target environment.

**Dev deployment** runs automatically. **Prod deployment** requires manual
approval via the GitHub Environment protection rule.

**Prod deployment** runs independently of dev (no dependency on dev succeeding)
and can be dispatched on its own via manual workflow dispatch.

> **Trade-off:** Prod independence means a broken change can reach prod without
> being caught in dev first. This is intentional — it allows hotfixes to bypass
> dev and enables manual prod-only deploys. The GitHub Environment protection
> rule (required reviewer) is the safety net instead. If you want dev-first
> gating, add `needs: [deploy-dev]` to the `deploy-prod` job.

The shared deployment logic lives in a **reusable workflow** (`deploy-reusable.yml`)
called by both dev and prod jobs with environment-specific inputs and secrets.

Each deployment:

1. Applies Helm chart with `--atomic` (waits for readiness, auto-rolls back on Helm failure)
2. Runs smoke tests via shared script (`.github/scripts/smoke-test.sh`):
   health endpoint, frontend HTTP 200, GraphQL connectivity, and deployed image tag verification
3. Automatically rolls back via `helm rollback` if smoke tests fail
   (on first deploy, the failed release is uninstalled instead)
4. Verifies rollback health after a rollback occurs
5. Cleans up kubeconfig from the runner filesystem
6. Reports status to the GitHub Actions step summary

> **Tip — initial setup:** When first configuring TLS, use the Let's Encrypt
> staging issuer (`certManager.issuer: letsencrypt-staging`) to avoid hitting
> rate limits. Staging certificates are not trusted by browsers but validate
> that the ACME flow works. Switch to `letsencrypt-prod` once verified.
> See [tls-certificates.md](tls-certificates.md) for details.

> **First deploy TLS delay:** On the very first deployment to a new environment,
> cert-manager needs 1-2 minutes to complete the ACME HTTP-01 challenge and
> provision the TLS certificate. The smoke test script includes a TLS readiness
> pre-check that waits up to 120 seconds before running assertions. If smoke
> tests still fail on first deploy, re-run the Deploy & Verify workflow — the
> certificate will already be provisioned.

## Required GitHub Configuration

### Secrets

| Secret            | Scope | Description                                    |
| ----------------- | ----- | ---------------------------------------------- |
| `KUBECONFIG_DEV`  | Environment (`dev`) | Base64-encoded kubeconfig for the dev cluster  |
| `KUBECONFIG_PROD` | Environment (`prod`) | Base64-encoded kubeconfig for the prod cluster |
| `DB_PASSWORD`     | Environment (each) | Reserved for future database use. Passed to the Helm secrets template but not yet consumed by any service. |

> **Note — `JWT_SECRET` is auto-generated:** The Helm chart automatically
> generates a random 64-character `JWT_SECRET` on first install and reuses it
> across upgrades (via `lookup`). No GitHub Actions secret is needed. Each
> cluster gets its own unique secret, ensuring environment isolation.

> **Important — environment-scoped secrets:** `DB_PASSWORD`
> must be configured as an **environment-scoped secret** (set separately on the
> `dev` and `prod` environments in **Settings → Environments → [env] → Secrets**),
> not as a repository-level secret.

> **Note:** `GITHUB_TOKEN` is provided automatically by GitHub Actions and does
> not need to be created manually. It is used for ghcr.io authentication.

> **Security — secrets visibility in Helm releases:** Secrets passed via
> `--set-string` are stored in the Helm release metadata (in etcd). Anyone with
> `helm get values luckyplans` access can read them in plaintext. For production,
> migrate to an external secrets operator (e.g. [External Secrets Operator](https://external-secrets.io/),
> [Sealed Secrets](https://sealed-secrets.netlify.app/)) that injects secrets
> directly into Kubernetes without exposing them in Helm values.

#### Secrets migration path

The current `--set-string` approach exposes secrets in Helm release metadata.
Migrate to an external secrets operator when moving to production:

1. Install [External Secrets Operator](https://external-secrets.io/) on the cluster
2. Create a `SecretStore` pointing to your secrets backend (e.g. AWS SSM,
   HashiCorp Vault, or GitHub Actions OIDC-federated provider)
3. Create `ExternalSecret` resources that sync into the Kubernetes `Secret`
   the Helm chart already references
4. Remove `--set-string secrets.*` flags from the deploy workflow
5. Secrets are now injected directly into Kubernetes without passing through
   Helm values or CI environment variables

To encode a kubeconfig:

```bash
# Linux
base64 -w 0 < ~/.kube/config

# macOS (BSD base64 does not support -w)
base64 -i ~/.kube/config
```

> **Security:** Use a dedicated service account with RBAC scoped to the `luckyplans` namespace, not a full cluster-admin kubeconfig.

### Environments

Create two environments in **Settings → Environments**:

- **dev** — no protection rules (auto-deploy)
- **prod** — enable "Required reviewers" and add maintainers

### Branch Protection (recommended)

Configure on the `main` branch under **Settings → Branches**:

- [x] Require a pull request before merging
- [x] Require at least 1 approval
- [x] Require status checks to pass (select the `ci` job)
- [x] Do not allow bypassing the above settings

## Helm Chart Versioning

The chart at `infrastructure/helm/luckyplans/Chart.yaml` has a `version` field,
but there is no automated enforcement that it is bumped when chart templates or
values change. This makes it difficult to track which chart version is deployed
and to distinguish image-only deployments from chart-structure changes.

**Recommendation:** Add a CI check that fails if files under
`infrastructure/helm/` have changed but `Chart.yaml` version has not been bumped.
Example using a simple shell check in the CI workflow:

```yaml
- name: Check Helm chart version bump
  if: github.event_name == 'pull_request'
  run: |
    CHART_CHANGED=$(git diff origin/main --name-only -- infrastructure/helm/ | grep -v Chart.yaml || true)
    if [ -z "$CHART_CHANGED" ]; then
      echo "No Helm chart files changed — skipping version check"
      exit 0
    fi
    OLD_VERSION=$(git show origin/main:infrastructure/helm/luckyplans/Chart.yaml | grep '^version:' | awk '{print $2}')
    NEW_VERSION=$(grep '^version:' infrastructure/helm/luckyplans/Chart.yaml | awk '{print $2}')
    if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
      echo "ERROR: Helm chart files changed but Chart.yaml version was not bumped (still $OLD_VERSION)"
      exit 1
    fi
    echo "Chart version bumped: $OLD_VERSION → $NEW_VERSION"
```

## Turborepo Caching

The CI workflow caches Turborepo artifacts in `.turbo/` using `actions/cache`.
On PRs, the `--filter=...[origin/main]` flag limits execution to packages
affected by the changes, significantly reducing CI time.

The cache key includes the OS and lockfile hash, with a restore fallback to the
most recent cache for the same OS.

## Manual Deployment

To deploy a specific image tag to an environment:

1. Go to **Actions → Deploy & Verify → Run workflow**
2. Enter the image tag (e.g. `sha-abc1234`)
3. Select the target environment (`dev`, `prod`, or `both`)
4. Click **Run workflow**

For prod, you will receive an approval prompt before deployment proceeds.

## Notifications (TODO)

The pipeline currently reports results to the GitHub Actions step summary but
does not send external notifications. For production, add failure alerts so the
team is notified immediately when deployments fail or rollbacks occur.

**Option A — Slack via GitHub Action:**

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v2
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
    webhook-type: incoming-webhook
    payload: |
      { "text": "Deployment to ${{ inputs.environment }} FAILED for tag ${{ inputs.image-tag }}" }
```

**Option B — GitHub native notifications:**

Enable "Required status checks" on the `main` branch and subscribe to workflow
failure notifications in **Settings → Notifications**. This provides email
alerts without additional secrets or integrations.

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

### Deployment fails with Helm timeout

The workflow's rollback step automatically reverts on failure. On the very first
deployment (no previous revision), the failed release is uninstalled instead. Check:

```bash
kubectl -n luckyplans get pods
kubectl -n luckyplans describe pod <pod-name>
kubectl -n luckyplans logs <pod-name>
```

### Improving smoke test coverage

The current smoke tests verify the API Gateway health endpoint, web frontend,
and GraphQL connectivity. They do **not** verify that downstream microservices
(service-auth, service-core) are connected via Redis. Consider adding:

- A `/ready` endpoint on the API Gateway that checks Redis connectivity and
  confirms all expected microservices have registered their message handlers
- Including this check in `smoke-test.sh` to catch partial-deployment failures
  where the gateway is healthy but microservices are unreachable

### Smoke tests fail

Health endpoints may take time to become available. The tests retry 5 times
with 10-second intervals. If they still fail, check:

- Pod readiness probes (`kubectl -n luckyplans get pods`)
- Ingress routing (`kubectl -n luckyplans get ingress`)
- Service endpoints (`kubectl -n luckyplans get endpoints`)
