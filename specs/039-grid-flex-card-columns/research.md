# Research: Grid and Flexbox Card Columns

Findings come from reading the current code (`src/lib/content.ts`, `src/styles/cards.css`, the tests, and the content
pages). Nothing was changed.

## 1. How the cards are built today

- `splitCards()` in `src/lib/content.ts` turns each `##` section into an `<article class="an-tile">` with `--i` set to
  its written position, deals cards into two `.an-cards__col` divs by odd and even index, and appends cards after a
  `---` as `an-tile--wide`, directly in the grid.
- `---` is detected as a top-level `hr` node. A `---` before the first card (as in `about-us.md`,
  `lead-generation.md`) makes every card wide, which is how those two pages show full-width cards today.
- Narrow screens (`max-width: 860px`): `.an-cards` becomes a flex column, `.an-cards__col` becomes
  `display: contents`, and each tile uses `order: var(--i)`.
- The grid and columns get their spacing from `gap: var(--space-6)`.

## 2. The grid and column rules

- **Decision**: apply the owner's rules, including `grid-gap: var(--space-6)` on both `.an-cards` and `.an-cards__col`:
  - `.an-cards`: `display: grid; grid: auto / <two equal columns>; grid-gap: var(--space-6)`, keep `align-items: start`.
  - `.an-cards__col`: `display: flex; flex-direction: column; flex-wrap: wrap; grid-gap: var(--space-6); min-width: 0`.
    `grid-gap` is the older name for `gap`, and `gap` applies to flex containers, so the cards in a column are
    24px apart. `flex-wrap: wrap` never wraps in a column with automatic height; it is set as asked.
  - No padding or margin tricks are needed: the grid gap spaces the columns and rows, and the column gap spaces the
    cards.
- **Problem found**: percentage tracks do not make room for a gap. `grid: auto / 50% 50%` plus a 24px column gap is
  100% plus 24px, so the right column would run 24px past the container and each card would be 12px wider than
  today. That breaks FR-007 and SC-003 (same widths and spacing, to the pixel).
- **Decision (owner-confirmed)**: use two equal tracks that share the room left after the gap, `grid: auto / 1fr 1fr`. Each card is
  then (width minus 24px) divided by 2, exactly as today. The alternative that keeps the literal `50%` is
  `calc(50% - 12px)` for both tracks. Either gives the same result; `1fr 1fr` is simpler. **The owner confirmed `1fr 1fr`** (2026-10-05).
- **Narrow screens**: keep the existing `max-width: 860px` rules (`display: contents` on columns, `order: var(--i)`).
  With `display: contents` the column's gap does not apply, and the cards spread by the narrow-screen grid's own gap,
  as today.
- To tell the two columns apart, nothing extra is needed now (no side-specific padding), so no extra classes.
- **Alternatives**: padding and margins for the spacing (more rules, no benefit once gap is allowed); `50% 50%` with
  gap (overflows); `row-gap` only (not what the owner asked for).

## 3. Reading the marks

- **Column break** (`||` alone): a top-level `p` element whose only text is `||` (after trimming). It is removed from
  the output and starts the right column of the current row.
- **Row break** (`---`): the existing top-level `hr`. It closes the current row. A row break at the start, at the end,
  or right after another creates no empty row.
- A `||` line with no blank line before it merges into the previous paragraph. The build checks every paragraph for a
  line that is exactly `||` and fails with the file name, telling the author to put blank lines around it. This is
  the same constraint `---` already has (text directly above `---` becomes a heading).
- **A second `||` in one row** throws an error naming the card it follows. `splitCards` throws; `getContentPage`
  catches and prefixes the file path (FR-010).
- **Output**:
  - A row with a column break: two `div.an-cards__col` holding that side's cards. An empty side
    is still emitted, so the other side stays in its half.
  - A row with no column break: each card gets `an-tile--wide` and is emitted directly in the grid.
- `--i` stays the written position across all rows, so narrow screens read in written order.

## 4. Existing pages (FR-013)

Cards before the first `---` (or all cards when there is none) form the first row and need a `||` at the middle, left
side getting the extra card:

| Page | Cards in first row | Left side | Cards after `---` |
|---|---|---|---|
| web-development | 17 | 9 | 1 (Techno Bits, wide) |
| technical-seo | 11 | 6 | 1 (Ongoing Support, wide) |
| agentic-systems | 5 | 3 | 0 |
| cost-reduction | 5 | 3 | 0 |
| web-hosting | 5 | 3 | 0 |
| process-re-engineering | 4 | 2 | 0 |
| growth-marketing | 3 | 2 | 0 |
| about-us | 0 (leading `---`) | n/a | 3, all wide as today |
| lead-generation | 0 (leading `---`) | n/a | 3, all wide as today |

`about-us` and `lead-generation` already open with `---` and need no change. These page edits are limited to the
`||` line; no card text or order changes.

## 5. Testing strategy

- Unit (`tests/unit/content.test.ts`): replace the alternating and spec 033 tests with tests for the column break,
  the row break, rows with no column break, an empty side, a second break in one row (error names the file), a `||`
  glued to a paragraph (error), a leading and trailing `---` (no empty row), and written order preserved.
- E2E: update `web-development-responsive.spec.ts`, `wide-card.spec.ts`, and `web-development.spec.ts` where they
  assume alternating. Add `tests/e2e/card-grid.spec.ts` that measures geometry at 360, 768, and 1280: column
  widths equal, gutter 24px, gap between cards 24px, left card edges and right card edges match today's, the right
  column does not stretch to the left column's height, and on a phone the cards read in written order.
- Visual parity: the layout of migrated pages changes by design (halves instead of alternating), so screenshot
  comparison is limited to pages whose layout does not change (`about-us`, `lead-generation`, the home page, and the
  not-found page). Geometry tests cover the spacing on the others.

## 6. Documentation and old specs (FR-012, FR-014)

- Rewrite the "Card layout" bullets in `content/README.md` and the comments in `src/lib/content.ts` and
  `src/styles/cards.css` in the language of rows and columns.
- Specs 033 and 034 and the as-built 002 describe the alternating flow as history. They get a one-line
  "Superseded by 039" note at the top instead of a rewrite, so the record of what was built then stays accurate.
