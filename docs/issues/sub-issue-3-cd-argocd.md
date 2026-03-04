# [Chore]: Implement CD with ArgoCD

**Parent Issue:** [Chore]: Setup Monorepo Foundation (Frontend + Backend Microservices)
**Labels:** `enhancement`, `priority:medium`
**Depends on:** Sub-Issue #1 (Microservice Architecture + k3s/Helm), Sub-Issue #2 (CI with GitHub Actions)

## Description

Implement Continuous Deployment (CD) using ArgoCD following a GitOps workflow. ArgoCD will watch the repository for changes to Helm charts and values, then automatically synchronize deployments to the target Kubernetes clusters.

## Motivation

- **GitOps as source of truth** — the desired state of every environment lives in Git
- **Automated deployments** — eliminate manual `helm upgrade` commands
- **Drift detection** — ArgoCD detects and corrects configuration drift
- **Auditability** — every deployment is traceable to a Git commit
- **Rollback** — revert to any previous state by reverting a Git commit
- Separates CI (build/test) from CD (deploy), keeping concerns clean

## Proposed Solution

### 1. ArgoCD Installation

- Install ArgoCD into the k3s cluster (local dev) via Helm
- Expose ArgoCD UI via Ingress at `/argocd`
- For remote clusters (Dev/Prod), install ArgoCD via Helm with production-grade configuration

```
/infrastructure
  /argocd
    /install
      values-local.yaml
      values-dev.yaml
      values-prod.yaml
    /apps
      app-web.yaml
      app-api-gateway.yaml
      app-service-auth.yaml
      app-service-core.yaml
      app-of-apps.yaml
```

### 2. GitOps Repository Structure

Use the **same repository** (monorepo) with ArgoCD watching the `/infrastructure/helm` path.

```
ArgoCD watches:
  /infrastructure/helm/charts/*      (Helm chart templates)
  /infrastructure/helm/values/*      (Environment-specific values)
```

#### Sync Flow

```
Developer pushes code
       │
       ▼
CI builds & pushes Docker image (ghcr.io/org/service:abc123)
       │
       ▼
CI updates image tag in values file (e.g., values/dev.yaml)
       │
       ▼
ArgoCD detects change in Git
       │
       ▼
ArgoCD syncs Helm release to target cluster
       │
       ▼
Deployment rolls out with new image
```

### 3. ArgoCD Application Definitions

Each service gets an ArgoCD `Application` resource:

```yaml
# Example: app-web.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/<org>/<repo>.git
    targetRevision: main
    path: infrastructure/helm/charts/web
    helm:
      valueFiles:
        - ../../values/dev.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 4. App of Apps Pattern

Use the **App of Apps** pattern to manage all services from a single root application:

- `app-of-apps.yaml` deploys all individual ArgoCD Applications
- Adding a new service = adding a new Application YAML
- Single entry point for cluster bootstrapping

### 5. Environment Strategy

| Environment | Sync Policy       | Image Update         | Approval     |
| ----------- | ----------------- | -------------------- | ------------ |
| Local       | Auto (self-heal)  | Manual / local build | None         |
| Dev         | Auto (self-heal)  | CI updates values    | None         |
| Prod        | Manual sync       | CI updates values    | Manual in UI |

#### Prod Safeguards

- **Manual sync required** — no auto-deploy to production
- **Sync windows** — optional deployment time restrictions
- **Diff preview** — review changes in ArgoCD UI before syncing
- **Rollback** — one-click rollback in ArgoCD UI or `git revert`

### 6. Image Tag Update Strategy

After CI builds and pushes a Docker image, the image tag in the Helm values file must be updated. Two approaches:

| Approach                   | How                                                        |
| -------------------------- | ---------------------------------------------------------- |
| **CI commit** (recommended)| CI job updates `values/dev.yaml` with new tag, commits     |
| **ArgoCD Image Updater**   | ArgoCD plugin watches registry for new tags automatically  |

Start with the **CI commit** approach for simplicity and auditability.

### 7. Notifications (Optional)

- Configure ArgoCD notifications to send sync status to:
  - Slack channel
  - GitHub commit status
- Helps team track deployment events without opening ArgoCD UI

## Scope

### In Scope

- ArgoCD installation via Helm (local k3s + remote clusters)
- ArgoCD Ingress configuration
- Application manifests for all services
- App of Apps pattern
- Automated sync for Dev environment
- Manual sync for Prod environment
- Image tag update mechanism in CI pipeline
- ArgoCD RBAC basic setup
- Documentation for ArgoCD workflow

### Out of Scope

- ArgoCD SSO / OIDC integration
- Multi-cluster management (beyond Dev/Prod)
- ArgoCD Rollouts (canary, blue-green) — separate issue
- Sealed Secrets / External Secrets Operator
- Observability integration (Prometheus metrics from ArgoCD)

## Technical Considerations

- ArgoCD must have read access to the Git repository
- Use ArgoCD projects to isolate environments if sharing a single ArgoCD instance
- Helm value files should use image tag variables, not hardcoded tags
- CI pipeline must not trigger ArgoCD sync loops (use `[skip ci]` on auto-commits if needed)
- Use `syncPolicy.retry` for transient failures
- ArgoCD health checks must align with Helm chart health probes
- Keep ArgoCD version pinned and managed via Helm values

## Acceptance Criteria

- [ ] ArgoCD installed and accessible in local k3s cluster
- [ ] ArgoCD UI reachable via Ingress at `/argocd`
- [ ] Application manifests created for all services (web, api-gateway, service-auth, service-core)
- [ ] App of Apps pattern deployed and manages all applications
- [ ] Dev environment auto-syncs when values change in Git
- [ ] Prod environment requires manual sync
- [ ] CI pipeline updates image tags in values files after Docker push
- [ ] ArgoCD detects Git changes and syncs within 3 minutes
- [ ] Deployments roll out successfully with new images
- [ ] Rollback works (revert Git commit → ArgoCD syncs previous state)
- [ ] ArgoCD RBAC configured (admin vs read-only)
- [ ] Documentation covers ArgoCD workflow, sync policies, and rollback procedure
- [ ] No sync errors or degraded applications

## Definition of Done

- ArgoCD operational in local and target clusters
- GitOps workflow validated end-to-end (commit → CI → image push → tag update → ArgoCD sync → deployment)
- Dev auto-deploys, Prod requires approval
- Rollback procedure documented and tested
- Documentation reviewed and merged
