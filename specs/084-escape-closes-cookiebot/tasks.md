# Tasks: Escape Closes the Cookiebot Dialog

**Input**: Design documents from `/specs/084-escape-closes-cookiebot/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: behavior tests only (spec FR-008 and CLAUDE.md, Tests): what Escape does and when. No tests for copy,
wording, color, or spacing, and no count checks.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: the user story the task serves (US1, US2)

## Phase 1: Setup

No setup needed: no new dependency or configuration.

## Phase 2: Foundational

No blocking prerequisites. The one component serves both stories.

## Phase 3: User Story 1 - Escape closes the dialog (Priority: P1) MVP

**Goal**: with the Cookiebot dialog showing, one press of Escape closes it exactly as its Close button does.

**Independent Test**: as a first-time visitor, wait for the dialog, press Escape once, and see it close; repeat from the
footer's Privacy Settings link.

- [X] T001 [US1] Create `src/components/marketing/CookiebotEscape.tsx`, starting with the license header, as a `"use client"`
  component that returns `null`. One `useEffect` follows plan.md, Design items 1 to 4: listen on `window` for
  `CookiebotOnDialogDisplay`, and start at once if `#CybotCookiebotDialog` is already showing (computed `display` not
  `none`). Starting adds a `keydown` listener and a capturing `click` listener to `document`. The key handler ignores the
  event unless `key` is `Escape`, and when `defaultPrevented` or `isComposing`; if the dialog is missing or hidden it stops
  the listeners and returns; otherwise it finds `#CybotCookiebotBannerCloseButton` and, if present, calls
  `preventDefault()` and `click()` on it. The click handler stops both listeners when its target is inside
  `#CybotCookiebotBannerCloseButton` (this also covers Escape's own click). `CookiebotOnAccept` and `CookiebotOnDecline`
  on `window` stop them too, and cleanup removes everything. Starting twice must not add duplicates. Match the comment
  style of `ContactPopup.tsx` and cite spec 084. No newline in rendered text (nothing renders).
- [X] T002 [US1] In `src/app/layout.tsx`, import `CookiebotEscape` and render `<CookiebotEscape />` inside `<body>`,
  directly before `<ContactProvider>`.
- [X] T003 [US1] Create `tests/e2e/cookiebot-escape.spec.ts`, starting with the license header, importing `test` and
  `expect` from `./fixtures`, and with the same note about contextual typing as `contact-escape.spec.ts`. Add a helper that
  injects a stand-in dialog into the page: a `div#CybotCookiebotDialog` with a `button#CybotCookiebotBannerCloseButton`
  whose click hides the dialog and adds one to `window.__closeClicks`, then dispatches `CookiebotOnDialogDisplay` on
  `window`. Tests: (a) Escape closes the dialog and `__closeClicks` is 1, with focus on the page, on the Close button, and
  on a link behind it; (b) the footer reopening is stood in for by showing the dialog again and dispatching the event, and
  Escape works again.
- [X] T004 [US1] Run `bun run format`, then `bun run test:e2e -- cookiebot-escape contact-escape` (port 3000 free) and fix
  anything that fails. Free port 3000 afterward if the run is interrupted.

**Checkpoint**: User Story 1 works on its own with the stand-in dialog.

## Phase 4: User Story 2 - Escape does nothing when there is no dialog (Priority: P2)

**Goal**: Escape changes nothing unless the dialog is showing, and the Contact Us popup still closes with it.

**Independent Test**: with no dialog showing, press Escape and see no change; open Contact Us and press Escape.

- [X] T005 [US2] In `tests/e2e/cookiebot-escape.spec.ts`, add tests: (a) Escape before any dialog is displayed clicks
  nothing and the page and URL are unchanged; (b) after the Close button is clicked with the mouse, Escape clicks nothing
  more (`__closeClicks` stays 1); (c) the same after an action button is used (the stand-in dispatches
  `CookiebotOnAccept`); (d) a `keydown` for Escape with `isComposing` set, dispatched on `document` while the dialog
  shows, clicks nothing; (e) Escape pressed twice quickly closes once. Do not test the Contact Us popup here;
  `contact-escape.spec.ts` already does.
- [X] T006 [US2] Run `bun run test:e2e -- cookiebot-escape contact-escape no-top-links` and `bun run test`; fix anything
  that fails. Do not change a test only because wording changed.

**Checkpoint**: both stories pass; the Contact Us popup is unchanged.

## Phase 5: Polish and cross-cutting

- [X] T007 Run `bun run format:check` and `bun run build`. Check the built `out/index.html` is unchanged in structure (the
  component renders nothing) and that no console error #418 appears on a first visit.
- [X] T008 Check the new files for typographic quotes and for hover underlines in any CSS touched (none expected).
- [X] T009 Follow `specs/084-escape-closes-cookiebot/quickstart.md` against the real Cookiebot on port 3000, including
  steps 2 and 4 (saved choice matches the Close button; Details view). If the display event name does not fire, switch the
  start condition to a `MutationObserver` on the dialog's `display` (plan.md, Risks) and update `research.md`. Report the
  result to the owner; the owner reviews the UI before any commit.

## Dependencies and order

- T001 then T002 (the layout imports the component). T003 needs T001 and T002. T004 needs T003.
- T005 is in the same file as T003, so it follows it. T006 follows T005.
- T007 to T009 follow T006. T008 can run beside T007.
- No story depends on the other beyond sharing the component; US1 alone is a working MVP.

## Parallel opportunities

Almost none: three source and test files, each small and each following the one before. T007 and T008 are the only
independent pair.

## Implementation strategy

Build the component and layout line (T001, T002), prove User Story 1 with the stand-in tests (T003, T004), add the
no-dialog cases (T005, T006), then build and check against the real Cookiebot (T007 to T009).
