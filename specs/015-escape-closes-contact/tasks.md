---

description: "Task list for closing the Contact Us popup with the Esc key"
---

# Tasks: Esc Closes the Contact Us Popup

**Input**: Design documents from `/specs/015-escape-closes-contact/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/escape-key.md, quickstart.md

**Tests**: Included. Constitution Principle V requires tests alongside the change, and FR-008 lists what they must cover.

**Organization**: Grouped by user story. The whole source change is one `useEffect` in `ContactPopup.tsx`: US1 adds it, US3 adds its two guards, and US2 adds only tests.

## Format: `[ID] [P?] [Story]` Description

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to
- New source and test files start with the SPDX license header
- Playwright spec files in this repo fail to load with TypeScript type annotations (`import type`, typed parameters, `as const`); rely on contextual typing, as in `tests/e2e/link-style.spec.ts`
- Spec 014 (`specs/014-footer-contact-us/`) also touches the popup's triggers. Nothing here depends on it: the Esc effect lives inside `ContactPopup`.

## Phase 1: Setup

- [X] T001 Confirm a clean baseline: run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e` from the repo root and note that all pass. Port 3000 must be free. The test "Web Development page links are reachable by keyboard with visible focus" in `tests/e2e/content-page-a11y.spec.ts` is known to flake occasionally under load; if it is the only failure, rerun it alone (`bunx playwright test tests/e2e/content-page-a11y.spec.ts`) before counting it as a failure. WebKit hangs on the owner's machine; `--project=chromium --project=firefox` is enough for iteration.

---

## Phase 2: Foundational

No blocking prerequisites beyond the baseline.

---

## Phase 3: User Story 1 - Esc closes the popup (Priority: P1) 🎯 MVP

**Goal**: Pressing Esc while the popup is open closes it, from the form and from the confirmation, and the form is empty when it is reopened.

**Independent Test**: Open the popup from any "Contact Us" button and press Esc. It closes; opening it again shows the empty form.

### Tests for User Story 1 (write first; they fail until T004)

- [X] T002 [P] [US1] In `tests/unit/contact-popup.test.tsx`, add tests inside `describe("ContactPopup")` using `fireEvent.keyDown(document, { key: "Escape" })`: (a) with `open` and an `onClose` mock, one Esc calls `onClose` exactly once; (b) after `fillValidForm()` and clicking "Send" (confirmation showing), Esc calls `onClose` once; (c) text typed into "Full name", then Esc calls `onClose` and does not call `onSubmit`; (d) render with `open`, type into "Full name", `rerender` with `open={false}` then `open`, and expect the "Full name" field to be empty (reopen shows the empty form). Run `bun run test tests/unit/contact-popup.test.tsx` and confirm (a) to (c) fail; (d) may already pass.
- [X] T003 [P] [US1] Create `tests/e2e/contact-escape.spec.ts` (with the SPDX header). In a `test.describe("Esc closes the Contact Us popup")`: (a) go to `/`, click the first `getByRole("button", { name: "Contact Us" })`, expect `getByRole("dialog", { name: "Contact Us" })` visible, press `Escape`, expect it not visible; (b) open, fill "Full name" with "Jordan Reyes", press `Escape`, expect it closed, open again with the same button, and expect "Full name" to have value `""`; (c) open, fill all four fields as in `tests/e2e/contact-popup-a11y.spec.ts` (Full name, Work email, Company website, Primary need `selectOption("Web Development")`), click "Send", expect the "Request received" heading, press `Escape`, expect the dialog closed, open again, and expect the form (not the confirmation) with an empty "Full name".

### Implementation for User Story 1

