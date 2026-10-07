---

description: "Task list for Card Bullet Icon Size"
---

# Tasks: Card Bullet Icon Size

**Input**: Design documents from `/specs/053-card-bullet-icon-size/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of cards or bullets. Playwright
specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state (specs 051 and 052 are built but uncommitted). In `src/styles/marketing.css`,
  `.svg-inline--fa.fa-square-check` is `height: 15px; width: 15px`, `.an-services__bullet` is a flex row
  (`align-items: center; gap: 8px`) with `font-size: 13px`, `.an-services__card-body` has `font-size: 14px`, and
  `.an-services__bullet-icon` has `flex: none`. No markup change is needed in `src/components/marketing/Services.tsx`

---

## Phase 2: User Story 1 - Larger bullet icons and text (Priority: P1) MVP

**Goal**: Every bullet in the eight home page service cards has a 24 by 24 icon, centered against its text, and 14px
text equal to the card description's size, with nothing overflowing at any width.

**Independent Test**: Open `/`: each bullet icon is 24 by 24, and the bullet text is the same size as the description.

### Tests (write first, see them fail)

- [X] T002 [US1] Update `tests/e2e/card-bullet-check-icon.spec.ts` (keep the file name and the SPDX header, no type
  annotations). Mention spec 053 in the header comment. In the loop over `.an-services__bullet` (never assert how
  many): change the expected icon width and height from 15 to 24 (within 0.5px); read the bullet text span's computed
  `font-size` and the computed `font-size` of that card's `.an-services__card-body` (the closest
  `.an-services__card` ancestor of the bullet) and assert both are `14px` and equal; assert the icon's vertical
  center is within 1px of its bullet's vertical center; and assert the bullet's right edge is at or inside the card's
  right edge. Keep every other assertion (class `fa-square-check`, `aria-hidden`, `--gold-300` color, transparent
  backgrounds, secondary layer opacity 0, primary opacity 1, 8px gap to the text)
- [X] T003 Run `bun run test:e2e -- card-bullet-check-icon --project=chromium` and confirm T002 fails on the size
  assertions (not because the test server failed to start)

### Implementation

- [X] T004 [US1] In `src/styles/marketing.css` change `.svg-inline--fa.fa-square-check` to `height: 24px; width: 24px`
  and `.an-services__bullet` to `font-size: 14px`. Nothing else changes (the 8px gap, 7px bullet spacing, `flex: none`,
  color, and clear square stay)
- [X] T005 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass

**Checkpoint**: 24px icons and 14px bullet text on all cards.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T006 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free
- [X] T007 Build, serve, and look at `/` at 360, 768, and 1280 pixels: icons 24px and centered against one- and
  two-line bullets, bullet text matching the description, no overlap, no text cut off, no horizontal scrolling, cards
  in a band keep equal widths
- [X] T008 Grep `src/styles/*.css` for `underline`, and the changed files for typographic quotes; walk through
  `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 after T003. T005 after T004.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
