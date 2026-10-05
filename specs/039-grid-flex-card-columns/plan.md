# Implementation Plan: Grid and Flexbox Card Columns

**Branch**: `21-make-generated-content-readable` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/039-grid-flex-card-columns/spec.md`

## Summary

Replace the alternating two-column flow on card pages with a grid of two equal columns, each a flexbox stack, where the
author groups cards by hand: `||` splits a row into a left and right column, and `---` starts a new row. A row with no
`||` shows each card full width, which is what the Techno Bits card does today. `splitCards()` stops dealing cards by
odd and even index and instead reads the marks; the style sheet gets the owner's grid and flex rules, including `grid-gap` on the grid and on the columns,
with `1fr 1fr` tracks so the gap does not widen the cards (owner-confirmed). The seven existing pages that show two columns get a `||`
at the middle of their first row (written order kept). Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: unified, remark, rehype (existing). No new dependencies.

**Storage**: Markdown files in `content/`

**Testing**: Vitest (`tests/unit/content.test.ts`), Playwright (new `tests/e2e/card-grid.spec.ts`, updated card specs)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change; the markup and CSS are about the same size.

**Constraints**: Spacing pixel-identical at 360, 768, and 1280 px; written order on every screen; the not-underlined
links and always-dark rules stay; formatting follows spec 038 (Prettier, 4 spaces; `data-raw-html` regions and the
DOM gate keep working because the card markup stays inside `.an-cards`).

**Scale/Scope**: 9 card pages, one generator function, one style sheet.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. No dependency; two marks; no third column. |
| II. Component stack | Pass. Next.js SSG unchanged. |
| III. Accessibility & performance | Pass. Reading order stays written order (DOM order is written order); no new content. |
| IV. Design & content consistency | Pass. Same cards, same look; no `#top` link. |
| V. Test-first | Pass. Unit and geometry tests written with the change. |
| VI. Always-dark, no hover underline | Pass. CSS rules touched are layout only; grep for hover underlines before done. |
| VII. Graceful shutdown | Pass. Docker shutdown check rerun. |
| VIII. Markdown content | Pass. Pages stay Markdown; the only page edits are the `||` lines (FR-013). |
| Technology constraints | Pass. Bun, scripts, license headers, Prettier formatting. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/039-grid-flex-card-columns/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── authoring-marks.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/lib/content.ts                        # splitCards reads || and ---, builds rows; errors name the file
src/styles/cards.css                      # grid, flex columns, grid-gap; narrow-screen rules kept
content/*.md                              # a || line in the first row of 7 pages (FR-013)
content/README.md                         # new authoring text (FR-012)
tests/unit/content.test.ts                # replaces alternating and spec 033 tests
tests/e2e/card-grid.spec.ts               # new: geometry at 360, 768, 1280
tests/e2e/web-development-responsive.spec.ts, wide-card.spec.ts, web-development.spec.ts   # updated
specs/033-wide-closing-card, 034-align-card-columns, 002-content-pages-card-template        # "Superseded by 039" note
```

**Structure Decision**: Keep the single Next.js project. All logic stays in `splitCards()`; all layout stays in
`cards.css`.

## Implementation Order

1. Unit tests for the marks, then `splitCards()` (rows, columns, errors) and the file-name wrapper in `getContentPage`.
2. CSS grid, flex columns, gutter, spacing; narrow-screen rules checked.
3. Add `||` to the seven pages; rebuild and compare.
4. Update and add e2e geometry tests; screenshot parity for unchanged pages.
5. README text, comments, "Superseded" notes; Docker shutdown check.

## Complexity Tracking

No constitution violations to justify.
