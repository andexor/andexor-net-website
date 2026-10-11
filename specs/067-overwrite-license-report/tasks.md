---

description: "Task list for Overwrite License Report"
---

# Tasks: Overwrite License Report

**Input**: Design documents from `/specs/067-overwrite-license-report/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (no contracts)

**Tests**: None. The owner decided the report is information for people and needs no tests (spec FR-008). Do not add a
test, a count, or a static check about the report or `setup.sh`. The existing suite must still pass.

**Quotes**: never type a curly quote, a backslash-u escape for one, or an HTML reference name for one into any file.
`bun run test` includes the straight-quotes check.

**Organization**: Two user stories. `setup.sh` is already changed by the owner and is not edited again. The constitution
and `CLAUDE.md` edits were made in the planning session on 2026-10-11 and are marked done; verify them rather than redo
them. Stay on the current branch (`48-update-dependencies`); never create or switch branches. The owner reviews before
committing, so do not commit.

**Network**: `./setup.sh` runs `bun add` and the license checker, so it needs the network. It keeps the Font Awesome kit at
`@latest` on purpose; do not pin it and do not treat a kit change as a problem unless something breaks.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Confirm the starting state. `git diff setup.sh` shows one change, the first write to the report going from `>>`
  to `>` (about line 47). `grep -n -E '^20[0-9]{2}-' reports/license-report.md` prints four date lines (2026-10-07,
  2026-10-08, and two on 2026-10-11). `ls node_modules/tinypool node_modules/vite-node` reports both missing, which shows
  `node_modules` already matches the lockfile; if either exists, run `rm -rf node_modules && bun install
  --frozen-lockfile` before going on. `git status --short` lists `bun.lock`, `package.json`, `setup.sh`,
  `reports/license-report.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, and the untracked
  `specs/067-overwrite-license-report/`

---

## Phase 2: User Story 1 - The report shows only the current dependencies (Priority: P1) MVP

**Goal**: `reports/license-report.md` holds exactly one dated section, produced by the changed script from the current
lockfile, and a second run replaces it rather than adding to it.

**Independent Test**: Run `./setup.sh` twice. After each run the report has one date line, the second newer than the
first, and the package list matches what is installed.

### Implementation

- [X] T002 [US1] Run `./setup.sh` from the repository root (it needs the network; allow a minute). It must finish without
  printing "Copyleft license found" and exit 0. Do not edit `setup.sh`
- [X] T003 [US1] Check the result in `reports/license-report.md`: `grep -n -E '^20[0-9]{2}-' reports/license-report.md`
  prints one line, on line 2, with today's date and time; line 1 and line 3 hold a single space; the list that follows
  includes `vitest@4.1.11` and `vite@7.3.7` and does not include `tinypool` or `vite-node`. `head -c 1
  reports/license-report.md` is a space, which shows the file was truncated before writing. Do not edit the report by hand
  (As built: the owner changed the script again before this ran, so the timestamp is now line 1 and the single-space
  line is line 2; the truncation and the one-section result are as specified. Verified 2026-10-11 18:03 UTC.)
- [X] T004 [US1] Check the script's own `bun add` lines changed nothing else: `git diff --stat package.json bun.lock`
  shows only the vitest and vite changes already on the branch. If `@awesome.me/kit-0a6c11d394` moved, say so in the
  report to the owner and leave it, since the kit stays at `@latest` by decision
- [X] T005 [US1] Run `./setup.sh` a second time and repeat the T003 check: still one date line, newer than the first. The
  file is about 670 lines, not 1340

**Checkpoint**: the report is a one-section snapshot and a rerun replaces it.

---

## Phase 3: User Story 2 - The project's rules match the script (Priority: P2)

**Goal**: No project document says the report is append-only or must not be overwritten; the constitution (1.7.0) and
`CLAUDE.md` describe the replace-on-run behavior and still say only `./setup.sh` writes the report.

**Independent Test**: `grep -n -i 'append' .specify/memory/constitution.md CLAUDE.md CONTRIBUTING.md setup.md` finds no
sentence that calls the report append-only; the constitution's last line reads 1.7.0, last amended 2026-10-11.

### Implementation

- [X] T006 [US2] In `.specify/memory/constitution.md`, Technology Constraints, rewrite the "Dependency audit" bullet: the
  report is produced by running `./setup.sh`, which replaces `reports/license-report.md` with one dated section listing
  the installed packages and their licenses; the report describes the current dependency set only and earlier sets are in
  version history; `./setup.sh` is the only thing that writes it and it MUST NOT be edited by hand or by any other script;
  dependencies added without a requirement in a spec or plan MUST be justified (Principle I). Done 2026-10-11
- [X] T007 [US2] In the same file, add an entry at the top of the Sync Impact Report comment: 1.6.0 to 1.7.0, MINOR, the
  Dependency audit rule changes materially, owner decision, specs/067-overwrite-license-report, no test because the report
  is information for people, templates checked and none mention the report. Change the last line to `**Version**: 1.7.0 |
  **Ratified**: 2026-09-28 | **Last Amended**: 2026-10-11`. Done 2026-10-11
- [X] T008 [P] [US2] In `CLAUDE.md`, Toolchain section, rewrite the sentence that began "Update the license report by
  running `./setup.sh`, which appends a dated section" so it says the script replaces the report with one dated section,
  earlier sets are in git history, the report is not edited by hand and no other script writes it, the script fails and
  leaves the report unchanged on a GPL, LGPL, or AGPL license, nothing is excluded, and the report has no tests. In the
  Spec-Driven Development workflow section, change "(currently v1.4.0)" to "(currently v1.7.0)". Done 2026-10-11
- [X] T009 [US2] Verify T006 to T008 are in place: `grep -n -i 'append' .specify/memory/constitution.md CLAUDE.md
  CONTRIBUTING.md setup.md` returns only the Sync Impact Report line that says "instead of appending"; `tail -1
  .specify/memory/constitution.md` shows 1.7.0 and 2026-10-11; `grep -n 'currently v' CLAUDE.md` shows v1.7.0;
  `grep -n -i 'license report' CONTRIBUTING.md setup.md` finds no description of append behavior (there is none to fix)

**Checkpoint**: documents and script agree.

---

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T010 Run `bun run test`, `bun run lint`, and `bun run format:check`. All pass with no new test file under `tests/`.
  The e2e suite is not affected and need not run; port 3000 is not used
- [X] T011 Grep the changed files (`setup.sh`, `CLAUDE.md`, `.specify/memory/constitution.md`,
  `specs/067-overwrite-license-report/*.md`) for curly quotes with `grep -rnP '[\x{2018}\x{2019}\x{201C}\x{201D}]'`;
  confirm none. Confirm `reports/license-report.md` was written only by the script, never by hand
- [X] T012 Leave everything uncommitted for the owner's review and report what changed: the one-section report, the
  constitution at 1.7.0, the `CLAUDE.md` paragraph, and the vitest and vite updates already on the branch. When asked to
  commit, use `git commit -s` with a subject ending in `Closes #48.`

---

## Dependencies & Execution Order

- T001 first. T002 to T005 run in order (each run of the script depends on the previous check). T006 to T008 are done;
  T009 verifies them and can run any time after T001, in parallel with T002 to T005 since it touches no file the script
  writes. T010 to T012 run last, in order.

## Implementation Strategy

User Story 1 is the MVP: one run of the script and a check. User Story 2 is already built and only needs verifying.
Then the suite, the quote check, and the hand-off to the owner.
