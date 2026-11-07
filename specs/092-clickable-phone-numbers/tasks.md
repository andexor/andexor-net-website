# Tasks: Clickable Phone Numbers

**Input**: Design documents from `/specs/092-clickable-phone-numbers/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included. The constitution (Principle V) requires tests for each testable acceptance criterion, written before or alongside the change. Tests cover behavior only: link target, no underline, focus. No copy or count assertions.

**Organization**: Tasks are grouped by user story. There is no setup or foundational work: the toolchain, Playwright, and the content pipeline already exist.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup (Shared Infrastructure)

No tasks. The repository, branch (`114-clickable-phone-numbers`), Bun dependencies, and Playwright are already in place.

---

## Phase 2: Foundational (Blocking Prerequisites)

No tasks. Nothing blocks the user stories.

---

## Phase 3: User Story 1 - Call the company from a legal page (Priority: P1) 🎯 MVP

**Goal**: Every visible +14043511440 on the Privacy Policy, Security Policy, and Terms of Service pages is a link to `tel:+14043511440`.

**Independent Test**: Build the site and run `tests/e2e/phone-links.spec.ts`. Every text node holding the number has a `tel:+14043511440` link as an ancestor.

### Tests for User Story 1 (write first, expect failure)

- [X] T001 [US1] Create tests/e2e/phone-links.spec.ts. For each of /privacy-policy, /security-policy, and /terms-of-service, load the page and check that every text node containing +14043511440 has an ancestor `a[href="tel:+14043511440"]`. Use the file header and style of tests/e2e/footer-links.spec.ts (Apache header, contextual typing in callbacks). Do not assert how many occurrences exist.

### Implementation for User Story 1

- [X] T002 [US1] In content/privacy-policy.md line 260, replace "call +14043511440" with "call [+14043511440](tel:+14043511440)". The link target has no spaces and matches the visible digits.
- [X] T003 [US1] In content/privacy-policy.md line 359, replace "Phone: +14043511440" with "Phone: [+14043511440](tel:+14043511440)". Runs after T002 (same file).
- [X] T004 [P] [US1] In content/security-policy.md line 172, replace "Phone: +14043511440" with "Phone: [+14043511440](tel:+14043511440)".
- [X] T005 [P] [US1] In content/terms-of-service.md line 170, replace "Phone: +14043511440" with "Phone: [+14043511440](tel:+14043511440)".
- [X] T006 [US1] Run `bun run build`, then `bun run test:e2e -- tests/e2e/phone-links.spec.ts`. Expect the T001 test to pass. If it fails, fix the named page and rerun.

**Checkpoint**: The number on all three policy pages is tap-to-call.

---

## Phase 4: User Story 2 - Links look like the rest of the site's links (Priority: P2)

**Goal**: Phone links have no underline at rest, on hover, or on focus, and show the keyboard focus ring, like every other link.

**Independent Test**: The link-style and phone-links tests pass on the policy pages.

### Tests for User Story 2 (write first, expect failure or pass)

- [X] T007 [P] [US2] In tests/e2e/link-style.spec.ts, add "/privacy-policy", "/security-policy", and "/terms-of-service" to the PAGES list so the no-underline-at-rest check covers the pages that now have phone links.
- [X] T008 [US2] In tests/e2e/phone-links.spec.ts, add one test on /privacy-policy: hover the first `a[href="tel:+14043511440"]` and check its computed `text-decoration-line` is "none"; focus it with the keyboard (Tab from the element before it, not `.focus()`) and check the focus ring is visible, and that the text decoration is still "none".

### Implementation for User Story 2

- [X] T009 [US2] No CSS change. Confirm by reading src/styles/content.css that `.an-prose a` (weight 600, hover color, focus-visible ring) applies to the phone links on the policy pages. If a rule is missing, add it to content.css, not to the component.
- [X] T010 [US2] Run `bun run test:e2e -- tests/e2e/link-style.spec.ts tests/e2e/phone-links.spec.ts` and confirm both pass.

**Checkpoint**: Phone links look and behave like other site links.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [X] T011 Run `bun run test` (Vitest, including the straight-quotes and no-top-links checks), `bun run format:check`, and `bun run test:e2e`. Expect all to pass.
- [X] T012 Run steps 1 and 4 of specs/092-clickable-phone-numbers/quickstart.md: the grep for plain-text occurrences in content/ must print nothing, and the hover and focus behavior checked by hand on /privacy-policy.
- [X] T013 Confirm src/lib/schema/ed.json and src/lib/schema/organization.json are unchanged (`git diff --stat -- src/lib/schema`), per spec Clarifications (session 2026-11-07).

---

## Dependencies & Execution Order

- **User Story 1 (P1)**: Starts immediately. T001 is written first; T002 and T003 edit the same file, so they run in order; T004 and T005 can run in parallel with them.
- **User Story 2 (P2)**: T007 and T008 can be written any time after T001. T010 runs after T006 (the pages must have their phone links).
- **Polish**: After both stories.

### Parallel Opportunities

- T004 and T005 (different content files), alongside T002/T003.
- T007 (a different file) alongside T001.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001: write the failing test
2. T002 to T005: make the four link edits
3. T006: build and confirm the test passes

Stop here if only the tap-to-call behavior is needed. US2 confirms the styling rules.

---

## Notes

- Commit only when asked, and then with `git commit -s` and `Closes #114.` in the subject.
- Mark tasks done as they finish.
