---

description: "Task list for Grid and Flexbox Card Columns"
---

# Tasks: Grid and Flexbox Card Columns

**Input**: Design documents from `/specs/039-grid-flex-card-columns/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/authoring-marks.md, quickstart.md

**Tests**: Included (Principle V). Assert layout rules and positions; never assert a count of cards, files, or lines.
Playwright specs must not use TypeScript type annotations (the loader fails on them); use contextual typing.

**Organization**: By user story. New `.ts` files start with the SPDX license header. All code is formatted with
Prettier (`bun run format`).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Write `tests/e2e/card-parity.spec.ts`: screenshot `/` and `/nope` at 360, 768, and 1280 px (`fullPage: true`, `animations: "disabled"`, wait for `document.fonts.ready`). These pages have no cards, so they must look the same after this feature. The card pages change by design (the owner has already regrouped them with `||` and `---`), so their spacing is checked by T007 and T014
- [X] T002 Capture the baselines now, before touching `src/` or `content/`: `bun run test:e2e --project=chromium -g "Card parity" --update-snapshots`. Keep the PNGs in `tests/e2e/card-parity.spec.ts-snapshots/`; they are deleted when the owner accepts the change Also record today's measurements of `/web-development` at 360, 768, and 1280 px as constants in `tests/e2e/card-grid.spec.ts`, using a quick script against the unchanged build: the `.an-cards` content-box left and right edges, the Techno Bits card's left, right, and width, the gutter between columns, the gap between cards in a column, and the gap above Techno Bits. T007 and T014 compare against these constants

---

## Phase 2: Foundational (blocks all stories)

**Purpose**: Read the marks into rows, with the errors. Both column and full-width rows build on it.

- [X] T003 Write failing unit tests in `tests/unit/content.test.ts` for reading the marks: a second `||` in one row throws an error containing the file name and the card it follows; a `||` with text directly above it (no blank line) throws an error containing the file name and `blank line`; a leading, trailing, or doubled `---` creates no empty row; the `||` paragraph never appears in the output; each card's `--i` is its written position across all rows. These tests call `getContentPage` on a temporary content file, so the error carries the file name (the wrapper is added in T005); tests of `splitCards` alone check only the message without the file name
- [X] T004 In `src/lib/content.ts`, add `readRows(nodes)` used by `splitCards`: walk the top-level nodes (after the `h1`), start a card at each `h2`, treat a top-level `hr` as a row break and a top-level `p` whose only text is `||` as a column break (remove it from the output), drop rows with no cards, and throw on a second column break in a row (message: `more than one column break in a row (after "<card heading>")`) and on any paragraph with a line that is exactly `||` but is not alone (`put a blank line before and after "||"`). The data shapes are in `data-model.md`
- [X] T005 In `src/lib/content.ts`, make `getContentPage` catch these errors and rethrow them prefixed with the content file path, so the build names the file (FR-010)

**Checkpoint**: the error tests from T003 pass.

---

## Phase 3: User Story 1 - The author groups cards into columns by hand (Priority: P1) MVP

**Goal**: `||` splits a row into a left and right column, each a stack in written order, laid out with the owner's grid and flex rules at the same spacing as today.

**Independent Test**: Render a page with cards A, B, C, `||`, D, E: A, B, C stack on the left and D, E on the right at 1280 px, and read A to E in one column at 360 px.

### Tests for User Story 1

- [X] T006 [P] [US1] In `tests/unit/content.test.ts`, replace the "dealt into two columns" test: a row with `||` renders two `an-cards__col` divs, the left holding the cards before the break and the right those after, each in written order; an empty side still renders its (empty) column; no card is duplicated or dropped
- [X] T007 [P] [US1] Write `tests/e2e/card-grid.spec.ts` using the migrated `/web-development` page (not a page created during the test, because the site is built ahead of time). At 1280 px: the two `.an-cards__col` have equal width, the gutter between them is 24px, cards in a column are 24px apart, both columns start at the same top, the shorter column's last card does not stretch to the other column's height, and the outer edges match the constants recorded in T002. At 768 and 360 px: the cards form one column ordered by `--i`, 20px apart (`--space-5`). Arrangements such as an empty side or several rows stay in the unit tests T006 and T013

### Implementation for User Story 1

- [X] T008 [US1] In `splitCards` (`src/lib/content.ts`), stop dealing cards by odd and even index. For a row with a column break, emit `<div class="an-cards__col">` with the left cards, then another with the right cards (empty if there are none). Keep `--i` as the written position. Remove the alternation code and its comment
- [X] T009 [US1] In `src/styles/cards.css`, apply the owner's rules: `.an-cards` becomes `display: grid; grid: auto / 1fr 1fr; grid-gap: var(--space-6)` and keeps `align-items: start`; `.an-cards__col` becomes `display: flex; flex-direction: column; flex-wrap: wrap; grid-gap: var(--space-6); min-width: 0`. Remove the old `grid-template-columns`, the old `gap`, and the old column `display: grid`/`align-content`. Leave the `max-width: 860px` rules (`display: contents` on columns, `order: var(--i)`) in place and the 768 and 360 px checks in T007 must pass
- [X] T010 [US1] Migrate the existing pages (FR-013): insert a `||` line, with a blank line on each side, before the card at the middle of each page's first row, left side getting the extra card, in `content/web-development.md` (before the 10th of its 17 first-row cards), `content/technical-seo.md` (before the 7th of 11), `content/agentic-systems.md`, `content/cost-reduction.md`, `content/web-hosting.md` (before the 4th of 5 each), `content/process-re-engineering.md` (before the 3rd of 4), `content/growth-marketing.md` (before the 3rd of 3). The first row is the cards before the first body `---`. Change nothing else in these files. `content/about-us.md` and `content/lead-generation.md` already open with `---`; leave them
- [X] T011 [US1] Update `tests/e2e/web-development-responsive.spec.ts` for the new layout: two `.an-cards__col` side by side at 1280, equal widths, same top, one column in written order when narrow. Keep its `--i` order check
- [X] T012 [US1] Run `bun run test`, `bun run test:e2e --project=chromium -g "card-grid|responsive"`, and fix until they pass

**Checkpoint**: Columns work and every migrated page shows two columns.

---

## Phase 4: User Story 2 - A card can sit in its own full-width row (Priority: P1)

**Goal**: `---` starts a new row; a row without `||` shows each card full width; a later row can have its own columns.

**Independent Test**: At 1280 px, the Web Development page's Techno Bits card is below both columns, spans both, and its list flows in two columns, as before.

### Tests for User Story 2

- [X] T013 [P] [US2] In `tests/unit/content.test.ts`, replace the spec 033 test: a row with no `||` gives each card `an-tile--wide`, emitted directly in the grid after the earlier row; a later row with `||` after a `---` gets its own two columns below the first; a page that opens with `---` (like `about-us`) has every card wide; no `<hr` appears in the output
- [X] T014 [P] [US2] Update `tests/e2e/wide-card.spec.ts` for the new markup: the Techno Bits card spans from the left column's left edge to the right column's right edge at 1280 and 1920 px, sits below both columns, its list is in two columns when wide and one when narrow, and it is the last card on a phone, and its edges and width match the constants recorded in T002
- [X] T015 [P] [US2] Update the order check in `tests/e2e/web-development.spec.ts` ("shows its cards in reading order") so it no longer assumes alternation: cards are in `--i` order in the DOM

### Implementation for User Story 2

- [X] T016 [US2] In `splitCards` (`src/lib/content.ts`), emit a row with no column break as its cards with class `an-tile an-tile--wide`, directly in `.an-cards`, in written order, and emit rows in written order. Delete the old `wideFrom` logic
- [X] T017 [US2] In `src/styles/cards.css`, confirm `.an-tile--wide { grid-column: 1 / -1 }` and the two-column list rules still work with the grid gap, and that the narrow layout orders wide cards by `--i`; adjust only if a check fails
- [X] T018 [US2] Run `bun run test` and `bun run test:e2e --project=chromium` and fix until they pass

**Checkpoint**: Techno Bits and `about-us`/`lead-generation` look as they do today.

---

## Phase 5: User Story 3 - The author knows how to write it (Priority: P2)

**Goal**: The notes tell the owner exactly how to use the marks, and nothing still speaks of an alternating flow.

**Independent Test**: Render the contract's example exactly as written and see two columns plus a full-width card.

- [X] T019 [P] [US3] In `tests/unit/content.test.ts`, add a test that renders the example from `specs/039-grid-flex-card-columns/contracts/authoring-marks.md` verbatim (A and B left, C right, Techno Bits wide with its list) and checks the structure. Also assert that the example block in `content/README.md` is identical to the contract's example, so the notes and the tested example cannot drift
- [X] T020 [US3] Rewrite the "Card layout" bullets in `content/README.md`: remove the alternating text; describe the column break (`||`), the row break (`---`), a row with no break, the blank-line rule, the one-break-per-row rule, and include the example from the contract
- [X] T021 [P] [US3] Reword the comments in `src/lib/content.ts` and `src/styles/cards.css` in the language of rows and columns (FR-014); grep for `alternat` in `src/` and `tests/` and fix what refers to the old flow
- [X] T022 [P] [US3] Add a one-line note at the top of `specs/033-wide-closing-card/spec.md`, `specs/034-align-card-columns/spec.md`, and `specs/002-content-pages-card-template/spec.md`: `**Superseded in part by** [specs/039-grid-flex-card-columns](../039-grid-flex-card-columns/spec.md): the alternating column flow is replaced by author-grouped columns.` Change nothing else in them

---

## Phase 6: Polish & Cross-Cutting

- [X] T023 Run `bun run format`, `bun run format:check`, `bun run lint`, `bun run test`, and `bun run test:e2e --project=chromium` (includes `card-parity` against the baselines from T002); run the new card specs on firefox too
- [X] T024 Grep `src/styles/` for hover underlines and `src/` and `content/` for `#top` links (Principles IV and VI); the existing tests must still pass
- [X] T025 Walk through `quickstart.md`: view `/web-development` at 1280 and below 860 px, and try the three bad-mark cases with a temporary `content/try.md` (second `||`, glued `||`, trailing `||`); delete the file after
- [X] T026 Docker check: `./build.sh`, `./run.sh`, load the page, one `Ctrl+C`, confirm the shutdown line and no leftover container in `docker ps -a` (Principle VII)
- [X] T027 Delete `tests/e2e/card-parity.spec.ts` and its snapshots once the owner accepts the change; set the spec Status to Implemented
- [ ] T028 Commit with `git commit -s` and a subject ending `Closes #N.` (ask the owner for the issue number), only when the owner asks

---

## Dependencies & Order

- Phase 1 (baselines) comes first and must run before any change to `src/` or `content/`.
- Phase 2 before the stories. US1 before US2, since both edit `splitCards` and `cards.css`.
- T010 (page migration) must land before T011, T007's first run, and the e2e runs in T012, which read the real pages. T007 is written first and fails until then.
- US3 depends on US1 and US2 being done (it documents and tests their behavior).

## Parallel Examples

- T006 and T007 (different test files); T013, T014, and T015; T019, T021, and T022.

## Implementation Strategy

1. MVP: Phases 1 to 3 (columns by hand, pages migrated).
2. Add US2 (full-width rows).
3. Add US3 (docs, notes) and polish.
