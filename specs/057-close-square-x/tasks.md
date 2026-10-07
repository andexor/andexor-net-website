---

description: "Task list for Close Square X"
---

# Tasks: Close Square X

**Input**: Design documents from `/specs/057-close-square-x/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/contact/ContactPopup.tsx` the Close button is
  `<button onClick={onClose} aria-label="Close" className="an-contact-header__close"><X size={22} strokeWidth={3} aria-hidden="true" /></button>`,
  and `import { X } from "lucide-react";` is the only Lucide import left in `src/` (grep `src` for `lucide`). The file
  already imports `FontAwesomeIcon` and `faSquareCheck` (spec 054). In `src/styles/marketing.css`,
  `.an-contact-header__close` (the second rule, headed by the comment "Close is a square with only the X in it") sets
  `margin-left: auto; flex: none; width: 38px; height: 38px; padding: 0; display: flex; align-items: center;
  justify-content: center`, its first rule sets `color: #ffffff` and the glossy gradient, and
  `.an-contact-header__close svg` adds a drop shadow. Confirm `faSquareX` is exported by
  `@awesome.me/kit-0a6c11d394/icons/duotone/solid`. Read `tests/e2e/contact-confirmation-icon.spec.ts` for how a test
  opens the popup and sends the form

---

## Phase 2: User Story 1 - Close button uses the square-x icon (Priority: P1) MVP

**Goal**: The glossy black Close button, on both the form screen and the Request received screen, holds the FontAwesome
square-x icon in white, 22 by 22 pixels, centered, with its square layer clear and a transparent icon background, so only
the X mark shows; everything else about the button is unchanged.

**Independent Test**: Open the Contact Us popup and look at Close, send the form and look again: a white X mark on the
glossy black button, centered, with no square drawn around it.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/contact-close-icon.spec.ts` (with the SPDX header, no type annotations). Open `/`, click
  the first "Contact Us" button, and for the Close button (found by role and name "Close") assert, on the form screen: it
  holds an `svg` with class `fa-square-x`; that svg is 22 by 22 within 0.5px; its `aria-hidden` is `true`; its computed
  `color` is `rgb(255, 255, 255)`; its computed `background-color` is `rgba(0, 0, 0, 0)`; its `.fa-secondary` path has
  computed `opacity` `0` and its `.fa-primary` path `1`; the svg's center is within 1px of the button's center; the button
  is 38 by 38 within 0.5px and its computed `background-image` contains `linear-gradient`. Then fill Full name, Work email,
  Company website, and Primary need (`Web Development`), click "Send", wait for the "Request received" heading, and repeat
  the same assertions on the Close button (put them in a helper function inside the file). Never assert how many of
  anything exist
- [X] T003 Run `bun run test:e2e -- contact-close-icon --project=chromium` and confirm T002 fails on the icon class
  assertion (not because the test server failed to start)

### Implementation

- [X] T004 [P] [US1] In `src/components/contact/ContactPopup.tsx` add `faSquareX` to the existing import from
  `@awesome.me/kit-0a6c11d394/icons/duotone/solid` (keeping `faSquareCheck`), replace
  `<X size={22} strokeWidth={3} aria-hidden="true" />` with `<FontAwesomeIcon icon={faSquareX} aria-hidden="true" />`, and
  delete the `import { X } from "lucide-react";` line. Keep the button's `onClick` and `aria-label="Close"`
- [X] T005 [P] [US1] In `src/styles/marketing.css` add `--fa-secondary-opacity: 0;` to the second
  `.an-contact-header__close` rule (the size and centering rule), and add, right after the
  `.an-contact-header__close svg` rule,
  `.an-contact-header__close .svg-inline--fa.fa-square-x { height: 22px; width: 22px; background: transparent; }`. Do not change
  the button's gradient, border, shadow, hover, press, or focus rules, or any other icon rule
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass. If the icon is not 22 by 22
  or the square shows, fix the CSS rule rather than the test

**Checkpoint**: the Close button shows a white X mark on both screens.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the popup focus, Escape, keyboard, flow, and axe specs. Port 3000 must be free
- [X] T008 Build, serve, and look at the popup at 360, 768, and 1280 pixels, on the form screen and the Request received
  screen: the Close button is the same glossy black square with a white X mark centered in it and no inner square;
  hover, press, and the gold focus ring look as before; nothing overlaps or scrolls sideways; the confirmation check is
  still 64px and the card bullets 24px
- [X] T009 `grep -rn "lucide" src` finds nothing; grep `src/styles/*.css` for `underline` and the changed files for
  typographic quotes; walk through `quickstart.md`. Leave the work uncommitted for the owner to review. Mention to the
  owner that `lucide-react` is now unused and still listed in `package.json`

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 and T005 are different files and can be done together after T003; T006 after both.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
