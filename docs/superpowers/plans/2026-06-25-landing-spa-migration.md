# Landing SPA Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the real landing page from `apps/web` into `apps/landing`, preserve the current section-by-section structure, and remove landing-only code from the Next.js app.

**Architecture:** The migration ports the existing landing components and their supporting data/assets into `apps/landing` with thin compatibility changes for Vite (`img` and anchors instead of Next primitives). After the SPA renders the full landing composition, the obsolete landing component tree is removed from `apps/web` while the existing root redirect behavior stays intact.

**Tech Stack:** React 19, Vite, HeroUI v3, Tailwind CSS, Vitest, Next.js 16, Turbo, Helm

---

## File Structure

### Create

- `apps/landing/src/components/landing/Navbar.tsx`
- `apps/landing/src/components/landing/HeroSection.tsx`
- `apps/landing/src/components/landing/StatsSection.tsx`
- `apps/landing/src/components/landing/ProblemSection.tsx`
- `apps/landing/src/components/landing/InfrastructureSection.tsx`
- `apps/landing/src/components/landing/ChainsSection.tsx`
- `apps/landing/src/components/landing/PrinciplesSection.tsx`
- `apps/landing/src/components/landing/BuildersSection.tsx`
- `apps/landing/src/components/landing/ProofSection.tsx`
- `apps/landing/src/components/landing/TeamSection.tsx`
- `apps/landing/src/components/landing/LabNotesSection.tsx`
- `apps/landing/src/components/landing/Footer.tsx`
- `apps/landing/src/components/landing/SectionContainer.tsx`
- `apps/landing/src/components/landing/data/protocols.ts`
- `apps/landing/src/components/icons/GitHubIcon.tsx`
- `apps/landing/src/components/icons/types.ts`
- `apps/landing/src/components/icons/chains/ArbitrumIcon.tsx`
- `apps/landing/src/components/icons/chains/BaseIcon.tsx`
- `apps/landing/src/components/icons/chains/EthereumIcon.tsx`
- `apps/landing/src/components/icons/chains/MegaEthIcon.tsx`
- `apps/landing/src/components/icons/chains/PolygonIcon.tsx`
- `apps/landing/src/components/icons/chains/index.ts`
- `apps/landing/src/components/icons/protocols/AvntIcon.tsx`
- `apps/landing/src/components/icons/protocols/GmxIcon.tsx`
- `apps/landing/src/components/icons/protocols/GnsIcon.tsx`
- `apps/landing/src/components/icons/protocols/index.ts`

### Modify

- `apps/landing/src/app.tsx`
- `apps/landing/src/app.test.tsx`
- `apps/landing/src/styles.css`
- `apps/web/src/app/(public)/page.test.tsx` if redirect expectations need minor adjustment after cleanup

### Delete after port is stable

- `apps/web/src/components/landing/*`
- `apps/web/src/components/landing/data/*`
- landing-only icons under `apps/web/src/components/icons/**` that are no longer referenced by any `apps/web` code

### Inspect during implementation

- `apps/web/src/components/landing/*`
- `apps/web/src/components/icons/**`
- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/app/(public)/page.test.tsx`

---

### Task 1: Lock in the migrated landing test target

**Files:**
- Modify: `apps/landing/src/app.test.tsx`
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace the current simplified assertion with a test that proves the real landing composition is present.

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('Landing SPA', () => {
  it('renders the migrated landing sections', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /the analytics layer for perpetual dex trading/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /perpetual dex trading lacks infrastructure/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /lab notes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: FAIL because `apps/landing/src/app.tsx` still renders the simplified placeholder composition instead of the real migrated sections.

- [ ] **Step 3: Do not change production code yet**

Leave `apps/landing/src/app.tsx` unchanged in this task. The goal here is only to establish the red state for the real migration target.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/app.test.tsx
git commit -m "test: define landing spa migration target"
```

---

### Task 2: Port landing support data and icon dependencies into `apps/landing`

**Files:**
- Create: `apps/landing/src/components/landing/data/protocols.ts`
- Create: `apps/landing/src/components/icons/GitHubIcon.tsx`
- Create: `apps/landing/src/components/icons/types.ts`
- Create: `apps/landing/src/components/icons/chains/ArbitrumIcon.tsx`
- Create: `apps/landing/src/components/icons/chains/BaseIcon.tsx`
- Create: `apps/landing/src/components/icons/chains/EthereumIcon.tsx`
- Create: `apps/landing/src/components/icons/chains/MegaEthIcon.tsx`
- Create: `apps/landing/src/components/icons/chains/PolygonIcon.tsx`
- Create: `apps/landing/src/components/icons/chains/index.ts`
- Create: `apps/landing/src/components/icons/protocols/AvntIcon.tsx`
- Create: `apps/landing/src/components/icons/protocols/GmxIcon.tsx`
- Create: `apps/landing/src/components/icons/protocols/GnsIcon.tsx`
- Create: `apps/landing/src/components/icons/protocols/index.ts`
- Modify: imports in later landing components will use these files
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Copy the landing data module**

