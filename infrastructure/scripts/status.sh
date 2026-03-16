#!/bin/bash

CLUSTER_NAME="luckyplans-local"
RELEASE_NAME="luckyplans"
RELEASE_NAME_OBS="luckyplans-observability"

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
echo "--- Helm releases ---"
helm list -n luckyplans 2>/dev/null || echo "  (luckyplans namespace not found)"
helm list -n monitoring 2>/dev/null || echo "  (monitoring namespace not found)"

echo ""
echo "--- App Pods (luckyplans) ---"
kubectl -n luckyplans get pods 2>/dev/null || echo "  Cannot connect to cluster"

echo ""
echo "--- Observability Pods (monitoring) ---"
kubectl -n monitoring get pods 2>/dev/null || echo "  (monitoring namespace not found)"

echo ""
echo "--- Services (luckyplans) ---"
kubectl -n luckyplans get services 2>/dev/null

echo ""
echo "--- Services (monitoring) ---"
kubectl -n monitoring get services 2>/dev/null

echo ""
echo "--- Ingress ---"
kubectl -n luckyplans get ingress 2>/dev/null

echo ""
echo "To view Helm values: helm -n luckyplans get values $RELEASE_NAME"
echo "To view obs values:  helm -n monitoring get values $RELEASE_NAME_OBS"
echo "To view logs:        kubectl -n luckyplans logs -f deployment/<name>"
echo "To port-forward Grafana: kubectl -n monitoring port-forward svc/grafana 3002:3000"
