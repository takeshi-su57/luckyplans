#!/bin/bash

CLUSTER_NAME="luckyplans-local"
RELEASE_NAME="luckyplans"

echo "=== LuckyPlans Service Status ==="
echo ""

# --- k3d cluster ---
echo "--- Kubernetes (k3d) ---"
if command -v k3d >/dev/null 2>&1; then
  if k3d cluster list 2>/dev/null | grep -q "$CLUSTER_NAME"; then
    echo "  Cluster: $CLUSTER_NAME (RUNNING)"
  else
    echo "  Cluster: not running"
    exit 0
  fi
else
  echo "  k3d: not installed"
  exit 1
fi

echo ""
echo "--- Helm release ---"
helm list -n luckyplans 2>/dev/null || echo "  (helm not available or namespace not found)"

echo ""
echo "--- Pods ---"
kubectl -n luckyplans get pods 2>/dev/null || echo "  Cannot connect to cluster"

echo ""
echo "--- Services ---"
kubectl -n luckyplans get services 2>/dev/null

echo ""
echo "--- Ingress ---"
kubectl -n luckyplans get ingress 2>/dev/null

echo ""
echo "To view Helm values: helm -n luckyplans get values $RELEASE_NAME"
echo "To view logs:        kubectl -n luckyplans logs -f deployment/<name>"
