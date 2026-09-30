# Research: Consistent Page Left Edge

## Decision 1: Reserve the scrollbar space with `scrollbar-gutter: stable`

- **Decision**: `html { scrollbar-gutter: stable; }` in `src/styles/globals.css`.
- **Rationale**: The cause is the classic 15px scrollbar appearing only on pages that scroll. It
  makes the centered container 7.5px further left there. Reserving the gutter on every page removes
  the difference. Measured 2026-09-30 in Chromium with visible scrollbars: before, left edge 15 /
  15 / 22.5px (home / web-development / not-found) at 1365px wide; after (prototype), 15 / 15 / 15px;
  at 1440px, 52.5 / 52.5 / 52.5px.
- **Alternatives considered**:
  - `overflow-y: scroll` on `html`: always shows a scrollbar track, even on short pages (visual
    change everywhere).
  - Padding the not-found page by 7.5px: hides the cause and breaks when a short page becomes long,
    or when the content shrinks or grows.
  - JavaScript that measures the scrollbar: more code for a problem CSS solves.
  - Setting a fixed `15px` side margin on every page: a sitewide redesign of the 24px padding, not
    what causes this.

## Decision 2: Browser support

- **Decision**: Accept that browsers without `scrollbar-gutter` (Safari before 18.2) keep today's
  7.5px shift.
- **Rationale**: Chrome 94+ and Firefox 97+ support it, and Safari 18.2+ does. The fallback is the
  current behavior, never a broken layout, and it costs nothing to add.
- **Alternatives considered**: A polyfill (unjustified for a cosmetic difference).

## Decision 3: Test with visible scrollbars in Chromium only

- **Decision**: `tests/e2e/left-edge.spec.ts` launches its own Chromium with the default
  `--hide-scrollbars` flag removed, checks scrollbars are really visible, then compares the header
  logo's left edge on three pages at 320px, 768px, 1365px, 1440px, and 1600px. It is skipped in
  other projects.
- **Rationale**: The shift only exists when scrollbars take space, and headless browsers hide them,
  so the current tests could never fail on this. Doing it in one browser is enough to guard the
  CSS declaration.
- **Alternatives considered**: A CSS text check (proves the line exists, not that the layout is
  stable); running in all six projects (device profiles use overlay scrollbars, so the check would
  prove nothing).

## Finding: headless desktop Chromium reserves the gutter even with scrollbars hidden

- **Observed** (implementation, 2026-09-30): with the fix, WebKit, Firefox, iPhone, iPad, and Android
  give a left edge of exactly 140px at 1600px wide (the value before the fix, so nothing moved with
  overlay or hidden scrollbars, FR-006). Headless desktop Chromium, which hides its scrollbar with
  `--hide-scrollbars`, gave 132.5px: it still reserves the classic 15px gutter. Real desktop
  Chrome either shows the scrollbar (15px, everything lines up) or uses overlay scrollbars (0px
  gutter), so users never see that hybrid state. The "unchanged from before" assertion therefore
  skips the desktop Chromium project and asserts only equality across pages there.

## Decision 4: Design guide rule without a pixel number

- **Decision**: Add the rule to `design/DESIGN.md` section 4, worded as consistency.
- **Rationale**: The owner asked for the rule in `DESIGN.md` and confirmed the "consistent left edge"
  wording. The left edge varies with window width, so a fixed number would be wrong.
- **Alternatives considered**: "15px" (rejected by the owner after seeing it comes from a 1365px
  window).

## Unknowns

None remaining.
