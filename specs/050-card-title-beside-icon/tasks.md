---

description: "Task list for Card Title Beside Icon"
---

# Tasks: Card Title Beside Icon

**Input**: Design documents from `/specs/050-card-title-beside-icon/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards. Playwright specs must
not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/Services.tsx` the `<h3 className="an-services__card-title">`
  follows the `.an-services__card-top` div. In `src/styles/marketing.css`, `.an-services__card-top` is a flex row
  (`justify-content: space-between`, `margin-bottom: 16px`), `.an-services__icon-tile` is 48x48, and
  `.an-services__card-title` has `margin: 0 0 6px`. Note that `tests/e2e/homepage-content.spec.ts` ("service cards have
  no badge", spec 049) asserts that each top row is exactly as tall as its icon tile, which stops being true when a
  title wraps onto two lines

---

## Phase 2: User Story 1 - Title sits beside the icon (Priority: P1) MVP

**Goal**: In each of the eight home page service cards the title is in the top row, to the right of the icon with a
16px gap, vertically centered against it, left-aligned, and wrapping rather than truncating.

**Independent Test**: Open `/`: every card shows its title beside its icon; the description and bullets follow below the
row.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/card-title-beside-icon.spec.ts` (with the SPDX header, no type annotations). On `/` at
  1440px and at 360px, for each `.an-services__card` (loop over what is found, never assert how many), read the
  bounding boxes of `.an-services__icon-tile` and the `h3` and assert: the `h3` is inside `.an-services__card-top`; the
  `h3`'s left is at least 12px right of the tile's right edge; the `h3`'s right edge is inside the card's box; the
  `h3`'s computed `text-align` is `left` or `start`; and when the `h3` is one line tall (height at most 1.5 times its
  computed line height) its vertical center is within 1px of the tile's vertical center. Also assert that each tile
  is still 48px wide and tall (a long title must not squeeze it)
- [X] T003 [US1] In `tests/e2e/homepage-content.spec.ts` change the spec 049 test so it no longer requires the top row
  to be exactly the tile's height: assert the row is at least as tall as the tile (`expect(row).toBeGreaterThanOrEqual(tile)`)
  and keep the `.an-badge` check. Update its comment to say so
- [X] T004 Run `bun run test:e2e -- card-title-beside-icon --project=chromium` and confirm T002 fails

### Implementation

- [X] T005 [US1] In `src/components/marketing/Services.tsx` move the
  `<h3 className="an-services__card-title">{service.title}</h3>` element inside
  `<div className="an-services__card-top">`, after the `.an-services__icon-tile` span. Keep it an `h3` with the same
  class and text. Do not put a newline in React-rendered text
- [X] T006 [US1] In `src/styles/marketing.css`: on `.an-services__card-top` add `gap: 16px` and change
  `justify-content` from `space-between` to `flex-start` (keep `align-items: center` and `margin-bottom: 16px`); on
  `.an-services__icon-tile` add `flex: none`; on `.an-services__card-title` change `margin` to `0` and add
  `text-align: left` and `min-width: 0`
- [X] T007 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 and T003 tests; confirm they pass

**Checkpoint**: titles beside icons on all cards.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T008 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free
- [X] T009 Build, serve, and look at `/` at 360, 768, and 1280 pixels: title beside the icon with a gap, centered, left
  aligned; "Process Re-engineering" wraps cleanly where it needs to; no overlap, no horizontal scrolling, no title cut
  off; equal card widths in each band
- [X] T010 Grep `src/styles/*.css` for `underline` and the changed files for typographic quotes; walk through
  `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002 and T003 are different files and can be written together; T004 after both. T005 and T006 are
  different files, but do both before T007. T007 after both.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
