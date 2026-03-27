#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
HELM_CHART="$SCRIPT_DIR/../helm/luckyplans"
HELM_CHART_OBS="$SCRIPT_DIR/../helm/observability"
RELEASE_NAME="luckyplans"
RELEASE_NAME_OBS="luckyplans-observability"
CLUSTER_NAME="luckyplans-local"

# ---------------------------------------------------------------------------
# Usage
# ---------------------------------------------------------------------------
usage() {
  cat <<EOF
Usage: deploy-local.sh [options] [services...]

Deploy LuckyPlans to a local k3d cluster.

Options:
  --helm-only         Run Helm upgrade only (no image build/import)
  --no-observability  Skip observability stack deployment

Services:
  No arguments      Full deploy — build all images, import infra, Helm install
  web               Rebuild and redeploy the web frontend only
  api-gateway       Rebuild and redeploy the API gateway only
  service-core      Rebuild and redeploy service-core only
  prisma-migrate    Rebuild the Prisma migration image only

Multiple services can be specified: deploy-local.sh web api-gateway

Examples:
  ./deploy-local.sh                    # Full deploy (first time or all services)
  ./deploy-local.sh web                # Redeploy web only
  ./deploy-local.sh api-gateway web    # Redeploy gateway and web
  ./deploy-local.sh --helm-only        # Helm upgrade only (config/secret changes)
EOF
  exit 0
}

HELM_ONLY=false
SKIP_OBS=false
SERVICES=()
for arg in "$@"; do
  case "$arg" in
    -h|--help) usage ;;
    --helm-only) HELM_ONLY=true ;;
    --no-observability) SKIP_OBS=true ;;
    *) SERVICES+=("$arg") ;;
  esac
done

