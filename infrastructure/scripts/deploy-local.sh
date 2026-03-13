#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
HELM_CHART="$SCRIPT_DIR/../helm/luckyplans"
RELEASE_NAME="luckyplans"
CLUSTER_NAME="luckyplans-local"

# ---------------------------------------------------------------------------
# Usage
# ---------------------------------------------------------------------------
usage() {
  cat <<EOF
Usage: deploy-local.sh [options] [services...]

Deploy LuckyPlans to a local k3d cluster.

Options:
  --helm-only       Run Helm upgrade only (no image build/import)

Services:
  No arguments      Full deploy — build all images, import infra, Helm install
  web               Rebuild and redeploy the web frontend only
  api-gateway       Rebuild and redeploy the API gateway only
  service-core      Rebuild and redeploy service-core only

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
  [web]="apps/web/Dockerfile|luckyplans/web:latest"
  [api-gateway]="apps/api-gateway/Dockerfile|luckyplans/api-gateway:latest"
  [service-core]="apps/service-core/Dockerfile|luckyplans/service-core:latest"
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
# Helper: build and import a single service
# ---------------------------------------------------------------------------
build_and_import() {
  local svc="$1"
  local dockerfile="${SERVICE_MAP[$svc]%%|*}"
  local image="${SERVICE_MAP[$svc]##*|}"

  echo ""
  echo "--- Building $svc ---"
  cd "$ROOT_DIR"

  local build_args=()
  if [[ "$svc" == "web" ]]; then
    echo "NEXT_PUBLIC_GRAPHQL_URL (baked into web image): $WEB_GRAPHQL_URL"
    build_args=(--build-arg "NEXT_PUBLIC_GRAPHQL_URL=$WEB_GRAPHQL_URL")
    # MSYS_NO_PATHCONV prevents Git Bash from mangling the build arg on Windows
    MSYS_NO_PATHCONV=1 docker build "${build_args[@]}" -t "$image" -f "$dockerfile" .
  else
    docker build -t "$image" -f "$dockerfile" .
  fi

  echo "--- Importing $svc into k3d ---"
  k3d image import "$image" -c "$CLUSTER_NAME"
}

# ---------------------------------------------------------------------------
# Build Docker images (skipped with --helm-only)
# ---------------------------------------------------------------------------
if ! $HELM_ONLY; then
  echo ""
  echo "--- Building Docker images ---"

  if $FULL_DEPLOY; then
    for svc in web api-gateway service-core; do
      build_and_import "$svc"
    done

    # Import infrastructure images (full deploy only)
    echo ""
    echo "--- Importing infrastructure images ---"
    docker pull redis:7-alpine
    docker pull quay.io/keycloak/keycloak:26.0
    k3d image import redis:7-alpine                  -c "$CLUSTER_NAME"
    k3d image import quay.io/keycloak/keycloak:26.0  -c "$CLUSTER_NAME"
  else
    for svc in "${SERVICES[@]}"; do
      build_and_import "$svc"
    done
  fi

  echo ""
  echo "Images ready."
fi

# ---------------------------------------------------------------------------
# Deploy with Helm
# ---------------------------------------------------------------------------
if $HELM_ONLY || $FULL_DEPLOY; then
  echo ""
  echo "--- Deploying with Helm ---"
  helm upgrade --install "$RELEASE_NAME" "$HELM_CHART" \
    --namespace luckyplans \
    --create-namespace \
    -f "$HELM_CHART/values.yaml" \
    --rollback-on-failure \
    --timeout 10m
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
echo ""
echo "Useful commands:"
echo "  kubectl -n luckyplans get pods"
echo "  kubectl -n luckyplans logs -f deployment/<service>"
echo "  helm -n luckyplans history $RELEASE_NAME"
