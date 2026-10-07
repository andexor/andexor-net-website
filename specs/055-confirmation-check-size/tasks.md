---

description: "Task list for Confirmation Check Size"
---

# Tasks: Confirmation Check Size

**Input**: Design documents from `/specs/055-confirmation-check-size/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state (specs 051 to 054 are built but uncommitted). In `src/styles/marketing.css`,
  `.an-contact-confirmation__icon` is a 56 by 56 flex-centered circle (`background: var(--success-100)`,
  `color: var(--success-600)`, `--fa-secondary-opacity: 0`, `margin: 0 auto 16px`, no `overflow` setting), and
  `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check` is `height: 28px; width: 28px; background: transparent`.
  Confirm the global card bullet rule `.svg-inline--fa.fa-square-check` is 24px and must stay so. No markup change is
  needed in `src/components/contact/ContactPopup.tsx`. Read `tests/e2e/contact-confirmation-icon.spec.ts` (spec 054)

---

## Phase 2: User Story 1 - Larger check on the confirmation screen (Priority: P1) MVP

**Goal**: The confirmation icon is 64 by 64 pixels, centered in the 56px badge, with its check mark fully inside the
circle, and the heading, text, and OK button unmoved.

**Independent Test**: Send the Contact Us form with valid details: the check mark is larger, centered in the round badge,
with space around it.

### Tests (write first, see them fail)

- [X] T002 [US1] Update `tests/e2e/contact-confirmation-icon.spec.ts` (keep the file name and the SPDX header, no type
  annotations). Mention spec 055 in the header comment and in the first test's name. In the confirmation test, change the
  expected icon width and height from 28 to 64 (within 0.5px). Also read, on the same screen: the `.fa-primary` path's
  bounding box (the visible check mark) and the badge's bounding box, and assert the check mark's box lies inside the
  badge's box with at least 8px margin on every side; the `.an-contact-confirmation__heading` top edge minus the badge's
  bottom edge is at least 16px; and the `.an-contact-confirmation`'s nearest scrolling panel (the `.an-contact-panel`)
  has `scrollWidth` not greater than `clientWidth`. Keep every other assertion (class `fa-square-check`, `aria-hidden`,
  `--success-600` color, transparent background, square layer opacity 0, check mark opacity 1, badge 56 by 56 with
  `--success-100` background and round, icon centered within 1px) and the second test (card bullets still 24 by 24)
- [X] T003 Run `bun run test:e2e -- contact-confirmation-icon --project=chromium` and confirm T002 fails on the 64
  by 64 size assertions (not because the test server failed to start)

### Implementation

- [X] T004 [US1] In `src/styles/marketing.css`, in the rule
  `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check`, change `height` and `width` from `28px` to `64px` and
  add `flex: none`. Keep `background: transparent`. Do not touch `.an-contact-confirmation__icon` (it stays 56px) or the
  global 24px `.svg-inline--fa.fa-square-check` rule
- [X] T005 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass. If the icon measures
  less than 64 or the check mark is off center, fix the rule rather than the test

**Checkpoint**: a 64px icon, centered, in the 56px badge.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T006 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the contact popup focus, Escape, flow, and axe specs. Port 3000 must be free
- [X] T007 Build, serve, and look at the confirmation screen at 360, 768, and 1280 pixels: a larger dark green check mark
  centered in the round light green badge with space to the circle's edge, heading and OK button where they were, no
  scrollbars or clipping; then look at the card bullets and confirm they are still 24px
- [X] T008 Grep `src/styles/*.css` for `underline` and the changed files for typographic quotes; walk through
  `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 after T003. T005 after T004.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