# --helm-only and service names are mutually exclusive
if $HELM_ONLY && [[ ${#SERVICES[@]} -gt 0 ]]; then
  echo "Error: --helm-only cannot be combined with service names."
  echo "Use --helm-only alone, or specify services without --helm-only."
  exit 1
fi

FULL_DEPLOY=false
if ! $HELM_ONLY && [[ ${#SERVICES[@]} -eq 0 ]]; then
  FULL_DEPLOY=true
fi

# Map service names to their Dockerfile paths and image names
declare -A SERVICE_MAP=(
  [web]="apps/web/Dockerfile|luckyplans/web:latest"
  [api-gateway]="apps/api-gateway/Dockerfile|luckyplans/api-gateway:latest"
  [service-core]="apps/service-core/Dockerfile|luckyplans/service-core:latest"
  [prisma-migrate]="packages/prisma/Dockerfile|luckyplans/prisma-migrate:latest"
)

# Validate service names
for svc in "${SERVICES[@]}"; do
  if [[ -z "${SERVICE_MAP[$svc]:-}" ]]; then
    echo "Error: Unknown service '$svc'"
    echo "Valid services: web, api-gateway, service-core"
    exit 1
  fi
done

echo "=== LuckyPlans Local Deployment (k3d + Helm) ==="
if $HELM_ONLY; then
  echo "Mode: Helm upgrade only (no image builds)"
elif $FULL_DEPLOY; then
  echo "Mode: full deploy (all services)"
else
  echo "Mode: targeted deploy (${SERVICES[*]})"
fi
echo ""

# ---------------------------------------------------------------------------
# Prerequisites
# ---------------------------------------------------------------------------
for cmd in docker kubectl k3d helm; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Error: $cmd is required but not installed."
    exit 1
  }
done

# ---------------------------------------------------------------------------
# Read NEXT_PUBLIC_GRAPHQL_URL from values.yaml — single source of truth.
# ---------------------------------------------------------------------------
WEB_GRAPHQL_URL=$(grep 'graphqlUrl:' "$HELM_CHART/values.yaml" \
  | head -1 | sed 's/.*graphqlUrl:[[:space:]]*//' | tr -d "\"'")
WEB_GRAPHQL_URL="${WEB_GRAPHQL_URL:-/graphql}"

# ---------------------------------------------------------------------------
# Helper: pull image only if not already present locally
# ---------------------------------------------------------------------------
pull_if_missing() {
  local image="$1"
  if docker image inspect "$image" >/dev/null 2>&1; then
    echo "  $image (cached)"
  else
    echo "  $image (pulling...)"
    docker pull "$image"
  fi
}

# ---------------------------------------------------------------------------
# Create k3d cluster if missing (full deploy only)
# ---------------------------------------------------------------------------
if $FULL_DEPLOY; then
  if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
    echo "--- Creating k3d cluster: $CLUSTER_NAME ---"
    k3d cluster create "$CLUSTER_NAME" \
      --port "80:80@loadbalancer" \
      --port "443:443@loadbalancer" \
      --agents 1
    echo "Cluster created."
  else
    echo "--- Cluster $CLUSTER_NAME already exists ---"
  fi
fi

kubectl config use-context "k3d-$CLUSTER_NAME"

# ---------------------------------------------------------------------------
# Helper: build a single service image
# ---------------------------------------------------------------------------
build_image() {
  local svc="$1"
  local dockerfile="${SERVICE_MAP[$svc]%%|*}"
  local image="${SERVICE_MAP[$svc]##*|}"

  echo ""
  echo "--- Building $svc ---"
  cd "$ROOT_DIR"

  if [[ "$svc" == "web" ]]; then
    echo "NEXT_PUBLIC_GRAPHQL_URL (baked into web image): $WEB_GRAPHQL_URL"
    # MSYS_NO_PATHCONV prevents Git Bash from mangling the build arg on Windows
    MSYS_NO_PATHCONV=1 docker build \
      --build-arg "NEXT_PUBLIC_GRAPHQL_URL=$WEB_GRAPHQL_URL" \
      -t "$image" -f "$dockerfile" .
  else
    docker build -t "$image" -f "$dockerfile" .
  fi
}

# ---------------------------------------------------------------------------
# Build Docker images and import in batch (skipped with --helm-only)
# ---------------------------------------------------------------------------
if ! $HELM_ONLY; then
  echo ""
  echo "--- Building Docker images ---"

  # Collect all images to import in one batch
  IMAGES_TO_IMPORT=()

  if $FULL_DEPLOY; then
    # Build app images
    for svc in web api-gateway service-core prisma-migrate; do
      build_image "$svc"
      local_image="${SERVICE_MAP[$svc]##*|}"
      IMAGES_TO_IMPORT+=("$local_image")
    done

    # Pull infrastructure images (skip if already cached)
    echo ""
    echo "--- Pulling infrastructure images (skipping cached) ---"
    INFRA_IMAGES=(
      "redis:7-alpine"
      "postgres:17-alpine"
      "quay.io/keycloak/keycloak:26.0"
      "minio/minio:latest"
    )
    for img in "${INFRA_IMAGES[@]}"; do
      pull_if_missing "$img"
    done
    IMAGES_TO_IMPORT+=("${INFRA_IMAGES[@]}")

    # Pull observability images (skip if already cached)
    if ! $SKIP_OBS; then
      echo ""
      echo "--- Pulling observability images (skipping cached) ---"
      OBS_IMAGES=(
        "otel/opentelemetry-collector-contrib:0.96.0"
        "prom/prometheus:v2.51.0"
        "grafana/grafana:10.4.0"
        "grafana/loki:2.9.4"
        "grafana/tempo:2.4.0"
        "grafana/promtail:2.9.4"
        "oliver006/redis_exporter:v1.58.0"
      )
      for img in "${OBS_IMAGES[@]}"; do
        pull_if_missing "$img"
      done
      IMAGES_TO_IMPORT+=("${OBS_IMAGES[@]}")
    fi

    # Batch import ALL images in a single k3d command (much faster than one-by-one)
    echo ""
    echo "--- Importing ${#IMAGES_TO_IMPORT[@]} images into k3d (single batch) ---"
    k3d image import "${IMAGES_TO_IMPORT[@]}" -c "$CLUSTER_NAME"

  else
    # Targeted deploy: build and import only specified services
    for svc in "${SERVICES[@]}"; do
      build_image "$svc"
      local_image="${SERVICE_MAP[$svc]##*|}"
      IMAGES_TO_IMPORT+=("$local_image")
    done

    echo ""
    echo "--- Importing ${#IMAGES_TO_IMPORT[@]} images into k3d ---"
    k3d image import "${IMAGES_TO_IMPORT[@]}" -c "$CLUSTER_NAME"
  fi

  echo ""
  echo "Images ready."
fi

# ---------------------------------------------------------------------------
# Deploy with Helm
# ---------------------------------------------------------------------------
if $HELM_ONLY || $FULL_DEPLOY; then
  echo ""
  echo "--- Deploying app with Helm ---"
  helm upgrade --install "$RELEASE_NAME" "$HELM_CHART" \
    --namespace luckyplans \
    --create-namespace \
    -f "$HELM_CHART/values.yaml" \
    --rollback-on-failure \
    --timeout 10m

  # Deploy observability stack (full deploy or helm-only, unless skipped)
  if ! $SKIP_OBS; then
    echo ""
    echo "--- Deploying observability stack with Helm ---"
    helm upgrade --install "$RELEASE_NAME_OBS" "$HELM_CHART_OBS" \
      --namespace monitoring \
      --create-namespace \
      -f "$HELM_CHART_OBS/values.yaml" \
      --rollback-on-failure \
      --timeout 10m
  fi
else
  # Targeted deploy: restart only the affected deployments to pick up new images
  echo ""
  echo "--- Restarting deployments ---"
  for svc in "${SERVICES[@]}"; do
    echo "Restarting $svc..."
    kubectl -n luckyplans rollout restart deployment/"$svc"
  done

  echo ""
  echo "--- Waiting for rollout ---"
  for svc in "${SERVICES[@]}"; do
    kubectl -n luckyplans rollout status deployment/"$svc" --timeout=120s
  done
fi

# ---------------------------------------------------------------------------
# Post-deploy summary
# ---------------------------------------------------------------------------
echo ""
echo "=== Deployment complete ==="
echo ""
echo "Frontend:           http://localhost"
echo "GraphQL Playground: http://localhost/graphql"
if ! $SKIP_OBS; then
  echo ""
  echo "Observability (monitoring namespace):"
  echo "  Grafana:          kubectl -n monitoring port-forward svc/grafana 3002:3000"
  echo "  Prometheus:       kubectl -n monitoring port-forward svc/prometheus 9090:9090"
fi
echo ""
echo "Useful commands:"
echo "  kubectl -n luckyplans get pods"
echo "  kubectl -n monitoring get pods"
echo "  kubectl -n luckyplans logs -f deployment/<service>"
echo "  helm -n luckyplans history $RELEASE_NAME"
echo "  helm -n monitoring history $RELEASE_NAME_OBS"
