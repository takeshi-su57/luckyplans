# UI Baseline — Notion-Style Design with HeroUI v3

**This is an enforcement rule.** All frontend code MUST follow this baseline.

The project uses a **Notion-inspired design system**: Inter font, Lucide icons, muted colors, generous whitespace, minimal borders. Built on **HeroUI v3** (`@heroui/react`) with **Tailwind CSS** for layout.

## Core Principles

1. **Notion aesthetic** — clean, minimal, document-like feel. No heavy borders or shadows unless needed
2. **HeroUI components** for all UI elements — no raw HTML form elements
3. **Lucide icons** (`lucide-react`) for all icons — Notion-compatible line icon style
4. **Tailwind** for layout only — flex, grid, spacing, positioning
5. **Icons everywhere** for accessibility — well-known actions can be icon-only

---

## Typography (Notion Scale)

**Font:** Inter (sans-serif), JetBrains Mono (monospace)

| Element | Size | Weight | Color | Classes |
|---------|------|--------|-------|---------|
| Page title | 40px | Bold (700) | `#37352f` | `text-[40px] font-bold text-[#37352f] leading-tight` |
| H1 / Section title | 30px | Semibold (600) | `#37352f` | `text-[30px] font-semibold text-[#37352f]` |
| H2 / Card title | 24px | Semibold (600) | `#37352f` | `text-2xl font-semibold text-[#37352f]` |
| H3 / Subsection | 20px | Semibold (600) | `#37352f` | `text-xl font-semibold text-[#37352f]` |
| Body text | 16px | Regular (400) | `#37352f` | `text-base text-[#37352f]` |
| Secondary text | 14px | Regular (400) | `#787774` | `text-sm text-[#787774]` |
| Caption / muted | 12px | Regular (400) | `#a3a29e` | `text-xs text-[#a3a29e]` |
| Label | 12px | Medium (500) | `#787774` | `text-xs font-medium text-[#787774] uppercase tracking-wide` |
| Code / mono | 14px | Regular (400) | `#eb5757` | `font-mono text-sm text-[#eb5757] bg-[#f1f1ef] px-1 py-0.5 rounded` |

**Line height:** `1.5` for body, `1.2` for headings (set in globals.css)

**Key Notion colors:**
- Primary text: `#37352f` (warm dark, NOT pure black)
- Secondary text: `#787774`
- Muted/placeholder: `#a3a29e`
- Icon gray: `#a6a299`
- Light background: `#fbfbfa` (page bg — very warm white)
- Surface: `#ffffff` (cards, sidebar)
- Hover bg: `#f1f1ef`
- Divider: `#e8e7e4`

---

## Color System (Notion Palette)

### Backgrounds

| Surface | Color | Usage |
|---------|-------|-------|
| Page body | `#fbfbfa` | App background (set in globals.css) |
| Cards / panels | `#ffffff` | Content cards |
| Sidebar | `#f7f6f3` | Navigation sidebar |
| Hover | `#f1f1ef` | Hover states on nav items, list items |
| Active/Selected | `#f1f1ef` | Selected nav item, active tab |
| Code block bg | `#f1f1ef` | Inline code, code blocks |
| Brand gradient | `from-emerald-600 to-emerald-900` | Login/register brand panel |

### Notion Accent Colors (for chips, badges, highlights)

| Name | Background | Text |
|------|-----------|------|
| Default | `#f1f1ef` | `#37352f` |
| Gray | `#e3e2e0` | `#787774` |
| Brown | `#eee0da` | `#64473a` |
| Orange | `#fadec9` | `#d9730d` |
| Yellow | `#fdecc8` | `#dfab01` |
| Green | `#dbeddb` | `#0f7b6c` |
| Blue | `#d3e5ef` | `#0b6e99` |
| Purple | `#e8deee` | `#6940a5` |
| Pink | `#f5e0e9` | `#ad1a72` |
| Red | `#ffe2dd` | `#e03e3e` |

