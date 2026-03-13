#!/usr/bin/env bash
# Smoke tests for LuckyPlans deployments.
# Usage: smoke-test.sh <deploy-host> [image-tag]
#
# Runs checks against the target host:
#   1. API Gateway health endpoint
#   2. Web frontend HTTP 200
#   3. GraphQL endpoint connectivity
#   4. (optional) Deployed image tag verification via kubectl
#
# Each check retries up to 5 times with 10-second intervals.

set -euo pipefail

DEPLOY_HOST="${1:?Usage: smoke-test.sh <deploy-host> [image-tag]}"
IMAGE_TAG="${2:-}"
MAX_RETRIES=5
RETRY_DELAY=10

fail() { echo "FAIL: $1"; exit 1; }

# Wait for TLS to be ready (cert-manager may need 1-2 min on first deploy)
echo "==> Pre-check: TLS readiness (https://$DEPLOY_HOST)"
TLS_TIMEOUT=120
TLS_INTERVAL=10
TLS_ELAPSED=0
while [ "$TLS_ELAPSED" -lt "$TLS_TIMEOUT" ]; do
  HTTP_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "https://$DEPLOY_HOST/health" 2>/dev/null || echo "000")
  # Accept 2xx/3xx as TLS-ready (connection succeeded); reject 4xx/5xx as potential errors
  if echo "$HTTP_CODE" | grep -qE '^[23]'; then
    echo "    TLS is ready (HTTP $HTTP_CODE)"
    break
  fi
  TLS_ELAPSED=$((TLS_ELAPSED + TLS_INTERVAL))
  echo "    Waiting for TLS certificate... (${TLS_ELAPSED}s / ${TLS_TIMEOUT}s)"
  sleep "$TLS_INTERVAL"
done
if [ "$TLS_ELAPSED" -ge "$TLS_TIMEOUT" ]; then
  fail "TLS not ready after ${TLS_TIMEOUT}s — certificate may not be provisioned yet. Re-run the workflow once cert-manager finishes."
fi

echo "==> Smoke test: API Gateway health (https://$DEPLOY_HOST/health)"
for i in $(seq 1 "$MAX_RETRIES"); do
  BODY=$(curl -sf "https://$DEPLOY_HOST/health" 2>/dev/null || true)
  if echo "$BODY" | grep -q '"status":"ok"'; then
    echo "    PASS: $BODY"
    break
  fi
  echo "    Attempt $i: unexpected response — retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
  [ "$i" -eq "$MAX_RETRIES" ] && fail "API Gateway health check failed after $MAX_RETRIES attempts"
done

echo "==> Smoke test: Web frontend (https://$DEPLOY_HOST/)"
for i in $(seq 1 "$MAX_RETRIES"); do
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "https://$DEPLOY_HOST/" || true)
  if [ "$STATUS" = "200" ]; then
    echo "    PASS: HTTP 200"
    break
  fi
  echo "    Attempt $i: HTTP $STATUS — retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
  [ "$i" -eq "$MAX_RETRIES" ] && fail "Web frontend health check failed after $MAX_RETRIES attempts"
done

echo "==> Smoke test: GraphQL endpoint (POST https://$DEPLOY_HOST/graphql)"
for i in $(seq 1 "$MAX_RETRIES"); do
  BODY=$(curl -sf -X POST "https://$DEPLOY_HOST/graphql" \
    -H 'Content-Type: application/json' \
    -d '{"query":"{ health }"}' 2>/dev/null || true)
  if echo "$BODY" | grep -q '"API Gateway is running"'; then
    echo "    PASS: $BODY"
    break
  fi
  echo "    Attempt $i: unexpected response — retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
  [ "$i" -eq "$MAX_RETRIES" ] && fail "GraphQL endpoint check failed after $MAX_RETRIES attempts"
done

# Verify deployed pods are running the expected image tag (requires kubectl access)
if [ -n "$IMAGE_TAG" ] && command -v kubectl &>/dev/null; then
  echo "==> Smoke test: Image tag verification (expected: $IMAGE_TAG)"
  DEPLOYMENTS="api-gateway service-core web"
  ALL_MATCH=true
  for DEPLOY in $DEPLOYMENTS; do
    ACTUAL=$(kubectl -n luckyplans get deployment "$DEPLOY" \
      -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || echo "NOT_FOUND")
    if echo "$ACTUAL" | grep -q "$IMAGE_TAG"; then
      echo "    PASS: $DEPLOY → $ACTUAL"
    else
      echo "    MISMATCH: $DEPLOY expected tag '$IMAGE_TAG' but got '$ACTUAL'"
      ALL_MATCH=false
    fi
  done
  if [ "$ALL_MATCH" != "true" ]; then
    fail "Image tag verification failed — not all deployments are running $IMAGE_TAG"
  fi
fi

echo "==> All smoke tests passed"
