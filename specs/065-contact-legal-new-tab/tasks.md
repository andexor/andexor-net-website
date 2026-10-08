---

description: "Task list for Contact Legal Links In New Tab"
---

# Tasks: Contact Legal Links In New Tab

**Input**: Design documents from `/specs/065-contact-legal-new-tab/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. New and edited files keep or get the SPDX license header and are formatted with
Prettier (`bun run format`). The owner reviews before committing, so do not commit. Stay on the current branch; never
create or switch branches.

**Port 3000**: e2e runs need it free. After any run you interrupt or abort, check `ss -ltnp | grep :3000` and kill the
leftover bun server by PID, then confirm the port is free. Run the full e2e suite in the background and wait for it.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/contact/ContactPopup.tsx` (about line 208) the note holds
  `<span className="an-contact-form__legal">` with two plain `<a href="/privacy">Privacy</a>` and
  `<a href="/terms">Terms</a>` joined by `{" | "}`, each preceded by an ESLint disable comment. Confirm that
  `faArrowUpRightFromSquare` is exported by `@awesome.me/kit-0a6c11d394/icons/duotone/solid` (grep
  `node_modules/@awesome.me/kit-0a6c11d394/icons/modules/duotone/solid.d.ts`). Read `tests/e2e/contact-popup-links.spec.ts`,
  `tests/e2e/footer-links.spec.ts` (lines 22-50), and `tests/e2e/social-icon-size.spec.ts` as models. Check that port
  3000 is free

---

## Phase 2: User Story 1 - Privacy and Terms open in a new tab, and say so (Priority: P1) MVP

**Goal**: In the Contact Us popup note, the Privacy and Terms links open in a new tab, are named "Privacy, opens in new
tab" and "Terms, opens in new tab" by `aria-label`, and each shows a small hidden transparent duotone
arrow-up-right-from-square icon just after its text that fits on the line. The footer links do not change.

**Independent Test**: Open the popup, type in a field, click "Privacy": `/privacy` opens in a new tab and the popup keeps
its text. Same for "Terms". Read the two links: one name each, icons not exposed.

### Tests (write first, see them fail)

