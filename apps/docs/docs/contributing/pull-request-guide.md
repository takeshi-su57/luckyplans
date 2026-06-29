---
title: Pull Request Guide
sidebar_label: Pull Request Guide
---

# Pull Request Guide

## Before opening a PR

- confirm the owning repo
- run the smallest meaningful verification for the changed surface
- update docs when behavior, config, or deployment steps change

## Good PR contents

- concise problem statement
- scope of change
- validation steps
- screenshots for docs or frontend changes when helpful
- notes on migrations, reindexing, or rollout risk if applicable

## Special caution areas

- simulation correctness
- copy-trading execution paths
- contract version boundaries
- historical index parsing
- auth and secret handling
