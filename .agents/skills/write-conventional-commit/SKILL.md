---
name: write-conventional-commit
description: Use when preparing a git commit message to enforce conventional-commit format and repository commit hygiene.
---

# Write Conventional Commit

## Format
`<type>(<scope>): <short description>`

## Checklist
1. Pick type: `feat|fix|docs|style|refactor|perf|test|chore|ci|revert`.
2. Add scope when useful (e.g., `auth`, `api`, `web`).
3. Write imperative short subject, no trailing period.
4. Add body only for context (`what` and `why`).
5. Never include AI attribution in commit message/footer.

## Examples
- `feat(auth): add session logout endpoint`
- `fix(web): handle null profile response`
- `docs: update deployment guide`
