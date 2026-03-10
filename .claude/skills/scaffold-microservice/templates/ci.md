# CI/CD Changes

## Docker Build (`.github/workflows/docker-build.yml`)

Add `service-<name>` to the matrix:

```yaml
strategy:
  matrix:
    service: [web, api-gateway, service-auth, service-core, service-<name>]
```

## Update Tags (`.github/workflows/update-tags.yml`)

Add image tag update for the new service, following the same pattern used for existing services. The workflow uses `yq` to update `infrastructure/helm/luckyplans/values.prod.yaml` with new image tags after a successful Docker build.
