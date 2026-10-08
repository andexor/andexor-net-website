---

description: "Task list for Privacy and Terms Links"
---

# Tasks: Privacy and Terms Links

**Input**: Design documents from `/specs/062-footer-legal-links/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: Two P1 stories, footer then popup. Edited and new files keep (or get) the SPDX license header and are
formatted with Prettier (`bun run format`). Nothing visible changes, but the owner reviews before committing, so do not
commit. Stay on the current branch; never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. `src/components/marketing/Footer.tsx` has `Privacy: "#privacy"` and `Terms: "#terms"`
  in `ITEM_HREFS` and a comment about placeholders (FR-017). `src/components/contact/ContactPopup.tsx` line 212 has
  `<a href="#privacy">` and `<a href="#terms">`. `content/privacy.md` and `content/terms.md` exist (H1s "Privacy Policy"
  and "Terms Of Service"). Read `tests/e2e/footer-links.spec.ts`. Grep `src/` and `tests/` for `#privacy` and `#terms`;
  the only other hit should be a sample string in `tests/unit/no-top-links.test.ts`, which stays

---

## Phase 2: User Story 1 - Footer opens the Privacy and Terms pages (Priority: P1) MVP

**Goal**: The footer's Privacy link goes to `/privacy` and Terms to `/terms`, from every page, with no visible change.

**Independent Test**: On `/`, `/web-development`, and `/nope`, click "Privacy" then "Terms" in the footer; each opens its
page.

### Tests (write first, see them fail)

- [X] T002 [US1] In `tests/e2e/footer-links.spec.ts` (keep the SPDX header, no type annotations), remove the `PLACEHOLDERS`
  array, its FR-003 comment, and the "are still placeholders" test. Add a `LEGAL` array `[["Privacy", "/privacy", "Privacy
  Policy"], ["Terms", "/terms", "Terms Of Service"]]` and, inside the `START_PAGES` loop, a test per entry: go to `start`,
  click the footer link by name (`exact: true`), expect the URL to end with the path and the level-1 heading to be the
  third value (`exact: true`). Mention spec 062 in a comment
- [X] T003 [US1] Run `bun run build` and `bun run test:e2e -- footer-links --project=chromium`. Confirm the new tests fail
  because the URL is still `#privacy` / `#terms` (not a typo or server startup). Port 3000 must be free

### Implementation

- [X] T004 [US1] In `src/components/marketing/Footer.tsx`, change `ITEM_HREFS` to `Privacy: "/privacy"` and
  `Terms: "/terms"`, and rewrite the comment above `Footer` so it no longer says they are placeholders. Change nothing
  else

**Checkpoint**: the footer links work.

---

## Phase 3: User Story 2 - Contact Us popup opens the Privacy and Terms pages (Priority: P1)

**Goal**: The popup note's "Privacy" and "Terms" links go to `/privacy` and `/terms`, with the same look, names, and
focus order.

**Independent Test**: Open Contact Us, click "Privacy"; reopen it and click "Terms"; each opens its page.

### Tests (write first, see them fail)

- [X] T005 [US2] Create `tests/e2e/contact-popup-links.spec.ts` (SPDX header, no type annotations, mention spec 062). For
  each of `["Privacy", "/privacy", "Privacy Policy"]` and `["Terms", "/terms", "Terms Of Service"]`: go to `/`, click the
  first "Contact Us" button, find the link inside `getByRole("dialog", { name: "Contact Us" })` by name (`exact: true`),
  click it, expect the URL to end with the path and the level-1 heading to be the third value. Add no count checks
- [X] T006 [US2] Run `bun run test:e2e -- contact-popup-links --project=chromium`. Confirm it fails because the URL is
  still a fragment, not for another reason

### Implementation

- [X] T007 [US2] In `src/components/contact/ContactPopup.tsx`, change `href="#privacy"` to `href="/privacy"` and
  `href="#terms"` to `href="/terms"`. Change nothing else (same text, same order, no `target`)
- [X] T008 [P] [US2] In `specs/001-homepage-contact-us/spec.md` FR-017, add "amended by 062: the footer and Contact Us
  popup Privacy and Terms links lead to `/privacy` and `/terms`" to the amendment note, and remove Privacy and Terms from
  the list of placeholders there. Do not touch other specs

**Checkpoint**: the popup links work.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T009 Run `bunx tsc --noEmit`, `bun run test`, and the T003 and T006 tests; confirm they pass. If another test breaks
  (for example `contact-popup-a11y` or `keyboard-navigation`), fix the cause, not the focus order or the link names
- [X] T010 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass. Port 3000 must be free. A flaky webkit or ipad failure on the full run should be re-run
  alone before being reported
- [X] T011 Grep `src/` for `#privacy` and `#terms` (none), and the changed files for curly quotes and hover underlines
  (none). Check `out/index.html` for `href="/privacy"` and `href="/terms"` in the footer
- [X] T012 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first. Story 1 (T002 to T004) and story 2 (T005 to T008) touch different files and are independent, but T002 and
  T005 each need a build to see the failure, so run the stories one after the other to keep port 3000 free. Within a
  story: test, see it fail, then source. T008 can run any time after T001. T009 to T012 run last, in order.

## Implementation Strategy

Footer first (the MVP), then the popup, then the full suite.