- [X] T004 [US1] In `src/components/contact/ContactPopup.tsx`, add a `useEffect` after the existing one: `useEffect(() => { if (!open) return; function handleKeyDown(event: KeyboardEvent) { if (event.key === "Escape") onClose(); } document.addEventListener("keydown", handleKeyDown); return () => document.removeEventListener("keydown", handleKeyDown); }, [open, onClose]);`. Keep it above the early `return null` for `!open` (hooks must run in the same order every render; the existing `if (!open) return null` is after the first effect, so place the new effect before it). Add a short comment saying Esc is one more way to close and calls the same `onClose` as the close button. Do not change the markup, `aria` attributes, or the other close paths.
- [X] T005 [US1] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox`. T002 and T003 must now pass, and `tests/e2e/contact-flow.spec.ts` still passes.

**Checkpoint**: US1 is complete and shippable on its own.

---

## Phase 4: User Story 2 - Esc works wherever focus is (Priority: P1)

**Goal**: Esc closes the popup whether focus is on the page behind it, in a field, or on a popup button.

**Independent Test**: Open the popup with the keyboard (Tab to the hero button, Enter) and press Esc without touching anything else. It closes. Repeat with focus in a field and on the "Send" and close buttons.

- [X] T006 [US2] In `tests/e2e/contact-escape.spec.ts`, add tests: (a) keyboard-opened: go to `/`, focus the first "Contact Us" button (`.focus()`), press `Enter`, expect the dialog visible, press `Escape` with no other input, expect it closed; (b) focus in a field: open, `getByLabel("Work email").focus()`, press `Escape`, expect closed; (c) focus on the buttons: open, focus `getByRole("button", { name: "Close" })` and press `Escape`, expect closed; open again, fill the four fields, focus the "Send" button (do not click), press `Escape`, expect closed with nothing submitted (no "Request received" heading). No source change is expected.
- [X] T007 [US2] Run `bun run test:e2e --project=chromium --project=firefox` and confirm T006 passes. If a case fails, fix `ContactPopup.tsx` (the listener must be on `document`); do not add per-element handlers.

**Checkpoint**: Esc works from every focus position.

---

## Phase 5: User Story 3 - Esc does nothing when closed, and does not interfere with the dropdown (Priority: P2)

**Goal**: With the popup closed, Esc changes nothing. With the "Primary need" list expanded, the first Esc closes only the list and a second Esc closes the popup.

**Independent Test**: With the popup closed, press Esc on `/` and `/web-development` and see nothing change. In Chromium, open the popup, click the "Primary need" list, press Esc (only the list closes), press Esc again (the popup closes).

### Tests for User Story 3 (write first; the guard cases fail until T010)

- [X] T008 [P] [US3] In `tests/unit/contact-popup.test.tsx`, add: (a) with `open={false}` and an `onClose` mock, `fireEvent.keyDown(document, { key: "Escape" })` does not call `onClose`; (b) with `open`, spy on the `<select>` (`screen.getByLabelText("Primary need")`) with `vi.spyOn(select, "matches").mockImplementation((selector) => selector === ":open")`, fire Esc on `document`, and expect `onClose` not to have been called; then restore the spy, fire Esc again, and expect one call; (c) with `open`, create `const event = createEvent.keyDown(screen.getByLabelText("Full name"), { key: "Escape" }); event.preventDefault(); fireEvent(screen.getByLabelText("Full name"), event);` (import `createEvent` from `@testing-library/react`) and expect `onClose` not to have been called; (d) `fireEvent.keyDown(document, { key: "Enter" })` and a keydown with `{ key: "Escape", isComposing: true }` do not call `onClose`. Run and confirm (b) to (d) fail.
- [X] T009 [P] [US3] In `tests/e2e/contact-escape.spec.ts`, add: (a) with no popup open, press `Escape` on `/` and expect no dialog and the URL unchanged; the same on `/web-development`; (b) a test `test("the first Esc closes only the open Primary need list", async ({ page }, testInfo) => { test.skip(testInfo.project.name !== "chromium", "Only desktop Chromium opens the native list headless"); ... })`: open the popup, `await page.getByLabel("Primary need").click()` (the native list opens), press `Escape`, expect the dialog still visible, press `Escape` again, expect it closed. The `page.getByLabel` call and skip must not use TypeScript type annotations.

### Implementation for User Story 3

- [X] T010 [US3] In `src/components/contact/ContactPopup.tsx`, extend the T004 handler to `if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;` followed by a check that the "Primary need" select is not expanded: `const select = document.getElementById("primaryNeed"); let listOpen = false; try { listOpen = Boolean(select?.matches(":open")); } catch { /* browsers without :open */ } if (listOpen) return; onClose();`. The `try` is needed because browsers that do not know the `:open` selector throw a `SyntaxError`. Keep the `id="primaryNeed"` the select already has; do not change the markup. Add a comment that Chromium sends no Esc to the page while its list is open and Firefox does, which is why the guard exists.
- [X] T011 [US3] Run `bun run lint`, `bunx tsc --noEmit`, `bun run test`, and `bun run test:e2e --project=chromium --project=firefox`. T008 and T009 must pass (the list test runs in Chromium only and is skipped elsewhere).

**Checkpoint**: All three stories are complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 [P] In `specs/001-homepage-contact-us/spec.md`, add a dated Amendments entry (2026-09-30, see `specs/015-escape-closes-contact/spec.md`) saying Esc also closes the popup, and add "or by pressing Esc" to FR-012 (lines 192 to 194). In `specs/001-homepage-contact-us/contracts/ui-contracts.md`, add "or Esc" to the `onClose` row (line 36) and to point 5 (line 52).
- [X] T013 [P] In spec 014, remove the statements that Esc does not close the popup: `specs/014-footer-contact-us/spec.md` (the Assumption at line 149, rewrite it to say Esc closing is specified in spec 015), `specs/014-footer-contact-us/plan.md` (the "Escape is not added" decision at line 119), and `specs/014-footer-contact-us/research.md` (line 51 "Add Escape-to-close" in Decision 5's rejected alternatives, and line 65 "has no Escape handler"). Say "added by spec 015" instead. Leave the rest of spec 014 alone.
- [X] T014 Run the manual steps in `quickstart.md`. Step 6 (the real "Primary need" list) is checked by the Chromium e2e test; checking it by hand in Firefox and Safari is optional and low priority (owner decision), so do not block on it or ask for it. Then run the Docker shutdown check: `./build.sh && ./run.sh`, one `^C`, and `docker ps -a` shows no leftover container. Grep the CSS and `src/` for hover underlines and `#top` (`grep -rn "underline" src/styles`, `grep -rn "#top" src content`) and confirm nothing new.
- [ ] T015 Do not open a PR unless asked. Commit with `git commit -s`, subject ending in `Closes #N.` for the GitHub issue.

---

## Dependencies & Execution Order

- T001, then T002 and T003 in parallel (different files), then T004, then T005.
- US2 (T006, T007) follows T005 and edits the file T003 created. It changes no source.
- US3: T008 and T009 in parallel (different files), then T010, then T011. T010 edits the effect T004 wrote, so it follows T004.
- T012 and T013 can run any time after T005; T014 and T015 come last.
- Spec 014 is independent. If it is built first or later, nothing here changes.

## Parallel Example: User Story 1

```text
T002 tests/unit/contact-popup.test.tsx
T003 tests/e2e/contact-escape.spec.ts
```

## Implementation Strategy

MVP is US1 (T001 to T005): one effect and its tests. US2 adds only tests that prove focus position
does not matter. US3 adds the two guards that keep Esc from doing harm when the popup is closed or the
native list is open; do it before shipping if you want the dropdown behavior in spec 015 (FR-004,
FR-005), since without it Esc would close the popup together with the list in Firefox.
