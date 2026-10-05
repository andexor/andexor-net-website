# Andexor Network — Design System Specification

> **Andexor Network, Inc.** provides enterprise-grade web, SEO, AI, and marketing services for small and medium-size businesses.
> **Brand promise:** Fortune-500 rigor, sized for your business.

The name **Andexor** is built from two logic gates — **AND** and **XOR** — overlapped and joined by an inserted letter **"e"** (AND + e + XOR → **Andexor**), so the two gate names read as a single pronounceable word. The logo is a single mark combining both gate symbols. The system inherits that engineered, precise, signal-clean personality throughout.

This document is a portable snapshot of the specification. The living source of truth is the design-system project (`styles.css` + `tokens/` + `components/`, compiled to `_ds_bundle.js`).

---

## 1 · Brand Voice and Content

**Voice:** Confident, precise, and plain-spoken — senior engineers and strategists who respect the reader's time. Credible over clever; specific over sweeping.

**Person:** "We" (Andexor) talking to "you" (the business owner / marketing lead). Never third-person about ourselves.

**Tone**
- Benefit first, mechanism second.
- Measured, quantified, qualified claims — no unbounded superlatives.
- Language of ownership: "one team that owns the whole sales funnel," "results we report on, not around."

**Casing**
- Headlines and body: **sentence case** ("Enterprise web, built right").
- Eyebrows / overlines / metric labels: **UPPERCASE**, mono, prefixed with `>>` (">> WHAT WE DO").
- Buttons: sentence case ("Get a proposal").