### Text Colors

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary text | `#37352f` | Headings, body text |
| Secondary | `#787774` | Subtitles, descriptions |
| Muted | `#a3a29e` | Placeholders, captions |
| Icon default | `#a6a299` | Icons in nav, actions |
| Link / accent | `#0b6e99` | Links, primary actions |
| Error | `#e03e3e` | Error messages |
| Success | `#0f7b6c` | Success states |

### Borders

| Purpose | Color |
|---------|-------|
| Default divider | `#e8e7e4` |
| Subtle border | `#eeeeec` |
| Input border (focus) | `#0b6e99` |

---

## Icons — Lucide React

Lucide icons match Notion's thin, clean line icon style. Import from `lucide-react`.

### Icon Sizing

| Context | Class |
|---------|-------|
| Inline with text / small button | `size-4` (16px) |
| Navigation / section header | `size-[18px]` |
| Empty state | `size-10` (40px) |

### Icon Color

- Default: `text-[#a6a299]` (Notion icon gray)
- Active: `text-[#37352f]`
- On hover: `text-[#37352f]`

### Common Icon Mapping

| Action | Icon | Notes |
|--------|------|-------|
| Add | `Plus` | With text or icon-only |
| Edit | `Pencil` | Icon-only |
| Delete | `Trash2` | Icon-only, danger color |
| Close | `X` | Icon-only |
| Save | `Check` | |
| Upload | `Upload` | With text |
| External link | `ExternalLink` | After link text |
| Loading | `Loader2` | With `animate-spin` |
| Menu | `Menu` / `X` | Icon-only |
| Logout | `LogOut` | Icon-only |
| Collapse sidebar | `ChevronsLeft` / `ChevronsRight` | |

---

## HeroUI Components

### TextField

```tsx
import { TextField, Label, Input, TextArea } from '@heroui/react';

<TextField onChange={setValue}>
  <Label>Field Name</Label>
  <Input placeholder="..." value={value} />
</TextField>
```

### Buttons

```tsx
import { Button } from '@heroui/react';

<Button onPress={save}>Save</Button>                           // Primary
<Button variant="outline" onPress={cancel}>Cancel</Button>     // Outline
<Button variant="ghost" size="sm" onPress={edit}>Edit</Button> // Ghost
<Button variant="danger-soft" size="sm" isIconOnly><Trash2 className="size-4" /></Button>

// Loading
<Button isPending={saving} onPress={save}>
  {({isPending}) => isPending ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : 'Save'}
</Button>
```

### Card (Dot Notation)

```tsx
<Card>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>...</Card.Footer>
</Card>
```

### Tabs, Chip, Avatar, Skeleton

Use HeroUI dot notation — see previous examples in codebase.

---

## Layout

| Context | Classes |
|---------|---------|
| App content (shell) | `mx-auto max-w-6xl px-10 py-8 max-lg:px-6` |
| Public profile | `mx-auto max-w-5xl px-6 py-10 md:px-8` |
| Section spacing | `space-y-8` (generous like Notion) |
| Card list | `space-y-3` |
| Form fields | `gap-3` |
| Button groups | `gap-2` |

---

## Anti-Patterns (Do NOT)

- Use raw `<input>`, `<textarea>`, `<select>`, `<button>`, `<label>` — use HeroUI
- Use inline `<svg>` — use Lucide icons
- Use emoji for icons
- Use pure black (`#000000`) for text — use `#37352f` (Notion warm dark)
- Use pure white (`#ffffff`) for page background — use `#fbfbfa`
- Use heavy borders or drop shadows — keep it minimal like Notion
- Use `text-default-*` or `text-neutral-*` — use Notion hex colors directly
- Use `border-default-*` — use `border-[#e8e7e4]`
- Build custom form fields — use `TextField > Label + Input`
- Use any icon library other than `lucide-react`

## Enforcement

1. **New code** must follow this baseline
2. **Touching existing code** — migrate in the same change
3. **Exceptions** must have a comment explaining why
