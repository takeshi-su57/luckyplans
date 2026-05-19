---
name: apply-ui-baseline
description: Use when implementing or modifying frontend UI in apps/web to enforce the repository's HeroUI + Notion-style baseline consistently.
---

# Apply UI Baseline

## Core Rules
1. Use HeroUI components for UI primitives (forms/buttons/cards/tabs/chips/etc.).
2. Use Lucide icons (`lucide-react`) for iconography.
3. Use Tailwind for layout/spacing, not ad-hoc UI primitives.
4. Follow Notion-like color/typography/whitespace conventions.
5. Keep pages/components consistent with existing project visual language.

## Checklist
1. Replace raw HTML form/button primitives with HeroUI where touched.
2. Use approved text/icon colors and spacing conventions.
3. Ensure loading/empty/error states are visually consistent.
4. Preserve accessibility semantics (labels, keyboard behavior).
5. Validate on desktop and mobile.

