# CI/CD Changes

## Docker Build (`.github/workflows/docker-build.yml`)

Add `service-<name>` to `strategy.matrix.include`:

```yaml
strategy:
  matrix:
    include:
      - service: service-<name>
        dockerfile: apps/service-<name>/Dockerfile
```

## Update Tags (`.github/workflows/update-tags.yml`)

Add image tag update for the new service in the `Update image tags in values files` step.

Example:

```bash
yq -i ".service<PascalName>.image.tag = \"$TAG\"" "infrastructure/helm/luckyplans/values.prod.yaml"
```

