---

description: "Task list for capitalizing 'Business Services' everywhere"
---

# Tasks: "Business Services" Capitalization

**Input**: Design documents from `/specs/013-business-services-caps/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/group-labels.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-004 requires an automated check on the group label. The existing test would not catch a revert (it compares against `PRIMARY_NEED_GROUPS` itself), so US1 adds a literal-text test.

**Organization**: Grouped by user story. US1 is the whole visible change; US2 is the project-wide cleanup and needs a search that skips the specs that quote the old phrase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- Only the exact phrase "Business services" (lowercase s) changes. Leave `BUSINESS SERVICES`, already-correct "Business Services", and lowercase running text ("business services, company") alone.
- Spec 012 (`specs/012-technical-services-caps/`) makes the same kind of change for "Technical services" and edits the same files. Build it first or in this pass.

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure. WebKit hangs on the owner's machine; `--project=chromium --project=firefox` is enough for iteration.
- [X] T002 Check whether spec 012 is built: `grep -n "Technical services" src/components/contact/primary-need-options.ts tests/unit/primary-need-select.test.tsx`. If it matches, also change "Technical services" to "Technical Services" in those two files now (the rest of 012's occurrences are handled by 012's own tasks; do not touch them here). The new test in T003 asserts both headings.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - The group label reads "Business Services" in the Contact Us form (Priority: P1) 🎯 MVP

**Goal**: The second group in the Contact Us "Primary need" list is headed "Business Services". Options, order, and submitted values are unchanged.

**Independent Test**: Open the Contact Us popup and the "Primary need" list. The group headings are "Technical Services" and "Business Services", and the options under them are as before.

### Tests for User Story 1 (write first; fails until T004)

- [X] T003 [US1] In `tests/unit/primary-need-select.test.tsx`, add a test "labels the two groups with capitalized headings": render `<ContactPopup open onClose={vi.fn()} />`, find the `Primary need` select, and expect `Array.from(select.querySelectorAll("optgroup")).map((g) => g.getAttribute("label"))` to equal `["Technical Services", "Business Services"]`, written as literals (not read from `PRIMARY_NEED_GROUPS`). Do not change the existing tests. Run `bun run test tests/unit/primary-need-select.test.tsx` and confirm the new test fails on "Business services".

### Implementation for User Story 1

- [X] T004 [US1] In `src/components/contact/primary-need-options.ts`, change `label: "Business services"` to `label: "Business Services"`. Do not change the options arrays or their order.
- [X] T005 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` (`tests/e2e/contact-flow.spec.ts` must still pass). T003 must now pass.

**Checkpoint**: US1 is complete and shippable on its own.

---

## Phase 4: User Story 2 - No "Business services" is left anywhere in the project (Priority: P2)

**Goal**: A case-sensitive search for "Business services" finds nothing, apart from the two specs that quote the phrase to describe this change.

**Independent Test**: `grep -rIn "Business services" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=.git --exclude-dir=test-results --exclude-dir=012-technical-services-caps --exclude-dir=013-business-services-caps .` prints nothing.

- [X] T006 [P] [US2] Replace "Business services" with "Business Services" in the design-system copy: `design/README.md` (line 80, the `Group "Business services"` text only; leave the all-caps `BUSINESS SERVICES` on line 66), `design/ui_kits/marketing-site/ContactUs.jsx.txt` (`<optgroup label="Business services">`), and `design/_ds_bundle.js` (`label: "Business services"`). Change nothing else in those files.
- [X] T007 [P] [US2] Replace "Business services" with "Business Services" in spec 001: `specs/001-homepage-contact-us/spec.md` (line 129), `tasks.md` (lines 61 and 131), `data-model.md` (line 58), and `quickstart.md` (line 62). Also change the comment in `tests/unit/primary-need-select.test.tsx` (`// "Business services", plus "Something else"...`) to "Business Services". Leave lowercase running text such as "technical services, business services, company" as it is.
- [X] T008 [P] [US2] In `specs/012-technical-services-caps/spec.md`, replace "Business services" with "Business Services" in lines 31, 58, 71, and 96 to 98, and rewrite the Assumption that says "Business services" stays lowercase so it says spec 013 (`specs/013-business-services-caps/spec.md`) capitalizes it, leaving both group headings the same. Do not change "Technical services" mentions in that file (they describe the old wording of spec 012 and are excluded from its own search).
- [X] T009 [US2] Fix the search scope, since spec 013's own documents quote the old phrase. In `specs/013-business-services-caps/spec.md`, add to Edge Cases: "This spec and spec 012 quote the old wording to describe the change, so the search in User Story 2 skips those two folders." In SC-001 and User Story 2's Independent Test, add "excluding the specs that quote the old wording (012 and 013)". In `specs/013-business-services-caps/quickstart.md`, add `--exclude-dir=012-technical-services-caps --exclude-dir=013-business-services-caps` to the `grep`, and in `contracts/group-labels.md` make the same change to the last table row and the last rule.
- [X] T010 [US2] Run the search from the Independent Test above and confirm it prints nothing. Then run `grep -rIn "Business services" specs/012-technical-services-caps specs/013-business-services-caps`; the only matches must be in `specs/013-business-services-caps` (quoted old wording). Fix anything else it finds.

**Checkpoint**: All occurrences are updated.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T011 Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` once more (Chromium and Firefox are enough). Then run the manual steps in `quickstart.md`, including the Docker shutdown check (`./build.sh && ./run.sh`, open "Contact Us" and "Primary need", one `^C`, `docker ps -a` shows no leftover container).
- [ ] T012 Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue.

---

## Dependencies & Execution Order

- T001, then T002, then T003 (test first), then T004, then T005.
- US2 tasks T006, T007, and T008 touch different files and can run in parallel after T005. T009 follows T008 (both touch spec text about scope), and T010 follows T006 to T009.
- T011 and T012 come last.

## Parallel Example: User Story 2

```text
T006 design/README.md, design/ui_kits/marketing-site/ContactUs.jsx.txt, design/_ds_bundle.js
T007 specs/001-homepage-contact-us/*, tests/unit/primary-need-select.test.tsx
T008 specs/012-technical-services-caps/spec.md
```

## Implementation Strategy

MVP is US1 (T001 to T005): one string and one test. Stop after T005 to ship the visible change, and
do US2 (the cleanup) afterward. If spec 012 is built in the same pass, do its source string and
test comment first (T002 covers the two shared files) so the new test passes once.
