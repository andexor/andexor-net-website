# Implementation Plan: Consistent Page Left Edge

**Branch**: `13-update-the-style-of-the-404-page` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-consistent-left-edge/spec.md`

## Summary

A page that is long enough to scroll shows a 15px classic scrollbar, which takes width from the page,
so its centered content sits 7.5px further left than on a short page such as "Page not found". The
fix is one declaration on the page root, `html { scrollbar-gutter: stable; }`, in
`src/styles/globals.css`: the browser then reserves the scrollbar space on every page, so scrolling
or not no longer changes the content's position. A new e2e check runs in a Chromium with visible
scrollbars (headless browsers hide them, which is why the problem never showed in tests), and
`design/DESIGN.md` gets the rule. No new dependencies, no layout or padding changes.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`); plain CSS

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Playwright (e2e), Vitest (unit), ESLint. The e2e spec checks the pages line up with
hidden or overlay scrollbars. A test with visible classic scrollbars was written and then removed
(owner decision 2026-09-30: classic scrollbars are essentially obsolete).

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change (one CSS declaration)

**Constraints**: Pages must look identical in windows with overlay scrollbars (FR-006); browsers
without `scrollbar-gutter` keep today's small shift (Safari before 18.2), never a broken layout

**Scale/Scope**: 1 stylesheet, 1 new e2e spec, 1 design-guide section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One CSS declaration on `html`. No JavaScript, no new tokens, no per-page rules. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Removes a layout shift between pages; the scrollbar itself is untouched. |
| IV. Design & content consistency | Pass, and this is the point: every page uses one left edge. |
| V. Test-first | Pass. The e2e test is written first, with a check that scrollbars are really visible so it cannot pass by accident. |
| VI. Always-dark, no link underlines | Not affected. |
| VII. Graceful shutdown | Not affected; verified by the usual Docker check. |
| VIII. Markdown-authored pages | Not affected. |
| License header | New test file gets the header. |

No violations. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/009-consistent-left-edge/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── left-edge.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/styles/globals.css          # edit: html { scrollbar-gutter: stable; } with a comment
design/DESIGN.md                # edit: section 4 "Spacing and Layout" gets the consistent-left-edge rule
tests/e2e/left-edge.spec.ts     # new: left edge equal on three pages, unchanged with hidden or overlay scrollbars
```

**Structure Decision**: Keep the existing layout. The declaration goes in `globals.css`, next to the
existing `body { margin: 0 }` page-level rule, not in `design/tokens/`, which mirrors the design
system and is scanned by other tests.

## Design Decisions

- **`scrollbar-gutter: stable` on `html`.** It reserves the scrollbar's space whether or not the page
  scrolls. With overlay scrollbars (phones, hidden scrollbars) the reserved width is 0, so nothing
  changes there (FR-006). A prototype on 2026-09-30 in Chromium with visible scrollbars gave a left
  edge of 15px on all three pages at 1365px wide (52.5px at 1440px), against 15px, 15px, 22.5px
  before.
- **Not `overflow-y: scroll`.** That forces a scrollbar track on short pages, which looks odd and
  changes the look of every short page.
- **Not a fixed side margin.** The layout is a centered container up to 1320px wide with 24px
  padding (`design/README.md`). The left edge depends on the window width and cannot be a single
  number such as 15px. The owner confirmed "consistent left edge" as the rule.
- **The test must see scrollbars.** Headless Chromium hides them by default
  (`--hide-scrollbars`), so the existing tests never saw the shift. The new spec launches its own
  Chromium with `ignoreDefaultArgs: ["--hide-scrollbars"]` and
  `args: ["--disable-features=OverlayScrollbar,OverlayScrollbars"]`, and first asserts that a
  scrolling page's `innerWidth - clientWidth` is greater than 0. The spec is skipped in the other
  Playwright projects, since those browsers and devices have their own scrollbar behavior and the
  flag is Chromium's.
- **Playwright loader.** Spec files here fail on TypeScript type annotations, so the spec uses
  contextual typing only.
- **Design guide wording.** Section 4 gets: all pages use one consistent left edge; a visible
  scrollbar or a short page must not move content; reserve the scrollbar gutter; new pages must not
  add their own side offsets. No pixel number, because the value depends on the window width.

## Complexity Tracking

Not needed.
