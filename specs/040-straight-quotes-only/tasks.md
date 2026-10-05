---

description: "Task list for Straight Quotes Only"
---

# Tasks: Straight Quotes Only

**Input**: Design documents from `/specs/040-straight-quotes-only/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/quote-rule.md, quickstart.md

**Tests**: Included (Principle V). Assert rules and positions; never assert a count of cards, files, or lines.

**Watch out**: never type a backslash-u escape for a quote, or the character itself, into any file or command. A typed
escape can turn into the real character when the file is written (it happened while planning this feature). Build the
characters from numeric code points (`String.fromCodePoint(0x2018)` and so on), describe them in words, and never write
the names of their HTML references. After writing any file in this feature, search it for the eight characters
(U+2018 to U+201F) to prove it is clean (T018 does this for all of them).

**Organization**: By user story. New `.ts` files start with the SPDX license header and are formatted with Prettier.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Record the starting state: search the repository (except `node_modules`, `.next`, `.git`, `out`, `playwright-report`, `test-results`, and the two Code of Conduct files) and the built pages in `out/` for the eight characters U+2018 to U+201F and for HTML references to them. Expect no matches. Note how many places in `out/index.html` write the numeric apostrophe reference in text (4 today), so T011 can show they are gone

---

## Phase 2: Foundational (blocks all stories)

- [X] T002 Create `scripts/quote-rules.ts` with the shared rule, shaped like `scripts/site-files.ts`: the eight banned code points (hexadecimal 2018 to 201F) turned into characters with `String.fromCodePoint`; a regular expression for the banned HTML references, named (left and right single, low-9 single, left and right double, low-9 double) and numeric in decimal and hex in any letter case, with the names assembled from parts so the file does not contain a reference written out; `findBannedQuotes(text)` returning `{ line, found }` for each match, with 1-based lines; and `isCheckedPath(relativePath)` that returns false for `node_modules/`, `.next/`, `.git/`, `out/`, `playwright-report/`, `test-results/`, `CODE_OF_CONDUCT.md`, `CODE_OF_CONDUCT.adoc`, and files that are not text (images, fonts, archives). The straight apostrophe and double quote, `&amp;`, `&lt;`, `&gt;`, and the numeric apostrophe reference are allowed. Include the license header

**Checkpoint**: the helper exists.

---

## Phase 3: User Story 1 - Only straight quotes appear anywhere (Priority: P1) MVP

**Goal**: No curly quote or reference to one is in any repository file (except the two Code of Conduct files) or comes out of the Markdown renderer.

**Independent Test**: `bun run test` passes; adding a banned character to any checked file makes it fail with the file and line.

### Tests for User Story 1

- [X] T003 [P] [US1] Write `tests/unit/straight-quotes.test.ts` (part 1, repository): cases for `findBannedQuotes` built from code points and from reference text assembled in the test (each of the eight characters, a named reference, a decimal one, a hex one in upper and lower case) are found with the right line number; straight quotes, the numeric apostrophe reference, and the ampersand escapes are not; then walk the repository with `isCheckedPath` and fail with `<file>:<line>: <what was found>` for any match. The two Code of Conduct files must be skipped by the walk. The file itself must contain none of the banned characters
- [X] T004 [P] [US1] In `tests/unit/content.test.ts`, add a test that renders Markdown containing a straight apostrophe and straight double quotes through `getContentPage` and asserts the output keeps them as typed and `findBannedQuotes` finds nothing (this guards against a smart-typography plugin being added later)

### Implementation for User Story 1

- [X] T005 [US1] Run `bun run test`; fix `scripts/quote-rules.ts` or the tests until T003 and T004 pass. The repository is expected to be clean already; if the walk finds anything outside the excluded files, replace it with the straight character
- [X] T006 [US1] Prove the check: create a temporary file under `src/` containing one banned character produced by a script from a code point (not typed), run `bun run test`, see the failure name that file and line, then delete the file

**Checkpoint**: The repository check works and the Markdown pipeline is guarded.

---

## Phase 4: User Story 2 - Apostrophes in the page source are plain characters (Priority: P1)

**Goal**: Built pages say `We'll`, not the numeric escape, with the same DOM and no hydration errors.

**Independent Test**: After `bun run build`, `out/index.html` has `We'll` and no numeric apostrophe reference, and the home page loads with no console errors.

### Tests for User Story 2

- [X] T007 [P] [US2] In `tests/unit/format-html.test.ts`, add cases: the numeric apostrophe reference in text becomes `'`; the named double quote reference in text becomes `"`; in a double-quoted attribute value the apostrophe becomes plain while a double quote stays escaped; text inside `script`, `style`, and `noscript` is not touched; `&amp;`, `&lt;`, and `&gt;` stay; the DOM check treats the plain and escaped forms as equal and still throws, naming the file, when text really changes

### Implementation for User Story 2

