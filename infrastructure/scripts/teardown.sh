#!/bin/bash
set -e

CLUSTER_NAME="luckyplans-local"
RELEASE_NAME="luckyplans"
RELEASE_NAME_OBS="luckyplans-observability"

echo "=== Tearing down LuckyPlans Local Environment ==="
echo ""

# Uninstall observability Helm release
if helm list -n monitoring 2>/dev/null | grep -q "$RELEASE_NAME_OBS"; then
  echo "--- Uninstalling Helm release: $RELEASE_NAME_OBS ---"
  helm uninstall "$RELEASE_NAME_OBS" -n monitoring
  echo "Observability release uninstalled."
else
  echo "Helm release $RELEASE_NAME_OBS not found (already uninstalled or never deployed)."
fi

# Uninstall app Helm release (removes Deployments, Services, ConfigMap, etc.)
# The namespace is annotated with helm.sh/resource-policy: keep, so it survives.
if helm list -n luckyplans 2>/dev/null | grep -q "$RELEASE_NAME"; then
  echo "--- Uninstalling Helm release: $RELEASE_NAME ---"
  helm uninstall "$RELEASE_NAME" -n luckyplans
  echo "Helm release uninstalled."
else
  echo "Helm release $RELEASE_NAME not found (already uninstalled or never deployed)."
fi

# Delete the k3d cluster entirely
if k3d cluster list 2>/dev/null | grep -q "$CLUSTER_NAME"; then
  echo ""
  echo "--- Deleting k3d cluster: $CLUSTER_NAME ---"
  k3d cluster delete "$CLUSTER_NAME"
  echo "Cluster deleted."
else
  echo "Cluster $CLUSTER_NAME not found. Nothing to tear down."
fi

echo ""
echo "=== Teardown complete ==="
