---

description: "Task list for Contact Notice Text"
---

# Tasks: Contact Notice Text

**Input**: Design documents from `/specs/064-contact-notice-text/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. New and edited source files keep or get the SPDX license header and are formatted with
Prettier (`bun run format`); `design/` is not formatted. Nothing else visible changes, but the owner reviews before
committing, so do not commit. Stay on the current branch; never create or switch branches.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [ ] T001 Confirm the starting state. `src/components/contact/ContactPopup.tsx` line 210 reads "No obligation. We never
  share your personal information.{" "}" inside `<p className="an-contact-form__note">`. Grep `src/`, `tests/`, `content/`,
  `specs/`, and `design/` for "No obligation" (case-insensitive): expect only that line plus `design/README.md` line 82,
  `design/ui_kits/marketing-site/ContactUs.jsx.txt` line 60, and `design/_ds_bundle.js` line 1256 (and this feature's own
  spec files). Read `tests/e2e/contact-flow.spec.ts` for how the popup is opened (the "Contact Us" button)

---

## Phase 2: User Story 1 - The popup notice no longer says "No obligation." (Priority: P1) MVP

**Goal**: The note under the Contact Us form reads "We never share your personal information." followed by the Privacy
and Terms links, with no leading space, nothing else changed on screen, and the design documents matching.

**Independent Test**: Open the Contact Us popup from `/` and read the note: "We never share your personal information.
Privacy | Terms". "No obligation" appears nowhere.

### Tests (write first, see them fail)

- [ ] T002 [US1] Create `tests/e2e/contact-notice-text.spec.ts` (SPDX header as `//` comments, no type annotations,
  header comment mentioning spec 064). One test: go to `/`, click the first "Contact Us" button (as `contact-flow.spec.ts`
  does), find `.an-contact-form__note`, and check that it has text "We never share your personal information. Privacy |
  Terms" (`toHaveText`), that its `textContent` does not start with whitespace, and that
  `page.locator("body")` does not contain the text "No obligation" (`not.toContainText`). Count nothing
- [ ] T003 [US1] Run `bun run build` and `bun run test:e2e -- contact-notice-text --project=chromium`. Confirm it fails
  because the note still starts with "No obligation." (not because of a typo or server startup). Port 3000 must be free

### Implementation

- [ ] T004 [US1] In `src/components/contact/ContactPopup.tsx` line 210, remove "No obligation. " so the line reads
  "We never share your personal information.{" "}". Change nothing else (keep the `{" "}` and the links)
- [ ] T005 [P] [US1] In `design/README.md` line 82, change the note to "We never share your personal information." (the
  rest of the line is unchanged)
- [ ] T006 [P] [US1] In `design/ui_kits/marketing-site/ContactUs.jsx.txt` line 60, remove "No obligation. " from the
  paragraph text
- [ ] T007 [P] [US1] In `design/_ds_bundle.js` line 1256, remove "No obligation. " from the string
  (`"We never share your personal information."`), keeping the surrounding code byte for byte
- [ ] T008 [US1] Run `bunx tsc --noEmit` (errors in the older untyped e2e specs are known and not ours; none may be in
  `src/` or the new test), `bun run test`, and the T003 test, then
  `bun run test:e2e -- contact --project=chromium`. All pass

**Checkpoint**: the popup note starts with "We never share your personal information."

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T009 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e`. All pass, including the contact popup and a11y specs. Port 3000 must be free. The full e2e run
  takes several minutes: run it in the background and wait for it. A flaky webkit or ipad failure should be re-run alone
  before being reported
- [ ] T010 Grep the changed files for curly quotes and hover underlines, and `src/`, `tests/`, `design/`, `content/`, and
  `out/` for "No obligation"; confirm none
- [ ] T011 Leave the changes uncommitted for the owner's review. When asked to commit, use `git commit -s` with a subject
  ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first, then T002, then T003. T004 follows T003. T005, T006, and T007 touch different files and can run together
  with T004. T008 follows all of them. T009 to T011 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the test first and failing, then the one-line source edit and the three
design copies, then the full suite.
