---

description: "Task list for Legal Icon Outside Link"
---

# Tasks: Legal Icon Outside Link

**Input**: Design documents from `/specs/066-legal-icon-outside-link/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: Included (Principle V), written first and seen to fail. Never assert a count of anything. Playwright specs
must not use TypeScript type annotations (the loader fails on them).

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: One user story. Edited files keep their SPDX license header and are formatted with Prettier
(`bun run format`). The owner reviews before committing, so do not commit. Stay on the current branch; never create or
switch branches.

**Port 3000**: e2e runs need it free. After any run you interrupt or abort, check `ss -ltnp | grep :3000` and kill the
leftover bun server by PID, then confirm the port is free. Run the full e2e suite in the background and wait for it. The
webkit, firefox, iphone, and ipad projects need browsers that are not installed for the current Playwright version, so run
`--project=chromium --project=android` and report that the others could not run.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. In `src/components/contact/ContactPopup.tsx` (about lines 212-232) each legal link is
  `<a ...>Privacy<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></a>` (and the same for Terms)
  inside `<span className="an-contact-form__legal">`, with `{" | "}` between the links. In `src/styles/marketing.css` find
  `.an-contact-form__legal`, `.an-contact-form__legal a`, and `.svg-inline--fa.fa-arrow-up-right-from-square`. Read
  `tests/e2e/contact-legal-new-tab.spec.ts`. Check that port 3000 is free

---

## Phase 2: User Story 1 - The new-tab icons sit after the links, not inside them (Priority: P1) MVP

**Goal**: Each popup legal link holds only its text, and each hidden transparent icon is the very next element after its
link, white, small, on the same line, with nothing else changed.

**Independent Test**: Open the Contact Us popup: "Privacy [icon] | Terms [icon]". The links contain no `svg`; each icon
is the next sibling of its link with no text between; clicking an icon does nothing.

### Tests (write first, see them fail)

- [X] T002 [US1] In `tests/e2e/contact-legal-new-tab.spec.ts` (keep the header, no type annotations; add spec 066 to the
  header comment), change the icon test for each link. Find the icon as the link's next sibling instead of inside it: in
  `link.evaluate`, use `const svg = el.nextElementSibling;`, return `adjacent: el.nextSibling === svg` and
  `tagName: svg.tagName.toLowerCase()`, and expect `adjacent` to be true and `tagName` to be `svg`. Check the sibling's
  `class` contains `fa-arrow-up-right-from-square`, `aria-hidden` is `"true"`, it has no `aria-label` and no `alt`, its
  background is `rgba(0, 0, 0, 0)`, its height is no greater than the link's text height, its left is at or after the link
  text's right edge, and its vertical middle is within the link's top and bottom. Add a check that the link itself holds no
  icon: `link.evaluate((el) => el.querySelector("svg"))` is `null`. Add a check that the icon's computed `color` equals
  white (`rgb(255, 255, 255)`). Keep the other tests (names, `target`, `rel`, note text, footer unchanged) as they are.
  Count nothing
- [X] T003 [US1] Run `bun run build` and `bun run test:e2e -- contact-legal-new-tab --project=chromium`. Confirm the
  icon tests fail because the icon is still inside the link (not because of a typo or server startup). Free port 3000
  afterward if the run was interrupted

### Implementation

- [X] T004 [US1] In `src/components/contact/ContactPopup.tsx`, move each `<FontAwesomeIcon icon={faArrowUpRightFromSquare}
  aria-hidden="true" />` out of its `<a>` so it is the next sibling directly after `</a>`: the Privacy icon before
  `{" | "}`, the Terms icon after the Terms `</a>`, inside the same `<span className="an-contact-form__legal">`. Leave
  each `<a>` holding only its text. Put nothing between a link and its icon (no text, no `{" "}`). Keep `target`, `rel`,
  and the `aria-label`s, and the comment above the links (update it if it mentions the icon being inside)
- [X] T005 [P] [US1] In `src/styles/marketing.css`, add a rule `.an-contact-form__legal .svg-inline--fa { color: #ffffff; }`
  after `.an-contact-form__legal a:hover`, with a short comment that the icon follows its link and is drawn in the link's
  resting color (spec 066). Add no hover rule. Keep the existing icon size rule unchanged unless the T002 size or same-line
  checks need a small adjustment
- [X] T006 [P] [US1] At the top of `specs/065-contact-legal-new-tab/spec.md`, after the Input line, add a short note that the
  icon's position (inside the links; FR-003 and the Edge Cases entry about sharing the link's hover color) is superseded by
  `specs/066-legal-icon-outside-link/spec.md`, and that the rest of spec 065 still holds
- [X] T007 [US1] Run `bunx tsc --noEmit` (errors in the older untyped e2e specs are known and not ours; none may be in `src/`
  or the new test), `bun run test`, then `bun run build` and `bun run test:e2e -- contact-legal-new-tab contact-popup-links
  contact-popup-a11y keyboard-navigation contact-notice-text footer-links --project=chromium`. All pass

**Checkpoint**: the popup's icons follow their links; the links hold only text.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [X] T008 Run `bun run format`, then `bun run format:check`, `bun run lint`, `bun run build`, `bun run test`, and
  `bun run test:e2e -- --project=chromium --project=android` (several minutes: run it in the background and wait; do not
  interrupt it, and if it is interrupted, free port 3000). All pass. Say plainly that webkit, firefox, iphone, and ipad
  could not run if their browsers are still not installed
- [X] T009 Grep the changed files for curly quotes, hover or focus underlines, `alt=` on the icons, and `aria-label` on the
  icons; confirm none
- [X] T010 Confirm port 3000 is free (`ss -ltnp | grep :3000`). Leave the changes uncommitted for the owner's review. When
  asked to commit, use `git commit -s` with a subject ending in `Closes #29.`

---

## Dependencies & Execution Order

- T001 first, then T002, then T003. T004 follows T003. T005 and T006 touch different files and can run together with T004.
  T007 follows all of them. T008 to T010 run last, in order.

## Implementation Strategy

One story, so the MVP is the whole feature: the test first and failing, then moving the two icons, the color rule, and
the spec 065 note, then the suite.