- [X] T002 [US1] Create `tests/e2e/contact-legal-new-tab.spec.ts` (SPDX header as `//` comments, no type annotations,
  header comment mentioning spec 065). Loop over `["Privacy", "/privacy", "Privacy, opens in new tab"]` and `["Terms",
  "/terms", "Terms, opens in new tab"]`; for each, open `/`, click the first "Contact Us" button, and find the link in
  `.an-contact-form__legal` by `getByRole("link", { name: <full name>, exact: true })`. Check: `target` is `_blank`; `rel`
  contains `noopener`; `aria-label` equals the full name; its `svg` has class `fa-arrow-up-right-from-square`,
  `aria-hidden="true"`, no `aria-label`, no `alt`, no `role` of its own other than what Font Awesome writes (do not assert a
  role); the svg's computed `background-color` is `rgba(0, 0, 0, 0)`; the svg's height is no greater than the link's
  computed `line-height` (parse the pixels; when `line-height` is `normal`, compare with the link's own height); and the
  svg sits after the link text (its left is greater than the link's text start) on the same line (its vertical center is
  within the link's top and bottom). Add a test that the note's text is still "We never share your personal information.
  Privacy | Terms" and that the page text has no "No obligation". Add a test that, in the footer, the "Privacy" and "Terms"
  links (found with `exact: true` inside `footer`) have no `target`, no `aria-label`, and contain no `svg`. Count nothing
- [X] T003 [US1] In `tests/e2e/contact-popup-links.spec.ts`, replace the same-tab navigation with a new-tab check (update the
  header comment to mention spec 065). For each link: open the popup, fill "Full name" with a test value, then click the
  link while waiting for the popup page (`const [newPage] = await Promise.all([page.context().waitForEvent("page"),
  link.click()])`); expect `newPage` URL to match the path, its level-1 heading to be visible, and, back on the original
  `page`, the dialog to still be visible with "Full name" still holding the typed value. Find the link by its full name
  with `exact: true`. Close `newPage` at the end
- [X] T004 [US1] Run `bun run build` and `bun run test:e2e -- contact-legal-new-tab contact-popup-links --project=chromium`.
  Confirm the new expectations fail because the links still have no `target`, name, or icon (not because of a typo or
  server startup). Free port 3000 afterward if the run was interrupted

### Implementation

- [X] T005 [US1] In `src/components/contact/ContactPopup.tsx`, add `faArrowUpRightFromSquare` to the existing import from
  `@awesome.me/kit-0a6c11d394/icons/duotone/solid`. On the Privacy link add `target="_blank"`,
  `rel="noopener noreferrer"`, `aria-label="Privacy, opens in new tab"`, and put
  `<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />` inside the `<a>` after the text "Privacy". Do the
  same on the Terms link with `aria-label="Terms, opens in new tab"`. Give the icons no `aria-label`, no `title`, and no
  `alt`. Do not put whitespace text next to the icon (the formatter rejects it); the gap comes from CSS. Keep the ESLint
  disable comments, the `{" | "}` separator, and the order. Update the comment above the links that says they are
  ordinary same-tab links
- [X] T006 [P] [US1] In `src/styles/marketing.css`, add `.svg-inline--fa.fa-arrow-up-right-from-square` (next to the
  other icon-size rules, and add a line to the sizing pattern comment if needed) with a size that fits the 12px note
  line, for example `height: 0.85em; width: 0.85em; margin-left: 0.25em; vertical-align: -0.1em`, and no background or
  box. Adjust the numbers until the T002 size and same-line checks pass. Do not touch Font Awesome's stylesheet and do
  not add underline or `!important`
- [X] T007 [P] [US1] At the top of `specs/062-footer-legal-links/spec.md`, after the Input line, add a short note that the
  Contact Us popup links' same-tab behavior (the Edge Cases entry and the "No new-tab behavior is added" sentence) is
  superseded by `specs/065-contact-legal-new-tab/spec.md`, and that the footer links and the rest of spec 062 still hold
- [X] T008 [US1] Run `bunx tsc --noEmit` (errors in the older untyped e2e specs are known and not ours; none may be in `src/`
  or the new test), `bun run test`, then `bun run build` and `bun run test:e2e -- contact-legal-new-tab
  contact-popup-links contact-popup-a11y keyboard-navigation contact-notice-text footer-links --project=chromium`. All
  pass. If another spec fails because it relied on the old link names or same-tab behavior, fix its lookup rather than the
  source

**Checkpoint**: the popup's Privacy and Terms links open new tabs, are named, and show their hidden icons.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T009 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e` (the full suite takes several minutes: run it in the background and wait; do not interrupt it, and
  if it is interrupted, free port 3000). All pass, including the a11y specs. A flaky webkit or ipad failure should be
  re-run alone before being reported
- [X] T010 Grep the changed files for curly quotes, hover or focus underlines, `alt=` on the icons, and `aria-label` on the
  icons; confirm none. Look at `out/index.html` or the popup's built HTML for the two `aria-label` values, `target="_blank"`,
  and the icons with `aria-hidden="true"`. Confirm the footer's Privacy and Terms links are unchanged in the built HTML
- [X] T011 Confirm port 3000 is free (`ss -ltnp | grep :3000`). Leave the changes uncommitted for the owner's review. When
  asked to commit, use `git commit -s` with a subject ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first, then T002 and T003 (different files, can run together), then T004. T005 follows T004. T006 and T007 touch
  different files and can run together with T005. T008 follows all of them. T009 to T011 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the tests first and failing, then the link attributes and icons, the sizing
rule, and the spec 062 note, then the full suite.
