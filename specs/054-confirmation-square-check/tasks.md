---

description: "Task list for Confirmation Square Check"
---

# Tasks: Confirmation Square Check

**Input**: Design documents from `/specs/054-confirmation-square-check/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). This is a UI change: do not commit until the owner has looked at it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state (specs 051 to 053 are built but uncommitted). In
  `src/components/contact/ContactPopup.tsx` the confirmation badge is
  `<div className="an-contact-confirmation__icon"><Check size={28} strokeWidth={2.5} aria-hidden="true" /></div>`, and
  `Check` is imported from `lucide-react` beside `ArrowRight` and `X`. In `src/styles/marketing.css`,
  `.an-contact-confirmation__icon` is a 56px flex-centered circle with `background: var(--success-100)` and
  `color: var(--success-600)`, and `.svg-inline--fa.fa-square-check` is the global 24px card bullet rule. Confirm
  `@fortawesome/react-fontawesome` and `faSquareCheck` are used by `src/components/marketing/Services.tsx`. Look at
  `tests/e2e/contact-flow.spec.ts` for how a test opens the popup and sends the form (Full name, Work email, Company
  website, Primary need, then Send)

---

## Phase 2: User Story 1 - Confirmation shows the square check (Priority: P1) MVP

**Goal**: The round light green badge on the Request received screen holds the FontAwesome square-check, 28 by 28
pixels, in `--success-600`, with its square layer clear and a transparent icon background, so only the check mark
shows over the circle; the badge and everything else are unchanged, and the card bullets stay 24px.

**Independent Test**: Send the Contact Us form with valid details: the badge shows a dark green check mark, 28 pixels,
centered, with nothing drawn around it.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/contact-confirmation-icon.spec.ts` (with the SPDX header, no type annotations). Open `/`,
  click the first "Contact Us" button, fill Full name, Work email, Company website, and Primary need
  (`Web Development`), click "Send", and wait for the "Request received" heading. Then, in the page, read the
  `.an-contact-confirmation__icon` badge and its `svg`, and assert: the svg has class `fa-square-check` and not
  `fa-check`; its box is 28 by 28 within 0.5px; `aria-hidden` is `true`; its computed `color` equals the resolved
  `--success-600` (set `style.color = "var(--success-600)"` on a temporary element and read its computed color); its
  computed `background-color` is `rgba(0, 0, 0, 0)`; its `.fa-secondary` path has computed `opacity` `0` and its
  `.fa-primary` path `1`; the badge is 56 by 56 with a computed `background-color` equal to the resolved `--success-100`
  and a `border-radius` of at least 28px; and the icon's center is within 1px of the badge's center. In the same test, or
  a second test that loads `/` without opening the popup, assert every `.an-services__bullet svg` is still 24 by 24
  (loop over what is found, never assert how many)
- [X] T003 Run `bun run test:e2e -- contact-confirmation-icon --project=chromium` and confirm T002 fails on the icon
  assertions (not because the test server failed to start)

### Implementation

- [X] T004 [US1] In `src/components/contact/ContactPopup.tsx` add
  `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";` and
  `import { faSquareCheck } from "@awesome.me/kit-0a6c11d394/icons/duotone/solid";` (placed with the other imports, the
  way `Services.tsx` does), remove `Check` from the `lucide-react` import, and replace the Lucide element with
  `<FontAwesomeIcon icon={faSquareCheck} aria-hidden="true" />` inside the same `an-contact-confirmation__icon` div. Nothing
  else in the file changes
- [X] T005 [US1] In `src/styles/marketing.css`: add `--fa-secondary-opacity: 0;` to the `.an-contact-confirmation__icon`
  rule (keep its size, radius, background, flex centering, margin, and color), and add, right after that rule,
  `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check { height: 28px; width: 28px; background: transparent; }`.
  Do not change `.svg-inline--fa.fa-square-check` (the 24px card bullet rule) or `.an-services__bullet-icon`
- [X] T006 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T002 test; confirm they pass

**Checkpoint**: the confirmation badge shows only a dark green check mark.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T007 Run `bun run format`, then `bun run format:check`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the contact popup focus, Escape, flow, and axe specs. Port 3000 must be free
- [X] T008 Build, serve, and look at the confirmation screen at 360, 768, and 1280 pixels: dark green check mark centered in
  the round light green badge, no square around it, no overlap, no sideways scrolling; then look at the card bullets
  and confirm they are still 24px
- [X] T009 Grep `src/styles/*.css` for `underline`, `src` for `Check` imports from `lucide-react` that nothing uses, and
  the changed files for typographic quotes; walk through `quickstart.md`. Leave the work uncommitted for the owner to
  review

---

## Dependencies & Execution Order

- T001 first. T002, then T003. T004 and T005 are different files and can be done together, but do both before T006.
- Polish last.

## Implementation Strategy

MVP is User Story 1, which is the whole feature.
