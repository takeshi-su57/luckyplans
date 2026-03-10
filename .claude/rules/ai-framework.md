# AI Framework Maintenance Rules

How to maintain and evolve the AI engineering framework (`.claude/`, `AI_ENGINEERING.md`, related docs).

## Framework File Hierarchy

```
AI_ENGINEERING.md              ← Human-readable overview (entry point for developers)
.claude/
├── CLAUDE.md                  ← AI context (auto-loaded, concise index, < 200 lines)
├── rules/                     ← Detailed guidance documents
│   └── <topic>.md
├── skills/                    ← Reusable task patterns
│   └── <skill-name>/
│       ├── skill.md           ← Instructions and steps
│       ├── templates/         ← Pattern files (all .md)
│       └── examples/          ← Worked examples (all .md)
└── settings.local.json        ← Claude Code permissions (not manually edited)
```

## Sync Protocol

When the project evolves, multiple files must stay in sync. Follow this order:

### When architecture changes (new pattern, tech stack change, convention update)

1. Update `.claude/rules/architecture.md` — the source of truth
2. Update `.claude/CLAUDE.md` — the summary in Architecture Patterns section
3. Update `AI_ENGINEERING.md` — the Core Engineering Principles section
4. Update `README.md` — only if it affects project structure, tech stack, or commands

### When adding a new rule

1. Create `.claude/rules/<topic>.md`
2. Add one-line reference in `.claude/CLAUDE.md` under Rules section
3. Add row in `AI_ENGINEERING.md` Framework Structure table

### When adding a new skill

1. Create `.claude/skills/<skill-name>/` with `skill.md`, `templates/`, `examples/`
2. Add row in `AI_ENGINEERING.md` Framework Structure table
3. No change needed in `CLAUDE.md` unless it's a frequently used skill

### When modifying shared types or message patterns

1. Update `packages/shared/src/types/index.ts`
2. Check if `.claude/rules/architecture.md` examples still match
3. Check if skill examples still match

### When scripts or commands change

1. Update `README.md` Scripts table
2. Update `.claude/CLAUDE.md` Key Commands section

## CLAUDE.md Principles

`CLAUDE.md` is loaded into every AI interaction. It must be:

- **Under 200 lines** — bloating it degrades AI tool performance
- **An index, not a manual** — summarize patterns, point to rules for details
- **Factual, not aspirational** — describe what IS, not what should be. Update when reality changes
- **No duplicated content** — if it's in a rule file, CLAUDE.md links to it, doesn't repeat it

What belongs in CLAUDE.md:
- Project identity and tech stack
- Repository layout (one-liner per directory)
- Architecture patterns (one paragraph each)
- Key commands
- CI pipeline summary
- Conventions (one line each)
- Links to rule files
- Known gaps

What does NOT belong in CLAUDE.md:
- Code examples (put in rules or skills)
- Step-by-step procedures (put in skills)
- Detailed explanations (put in rules)
- Historical context or rationale

## Rule Design Principles

A good rule file:

- **References real code** — points to actual files and patterns in this codebase, not generic advice
- **Shows don't tell** — includes concrete examples from existing code
- **States anti-patterns explicitly** — "do NOT" is clearer than only describing the happy path
- **Stays current** — outdated rules are worse than no rules. Remove or update when code changes
- **Has a single focus** — one topic per file (architecture, testing, security — not "misc guidelines")

Naming: `kebab-case.md` (e.g., `architecture.md`, `git-commit.md`, `ai-framework.md`)

## Skill Design Principles

A good skill:

- **Solves a repeatable task** — something done more than once with the same pattern
- **Has a clear "when to use"** — explicitly states when to use this skill vs. alternatives
- **Uses .md for everything** — templates and examples are markdown files with code blocks, not raw source files
- **Templates show the pattern** — use placeholders like `<PascalName>`, `<name>`, `<camelName>`
- **Examples show a real scenario** — a complete worked example with a concrete domain (Order, Trading, etc.)
- **Includes all layers** — from shared types through to the final integration point
- **Shows what to import and from where** — imports are the most common source of errors

Skill folder structure:
```
<skill-name>/
├── skill.md           ← Required. What, when, steps
├── templates/         ← Required. Reusable patterns as .md files
└── examples/          ← Required. At least one worked example as .md
```

## Evolution Guidelines

### Adding

- New rules/skills should be reviewed before merging, like code
- Every new file must be referenced from the appropriate parent (CLAUDE.md or AI_ENGINEERING.md)
- Don't create a rule until a pattern has been confirmed across at least 2 instances

### Updating

- When you find a rule is wrong, fix it immediately — wrong rules cause compounding errors
- When code changes make an example outdated, update the example in the same PR
- Periodically check that CLAUDE.md line count is under 200

### Deprecating / Removing

- Delete rules that no longer apply — don't leave stale guidance
- Remove skill examples that reference patterns no longer in use
- Clean up references in CLAUDE.md and AI_ENGINEERING.md when removing

## Verification

To check if the framework is healthy:

- `CLAUDE.md` is under 200 lines
- Every rule file is referenced in CLAUDE.md or AI_ENGINEERING.md
- Every skill folder has `skill.md`, `templates/`, and `examples/`
- No rule references files or patterns that no longer exist
- Architecture rules match the actual code patterns in the repository
