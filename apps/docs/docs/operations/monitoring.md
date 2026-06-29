---
title: Monitoring
sidebar_label: Monitoring
---

# Monitoring

## Goal

Keep enough visibility on docs, web, API, workers, and infrastructure to spot failures early.

## What exists in the repo

- persistent `Log` model in the current backend
- GraphQL log subscription support
- beta monorepo observability direction referencing OTel, Prometheus, Grafana, Loki, and Tempo

## Minimum things to watch

- API availability
- docs and web ingress reachability
- Redis and Postgres availability
- worker liveness
- indexing lag
- simulation failures

## Verification

- inspect GraphQL log output
- inspect Kubernetes rollout and pod status
- inspect worker logs for adaption and task execution

## Troubleshooting

- if plans update but leaderboards do not, inspect leaderboard worker state
- if docs and landing work but app does not, inspect API and auth routing
- if subscriptions feel stale, inspect websocket endpoint health
