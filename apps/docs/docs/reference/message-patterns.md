---
title: Message Patterns
sidebar_label: Message Patterns
---

# Message Patterns

The current backend uses NestJS Redis microservice transport with explicit message and event pattern names.

## Core process patterns

| Pattern | Purpose |
| --- | --- |
| `KILL_PROCESS_EVENT` | Ask a service mode to stop |
| `PROCESS_STATUS` | Publish current process status |
| `ASK_PROCESS_STATUS` | Request current process status from workers |

## Security patterns

| Pattern | Purpose |
| --- | --- |
| `IS_VALID_PASSWORD` | Validate password through the security controller |
| `IS_SAFE_APP` | Safety-state check |
| `ENCRYPT` | Encrypt text |
| `DECRYPT` | Decrypt text |

## Log patterns

| Pattern | Purpose |
| --- | --- |
| `NATIVE_LOG_EVENT` | Native log event fan-out |
| `LOG_EVENT` | Structured application log creation |

## Product event patterns

| Pattern | Purpose |
| --- | --- |
| `BOT_CREATED` / `BOT_UPDATED` | bot lifecycle broadcasts |
| `MISSION_CREATED` / `MISSION_UPDATED` | mission lifecycle broadcasts |
| `PLAN_CREATED` / `PLAN_UPDATED` | plan lifecycle broadcasts |
| `SIMULATION_PROGRESS_UPDATED` | simulation progress updates |
| `TASK_CREATED` / `TASK_UPDATED` | task lifecycle broadcasts |
| `GET_ADAPTION_STATUS` | request leaderboard adaption status |
| `START_ADAPTION` | trigger leaderboard adaption for a contract |

## Where these are used

- API services emit many domain events after persistence
- controllers subscribe to event patterns and republish through GraphQL subscriptions where needed
- worker services answer adaption and process-status requests
