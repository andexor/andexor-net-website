---

description: "Task list for Combine Page Scripts"
---

# Tasks: Combine Page Scripts

**Input**: Design documents from `/specs/041-combine-page-scripts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/built-page-scripts.md, quickstart.md

**Tests**: Included (Principle V). Assert structure and behavior; never assert a count of cards, files, or lines. Playwright
specs must not use TypeScript type annotations (the loader fails on them).

**Go or no-go**: Each step is kept only if every check passes (FR-006). After step 1 (T008) and after step 2 (T018) the
checks are run and the result is written at the end of that task. If step 2 fails, undo only step 2 and keep step 1; if
step 1 fails and cannot be fixed, undo both. Tell the owner which step and why.

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
Search new files for U+2018 to U+201F before finishing (T020).

**Organization**: By user story. New `.ts` files start with the SPDX license header and are formatted with Prettier.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the assumption on today's build: for every `out/*.html`, the body ends in a run of inline scripts with no attributes, directly before the closing body tag, with only whitespace between them (about 13 per page), and nothing else inline sits there. Note any page that differs; the code must leave such a page alone (FR in spec Edge Cases)

---

## Phase 2: Foundational (blocks both steps)

**Purpose**: Find the data scripts and prove two sets of scripts leave the same data.

- [X] T002 [P] Write `tests/unit/combine-scripts.test.ts` (first part, failing): `splitDataScripts(html)` finds the trailing run of attribute-less inline scripts before the closing body tag and returns what is before it, the script bodies in order, and what is after; it ignores the head's inline scripts and every script with an address; it returns nothing when the body does not end in inline scripts. `dataQueue(bodies)` runs the bodies in order in a sandbox with `self` as an empty object and returns what ends up in `self.__next_f`; it is equal for the same scripts and different when a piece is dropped, reordered, or altered. `assertSameData(originalBodies, newBody, page)` passes for equal data and throws naming the page otherwise
- [X] T003 Create `scripts/combine-scripts.ts` with `splitDataScripts`, `dataQueue` (use `node:vm` with a fresh context per call and a short timeout; return a deep copy), and `assertSameData`, so T002 passes. Include the license header

**Checkpoint**: the helper and its tests pass.

---

## Phase 3: User Story 1 - One script element carries the page's data (Priority: P1) MVP

**Goal**: Each built page ends with one inline data script, not 13, with the same data in the same order.

**Independent Test**: Build, view the end of `out/index.html` and a content page: one inline data script; all pages load with no errors.

### Tests for User Story 1

- [X] T004 [P] [US1] In `tests/unit/combine-scripts.test.ts`, add tests for `combineDataScripts(html, page)`: the page's trailing run becomes one inline script whose body is the old bodies joined in order with a newline; the head's scripts and every script with an address are unchanged; a page with no trailing run is returned unchanged with a note; the data check passes on the result and the original; the check fails (naming the page) if the combine step loses a piece

### Implementation for User Story 1

- [X] T005 [US1] In `scripts/combine-scripts.ts`, add `combineDataScripts(html, page)` returning the new page, the original bodies, and an optional note, and calling `assertSameData`. Keep the combined script's indentation consistent with the page
- [X] T006 [US1] In `scripts/format-site.ts`, call it for each built HTML page before `formatHtml`, print each note, and let the existing formatting and DOM checks run on the result
- [X] T007 [US1] Run `bun run build`; look at the end of `out/index.html`, `out/web-development.html`, and `out/404.html`; run `bun run test`, `bun run test:e2e --project=chromium`, and `bun run test:e2e --project=firefox -g "Readable output"`
- [X] T008 [US1] Go or no-go for step 1: if every check passes, record "step 1: go" at the end of this task. If not, fix the cause or undo step 1 and record why. **Result: step 1: go** (168 unit tests, 207 Chromium e2e tests, and the Firefox hydration checks all pass; every page has one inline data script)

**Checkpoint**: Step 1 works, or is dropped with a reason.

---

## Phase 4: User Story 2 - The combined script lives in an external file (Priority: P2)

**Goal**: The page has one script element with an address instead of the inline data, plus a preload hint, and the data sits in a readable file.

**Independent Test**: Build; the end of each page has one `<script src="/_next/static/data/<hash>.js">`, the file exists and is formatted, and the page loads and works as before.

### Tests for User Story 2

- [X] T009 [P] [US2] In `tests/unit/combine-scripts.test.ts`, add tests for `externalizeDataScript(html, bodies, page)`: it returns the page and a file `{ path, content }`; the path is `out/_next/static/data/<name>.js` where the name is the first 16 hexadecimal digits of the SHA-256 of the file text; the data script becomes `<script src="/_next/static/data/<name>.js"></script>` with no `async` or `defer`, in the same place; a preload hint (`<link rel="preload" as="script" href="...">`) is the first thing inside the head; the file content is formatted (several lines, 4-space indent) and, run in the sandbox, leaves the same data as the original bodies; identical content gives the same name

### Implementation for User Story 2

- [X] T010 [US2] In `scripts/combine-scripts.ts`, add `externalizeDataScript` (format the file text with Prettier, babel parser, 4 spaces, width 120, ignoring the repository's ignore files as `format-site.ts` does; hash the formatted text; run `assertSameData` against the formatted file text). Put the preload hint right after the opening head tag in the page source, so the whitespace script that `formatHtml` adds stays first
- [X] T011 [US2] In `scripts/format-site.ts`, use it after `combineDataScripts`, write each data file under `out/_next/static/data/` (create the folder), fail if two pages would write different content to one name, and run `formatHtml` on the resulting page as before
- [X] T012 [US2] In `scripts/site-files.ts`, add a group for `out/_next/static/data/*.js` ("built-data-js") and update `tests/unit/site-files.test.ts`; make `tests/unit/formatting.test.ts`, `tests/unit/build-output.test.ts`, and `tests/unit/straight-quotes.test.ts` include that group among the built files they check (formatted, not minified, no curly quote or reference)
- [X] T013 [US2] Run `bun run build`; look at the end of `out/index.html`, the head's first lines, and `head -20 out/_next/static/data/*.js`; run `bun run test` and the Chromium and Firefox hydration checks

**Checkpoint**: Step 2 works, or is dropped with a reason.

---

## Phase 5: User Story 3 - Nothing breaks, and the owner is told if something would (Priority: P1)

**Goal**: The checks that decide each step's go or no-go exist and run.

**Independent Test**: `bun run test` and `bun run test:e2e --project=chromium` pass; each check fails when the thing it guards is broken.

- [X] T014 [P] [US3] In `tests/unit/build-output.test.ts` (runs only when `out/` exists), add: no built page has an inline `self.__next_f` script; each built page has exactly one script element whose address is under `/_next/static/data/` (a structural rule from the spec, not a count of anything else), that file exists, and it is not minified (`isMinified` from `scripts/site-files.ts`)
- [X] T015 [P] [US3] In `tests/e2e/readable-output.spec.ts`, add a Chromium-only check on a slow connection (a Chrome DevTools Protocol session with latency 150 ms and download 1.6 Mbps): the Contact Us popup opens within 5 seconds of navigation, and the page requested exactly its data file. Skip it in other browsers
- [X] T016 [P] [US3] In `tests/e2e/readable-output.spec.ts`, add a check that a page reached through a link works: click a service card link on the home page, wait for the Web Development heading, and assert that page requested its own data file (a different one from the home page's) and that no console errors were logged. (The site's links are ordinary links, so each click is a full page load; there is no client-side navigation to test, and content pages have no Contact popup.)
- [X] T017 [US3] Prove the data check: temporarily make `combineDataScripts` drop one piece, run `bun run build`, see the build stop naming the page; revert. Then temporarily remove the data file for one page from `out/`, run `bun run test`, see the built-output test name that page; rebuild
- [X] T018 [US2] Go or no-go for step 2: if T013 and T014 to T017 all pass, record "step 2: go" at the end of this task; if not, record "step 2: dropped, because ..." and undo T009 to T013 (and the data-file parts of T014 and T015), keeping step 1. **Result: step 2: go** (176 unit tests, 209 Chromium e2e tests, and the Firefox hydration, slow-connection (skipped, Chromium only), and link checks all pass; the data check and the built-output test were each proved to fail when the data is wrong or missing)

---

## Phase 6: Polish & Cross-Cutting

- [X] T019 Update the "Formatting" section of `CLAUDE.md` with a short line on the data scripts (one file per page in `_next/static/data/`, formatted, with a preload hint; the data check; the head scripts stay inline and first). Use plain straight quotes
- [X] T020 Run `bun run format`, `bun run format:check`, `bun run lint`, `bun run test`, `bun run test:e2e --project=chromium`, and `bun run test:e2e --project=firefox -g "Readable output"`; search every file this feature created or changed for U+2018 to U+201F; confirm `git diff -- CODE_OF_CONDUCT.md CODE_OF_CONDUCT.adoc` is empty
- [X] T021 Docker check: `./build.sh`, `./run.sh`, load the home page (its source ends with one data script element), one `Ctrl+C`, confirm the shutdown line and no leftover container in `docker ps -a` (Principle VII)
- [X] T022 Walk through `quickstart.md`
- [ ] T023 Set the spec Status to Implemented. Commit with `git commit -s` and a subject ending `Closes #N.` (ask the owner for the issue number), only when the owner asks

---

## Dependencies & Order

- T001 first; Phase 2 before the steps (T002 before T003).
- US1 (T004 to T008) before US2; US2 builds on the combined script.
- T014 to T016 can be written once step 1 is in place; they must pass for T018 (step 2 go or no-go). T014 and T015 describe step 2's end state, so they are run after T013.
- If step 2 is dropped, T009 to T013, T014's address checks, and T015's data-file request check are undone; keep T016.
- Polish last.

## Parallel Examples

- T014, T015, and T016 (different files or blocks).

## Implementation Strategy

1. MVP: Phases 1 to 3 (one combined script), with its go or no-go.
2. Add step 2 (external file and preload hint) with its go or no-go.
3. Verification tests, docs, Docker check, and commit when asked.
