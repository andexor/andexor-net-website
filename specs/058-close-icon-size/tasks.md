---

description: "Task list for Close Icon Size"
---

# Tasks: Close Icon Size

**Input**: Design documents from `/specs/058-close-icon-size/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state (spec 057 is built and committed or uncommitted; check `git status`). In
  `src/styles/marketing.css` the rule `.an-contact-header__close .svg-inline--fa.fa-square-x` is
  `height: 22px; width: 22px; background: transparent`, and the button rule above it is `width: 38px; height: 38px;
  padding: 0; display: flex; align-items: center; justify-content: center; --fa-secondary-opacity: 0`. `.an-contact-header`
  is a flex row with `padding: 22px 24px`. No markup change is needed in `src/components/contact/ContactPopup.tsx`. Read
  `tests/e2e/contact-close-icon.spec.ts` (its helper `expectSquareXInClose` checks the icon on both screens)

---

## Phase 2: User Story 1 - Larger X in the Close button (Priority: P1) MVP

**Goal**: The Close button's icon is 36 by 36 pixels, centered, fully inside the 38 by 38 button, with the button, the
header height, and every other look unchanged, on both the form and the Request received screens.

**Independent Test**: Open the popup and look at Close, send the form and look again: a larger white X mark on the same
glossy black button.

### Tests (write first, see them fail)

- [X] T002 [US1] Update `tests/e2e/contact-close-icon.spec.ts` (keep the file name and the SPDX header, no type annotations).
  Mention spec 058 in the header comment. In the helper `expectSquareXInClose`, change the expected icon width and height
  from 22 to 36 (within 0.5px). In the same `evaluate`, also read the icon box's `left`, `right`, `top`, and `bottom`
  against the button's, and the closest `.an-contact-header` element's height; assert the icon box lies inside the button's
  box on every side (allow 0.5px), and the header's height equals 44 plus the button's height within 1px. Keep every other
  assertion (class `fa-square-x`, `aria-hidden`, white color, transparent background, square layer opacity 0, X mark opacity
  1, icon centered within 1px, button 38 by 38, gradient background)
- [X] T003 Run `bun run test:e2e -- contact-close-icon --project=chromium` and confirm T002 fails on the 36 by 36 size
  assertions (not because the test server failed to start, and not on the header or inside-the-button assertions, which
  must already hold with the old icon)

### Implementation

- [X] T004 [US1] In `src/styles/marketing.css`, in the rule `.an-contact-header__close .svg-inline--fa.fa-square-x`, change
  `height` and `width` from `22px` to `36px` and add `flex: none`. Keep `background: transparent`. Do not change the button's
  38px size, its gradient, border, shadow, hover, press, or focus rules, or any other icon rule
- [X] T005 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass. If the icon is clipped,
  smaller than 36, or the header grows, fix the CSS rule rather than the test

**Checkpoint**: a 36px X in the 38px Close button.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T006 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the popup focus, Escape, keyboard, flow, and axe specs. Port 3000 must be free
- [X] T007 Build, serve, and look at the popup at 360, 768, and 1280 pixels, on the form screen and the Request received
  screen: the Close button is the same glossy black square with a larger white X mark centered and not clipped; hover, press,
  and the gold focus ring look as before; the header is the same height; nothing overlaps or scrolls sideways; the
  confirmation check is still 64px and the card bullets 24px
- [X] T008 Grep `src/styles/*.css` for `underline` and the changed files for typographic quotes; walk through
  `quickstart.md`. Leave the work uncommitted for the owner to review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 after T003. T005 after T004.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
