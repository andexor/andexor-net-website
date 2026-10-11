# Research: Overwrite License Report

## What the script does now

- **Finding**: `setup.sh` runs `bun add` for the Font Awesome packages and the license checker, writes the checker's
  Markdown output to a temp file, fails (exit 1, report untouched) when `--failOn` or the `GPL` grep finds a copyleft
  license, and otherwise writes a blank spacer line, an ISO 8601 timestamp, another spacer, and the package list. The
  owner first changed the spacer's redirect from `>>` to `>`, then dropped the leading spacer so the timestamp itself is
  the first write, with `>`, and truncates the file. Everything after it still appends, to the now-empty file. One run
  therefore produces one section: timestamp, blank line, package list.
- **Decision**: Keep the script exactly as the owner changed it. No further edit.
- **Alternatives considered**: Writing the whole section to the temp file and moving it into place (atomic, but more
  lines for no observed need); keeping the history in the file (the owner rejected this).

## Where "append-only" is written down

- **Finding**: Two places. The constitution, Technology Constraints, Dependency audit: "which appends a dated section
  ... The report is append-only and MUST NOT be overwritten, so `./setup.sh` is the only way to update it."
  `CLAUDE.md`, Toolchain: "which appends a dated section to `reports/license-report.md` (append-only, never overwrite
  it, so do not add another script that writes the report)". `CONTRIBUTING.md` and `setup.md` do not mention it.
  The constitution is at 1.6.0, last amended 2026-10-05, although `CLAUDE.md` still says 1.4.0 in its workflow
  paragraph; that number is fixed in passing.
- **Decision**: Amend the constitution rule to: the report is produced by running `./setup.sh`, which replaces it with
  one dated section; `./setup.sh` is still the only thing that writes it; earlier dependency sets are in version
  history. Bump to 1.7.0 (MINOR: an existing rule is materially changed, the owner's call per the spec), set Last
  Amended to 2026-10-11, and add the entry at the top of the Sync Impact Report. Templates in `.specify/templates/`
  do not mention the report, so none need follow-up. Rewrite the `CLAUDE.md` sentence to match, keeping "do not add
  another script that writes the report".
- **Alternatives considered**: PATCH bump (rejected: the rule's meaning reverses, that is not a wording fix); leaving
  `CLAUDE.md` alone (rejected: an assistant reading it would refuse to run the script or revert the change).

## The committed report

- **Finding**: The working-tree report has four sections (2026-10-07, 2026-10-08, and two from 2026-10-11: the owner's
  run at 17:14 before the vitest upgrade and a run at 17:26 after it). Only the last reflects the lockfile. The license
  checker reads `node_modules`, so a stale directory from an earlier install would show up in the report; that happened
  once today with `tinypool` and `vite-node` until `node_modules` was reinstalled from the lockfile.
- **Decision**: Run `./setup.sh` once. The result is a single section dated at that run. `node_modules` was already
  reinstalled from the lockfile on 2026-10-11 after the stale directories were noticed, so no reinstall is needed first.
  (`bun install` and `bun update` do not remove packages the lockfile no longer lists; only deleting `node_modules` and
  installing with `--frozen-lockfile` does.) The script's `bun add` lines re-add packages already present and should
  change nothing. The Font Awesome kit stays at `@latest` in the script: the owner wants it easy to update, and if it
  ever moves unexpectedly that is looked at then.
- **Alternatives considered**: Trimming the file by hand to its last section (rejected: the constitution says only
  `./setup.sh` writes it, and a hand edit is exactly what the rule forbids).

## Test

- **Finding**: Principle V asks for tests where a spec has testable criteria. A static test over `setup.sh` and the
  project documents was considered.
- **Decision**: No test. The owner's decision: the report is an FYI for humans, not site behavior, so no test is
  needed. The quickstart's manual checks cover the acceptance scenarios. This is recorded in the plan's Constitution
  Check as the reason Principle V is satisfied without a new test.
