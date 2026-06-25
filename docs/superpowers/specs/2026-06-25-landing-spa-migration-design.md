# Landing SPA Migration Design

Date: 2026-06-25

## Goal

Move the real public landing page from `apps/web` into `apps/landing` so `luckyplans.xyz` is served entirely by the Vite SPA, while `apps/web` keeps only product, docs, auth, and other non-landing behavior.

The migration should preserve the current landing page section structure section-for-section for now.

## Scope

In scope:

- Migrate the existing landing page composition and section components from `apps/web/src/components/landing` into `apps/landing`
- Preserve current section order and current content as closely as practical
- Adapt Next.js-specific code for Vite/React SPA runtime
- Move any landing-only support files needed by those sections into `apps/landing`
- Update `apps/landing` to use the real migrated landing page instead of the current placeholder
- Remove landing-only code from `apps/web` after the SPA is using it
- Keep `apps/web` root redirect behavior unchanged

Out of scope:

- Content redesign or section reordering
- Shared package extraction for landing components
- Major visual refresh
- Product/docs/auth changes beyond what is required by the migration

## Constraints

- `luckyplans.xyz` remains the landing domain
- `apps/landing` is the only owner of public marketing content after the migration
- `apps/web` should not continue to carry dead landing components after the cutover
- The migration should minimize behavior drift by porting section-for-section rather than rewriting from scratch

## Recommended Approach

Use a direct port with a thin compatibility layer.

Why:

- Lowest risk for a section-for-section migration
- Fastest route to getting real landing content live in the SPA
- Avoids unnecessary shared-package complexity if `apps/web` is no longer supposed to render the landing

Rejected alternatives:

- Shared extraction into a package: cleaner reuse, but unnecessary cost if `apps/web` is intentionally dropping landing ownership
- Rebuild from reference: too easy to drift from the current content and layout

## Target Architecture

### Ownership

- `apps/landing`
  - Owns all public landing sections, supporting content/data used only by the landing, and any landing-only visual assets needed at runtime
  - Composes the full public homepage for `luckyplans.xyz`

- `apps/web`
  - Owns product app routes, auth screens, docs, blog, and public profile pages
  - No longer owns landing page components after migration

### Runtime split

- `apps/landing` serves `/` on the landing domain
- `apps/web` continues to serve app/docs/auth/public profile behavior on the app surface
- `apps/web` root continues redirecting users into `/login` or `/dashboard`

## Component Migration Plan

### Components to migrate

Move the current landing section set from `apps/web/src/components/landing` into `apps/landing/src/components/landing`:

- `Navbar`
- `HeroSection`
- `StatsSection`
- `ProblemSection`
- `InfrastructureSection`
- `ChainsSection`
- `PrinciplesSection`
- `BuildersSection`
- `ProofSection`
- `TeamSection`
- `LabNotesSection`
- `Footer`
- `SectionContainer`
- landing `data/*`

### Supporting assets and dependencies

For each migrated component:

- Replace `next/link` with standard anchors or SPA navigation helpers
- Replace `next/image` with standard `img`
- Move any landing-only icon components or static data needed by migrated sections into `apps/landing`
- Do not leave `apps/landing` depending on imports from `apps/web`

### Composition root

Update `apps/landing/src/app.tsx` so it mirrors the previous landing page assembly order:

1. `Navbar`
2. `HeroSection`
3. `StatsSection`
4. `ProblemSection`
5. `InfrastructureSection`
6. `ChainsSection`
7. `PrinciplesSection`
8. `BuildersSection`
9. `ProofSection`
10. `TeamSection`
11. `LabNotesSection`
12. `Footer`

## Cleanup Plan for `apps/web`

After `apps/landing` renders the migrated sections successfully:

- Delete `apps/web/src/components/landing/*`
- Delete landing-only support data under that folder
- Delete landing-only icons from `apps/web` if no remaining `apps/web` code references them
- Keep `apps/web/src/app/(public)/page.tsx` redirect behavior

Before deleting any icon or helper, confirm whether it is used elsewhere in `apps/web`.

## Testing Strategy

### Test-first expectations

Before implementation, define at least one SPA test expectation around the real landing content rendering, not just the placeholder shell.

Minimum coverage:

- Existing `apps/web` root redirect test remains passing
- New or updated `apps/landing` test proves migrated landing sections render

### Verification

Target verification after implementation:

- `apps/landing` tests pass
- `apps/landing` build passes
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `git diff --check`

Helm validation should still be exercised if the migration changes any landing build/runtime assumptions, but this design expects infra ownership to remain as already established.

## Risks and Mitigations

### Risk: hidden coupling to `apps/web`

Some landing sections may depend on icons, helpers, or aliases that currently live under the Next app tree.

Mitigation:

- Move or duplicate landing-only dependencies into `apps/landing`
- Ensure no imports remain from `apps/web` into `apps/landing`

### Risk: Next-specific primitives break under Vite

The old sections use `next/link` and `next/image`.

Mitigation:

- Replace them during migration with SPA-safe equivalents
- Keep the rendered markup and layout close to the original

### Risk: incomplete cleanup leaves dead code in `apps/web`

Mitigation:

- Search for references before deletion
- Remove only landing-only files confirmed unused by the product app

### Risk: minor visual drift

Mitigation:

- Port section-for-section instead of redesigning
- Preserve class names and content structure where possible

## Success Criteria

- `apps/landing` renders the full real landing page using the migrated sections
- `apps/web` no longer contains landing-only components or unused landing dependencies
- `apps/web` root redirect still behaves correctly
- Repo validation passes, excluding any unrelated pre-existing repo issues outside this migration
