#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
HELM_CHART="$SCRIPT_DIR/../helm/luckyplans"
RELEASE_NAME="luckyplans"
CLUSTER_NAME="luckyplans-local"
HELM_TIMEOUT="${HELM_TIMEOUT:-15m}"

# ---------------------------------------------------------------------------
# Usage
# ---------------------------------------------------------------------------
usage() {
  cat <<EOF
Usage: deploy-local.sh [options] [services...]

Deploy LuckyPlans to a local k3d cluster.

Options:
  --helm-only         Run Helm upgrade only (no image build/import)

Services:
  No arguments      Full deploy — build all images, import infra, Helm install
  landing           Rebuild and redeploy the landing SPA only
  docs              Rebuild and redeploy the docs SPA only
  web               Rebuild and redeploy the web frontend only
  api-gateway       Rebuild and redeploy the API gateway only
  prisma-migrate    Rebuild the Prisma migration image only

Multiple services can be specified: deploy-local.sh landing web api-gateway

Examples:
  ./deploy-local.sh                    # Full deploy (first time or all services)
  ./deploy-local.sh landing            # Redeploy landing only
  ./deploy-local.sh web                # Redeploy web only
  ./deploy-local.sh api-gateway web    # Redeploy gateway and web
  ./deploy-local.sh docs               # Redeploy docs only
  ./deploy-local.sh --helm-only        # Helm upgrade only (config/secret changes)
EOF
  exit 0
}

HELM_ONLY=false
SERVICES=()
for arg in "$@"; do
  case "$arg" in
    -h|--help) usage ;;
    --helm-only) HELM_ONLY=true ;;
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
  [landing]="apps/landing/Dockerfile|luckyplans/landing:latest"
  [docs]="apps/docs/Dockerfile|luckyplans/docs:latest"
  [web]="apps/web/Dockerfile|luckyplans/web:latest"
  [api-gateway]="apps/api-gateway/Dockerfile|luckyplans/api-gateway:latest"
  [prisma-migrate]="packages/prisma/Dockerfile|luckyplans/prisma-migrate:latest"
)

# Validate service names
for svc in "${SERVICES[@]}"; do
  if [[ -z "${SERVICE_MAP[$svc]:-}" ]]; then
    echo "Error: Unknown service '$svc'"
    echo "Valid services: landing, docs, web, api-gateway, prisma-migrate"
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

print_app_diagnostics() {
  local namespace="$1"
  echo ""
  echo "--- Diagnostics ($namespace) ---"
  kubectl -n "$namespace" get pods -o wide || true
  echo ""
  echo "--- Recent events ($namespace) ---"
  kubectl -n "$namespace" get events --sort-by=.metadata.creationTimestamp | tail -n 40 || true
  echo ""
  echo "Tip:"
  echo "  kubectl -n $namespace describe pod <pod-name>"
  echo "  kubectl -n $namespace logs <pod-name> --all-containers=true --tail=200"
}

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

LANDING_APP_URL=$(grep 'appUrl:' "$HELM_CHART/values.yaml" \
  | head -1 | sed 's/.*appUrl:[[:space:]]*//' | tr -d "\"'")
LANDING_APP_URL="${LANDING_APP_URL:-/login}"

LANDING_DOCS_URL=$(grep 'docsUrl:' "$HELM_CHART/values.yaml" \
  | head -1 | sed 's/.*docsUrl:[[:space:]]*//' | tr -d "\"'")
LANDING_DOCS_URL="${LANDING_DOCS_URL:-/docs}"

DOCS_APP_URL=$(grep 'appUrl:' "$HELM_CHART/values.yaml" \
  | tail -1 | sed 's/.*appUrl:[[:space:]]*//' | tr -d "\"'")
DOCS_APP_URL="${DOCS_APP_URL:-/login}"

WEB_DOCS_URL=$(grep 'docsUrl:' "$HELM_CHART/values.yaml" \
  | tail -1 | sed 's/.*docsUrl:[[:space:]]*//' | tr -d "\"'")
WEB_DOCS_URL="${WEB_DOCS_URL:-/docs}"

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

  if [[ "$svc" == "landing" ]]; then
    echo "VITE_APP_URL (baked into landing image): $LANDING_APP_URL"
    echo "VITE_DOCS_URL (baked into landing image): $LANDING_DOCS_URL"
    MSYS_NO_PATHCONV=1 docker build \
      --build-arg "VITE_APP_URL=$LANDING_APP_URL" \
      --build-arg "VITE_DOCS_URL=$LANDING_DOCS_URL" \
      -t "$image" -f "$dockerfile" .
  elif [[ "$svc" == "docs" ]]; then
    echo "DOCS_APP_URL (baked into docs image): $DOCS_APP_URL"
    MSYS_NO_PATHCONV=1 docker build \
      --build-arg "DOCS_APP_URL=$DOCS_APP_URL" \
      -t "$image" -f "$dockerfile" .
  elif [[ "$svc" == "web" ]]; then
    echo "NEXT_PUBLIC_GRAPHQL_URL (baked into web image): $WEB_GRAPHQL_URL"
    echo "NEXT_PUBLIC_DOCS_URL (baked into web image): $WEB_DOCS_URL"
    # MSYS_NO_PATHCONV prevents Git Bash from mangling the build arg on Windows
    MSYS_NO_PATHCONV=1 docker build \
      --build-arg "NEXT_PUBLIC_GRAPHQL_URL=$WEB_GRAPHQL_URL" \
      --build-arg "NEXT_PUBLIC_DOCS_URL=$WEB_DOCS_URL" \
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
    for svc in landing docs web api-gateway prisma-migrate; do
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
  if ! helm upgrade --install "$RELEASE_NAME" "$HELM_CHART" \
    --namespace luckyplans \
    --create-namespace \
    -f "$HELM_CHART/values.yaml" \
    --wait \
    --timeout "$HELM_TIMEOUT"; then
    echo ""
    echo "App Helm deploy failed."
    print_app_diagnostics "luckyplans"
    exit 1
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
echo "Landing:            http://localhost"
echo "App:                http://localhost/login"
echo "Docs:               http://localhost/docs"
echo "Direct docs dev:    http://localhost:3002"
echo "GraphQL Playground: http://localhost/graphql"
echo ""
echo "Useful commands:"
echo "  kubectl -n luckyplans get pods"
echo "  kubectl -n luckyplans logs -f deployment/<service>"
echo "  helm -n luckyplans history $RELEASE_NAME"
