# Tasks: Organization Structured Data on the Home Page

**Input**: Design documents from `specs/090-home-organization-schema/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. Spec 090 defines testable acceptance criteria, and the constitution (Principle V) requires tests for them. Tests check behavior only: placement, home-page-only presence, the data matching its source, and the DOM check. No test checks wording.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story the task belongs to (US1, US2, US3)
- Exact file paths are in each description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the starting point before any change

- [X] T001 Run `bun run test` and `bun run build` from the repository root with no changes, and confirm both pass, so later failures can be traced to this feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The formatter changes that every user story depends on. They are in one file, so they run in order.

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Add `ORGANIZATION_JSON_LD` to `scripts/format-html.ts`: import `createElement` from `react`, `renderToStaticMarkup` from `react-dom/server`, `JsonLD` from `src/components/JsonLD.tsx`, and `organization` from `src/lib/schema/organization.json`, and set the constant to `renderToStaticMarkup(createElement(JsonLD, { data: organization }))`
- [X] T003 Extend `formatHtml` in `scripts/format-html.ts` with an optional third argument `{ jsonLD?: boolean }` (default `{}`). When `jsonLD` is true, insert `ORGANIZATION_JSON_LD` in step 6 after `COOKIEBOT_SCRIPT` and before `WHITESPACE_SCRIPT`, in the same head string as the other injected scripts
- [X] T004 Update `assertSameDom` in `scripts/format-html.ts` so the formatted page has `ORGANIZATION_JSON_LD` removed before the comparison, as the Cookiebot scripts already are, so the DOM check passes whether or not the block was added

**Checkpoint**: The formatter can add the block and still prove the DOM is unchanged. User stories can start.

---

## Phase 3: User Story 1 - Search engines read the company's details from the home page (Priority: P1) MVP

**Goal**: The built home page has one Organization JSON-LD block in its head, after the Cookiebot script, with the values from `src/lib/schema/organization.json`.

**Independent Test**: Run `bun run build`, then confirm `out/index.html` has one `application/ld+json` script in the head directly after the Cookiebot script, and that its parsed content equals `src/lib/schema/organization.json`.

### Tests for User Story 1

- [X] T005 [US1] In `tests/unit/format-html.test.ts`, add a test: `formatHtml` with `{ jsonLD: true }` returns a page with exactly one `<script type="application/ld+json">` in `<head>`, placed after the Cookiebot script and before `WHITESPACE_SCRIPT`, whose parsed JSON deep-equals `src/lib/schema/organization.json`
- [X] T006 [US1] In `tests/unit/format-html.test.ts`, add a test: `formatHtml` without the option returns a page with no `application/ld+json` element, and the DOM check passes for it

### Implementation for User Story 1

- [X] T007 [US1] In `scripts/format-site.ts`, change `formatPage` to pass `{ jsonLD: name === "out/index.html" }` as the third argument to `formatHtml`, so only the home page gets the block
- [X] T008 [US1] In `tests/unit/build-output.test.ts`, add a built-site test (it skips when `out/` is missing): `out/index.html` has exactly one `application/ld+json` element in its head, directly after the Cookiebot script, whose parsed content deep-equals `src/lib/schema/organization.json`

**Checkpoint**: The home page carries the block, and the formatter tests pass. This is the MVP.

---

## Phase 4: User Story 2 - Other pages stay the same (Priority: P2)

**Goal**: No built page other than the home page contains the block.

**Independent Test**: Run `bun run build`, then confirm no built `.html` file other than `out/index.html` contains `application/ld+json`.

### Tests for User Story 2

- [X] T009 [P] [US2] In `tests/unit/build-output.test.ts`, add a built-site test: every built `.html` file other than `out/index.html` (use the existing `builtFiles` helper) has no `application/ld+json` element

**Checkpoint**: Only the home page carries the block.

---

## Phase 5: User Story 3 - The home page still loads and works (Priority: P3)

**Goal**: The home page renders with no hydration error for a first-time visitor, and the block is not visible text.

**Independent Test**: Load `/` in a browser with no saved consent choice, and confirm the page renders and the console has no hydration error.

### Tests for User Story 3

- [X] T010 [P] [US3] Covered by the existing `tests/e2e/readable-output.spec.ts`, which loads `/` five times and fails on any console or page error. No new spec file: a second one would repeat it (constitution Principle V).

### Verification for User Story 3

- [ ] T011 [US3] (Not done by the implementer; needs a person to look at the page.) Run step 5 of `specs/090-home-organization-schema/quickstart.md` by hand in a browser, with no saved choice and then with a saved choice, and confirm the page renders, the Cookiebot banner shows for a first-time visitor, and no JSON-LD text is visible

**Checkpoint**: The home page loads and works with the block present.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final checks across the feature

- [X] T012 Run `bun run test` and confirm all unit tests pass, including the new tests in `tests/unit/format-html.test.ts` and `tests/unit/build-output.test.ts`
- [X] T013 Run `bun run build` and then steps 2 to 4 of `specs/090-home-organization-schema/quickstart.md`, and confirm the output matches the expected results
- [X] T014 [P] Run `bunx prettier --check scripts/format-html.ts scripts/format-site.ts tests/unit/format-html.test.ts tests/unit/build-output.test.ts tests/e2e/home-organization-schema.spec.ts` and fix any reported formatting
- [X] T015 [P] Run `bunx vitest run tests/unit/straight-quotes.test.ts` and confirm it passes, so no curly quotes are in the changed files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start here.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories. T002, T003, and T004 are in one file, so run them in order.
- **User Stories (Phases 3 to 5)**: All depend on Foundational. Priority order is US1, then US2 and US3.
- **Polish (Phase N)**: Depends on all user stories.

### User Story Dependencies

- **US1 (P1)**: Needs Foundational. T007 must come before T008 and T010, which need the built block.
- **US2 (P2)**: Needs US1's build (T007). Independent of US3.
- **US3 (P3)**: Needs US1's build (T007). Independent of US2.

### Within Each User Story

- T005 and T006 can be written with T002 to T004, and must pass before the story is marked done.
- T008 needs a fresh `bun run build`.
- T011 is a manual check and is recorded as done only when a person has looked at the page.

### Parallel Opportunities

- T009 and T010 touch different files and can run in parallel once T007 is done.
- T014 and T015 can run in parallel at the end.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002 to T004)
3. Complete Phase 3: User Story 1 (T005 to T008)
4. **STOP and VALIDATE**: `bun run test`, then `bun run build`, then quickstart step 3 and step 4

### Incremental Delivery

1. Add US1: home page block (MVP)
2. Add US2: other pages confirmed unchanged
3. Add US3: browser check and e2e test
4. Polish: run all checks

---

## Notes

- `[P]` tasks touch different files and have no dependency on incomplete tasks
- `[Story]` labels map each task to its user story in spec.md
- The block comes from `ORGANIZATION_JSON_LD`, so no page component changes
- Do not commit as part of these tasks. Commit only when asked, with `git commit -s` and a closing reference once an issue exists
- Avoid tests that check the wording of the organization values (constitution Principle V)

---

## Summary

- **Total tasks**: 15 (T001 to T015)
- **Per user story**: US1 has 4 tasks (T005 to T008), US2 has 1 (T009), US3 has 2 automated or manual checks (T010 and T011)
- **Setup and foundational**: 4 tasks (T001 to T004)
- **Polish**: 4 tasks (T012 to T015)
- **Parallel opportunities**: T009 with T010; T014 with T015
- **Independent test per story**:
  - US1: build, then confirm one block after the Cookiebot script with the source values
  - US2: build, then confirm no other page has the block
  - US3: load `/` in a browser with no consent choice, with no hydration error
- **MVP scope**: User Story 1 only (T001 to T008)
- **Format check**: All 15 tasks use the checkbox, ID, story label where required, and an exact file path or the quickstart path