- [X] T008 [US2] In `scripts/format-html.ts`, add the plain-quote step before Prettier runs, applied to the page outside `script`, `style`, and `noscript`: in text, replace the numeric apostrophe reference (`&#x27;` and `&#39;`) with `'` and the named double quote reference with `"`; in tag attribute values written in double quotes, replace the numeric apostrophe reference with `'` and leave an escaped double quote alone. Do not touch the other escapes
- [X] T009 [US2] In `scripts/format-html.ts`, make the DOM check compare text tokens (and the loose region tokens) after decoding those same references on both sides, so the plain and escaped forms count as the same text
- [X] T010 [US2] Run `bun run test -- tests/unit/format-html.test.ts` and fix until T007 passes
- [X] T011 [US2] Run `bun run build`; confirm `out/index.html` contains `We'll` and no numeric apostrophe reference; run `bun run test:e2e --project=chromium -g "Readable output"` and the same on firefox; hydration must stay clean
- [X] T012 [US2] Extend `tests/unit/straight-quotes.test.ts` (part 2, built site, runs only when `out/` exists): every built page, the site's script chunk (`site-*.js`), and the site stylesheet have no banned character or reference, and no built page contains the numeric apostrophe reference (SC-003). Use `fileGroup` from `scripts/site-files.ts` to pick the files; vendor chunks are not checked

**Checkpoint**: The built pages show plain apostrophes and quotes, unchanged to the visitor.

---

## Phase 5: User Story 3 - It never comes back (Priority: P1)

**Goal**: The rule is in the four documents and in Claude's memory, and the checks from US1 and US2 enforce it.

**Independent Test**: Open the four documents and find the rule in each; the Code of Conduct files show no changes.

- [X] T013 [P] [US3] Add a section "Straight quotes only" to `CLAUDE.md`, after "No underline on links": never use curly, smart, or typographic quotes, in any file, as characters or as HTML references; use only the straight apostrophe and double quote; the Code of Conduct files are third-party and are not altered or checked; enforced by `tests/unit/straight-quotes.test.ts`. Use the words, not the characters or reference names
- [X] T014 [P] [US3] Add the same rule to `design/DESIGN.md`, in its copy or typography rules (read the file first and put it where the brand and copy rules are stated). Use words only
- [X] T015 [P] [US3] In `.specify/memory/constitution.md`, add a bullet under Technology Constraints stating the rule, the Code of Conduct exception, and that `bun run test` must fail, naming the file and line, when it is broken; add a Sync Impact Report entry at the top; change the version line to 1.6.0 with Last Amended set to today (MINOR: a new rule, no principle changed). Read the file first
- [X] T016 [P] [US3] Add a section "Straight quotes only" to `/home/ed/.claude/CLAUDE.md` (read it first; match the style of its existing "Links: no underline on hover" and Docker sections): never use curly, smart, or typographic quotes in any file in any project, as characters or HTML references; use only the straight apostrophe and double quote. No Code of Conduct exception, since that is specific to this project. Edit only this file
- [X] T017 [P] [US3] Save a feedback memory in `/home/ed/.claude/projects/-lab-andexor-net-website/memory/` (for example `straight_quotes_only.md`, with the frontmatter format from the memory instructions: why = the owner never authorized curly quotes and was upset to see them; how to apply = never write them, check files after writing, a typed escape can become the real character) and add its one-line pointer to `MEMORY.md`
- [X] T018 [US3] Search the four documents, the memory file, and every file this feature created or changed for the eight characters and for reference names; there must be none. Confirm `git diff -- CODE_OF_CONDUCT.md CODE_OF_CONDUCT.adoc` is empty

---

## Phase 6: Polish & Cross-Cutting

- [X] T019 Run `bun run format`, `bun run format:check`, `bun run lint`, `bun run test`, and `bun run test:e2e --project=chromium`; every test passes and the pages look the same
- [X] T020 Docker check: `./build.sh`, `./run.sh`, view the home page source (it shows `We'll`), one `Ctrl+C`, confirm the shutdown line and no leftover container in `docker ps -a` (Principle VII)
- [X] T021 Walk through `quickstart.md`, including its proof step with a temporary file, then delete the file
- [ ] T022 Set the spec Status to Implemented. Commit with `git commit -s` and a subject ending `Closes #N.` (ask the owner for the issue number), only when the owner asks

---

## Dependencies & Order

- T001 first, then T002 (the helper), then the stories.
- US1 (T003 to T006) before US2's T012, which extends the same test file.
- US2: T007 before T008 to T010; T011 after them.
- US3's document tasks (T013 to T017) are independent of each other and of the code; T018 comes after all of them.
- Polish last.

## Parallel Examples

- T003 and T004 (different files); T013, T014, T015, T016, and T017 (different files, one of them outside the repository).

## Implementation Strategy

1. MVP: Phases 1 to 3. The repository check and the Markdown guard exist and pass.
2. Add US2 (plain apostrophes in the built pages).
3. Add US3 (the four documents and the memory note), then polish.
