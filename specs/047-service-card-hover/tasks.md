---

description: "Task list for Service Card Hover"
---

# Tasks: Service Card Hover

**Input**: Design documents from `/specs/047-service-card-hover/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Assert computed styles; never assert a count of
cards. Resolve the gold from the token on the page, not a literal color. Playwright specs must not use TypeScript type
annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check (T007).

**Organization**: One user story. New `.ts` files start with the SPDX license header and are formatted with Prettier. This
is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/styles/components.css`, `.an-card--hover:hover` sets `box-shadow`,
  `transform: translateY(-2px)`, and `border-color`. In `src/styles/marketing.css`,
  `.an-services__card.an-card--hover:active` sets `transform: translateX(2px) translateY(2px)`. Confirm `--gold-500`
  exists in `src/styles/tokens/colors.css`. Grep `tests/` for any test that expects the old hover lift or border color,
  and grep `src/` to confirm only `src/components/marketing/Services.tsx` uses `hover` on `Card`

---

## Phase 2: User Story 1 - A service card on the home page reacts like a button (Priority: P1) MVP

**Goal**: On hover a home page service card shows a 2px gold-500 ring, does not move, and keeps its border color. While
pressed it moves 2px right and 2px down.

**Independent Test**: On the home page, hover a service card: a thin gold ring, no movement, same border color. Hold the
mouse button down on it: it moves a little right and down.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/service-card-hover.spec.ts` (SPDX header, no type annotations, no count assertions,
  Playwright retrying matchers so transitions can finish). On `/`, take the first `.an-services__card` and read its
  computed `transform`, `box-shadow`, and `border-color` at rest (pointer moved away). Resolve gold-500 from the token on
  the page. On hover, expect `transform` equal to the resting one, `box-shadow` to be that gold at 2px spread with zero
  blur and offsets (`<gold> 0px 0px 0px 2px`), and `border-color` equal to the resting one. With the mouse button held
  down on the card, expect `transform` to be `matrix(1, 0, 0, 1, 2, 2)`. Release the button, move away, and expect the
  card back at rest. Run `bun run test:e2e -- service-card-hover` and confirm it fails (the card lifts, the shadow is
  the old one, and the border changes)

### Implementation

- [X] T003 [US1] In `src/styles/components.css`, edit `.an-card--hover:hover`: set `box-shadow: 0 0 0 2px var(--gold-500)`
  and delete the `transform` and `border-color` declarations. Leave the transition on `.an-card--hover` as it is
- [X] T004 [US1] In `src/styles/marketing.css`, keep the `.an-services__card.an-card--hover:active` rule and its
  declarations as they are. Correct only its comment, which says the extra class outranks the design system's hover
  lift: that lift is gone, so say the rule moves a service card 2px right and 2px down while it is pressed, like the
  buttons
- [X] T005 [US1] Run `bun run format`, then `bun run test:e2e -- service-card-hover` and confirm it passes

---

## Phase 3: Polish

- [X] T006 Run `bun run build`, `bun run test:e2e`, and `bun run test`. Fix any existing test that expected the old
  hover (T001 lists them); do not weaken a test to make it pass
- [X] T007 Check `grep -n -A6 "an-card--hover:hover" src/styles/components.css` shows only the gold ring, `bun run
  format:check` passes, no hover underline was added (`grep` the CSS), and no curly quote is in the new or changed files
- [X] T008 Mark the spec Status as Implemented in `specs/047-service-card-hover/spec.md`, and leave the work uncommitted
  for the owner to review

---

## Dependencies

T001 -> T002 -> T003 -> T004 -> T005 -> T006 -> T007 -> T008. No parallel tasks: two stylesheets and one test file,
in order, and T004 only touches a comment.

## Implementation Strategy

MVP is User Story 1, which is the whole feature. Write the test, see it fail, edit the hover rule and the press rule's
comment, see it pass, run everything.