**Punctuation and style (locked rules)**
- **Never use italics** — for emphasis use weight, color, or caps.
- **Never use "&" as the word "and"** in reader-facing copy — always spell out "and". (Code operators and HTML entities are exempt.)
- **Always use the Oxford (serial) comma** — "web, SEO, and AI".
- **Never use curly, smart, or typographic quotes** — in any form, as characters or as HTML references. Use only the straight apostrophe (') and the straight double quote (").
- **No periods on headline phrases** — a period ends a complete sentence, not a fragment. "Built to scale" takes none; "Search is being rewritten by AI." keeps one because it is a full sentence.
- Numerals for stats ("+182%", "0.9s", "3.1×", "40+").
- **Emoji: never.** The mono `>>` prefix is the brand's textual icon for eyebrows.

**Vocabulary that fits:** audit, pipeline, signal, foundations, compound, fixed-scope, guardrails, deflect, attribution, Core Web Vitals.
**Avoid:** "ninja/rockstar/guru," "synergy," "revolutionary," hype, fake urgency.

---

## 2 · Color

Two brand colors anchor everything: **Andexor Blue `#002855`** (deep blue — authority, trust, the "ink") and **Old Gold `#EAAA00`** (accent — energy, the single highest-intent action). Cool **slate** neutrals are tuned toward the blue (never warm). Gold is used **sparingly** — hero CTA, key metric labels on dark, focus rings, small highlights — never as large fills (its contrast on white is poor; use `--gold-700`/`--gold-800` for gold text on light).

**Andexor Blue** — `950 #00132B · 900 #001B3A · 800 #002855 (PRIMARY) · 700 #013A73 · 600 #0A4F93 · 500 #1766B4 · 400 #4A8BD0 · 300 #8FB6E2 · 200 #C5D8EF · 100 #E7EFF8 · 50 #F3F7FC`

**Old Gold** — `800 #7A5900 · 700 #9C7100 · 600 #C08C00 · 500 #EAAA00 (ACCENT) · 400 #F4BD2E · 300 #F8D066 · 200 #FBE4A3 · 100 #FDF2D4 · 50 #FEF9EA`

**Slate (cool neutrals)** — `950 #0B1220 · 900 #111A2B · 800 #1E293B · 700 #334155 · 600 #475569 · 500 #64748B · 400 #94A3B8 · 300 #CBD5E1 · 200 #E2E8F0 · 100 #F1F5F9 · 50 #F8FAFC`

**Status** — success `#1F8A5B` · warning `#EAAA00` (gold-leaning) · danger `#D33A2C` (brick red) · info `#1766B4` (each with 600/100 steps).

**Semantic aliases (prefer these in product code):**
- Text — `--text-heading` (blue-800) · `--text-body` (slate-700) · `--text-muted` (slate-500) · `--text-subtle` (slate-400) · `--text-strong` (slate-900) · `--text-accent` (gold-700, gold readable on light) · `--text-link` (blue-600) · `--text-inverse` (white)
- Surfaces — `--surface-page` (slate-50) · `--surface-card` (white) · `--surface-sunken` (slate-100) · `--surface-ink` (blue-800) · `--surface-ink-2` (blue-900) · `--surface-accent-soft` (gold-50) · `--surface-brand-soft` (blue-50)
- Borders — `--border-subtle` (slate-200) · `--border-default` (slate-300) · `--border-strong` (slate-400) · `--border-ink` (blue-700)
- Interaction — `--focus-ring` (gold-500) · `--selection-bg` (gold-200)

**Dark mode — OS setting only (`prefers-color-scheme`), no in-app toggle.** The brand blue/gold scales are unchanged; only the semantic surface/text/border aliases flip so every pairing stays legible. **All designs must look good in both light and dark modes.** (Print is the one exception: physical documents are always pinned dark-on-white paper regardless of OS theme.)

---

## 3 · Typography

Three families, all Google Fonts (self-host before production):

| Role | Family | Weights | Usage |
|---|---|---|---|
| **Display** | Play | **400, 700 only** | Headlines, hero, stat values. Tracking −0.015 to −0.02em, leading 1.05–1.12. Geometric, engineered. |
| **Body** | Roboto | 400, 500, 700 | All UI and long-form copy. 16px base, leading 1.5. |
| **Mono** | Source Code Pro | 400, 500, 600 | Eyebrows, metric labels, code, data. UPPERCASE, tracking 0.14em, `>>` prefixes. |

> ⚠ **Play ships only Regular (400) and Bold (700)** — there is no medium/semibold. Never use 500/600 for display.

**Tokens:** `--font-display`, `--font-sans`, `--font-mono`.

**Type scale** — `2xs 11 · xs 12 · sm 14 · md 16 (base) · lg 18 · xl 22 · 2xl 28 · 3xl 36 · 4xl 48 · 5xl 60 · 6xl 76` (px).

**Line heights** — none 1 · tight 1.12 · snug 1.28 · normal 1.5 · relaxed 1.65.
**Tracking** — tighter −0.03 · tight −0.015 · normal 0 · wide 0.02 · wider 0.08 · caps 0.14em (eyebrows).

---

## 4 · Spacing and Layout

- **Base unit 4px.** Scale: `space-1 (4) · 2 (8) · 3 (12) · 4 (16) · 5 (20) · 6 (24) · 8 (32) · 10 (40) · 12 (48) · 16 (64) · 20 (80) · 24 (96) · 32 (128)`.
- **Containers:** `sm 640 · md 768 · lg 1024 · xl 1200 · 2xl 1320` px.
- **Consistent left edge.** Every page uses the same left edge: content starts at the same distance from the left of the window on every page, at every window width, whether or not the page is long enough to scroll. A visible scrollbar or a short page must never move content sideways, so the page root reserves the scrollbar's space (`scrollbar-gutter: stable` in `src/styles/globals.css`). A new page must not add its own side offsets to compensate. The value depends on the window width (a centered container up to 1320px with 24px padding), so this is a rule about consistency, not a fixed pixel number. Windows with classic (always visible) scrollbars are no longer tested, since they are essentially obsolete; `tests/e2e/left-edge.spec.ts` checks the pages line up with hidden or overlay scrollbars.
- **Section rhythm:** `--section-y: 96px` (tight variant 64px). Generous vertical breathing between page sections.

---

## 5 · Elevation, Radii, and Shape

**Radii (restrained, engineered — not pill-soft):** `xs 3 · sm 5 · md 8 · lg 12 · xl 16 · 2xl 24 · full 999` px. Cards use `xl`, buttons `md`, big CTA bands `2xl`. `full` reserved for pills, avatars, switches, status dots.

**Shadows — blue-tinted ramp** (`rgba(0,19,43,α)`, cool not black, sits naturally on slate):
- `xs` 0 1px 2px /.06 · `sm` layered /.08+.06 · `md` 0 4px 10px · `lg` 0 12px 24px · `xl` 0 24px 48px.
- Cards rest at `shadow-sm`, lift to `shadow-lg`; modals at `shadow-xl`.

**Borders:** hairline 1px slate. On ink surfaces, borders are `blue-700`. Crisp, never heavy.

**Focus:** a **3px gold halo** (`--ring: 0 0 0 3px rgba(234,170,0,.45)`) on `:focus-visible` — gold doubles as the accessibility accent.

---

## 6 · Backgrounds, Motion, and Interaction

**Backgrounds:** mostly flat — white/`slate-50` light surfaces, `blue-800/900` "ink" sections. **No photographic hero backgrounds.** The one signature texture is a faint **engineering grid** (1px lines on 48px cells) on blue, radially masked to fade out — used behind the hero. Gold radial *glows* allowed sparingly behind dark CTA bands. No noisy gradients, mesh blobs, or bluish-purple gradients.

**Animation:** restrained and functional. Transitions 0.15s (color/border) to 0.18s (lift) on `ease`. No bounce, no infinite decorative loops, no parallax.

**Hover:** buttons darken (primary → blue-700, accent → gold-400); secondary gains blue-400 border + blue-50 wash; links change color only and NEVER gain an underline on hover (a link that is not underlined at rest must never gain one on hover; this overrides the design system's original "links underline" rule, per the Andexor Network, Inc. website constitution, Principle VI); nav items shift slate→blue; cards lift 2px + deeper shadow + blue-200 border.

**Press:** 1px downward translate; primary deepens to blue-900, accent to gold-600.

**Transparency/blur:** sticky header white at 82% opacity with `backdrop-filter: blur`; modal scrim dark blue at 55% with light blur. Otherwise opaque.

---

## 7 · Iconography and Logo

- **Icon set: [Lucide](https://lucide.dev)** (`lucide@0.460.0`) — line style, 2px stroke, 24px grid, inline SVG with `stroke="currentColor"`. Matches the engineered Play + Source Code Pro pairing.
- ⚠ **Substitution flag:** Lucide is CDN-loaded in the UI kit; self-host and pin before production.
- **No emoji anywhere.** The mono `>>` prefix is the brand's textual "icon" for eyebrows.
- **Logo:** bespoke BIMI-compliant 96×96 SVG combining the AND gate (D-body) and XOR gate (double back-curve).
  - `assets/logo/andexor-logo.svg` — solid Blue + Old Gold boxed mark.
  - `assets/logo/logo-outline.svg` — line variant.
  - `assets/logo/logo-gold.svg` — **Old Gold on transparent** (for dark/photographic surfaces).

---

## 8 · Components

React primitives, bundled to `window.AndexorNetworkDesignSystem_d67969`. Each ships `<Name>.jsx` + `.d.ts` + `.prompt.md`.

**Forms**
- **Button** — `variant` (primary / secondary / ghost / accent), `size` (sm / md / lg), `block`, `onInk` (light treatment for dark backgrounds), `as`/`href`. Primary = blue; accent = gold (reserve for the single highest-intent action).
- **IconButton** — square icon-only control; same variant/size system.
- **Input** — `label`, `type`, `placeholder`; hairline border, focus halo.
- **Switch** — blue track when on; slate track off.

**Data display**
- **Badge** — `tone` (neutral / brand / accent / success / warning / danger / info), optional `dot`.
- **Tag** — chip; optional removable affordance.
- **Card** — surface container: white, 1px slate-200 border, `radius-xl`, `shadow-sm`. Variants `hover` (lift) and `ink` (dark blue). Prop `pad`. **No colored left-border accents** (anti-pattern for this brand).
- **Avatar** — `name` (initials fallback), `size`, `src`.
- **Stat** — big `value` (Play display) + mono `label`.

**Usage**
```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Card, Badge, Stat } = window.AndexorNetworkDesignSystem_d67969;
</script>
```

---

## 9 · Templates and Kits

**Templates** (`templates/<slug>/` — ready-to-copy starting points that load the system via a sibling `ds-base.js`):
- **Pitch deck** — on-brand 10-slide sales deck (16:9, keyboard-navigable).
- **Landing page** — single-offer conversion page (free-audit campaign) with lead form.
- **One-page proposal** — print-ready fixed-scope proposal (US Letter; adaptive on screen, dark-on-white in print).

**UI kit** (`ui_kits/marketing-site/`) — interactive recreation of the Andexor marketing homepage: Header, Hero, Services, Results, Testimonial, CTA, Footer, ContactUs. Includes a Tweaks panel (Signal color · Dark canvas · Rhythm) that remaps tokens system-wide.

---

## 10 · Project Structure

```
styles.css              single entry point consumers link (@imports only)
tokens/                 colors · typography (+Google Fonts) · spacing · elevation · base
components/
  forms/                Button · IconButton · Input · Switch
  data-display/         Badge · Tag · Card · Avatar · Stat
  components.css        shipped component classes
templates/              pitch-deck · landing-page · proposal (+ ds-base.js each)
ui_kits/marketing-site/ interactive homepage recreation
guidelines/cards/       specimen cards (Colors · Type · Spacing · Brand)
assets/logo/            brand marks (boxed · outline · gold-on-transparent)
```

> `_ds_bundle.js`, `_ds_manifest.json`, and `_adherence.oxlintrc.json` are **generated by the compiler** — never edit by hand.

### Sources
This is a **from-scratch brand** — no prior codebase, Figma, or brand book was provided; everything here was authored for this system. Link production assets here when they exist.
