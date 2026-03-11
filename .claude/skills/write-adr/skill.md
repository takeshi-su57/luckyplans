# Skill: Write ADR

Create an Architecture Decision Record when a significant architectural decision is made.

## When to Use

- Adding or removing a microservice
- Changing communication patterns
- Adopting a new framework or major dependency
- Changing deployment strategy
- Any decision someone might question later

## Steps

1. Determine the date and a short kebab-case name
2. Create `apps/web/content/architecture/decisions/yyyy-mm-dd-<name>.mdx` using the template (add frontmatter `title:` and `description:` at the top)
3. Add the new key to `apps/web/content/architecture/decisions/_meta.ts`
4. Update `apps/web/content/architecture/overview.mdx` if the decision changes the current architecture
5. Follow sync protocol in `.claude/rules/ai-framework.md` for any `.claude/` file updates

## Reference

- See `templates/adr-template.md` for the file format
- See `examples/` for worked examples
- See `.claude/rules/documentation.md` for when to write (and when not to write) an ADR
