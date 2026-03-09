# ArgoCD — GitOps Continuous Delivery

## Overview

LuckyPlans uses ArgoCD for pull-based GitOps continuous delivery. ArgoCD watches the Git repository for changes to Helm values files and automatically synchronizes deployments to the target Kubernetes clusters.

## GitOps Flow

```
Developer pushes code to main
       │
       ▼
CI workflow (lint, test, build)
       │
       ▼
Docker Build & Push (ghcr.io/takeshi-su57/<service>:sha-<hash>)
       │
       ▼
Update Tags workflow commits new image tags to values files [skip ci]
       │
       ▼
ArgoCD detects change in Git → auto-syncs
       │
       ▼
Post-sync hook runs smoke tests (health, web, GraphQL)
```

## Architecture

### Components

| Component            | Location                                                       | Purpose                                      |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| ArgoCD Helm values   | `infrastructure/argocd/values-base.yaml`, `values-prod.yaml`   | ArgoCD server configuration                  |
| Application manifest | `infrastructure/argocd/apps/luckyplans-prod.yaml`              | ArgoCD Application resource for prod         |
| Install script       | `infrastructure/scripts/install-argocd.sh`                     | One-time ArgoCD installation on prod cluster |
| Smoke test hook      | `infrastructure/helm/luckyplans/templates/smoke-test-job.yaml` | Post-sync verification                       |
| Tag update workflow  | `.github/workflows/update-tags.yml`                            | CI commits image tags to values files        |

### Environment Strategy

ArgoCD is used **only for prod**. Local development uses direct Helm (`pnpm deploy:local`).

| Environment | CD Method          | Image Update        | Approval  |
| ----------- | ------------------ | ------------------- | --------- |
| Local       | Direct Helm        | Manual (k3d import) | None      |
| Prod        | ArgoCD (auto-sync) | CI updates values   | Automatic |

## Installation

### Prerequisites

- k3d cluster running with Traefik ingress
- Helm 3.x installed
- kubectl configured for the target cluster
- GitHub personal access token (PAT) with repo read access
- **CD push token (required with branch protection):** If branch protection is
  enabled on `main`, create a fine-grained PAT with **Contents: read+write** scope
  and store it as the `CD_PUSH_TOKEN` repository secret. The `update-tags` workflow
  uses this to push tag commits directly to `main`. Without it, the CD pipeline
  silently breaks after Docker builds complete.

### Install ArgoCD

```bash
./infrastructure/scripts/install-argocd.sh --github-token ghp_xxx
```

The script:

1. Adds the ArgoCD Helm repo
2. Installs ArgoCD into the `argocd` namespace with base + prod values
3. Waits for ArgoCD server, repo server, and application controller to be ready
4. Prints the initial admin password
5. Applies the Traefik HTTPS redirect middleware for the ArgoCD UI
6. Applies the `luckyplans-prod` Application manifest
7. Prints the ArgoCD UI access URL

## Accessing ArgoCD UI

URL: **https://luckyplans.xyz/argocd**

**Initial login:**

- Username: `admin`
- Password: retrieve with:
  ```bash
  kubectl -n argocd get secret argocd-initial-admin-secret \
    -o jsonpath='{.data.password}' | base64 -d
  ```

## Operations

### Check Sync Status

In ArgoCD UI, the Application tile shows sync status (Synced/OutOfSync) and health (Healthy/Degraded/Progressing).

Via CLI:

```bash
# Install ArgoCD CLI (optional)
# https://argo-cd.readthedocs.io/en/stable/cli_installation/

argocd app get luckyplans-prod --server <argocd-url> --grpc-web
```

### Prod Auto-Sync

Prod auto-syncs automatically. After CI updates image tags, ArgoCD detects the
Git change and syncs within its polling interval (default ~3 minutes). Monitor
sync progress in the ArgoCD UI → `luckyplans-prod` application.

### Rollback

**Option 1: Git revert** (recommended)

```bash
# Find the tag update commit
git log --oneline -5

# Revert it
git revert <commit-sha>
git push origin main
```

ArgoCD will detect the revert and sync back to the previous image tags.

**Option 2: ArgoCD UI rollback** (temporary)

1. Open the Application in ArgoCD UI
2. Click **History and Rollback**
3. Select a previous revision
4. Click **Rollback**

> **Warning:** With auto-sync enabled, UI rollbacks are reverted almost immediately.
> Use git revert for permanent rollbacks.

### Smoke Tests

Smoke tests run automatically as ArgoCD post-sync hooks. They verify:

1. API Gateway health (`/health` returns `{"status":"ok"}`)
2. Web frontend (HTTP 200 on `/`)
3. GraphQL endpoint (`{ health }` query returns expected response)

If smoke tests fail, the sync is marked as **Degraded** in ArgoCD UI. Check the Job logs:

```bash
kubectl -n luckyplans logs job/smoke-test
```

## Secret Management

Secrets (JWT_SECRET, DB_PASSWORD) are **not stored in Git**. They use Helm's `lookup` function to preserve existing values from the cluster across ArgoCD syncs.

**First-time setup** (before first ArgoCD sync):

```bash
kubectl -n luckyplans create secret generic luckyplans-secrets \
  --from-literal=JWT_SECRET="$(openssl rand -base64 48)" \
  --from-literal=DB_PASSWORD="your-db-password"
```

After creation, ArgoCD's Helm rendering will detect the existing secret via `lookup` and preserve the values.

## Troubleshooting

### Application stuck in "Progressing"

- Check pod status: `kubectl -n luckyplans get pods`
- Check pod events: `kubectl -n luckyplans describe pod <pod-name>`
- Common cause: image pull errors (wrong tag or registry auth)

### Application shows "OutOfSync" after sync

- Helm's `lookup` function does not work in ArgoCD's repo server (no cluster access), so the Secret template always renders a new random `JWT_SECRET`
- This is handled by `ignoreDifferences` + `RespectIgnoreDifferences=true` in the Application manifests, which tells ArgoCD to skip diffing the Secret resource
- If the Secret still shows as OutOfSync, verify the Application has `ignoreDifferences` configured for the `luckyplans-secrets` Secret

### Smoke test Job failed

- View logs: `kubectl -n luckyplans logs job/smoke-test`
- The Job is recreated on each sync (`BeforeHookCreation` delete policy)

### CI tag update commit conflicts

- The `update-tags` workflow uses a concurrency group to prevent races
- If a conflict occurs, re-run the workflow manually

### ArgoCD cannot access Git repository

- Verify the GitHub token is valid and has repo read access
- Check ArgoCD repo credentials: ArgoCD UI → Settings → Repositories

### `update-tags` workflow fails to push to main

- The `Update Image Tags` workflow pushes directly to `main`
- If branch protection rules require PR reviews or status checks, `GITHUB_TOKEN` cannot bypass them and the push is rejected — the CD pipeline breaks silently
- **Fix (recommended):** Create a fine-grained PAT with **Contents: read+write** scope, store it as the `CD_PUSH_TOKEN` repository secret. The workflow already uses `CD_PUSH_TOKEN` with a `GITHUB_TOKEN` fallback
- **Alternative:** In GitHub repo settings → Branches → `main` protection rule, add `github-actions[bot]` to the "Bypass list" for push restrictions (less secure — allows all bot pushes)
