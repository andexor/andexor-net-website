# Tasks: Do Not Sell Opens the Cookie Banner

**Input**: Design documents from `/specs/083-do-not-sell-opens-banner/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: behavior tests only (spec FR-008 and CLAUDE.md, Tests): what the links do and where the comments are. No tests
for copy, wording, color, or spacing, and no count checks.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1, US2)

## Phase 1: Setup

No setup needed: no new dependency, configuration, or source file.

## Phase 2: Foundational

- [X] T001 In `src/components/marketing/PrivacySettingsLink.tsx`, change `PrivacySettingsLink` to take `{ className, children }`
  and render `<a href="#" className={className} onClick={onClick}>{children}</a>`, keeping the click handler
  (`event.preventDefault()`, then `window.Cookiebot?.renew()`) exactly as it is. Put the link text on one line as a child, with
  no newline inside the element (CLAUDE.md, Formatting). Update the comment above it to say spec 083 reuses it for the Do Not
  Sell link.
- [X] T002 In `src/components/marketing/Footer.tsx`, pass the text to the existing use:
  `<PrivacySettingsLink className="an-footer__col-link">{PRIVACY_SETTINGS}</PrivacySettingsLink>`. Nothing visible changes.

**Checkpoint**: Privacy Settings looks and acts as before; `bun run build` still passes.

## Phase 3: User Story 1 - Do Not Sell opens the cookie banner (Priority: P1) MVP

**Goal**: the Do Not Sell or Share My Personal Information link reopens the Cookiebot banner and stays on the page.

**Independent Test**: on any page click the link (and press Enter on it): the banner opens, the address and scroll
position do not change.

- [X] T003 [US1] In `src/components/marketing/Footer.tsx`, replace the Do Not Sell `<a href={DO_NOT_SELL_HREF} ...>` with
  `<PrivacySettingsLink className="an-footer__legal-link">Do Not Sell or Share My Personal Information</PrivacySettingsLink>` (text
  on one line). Delete `DO_NOT_SELL_HREF` and the comment above it. In the comment above `Footer`, say the Do Not Sell link now
  reopens the banner like Privacy Settings (spec 083, replacing spec 081's target).
- [X] T004 [US1] In `tests/e2e/footer-links.spec.ts`, delete the test "the Do Not Sell or Share link under the copyright line
  opens the Cookie Declaration section of the Privacy Policy". In its place add two tests that reuse `countRenewCalls`:
  (a) on `/`, scroll the Do Not Sell link into view, record `window.scrollY`, click it, and expect `__renewCalls` to be 1,
  the URL to still end in `/`, and `scrollY` unchanged; (b) on `/web-development`, focus the link, press Enter, and expect
  `__renewCalls` to be 1 and the URL unchanged. Match the style of the Privacy Settings tests beside them.
- [X] T005 [US1] Check that the e2e tests still pass for pages that also use the footer: run
  `bun run test:e2e -- footer-links cookie-declaration no-top-links` (port 3000 free) and fix anything that named the old
  target. Do not change a test only because wording changed.

**Checkpoint**: User Story 1 works on its own, and Privacy Settings is unchanged (spec scenario 4).

## Phase 4: User Story 2 - The page source says which law each link serves (Priority: P2)

**Goal**: each built page's footer has `<!-- For GDPR -->` directly before the Privacy Settings link and
`<!-- For CCPA -->` directly before the Do Not Sell link.

**Independent Test**: build, then read the footer in `out/index.html`, `out/privacy-policy.html`, and `out/404.html`.

- [X] T006 [P] [US2] In `scripts/format-html.ts`, add and export `addPrivacyComments(html: string, file: string): string`. On the
  raw (unformatted) page it inserts `<!-- For GDPR -->` immediately before the single `<a ...>Privacy Settings</a>` element and
  `<!-- For CCPA -->` immediately before the single `<a ...>Do Not Sell or Share My Personal Information</a>` element, with no
  whitespace between a comment and its link. Match the `<a` start tag, so the footer's text inside the framework's data scripts is
  never changed. If either link is found zero times or more than once, throw an error that names `file` (the same way
  `removeFrameworkNoindex` in `scripts/format-site.ts` does). Add the license header only if a new file is created (none is).
- [X] T007 [US2] In `scripts/format-site.ts`, make `formatPage` call `addPrivacyComments` on the page before `formatHtml`, after
  the 404 page's noindex removal, so the formatter's same-DOM check compares pages that both have the comments.
- [X] T008 [P] [US2] In `tests/unit/format-html.test.ts`, add tests for `addPrivacyComments`: with a small page that has both links
  (one-line, like `PAGE` in that file) each comment is directly before its link and nothing else in the page changes; with a link
  missing or repeated it throws and the message contains the file name. Test behavior only, not wording beyond the two comments
  the spec requires.
- [X] T009 [US2] In `tests/e2e/footer-links.spec.ts`, add a test that fetches the raw HTML (`request.get`) of `/`,
  `/web-development`, `/privacy-policy`, and `/nope` and expects each to contain `<!-- For GDPR -->` followed, with only
  whitespace between, by the Privacy Settings `<a` element, and `<!-- For CCPA -->` followed likewise by the Do Not Sell `<a`
  element. Do not assert how many pages there are.
- [X] T010 [US2] Run `bun run build` and read the footer in `out/index.html`, `out/privacy-policy.html`, and `out/404.html`.
  Then load the site (quickstart steps 2 and 3) as a first-time visitor and confirm there is no React error #418 on `/` and
  `/privacy-policy`; if there is, stop and report it, because the comments would be the cause.

**Checkpoint**: both stories work; the visible footer is unchanged (spec scenario 2 of Story 2).

## Phase 5: Polish and cross-cutting

- [X] T011 [P] Update `CLAUDE.md`: in the Formatting rules, the Cookie Declaration paragraph says the footer's Do Not Sell link
  opens that section; change it to say the Do Not Sell and Privacy Settings links both reopen the Cookiebot banner (spec 083),
  and add one line that the post-build pass adds the `For GDPR` and `For CCPA` comments (`addPrivacyComments`).
- [X] T012 [P] Add a short note to `specs/081-privacy-policy-consolidation/spec.md` (under Status) that spec 083 changed the Do Not
  Sell link's target from the Cookie Declaration section to reopening the banner.
- [X] T013 Run `bun run format`, `bun run format:check`, `bun run test`, and `bun run test:e2e -- footer-links cookie-declaration
  cookiebot page-metadata no-top-links`. Search the changed files for curly quotes and for hover underlines. Stop any server and
  confirm port 3000 is free.

## Dependencies and order

- T001 and T002 first (Foundational). T003 needs T001. T004 needs T003. T005 needs T004.
- Story 2 does not depend on Story 1's tests, only on the footer markup the build reads: T006 and T008 can start after T001
  (in parallel, different files); T007 needs T006; T009 needs T007 and T003; T010 needs T007.
- T011 and T012 can run in parallel with each other after T003.
- T013 is last.

## Parallel example

After T003: T006 (`scripts/format-html.ts`) and T008 (`tests/unit/format-html.test.ts`) in parallel, and T011 and T012
(docs) in parallel.

## Implementation strategy

1. MVP: T001 to T005 (User Story 1). The link behaves like Privacy Settings and the old test is replaced.
2. Then Story 2 (T006 to T010): the comments, with the first-visit check that React hydrates cleanly.
3. Polish (T011 to T013).