Copy the contents of `apps/web/src/components/landing/data/protocols.ts` into:

```ts
// apps/landing/src/components/landing/data/protocols.ts
```

Do not change the exported names yet. Keep the same data shape to minimize downstream edits.

- [ ] **Step 2: Copy the shared SVG type**

Copy:

```ts
// apps/web/src/components/icons/types.ts
export type SVGProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};
```

into:

```ts
// apps/landing/src/components/icons/types.ts
```

- [ ] **Step 3: Copy GitHub and protocol/chain icons used by landing**

Port the exact icon component bodies currently used by landing from `apps/web/src/components/icons/**` into the new `apps/landing` icon tree, preserving file names and exported component names.

Use this directory structure:

```text
apps/landing/src/components/icons/
apps/landing/src/components/icons/chains/
apps/landing/src/components/icons/protocols/
```

Add simple re-export files:

```ts
// apps/landing/src/components/icons/chains/index.ts
export * from './ArbitrumIcon';
export * from './BaseIcon';
export * from './EthereumIcon';
export * from './MegaEthIcon';
export * from './PolygonIcon';
```

```ts
// apps/landing/src/components/icons/protocols/index.ts
export * from './AvntIcon';
export * from './GmxIcon';
export * from './GnsIcon';
```

- [ ] **Step 4: Run the landing test to confirm it still fails for the expected reason**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: FAIL, but now only because the landing composition has not been ported yet, not because imports are missing.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/landing/data/protocols.ts apps/landing/src/components/icons
git commit -m "feat: port landing support data and icons"
```

---

### Task 3: Port the layout helper and navigation/footer shell

**Files:**
- Create: `apps/landing/src/components/landing/SectionContainer.tsx`
- Create: `apps/landing/src/components/landing/Navbar.tsx`
- Create: `apps/landing/src/components/landing/Footer.tsx`
- Modify: any Next-specific imports during port
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Copy `SectionContainer` unchanged**

Create:

```tsx
// apps/landing/src/components/landing/SectionContainer.tsx
export function SectionContainer({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-24 md:px-8">
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Port `Navbar` and replace Next primitives**

Create `apps/landing/src/components/landing/Navbar.tsx` using the existing `apps/web` version as the source, with these changes:

- `next/image` → `<img src="/brand.png" ... />`
- `next/link` → `<a href="...">`
- keep the mobile menu state and anchor structure
- app links should point at `import.meta.env.VITE_APP_URL || 'https://app.luckyplans.xyz/login'`
- docs links should point at `import.meta.env.VITE_DOCS_URL || 'https://app.luckyplans.xyz/docs'`

Keep in-page section anchors like `#infrastructure` and `#proof` as plain anchors.

- [ ] **Step 3: Port `Footer` and replace Next image**

Create `apps/landing/src/components/landing/Footer.tsx` from the existing version with:

- `next/image` → `<img>`
- links that previously targeted `/blog` and `/docs` changed to the correct external app/docs URLs for the SPA environment
- preserve the protocols/chains/project columns and current content

- [ ] **Step 4: Run the landing test to verify it still fails only because the middle sections are not mounted yet**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: FAIL because `apps/landing/src/app.tsx` still does not compose the migrated sections.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/landing/SectionContainer.tsx apps/landing/src/components/landing/Navbar.tsx apps/landing/src/components/landing/Footer.tsx
git commit -m "feat: port landing shell components"
```

---

### Task 4: Port the hero and top-of-page content sections

**Files:**
- Create: `apps/landing/src/components/landing/HeroSection.tsx`
- Create: `apps/landing/src/components/landing/StatsSection.tsx`
- Create: `apps/landing/src/components/landing/ProblemSection.tsx`
- Modify: import paths for icons and data
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Port `HeroSection`**

Create `apps/landing/src/components/landing/HeroSection.tsx` from the existing version with:

- `next/image` → `<img>`
- `next/link` → `<a>`
- `/register` link replaced with `${import.meta.env.VITE_APP_URL || 'https://app.luckyplans.xyz/login'}` for the primary CTA
- preserve copy, chain pills, protocol badges, and aggregate metrics

- [ ] **Step 2: Port `StatsSection` unchanged except local data import path**

Create:

```tsx
// apps/landing/src/components/landing/StatsSection.tsx
```

using the current structure and values from the web version, with the import updated to:

```ts
import {
  AGGREGATE_VOLUME,
  AGGREGATE_TRADERS,
  AGGREGATE_PAIRS,
  PROTOCOL_COUNT,
  CHAIN_COUNT,
} from './data/protocols';
```

- [ ] **Step 3: Port `ProblemSection` unchanged except local helper import**

Create:

```tsx
// apps/landing/src/components/landing/ProblemSection.tsx
```

from the existing version using the local `SectionContainer`.

- [ ] **Step 4: Run the landing test to confirm the headline requirement is now satisfiable once composition is updated**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: still FAIL, because `App` has not yet been updated to mount these new sections.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/landing/HeroSection.tsx apps/landing/src/components/landing/StatsSection.tsx apps/landing/src/components/landing/ProblemSection.tsx
git commit -m "feat: port landing hero and summary sections"
```

---

### Task 5: Port the remaining middle and lower landing sections

**Files:**
- Create: `apps/landing/src/components/landing/InfrastructureSection.tsx`
- Create: `apps/landing/src/components/landing/ChainsSection.tsx`
- Create: `apps/landing/src/components/landing/PrinciplesSection.tsx`
- Create: `apps/landing/src/components/landing/BuildersSection.tsx`
- Create: `apps/landing/src/components/landing/ProofSection.tsx`
- Create: `apps/landing/src/components/landing/TeamSection.tsx`
- Create: `apps/landing/src/components/landing/LabNotesSection.tsx`
- Modify: import paths to local data/icons/helpers
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Port each remaining section file with minimal adaptation**

Create each file from its `apps/web/src/components/landing` source and change only:

- import paths to local `apps/landing` modules
- `next/link` → `<a>`
- `next/image` → `<img>`

Keep section IDs, copy, card structure, and class names intact.

- [ ] **Step 2: Preserve external and app-domain links intentionally**

Where a landing section links to docs, blog, GitHub, or app routes:

- app routes → `import.meta.env.VITE_APP_URL` / `VITE_DOCS_URL` when applicable
- blog/docs links that live in the Next app should point to `https://app.luckyplans.xyz/blog` and `https://app.luckyplans.xyz/docs` by default
- external GitHub or protocol links remain standard external anchors

- [ ] **Step 3: Run the landing test again**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: still FAIL until `apps/landing/src/app.tsx` mounts the real composition.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/components/landing
git commit -m "feat: port remaining landing content sections"
```

---

### Task 6: Replace the placeholder SPA composition with the real landing assembly

**Files:**
- Modify: `apps/landing/src/app.tsx`
- Test: `apps/landing/src/app.test.tsx`

- [ ] **Step 1: Replace the placeholder `App` composition**

Update `apps/landing/src/app.tsx` so it imports and renders:

```tsx
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { StatsSection } from './components/landing/StatsSection';
import { ProblemSection } from './components/landing/ProblemSection';
import { InfrastructureSection } from './components/landing/InfrastructureSection';
import { ChainsSection } from './components/landing/ChainsSection';
import { PrinciplesSection } from './components/landing/PrinciplesSection';
import { BuildersSection } from './components/landing/BuildersSection';
import { ProofSection } from './components/landing/ProofSection';
import { TeamSection } from './components/landing/TeamSection';
import { LabNotesSection } from './components/landing/LabNotesSection';
import { Footer } from './components/landing/Footer';
```

Render them in this order:

```tsx
export function App() {
  return (
    <div className="min-h-screen bg-white text-[#37352f]">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <InfrastructureSection />
        <ChainsSection />
        <PrinciplesSection />
        <BuildersSection />
        <ProofSection />
        <TeamSection />
        <LabNotesSection />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Remove placeholder-only arrays and helper text from `app.tsx`**

Delete the temporary `metrics`, `pillars`, `chains`, `systems`, and `navigate()` logic if the migrated components now own those responsibilities.

- [ ] **Step 3: Run the landing test to verify it passes**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: PASS

- [ ] **Step 4: Run the landing build to verify the migrated SPA compiles**

Run: `node .\node_modules\vite\bin\vite.js build`

Expected: successful Vite production build

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/app.tsx apps/landing/src/app.test.tsx
git commit -m "feat: compose real landing page in spa"
```

---

### Task 7: Confirm the Next.js root redirect still behaves correctly

**Files:**
- Modify: `apps/web/src/app/(public)/page.test.tsx` only if needed
- Test: `apps/web/src/app/(public)/page.test.tsx`

- [ ] **Step 1: Inspect the existing redirect test**

Confirm `apps/web/src/app/(public)/page.test.tsx` still asserts:

- no session → `/login`
- session present → `/dashboard`

Do not weaken these assertions.

- [ ] **Step 2: Run the redirect test**

Run: `node .\node_modules\vitest\vitest.mjs run "src/app/`(public`)/page.test.tsx"`

Expected: PASS

- [ ] **Step 3: Only edit the test if imports or environment assumptions changed**

If no change is needed, leave the file untouched.

- [ ] **Step 4: Commit only if the file changed**

```bash
git add apps/web/src/app/(public)/page.test.tsx
git commit -m "test: confirm web root redirect remains intact"
```

---

### Task 8: Remove landing-only code from `apps/web`

**Files:**
- Delete: `apps/web/src/components/landing/*`
- Delete: `apps/web/src/components/landing/data/*`
- Modify/Delete: landing-only files under `apps/web/src/components/icons/**` if no longer referenced
- Test: repo search plus app/web tests/build

- [ ] **Step 1: Find remaining references to web landing components**

Run:

```bash
rg -n "@/components/landing|src/components/landing" apps/web/src
```

Expected: no remaining imports outside files scheduled for deletion.

- [ ] **Step 2: Find which old icon files are still used by `apps/web`**

Run:

```bash
rg -n "components/icons/(chains|protocols)|GitHubIcon|SVGProps" apps/web/src
```

Use the results to separate shared app icons from landing-only icons.

- [ ] **Step 3: Delete the web landing tree**

Delete:

```text
apps/web/src/components/landing/
```

only after confirming no remaining `apps/web` code imports it.

- [ ] **Step 4: Delete any landing-only icon files left unused**

Delete only icon files proven unused by `apps/web` after the landing tree removal.

Do not delete icons still used by blog, profile, docs, or app features.

- [ ] **Step 5: Run search again to verify cleanup**

Run:

```bash
rg -n "@/components/landing|src/components/landing" apps/web/src
```

Expected: no matches

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components apps/web/src/app
git commit -m "refactor: remove landing page code from web app"
```

---

### Task 9: Run focused validation before full repo gates

**Files:**
- Test only

- [ ] **Step 1: Run the landing SPA test**

Run: `node .\node_modules\vitest\vitest.mjs run src/app.test.tsx`

Expected: PASS

- [ ] **Step 2: Run the Next redirect test**

Run: `node .\node_modules\vitest\vitest.mjs run "src/app/`(public`)/page.test.tsx"`

Expected: PASS

- [ ] **Step 3: Run the landing SPA build**

Run: `node .\node_modules\vite\bin\vite.js build`

Expected: PASS

- [ ] **Step 4: Run the Next app build directly**

Run: `pnpm.cmd --filter @luckyplans/web build`

Expected: PASS

- [ ] **Step 5: Commit only if focused validation forced code changes**

```bash
git add apps/landing apps/web
git commit -m "fix: address landing migration validation issues"
```

---

### Task 10: Run full repo verification and diff hygiene

**Files:**
- Modify only if validation reveals issues

- [ ] **Step 1: Run lint**

Run: `pnpm.cmd lint`

Expected: PASS

- [ ] **Step 2: Run type-check**

Run: `pnpm.cmd type-check`

Expected: PASS

- [ ] **Step 3: Run build**

Run: `pnpm.cmd build`

Expected: PASS

- [ ] **Step 4: Run diff hygiene**

Run: `git diff --check`

Expected: PASS with no whitespace or patch-format issues

- [ ] **Step 5: Inspect changed files**

Run:

```bash
git status --short
git diff --stat
```

Confirm the change set contains:

- new landing SPA section/component files
- removal of `apps/web` landing-only code
- no accidental product/auth/docs regressions

- [ ] **Step 6: Commit final migration state**

```bash
git add apps/landing apps/web infrastructure pnpm-lock.yaml docs/superpowers/specs docs/superpowers/plans .github
git commit -m "feat: move landing page into dedicated spa"
```

---

## Self-Review

### Spec coverage

- Move section-by-section landing content into `apps/landing`: covered by Tasks 2-6
- Adapt Next primitives to Vite-safe equivalents: covered by Tasks 3-5
- Keep `apps/web` root redirect behavior: covered by Task 7
- Remove landing-only code from `apps/web`: covered by Task 8
- Verify with tests/builds: covered by Tasks 9-10

No spec gaps found.

### Placeholder scan

- No `TBD`, `TODO`, or “similar to above” placeholders remain
- Each task includes concrete file paths, commands, and expected outcomes

### Type consistency

- `App` remains the exported root component in `apps/landing/src/app.tsx`
- Landing sections are consistently imported from `./components/landing/*`
- Redirect behavior remains `/login` and `/dashboard`

