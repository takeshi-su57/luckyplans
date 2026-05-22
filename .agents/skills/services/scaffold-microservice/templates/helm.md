# Helm Template

## Deployment manifest

Create `infrastructure/helm/luckyplans/templates/service-<name>/deployment.yaml`.

Copy from `infrastructure/helm/luckyplans/templates/service-core/deployment.yaml` and replace:

| Find | Replace with |
|------|-------------|
| `service-core` (component name) | `service-<name>` |
| `.Values.serviceCore` | `.Values.service<PascalName>` |

Key points:
- No HTTP port - microservices communicate via Redis transport only
- Uses `envFrom` with shared ConfigMap and Secrets
- Non-root user (UID 1001)
- Liveness probe via `node -e "process.exit(0)"` (no HTTP health endpoint)

## Values entry

Add to `infrastructure/helm/luckyplans/values.yaml`:

```yaml
# ============================================================
# service-<name> (Redis transport microservice - no HTTP port)
# ============================================================
service<PascalName>:
  image:
    repository: luckyplans/service-<name>
    tag: latest
  replicas: 1
  resources:
    requests:
      memory: '128Mi'
      cpu: '100m'
    limits:
      memory: '256Mi'
      cpu: '200m'
  probes:
    liveness:
      initialDelaySeconds: 15
      periodSeconds: 20
      failureThreshold: 3
```

## ArgoCD

Add or update the ArgoCD application manifest used by this repository so `service-<name>` deploys with the Helm release in the target environment(s). In this repo, check `infrastructure/argocd/apps/*.yaml` (for example `infrastructure/argocd/apps/luckyplans-prod.yaml`).

Minimum check:
- The relevant ArgoCD app path references the updated Helm chart/values.
- Sync policy and destination namespace remain consistent with existing services.

