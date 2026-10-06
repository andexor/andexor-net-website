---

description: "Task list for Remove Card Hover"
---

# Tasks: Remove Card Hover

**Input**: Design documents from `/specs/046-remove-card-hover/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Assert computed styles; never assert a count of
cards. Playwright specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check (T006).

**Organization**: One user story. New `.ts` files start with the SPDX license header and are formatted with Prettier. This
is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state in `src/styles/cards.css`: `.an-tile:hover` sets `transform`, `box-shadow`, and
  `border-color`, and `.an-tile` has a `transition` on `transform`, `box-shadow`, and `border-color`. Grep `src/` and
  `tests/` for other uses of `.an-tile:hover`, and for tests that expect the lift or the transition

---

## Phase 2: User Story 1 - Cards stay still when the pointer is over them (Priority: P1) MVP

**Goal**: A card's position, shadow, and border color are the same with the pointer over it as at rest, on every
service page and on About Us. Links inside cards keep their hover color.

**Independent Test**: In the browser, move the pointer over a card on `/web-development` and `/about-us`: nothing
changes. Hover a link in a card: it still turns lighter blue.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/card-no-hover.spec.ts` (SPDX header, no type annotations, no count assertions). For
  `/web-development` and `/about-us`: read the first card's computed `transform`, `box-shadow`, and `border-color`, hover
  the card, read them again, and expect them to be equal. Also hover a link inside a card and expect its color to differ
  from its resting color. Run `bun run test:e2e -- card-no-hover` and confirm the card assertions fail (the card lifts)

### Implementation

- [X] T003 [US1] In `src/styles/cards.css`, delete the `.an-tile:hover` rule and the `transition` declaration on
  `.an-tile`. Leave the rest of `.an-tile` and the `.an-tile a:hover` rule as they are
- [X] T004 [US1] Run `bun run format`, then `bun run test:e2e -- card-no-hover` and confirm it passes

---

## Phase 3: Polish

- [X] T005 Run `bun run build`, `bun run test:e2e`, and `bun run test`. Fix any existing test that expected the lift or
  the transition (T001 lists them); do not weaken a test to make it pass
- [X] T006 Check `grep -rn "an-tile:hover" src/` finds nothing, `bun run format:check` passes, and no curly quote is in
  the new or changed files
- [X] T007 Mark the spec Status as Implemented in `specs/046-remove-card-hover/spec.md`, and leave the work uncommitted
  for the owner to review

---

## Dependencies

T001 -> T002 -> T003 -> T004 -> T005 -> T006 -> T007. No parallel tasks: one stylesheet and one test file, in order.

## Implementation Strategy

MVP is User Story 1, which is the whole feature. Write the test, see it fail, delete the rule and the transition, see it
pass, run everything.
