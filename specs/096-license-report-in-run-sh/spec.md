# Feature Specification: License Report in run.sh

**Feature Branch**: `120-add-security-headers` (current branch; not created by this spec)

**Created**: 2026-11-12

**Status**: Implemented (2026-11-12).

**Input**: User description: "Streamline the license report. Remove update.sh. Move the license report stuff from
setup.sh to run.sh. Let run.sh do `npm update`. If it installs or updates any packages, update the license report. If
not, skip it. Then it can proceed with running the preview."

**Issue**: [#120](https://github.com/andexor/andexor-net-website/issues/120), the issue of the current branch
(`120-add-security-headers`).

## Summary

Two scripts touched the packages and one of them wrote the license report: `update.sh` ran `npm update` and then
`setup.sh`, which also added packages and wrote the report every time. Now `run.sh` is the one place: it updates the
packages, rewrites the report only when the packages changed, and then builds and previews the site.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Running the site keeps the packages and the report current (Priority: P1)

**Independent Test**: Run `./run.sh` twice in a row. The first run updates what can be updated and rewrites the report
if the lockfile changed. The second finds nothing to update and leaves the report alone. Both then build and start the
preview.

**Acceptance Scenarios**:

1. **Given** `npm update` changes the lockfile, **When** `run.sh` continues, **Then** `reports/license-report.md` is
   rewritten before the build.
2. **Given** `npm update` changes nothing and the report already describes the lockfile, **When** `run.sh`
   continues, **Then** the report is not touched.
3. **Given** a report that is missing or describes another lockfile (`setup.sh` added a package, or git brought in a
   new lockfile), **When** `run.sh` runs, **Then** the report is rewritten.
4. **Given** a package with a GPL, LGPL, or AGPL license, **When** the report is rewritten, **Then** `run.sh` prints
   that, leaves the report as it was, and stops before the build.

## Requirements *(mandatory)*

- **FR-001**: `run.sh` MUST run `npm update`, then rewrite the report when needed, then run `npm run build` and
  `npm run preview`.
- **FR-002**: The report MUST record, on its second line, the SHA-256 hash of `package-lock.json` it describes
  (`<!-- package-lock.json sha256: ... -->`). `run.sh` MUST rewrite the report only when that hash differs from the
  lockfile's, or the report is missing.
- **FR-003**: The copyleft check MUST be the one `setup.sh` had: `--failOn` for exact SPDX identifiers and a `grep`
  backstop for variants.
- **FR-004**: `update.sh` MUST be removed. `setup.sh` MUST keep only the FontAwesome package additions.
- **FR-005**: The report MUST still be written only by that script, never by hand, and MUST have no test.
- **FR-006**: The constitution (3.1.0), `CLAUDE.md`, and `setup.md` MUST name `run.sh` as the writer.

## Assumptions and Decisions

- The report records the lockfile's hash instead of the run comparing file dates, because `npm update` rewrites the
  lockfile's modification time even when nothing changes, which would rewrite the report on every run. The hash also
  covers a lockfile changed by `setup.sh` or by git, which a before-and-after comparison inside one run would miss.
- The report's second line was a single space and is now the hash comment. It does not show when the Markdown is
  rendered.
- `run.sh` stops on a copyleft license, as `setup.sh` did, so a risky update is not previewed as if it were fine.
- `npm update` now runs on every local run, so `package-lock.json` can change in the working tree. Commit it once the
  preview looks right.
- `license-checker-rseidelsohn` is already a development dependency, so the `npm install --save-dev` line in
  `setup.sh` is gone.
