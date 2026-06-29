---
title: GraphQL Reference
sidebar_label: GraphQL Reference
---

# GraphQL Reference

This page summarizes the current GraphQL surface from the real backend and frontend schema files.

## Example queries

| Query | Purpose |
| --- | --- |
| `getPlansByStatus` | Paginated live plan list by status |
| `getPlanById` | Fetch one plan |
| `getAllFollowerDetails` | Paginated follower details for a contract |
| `getPerpTradePositions` | Historical position view with summary data for an address and platform |
| `getSimulationPlans` | Paginated simulation plan list |
| `simulation` | Fetch one simulation |
| `simulations` | Paginated simulations |
| `simulationResearches` | Paginated simulation research records |
| `simulationPlansBySimulation` | Get plans belonging to a simulation |
| `simulationPlanDetailsBySimulation` | Detailed per-plan view |
| `simulationLeaderSelections` | Leader selections for a simulation or plan |

## Example mutations

| Mutation | Purpose |
| --- | --- |
| `createPlan` | Create a live plan |
| `updatePlan` | Update a live plan |
| `startPlan` | Start a plan |
| `endPlan` | End a plan |
| `createSimulation` | Create an auto simulation record |
| `createSimulationPlan` | Create a manual simulation plan |
| `createSimulationResearch` | Create a research batch |
| `playAutoSimulation` | Start an auto simulation |
| `playSimulationPlan` | Start or resume a simulation plan |
| `cancelSimulation` | Cancel a simulation |
| `updateSimulationBot` | Update a simulation bot |
| `batchCreateSimulationBots` | Create multiple simulation bots |
| `stopSimulationBot` | Stop a simulation bot |

## Example subscriptions

| Subscription | Purpose |
| --- | --- |
| `planCreated` | Notify the UI about newly created plans |
| `planUpdated` | Notify the UI about plan changes |
| `botCreated` / `botUpdated` | Bot state updates |
| `missionCreated` / `missionUpdated` | Mission lifecycle updates |
| `taskCreated` / `taskUpdated` | Task lifecycle updates |
| `newLog` | Log stream updates |

The backend constants also define `simulationProgressUpdated`, but treat the exact published shape as implementation-sensitive until a dedicated public schema example is added.

<!-- TODO: add copy-ready GraphQL examples for one plan query, one leaderboard query, and one simulation query. -->
