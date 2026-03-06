#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
HELM_CHART="$SCRIPT_DIR/../helm/luckyplans"
RELEASE_NAME="luckyplans"
CLUSTER_NAME="luckyplans-local"

echo "=== LuckyPlans Local Deployment (k3d + Helm) ==="
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
# This URL is baked into the Next.js bundle at docker build time; Helm cannot
# inject it at runtime. We extract it here so .env is not required for deploys.
# ---------------------------------------------------------------------------
WEB_GRAPHQL_URL=$(grep 'graphqlUrl:' "$HELM_CHART/values.yaml" \
  | head -1 | sed 's/.*graphqlUrl:[[:space:]]*//' | tr -d "\"'")
WEB_GRAPHQL_URL="${WEB_GRAPHQL_URL:-/graphql}"

echo "NEXT_PUBLIC_GRAPHQL_URL (baked into web image): $WEB_GRAPHQL_URL"

# ---------------------------------------------------------------------------
# Create k3d cluster if missing
# ---------------------------------------------------------------------------
if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
  echo ""
  echo "--- Creating k3d cluster: $CLUSTER_NAME ---"
  k3d cluster create "$CLUSTER_NAME" \
    --port "80:80@loadbalancer" \
    --port "443:443@loadbalancer" \
    --agents 1
  echo "Cluster created."
else
  echo "--- Cluster $CLUSTER_NAME already exists ---"
fi

kubectl config use-context "k3d-$CLUSTER_NAME"

# ---------------------------------------------------------------------------
# Build Docker images
# ---------------------------------------------------------------------------
echo ""
echo "--- Building Docker images ---"
cd "$ROOT_DIR"

MSYS_NO_PATHCONV=1 docker build \
  --build-arg NEXT_PUBLIC_GRAPHQL_URL="$WEB_GRAPHQL_URL" \
  -t luckyplans/web:latest \
  -f apps/web/Dockerfile .

docker build -t luckyplans/api-gateway:latest  -f apps/api-gateway/Dockerfile .
docker build -t luckyplans/service-auth:latest  -f apps/service-auth/Dockerfile .
docker build -t luckyplans/service-core:latest  -f apps/service-core/Dockerfile .

echo "Images built."

# ---------------------------------------------------------------------------
# Import images into k3d (bypasses Docker Hub pull inside cluster nodes)
# ---------------------------------------------------------------------------
echo ""
echo "--- Importing images into k3d ---"
docker pull redis:7-alpine
k3d image import redis:7-alpine              -c "$CLUSTER_NAME"
k3d image import luckyplans/web:latest       -c "$CLUSTER_NAME"
k3d image import luckyplans/api-gateway:latest  -c "$CLUSTER_NAME"
k3d image import luckyplans/service-auth:latest -c "$CLUSTER_NAME"
k3d image import luckyplans/service-core:latest -c "$CLUSTER_NAME"

echo "Images imported."

# ---------------------------------------------------------------------------
# Deploy with Helm
# ---------------------------------------------------------------------------
echo ""
echo "--- Deploying with Helm ---"
helm upgrade --install "$RELEASE_NAME" "$HELM_CHART" \
  --namespace luckyplans \
  --create-namespace \
  -f "$HELM_CHART/values.yaml" \
  --rollback-on-failure \
  --timeout 5m

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
echo "  kubectl -n luckyplans logs -f deployment/api-gateway"
echo "  helm -n luckyplans history $RELEASE_NAME"
echo "  helm -n luckyplans get values $RELEASE_NAME"
