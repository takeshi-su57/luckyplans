---
title: Database Migration
sidebar_label: Database Migration
---

# Database Migration

## Goal

Apply Prisma schema changes without breaking existing data.

## When to use

- new model fields
- contract metadata changes
- simulation schema changes
- indexing or workflow persistence updates

## Prerequisites

- review the target Prisma schema
- know whether tables already contain production data
- have a backout plan

## Steps

1. Make the Prisma schema change in the owning repo.
2. Generate a migration with Prisma tooling.
3. Review SQL output carefully.
4. Apply the migration in development first.
5. Verify application behavior against the new schema.

## Verification

- Prisma client generation succeeds
- application queries still work
- simulation and leaderboard pages still load when relevant

## Troubleshooting

- never add required columns to populated tables without a default or backfill plan
- treat contract-range changes as data correctness changes, not just schema changes
