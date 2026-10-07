---

description: "Task list for Logo Alt Text"
---

# Tasks: Logo Alt Text

**Input**: Design documents from `/specs/059-logo-alt-text/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). Nothing visible changes, but the owner reviews before committing, so do not commit.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/marketing/Logo.tsx` the mark is
  `<img src="/logo/logo-gold.svg" alt="" className="an-logo-mark" />` and a comment above `Logo` says the mark is
  decorative. In `src/components/contact/ContactPopup.tsx` the header logo is
  `<img src="/logo/logo-gold.svg" alt="" className="an-contact-header__logo" />`. No other file under `src/` references
  `logo-gold.svg`. Read `tests/unit/logo.test.tsx`, `tests/unit/contact-popup.test.tsx` (the "shows the gold logo" test), and
  `tests/e2e/contact-popup-logo.spec.ts`

---

## Phase 2: User Story 1 - Logo image named "Andexor Network logo" (Priority: P1) MVP

**Goal**: Every logo mark image has the alt text "Andexor Network logo", taken from one exported constant, with nothing
changing on screen.

**Independent Test**: Open `/`, `/web-development`, `/nope`, and the Contact Us popup (both screens): every logo image's alt
text is "Andexor Network logo".

### Tests (write first, see them fail)

- [X] T002 [P] [US1] In `tests/unit/logo.test.tsx`: import `LOGO_ALT` from `@/components/marketing/Logo`. Rename the test
  "marks the image decorative so the name is announced once" to say the image is named, and assert the `img` alt equals
  `LOGO_ALT` and `LOGO_ALT` equals "Andexor Network logo" (literal). Change every link lookup that uses the name
  "Andexor Network" (in the "renders a link to href", the footer, and the not-found tests) to "Andexor Network logo Andexor
  Network", because the link's accessible name now includes the alt text. Keep the `toBeNull` footer check on the new
  name too. In the "logo-gold.svg is referenced in exactly..." test's neighborhood, add a test that reads
  `src/components/marketing/Logo.tsx` and `src/components/contact/ContactPopup.tsx` and, for every `<img` tag containing
  `logo-gold.svg`, expects it to contain `alt={LOGO_ALT}`. No counts
- [X] T003 [P] [US1] In `tests/unit/contact-popup.test.tsx`, update the "shows the gold logo, decorative, in the form and the
  confirmation" test (and its Spec 016 comment, rename it to say named, not decorative) so both `alt` expectations are
  "Andexor Network logo"
- [X] T004 [P] [US1] In `tests/e2e/contact-popup-logo.spec.ts` (keep the SPDX header, no type annotations), mention spec 059 in
  the header comment, change the form-screen `alt` expectation from `""` to "Andexor Network logo", and add the same alt
  assertion to the confirmation-state test
- [X] T005 [US1] Run `bun run test` and `bun run test:e2e -- contact-popup-logo --project=chromium`. Confirm the new
  expectations fail because the alt is still empty and `LOGO_ALT` is not exported (not because of a typo or server
  startup)

### Implementation

- [X] T006 [US1] In `src/components/marketing/Logo.tsx`, add `export const LOGO_ALT = "Andexor Network logo";` above
  `Logo`, use `alt={LOGO_ALT}` on the mark image, and rewrite the comment that says the mark is decorative to say the
  mark carries the alt text from `LOGO_ALT` (specs/059-logo-alt-text) and that screen readers hear the name twice by the
  owner's choice. Keep the eslint-disable comment above the `<img>`
- [X] T007 [US1] In `src/components/contact/ContactPopup.tsx`, import `LOGO_ALT` from `@/components/marketing/Logo` (or add it
  to the existing import from that module) and set the header logo's `alt={LOGO_ALT}`. Change nothing else
- [X] T008 [US1] Run `bunx tsc --noEmit`, `bun run test`, and the T004 test; confirm they pass. If an e2e spec that finds the
  header link by name fails, fix the lookup to the new name rather than the source

**Checkpoint**: every logo image says "Andexor Network logo".

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T009 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the a11y, brand wordmark, popup, and no-`#top` specs. Port 3000 must be free. A
  flaky webkit or ipad failure on the full run should be re-run alone before being reported
- [X] T010 Grep `src/` and `tests/` for `alt=""` next to `logo-gold.svg`, and the changed files for curly quotes and
  hover underlines; confirm none. Look at `out/index.html`, `out/web-development/index.html`, and `out/404.html` for
  `alt="Andexor Network logo"` on each logo image
- [X] T011 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #27.`

---

## Dependencies & Execution Order

- T001 first. T002, T003, T004 touch different files and can run together. T005 follows them. T006 and T007 follow T005 and
  can run together (different files). T008 follows both. T009 to T011 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: tests first and failing, then the constant and its two uses, then the full
suite.
