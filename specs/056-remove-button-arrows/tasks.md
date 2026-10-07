---

description: "Task list for Remove Button Arrows"
---

# Tasks: Remove Button Arrows

**Input**: Design documents from `/specs/056-remove-button-arrows/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of buttons or cards. Playwright
specs must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/CTABand.tsx` the Contact Us `<Button>` has
  `rightIcon={<ArrowRight size={18} />}` and `ArrowRight` is the only name imported from `lucide-react`. In
  `src/components/contact/ContactPopup.tsx` the Send `<Button>` has
  `rightIcon={<ArrowRight size={18} aria-hidden="true" />}` and the import is `import { ArrowRight, X } from "lucide-react"`
  (`X` is the Close icon and stays). Grep `src/` and `tests/` for `ArrowRight` and `arrows`: the only other use is
  `tests/e2e/ok-button.spec.ts`, which expects `send.arrows` to be 1. Leave `src/components/ui/Button.tsx` and
  `src/styles/components.css` alone. Read `tests/e2e/send-button-style.spec.ts` and `tests/e2e/ok-button.spec.ts`

---

## Phase 2: User Story 1 - Buttons show text only (Priority: P1) MVP

**Goal**: The Contact Us button in the home page call-to-action band and the Send button in the popup show only their
labels, centered, with the same fonts, heights, colors, and interaction looks, and Send, Contact Us, and OK still match.

**Independent Test**: Open `/`: Contact Us has no arrow. Click it: Send has no arrow.

### Tests (write first, see them fail)

- [X] T002 [P] [US1] In `tests/e2e/ok-button.spec.ts` change `expect(send.arrows).toBe(1)` to `expect(send.arrows).toBe(0)`,
  rename the test to "OK looks like Send, and is centered", and update its comment (spec 056: Send has no arrow now, so
  OK and Send differ in nothing but the label)
- [X] T003 [P] [US1] Create `tests/e2e/button-no-arrow.spec.ts` (with the SPDX header, no type annotations). On `/`, take
  the button inside `.an-cta-band__button-wrap`; assert it contains no `svg` and its label is centered (the horizontal
  center of a `Range` over the button's text node is within 1px of the button's horizontal center). Then click it, and
  assert the same for the popup's "Send" button (found by role and name). Never assert how many buttons exist
- [X] T004 Run `bun run test:e2e -- button-no-arrow ok-button --project=chromium` and confirm T002 and T003 fail because
  the buttons still hold an icon (not because the test server failed to start)

### Implementation

- [X] T005 [P] [US1] In `src/components/marketing/CTABand.tsx` remove the `rightIcon={<ArrowRight size={18} />}` prop from
  the Contact Us `<Button>` and delete the `import { ArrowRight } from "lucide-react";` line. Keep every other prop
- [X] T006 [P] [US1] In `src/components/contact/ContactPopup.tsx` remove the
  `rightIcon={<ArrowRight size={18} aria-hidden="true" />}` prop from the Send `<Button>` and change the Lucide import to
  `import { X } from "lucide-react";`. Keep `type="submit"`, `variant`, `size`, and `disabled={submitting}`
- [X] T007 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 and T003 tests; confirm they pass, and that
  `tests/e2e/send-button-style.spec.ts` still passes

**Checkpoint**: no arrows on either button.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T008 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the popup focus, Escape, flow, and axe specs. Port 3000 must be free
- [X] T009 Build, serve, and look at `/` and the popup at 360, 768, and 1280 pixels: both buttons show only a centered
  label, Send still matches Contact Us in fill, ring, font, and height, OK still matches Send, nothing overlaps or is cut
  off
- [X] T010 `grep -rn "ArrowRight" src tests` finds nothing but the word in test names or comments if any; grep
  `src/styles/*.css` for `underline` and the changed files for typographic quotes; walk through `quickstart.md`. Leave the
  work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002 and T003 are different files and can be written together; T004 after both. T005 and T006 are
  different files and can be done together after T004; T007 after both.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
