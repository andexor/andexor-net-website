# Feature Specification: Overwrite License Report

**Feature Branch**: `48-update-dependencies`

**Created**: 2026-10-11

**Status**: Draft

**Input**: User description: "I changed setup.sh to overwrite reports/license-report.md on every run, so it is no longer append only."

This is an as-built spec. The owner has already changed `setup.sh`; this document records the new rule so the project's
documents, the constitution, and the report itself agree with it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The report shows only the current dependencies (Priority: P1)

Until now each run of `./setup.sh` appended a new dated section to `reports/license-report.md`, so the file grew by about
670 lines per run and held every past dependency set alongside the current one. From now on each run replaces the file
with one dated section listing the dependencies installed at that moment. Someone opening the report sees the current
state and nothing else.

**Why this priority**: This is the owner's whole request. A reader checking what the site depends on, and under which
licenses, should not have to find the last section in a file that keeps growing.

**Independent Test**: Run `./setup.sh` twice. After the second run the report holds exactly one dated section, its date
is from the second run, and its package list matches what is installed.

**Acceptance Scenarios**:

1. **Given** a report with several dated sections, **When** `./setup.sh` runs and the license check passes, **Then** the
   report holds one dated section with the current date and time, and the earlier sections are gone.
2. **Given** a report with one section, **When** `./setup.sh` runs again, **Then** the report still holds one section,
   dated from the new run.
3. **Given** a dependency set that contains a copyleft license, **When** `./setup.sh` runs, **Then** the script fails,
   says the report was not updated, and the report keeps its previous content unchanged.
4. **Given** a reader who wants an earlier dependency set, **When** they look for it, **Then** they find it in the
   project's version history, where every committed version of the report is kept.

---

### User Story 2 - The project's rules match the script (Priority: P2)

The constitution and the project guidance for AI assistants both say the report is append-only and must never be
overwritten. After this change those statements are wrong. They are corrected so nobody, person or assistant, restores
the old behavior or refuses to run the script because a document forbids overwriting.

**Why this priority**: The owner has asked that project documents never contradict the code. A stale rule here would
make an assistant argue with the owner about the owner's own decision.

**Independent Test**: Search the constitution, `CLAUDE.md`, `CONTRIBUTING.md`, and `setup.md` for "append". No sentence
says the report is append-only or must not be overwritten, and the sentences that describe the report say it is
replaced on each run.

**Acceptance Scenarios**:

1. **Given** the constitution, **When** its Dependency audit rule is read, **Then** it says `./setup.sh` replaces the
   report with one dated section, that the report is still only written by `./setup.sh`, and that earlier versions
   live in version history. The constitution's version and amendment date are bumped for the change.
2. **Given** `CLAUDE.md`, **When** its toolchain section is read, **Then** it describes the same behavior, no longer
   says "append-only, never overwrite it", and still says not to add another script that writes the report.
3. **Given** the committed report, **When** it is opened after this feature, **Then** it holds one section produced by
   the new script, not the four sections that accumulated under the old rule.

---

### Edge Cases

- The script writes the report only after the license check passes. A failed check, for a GPL, LGPL, or AGPL license,
  leaves the previous report in place exactly as before.
- The report is regenerated from what is installed, so the installed packages must match the lockfile when it runs.
  A stale package left in the install directory from an earlier experiment would appear in the report; a clean
  install from the lockfile first avoids that.
- Running the script in a fresh checkout that has no report creates it, as before.
- The "do not add another script that writes the report" rule still holds. Only `./setup.sh` writes it, and it still
  appends nothing anywhere else.
- Two runs on the same day are not a problem any more: the second simply replaces the first.
- A section reads as before: the date line, a blank line, then the package list. The only differences are that the
  file now begins with the date line, with no blank line before it, and that there is one section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each successful run of `./setup.sh` MUST replace the whole of `reports/license-report.md` with one dated
  section listing the currently installed dependencies and their licenses.
- **FR-002**: A run whose license check fails MUST leave the report unchanged and MUST exit with an error, as before.
- **FR-003**: `./setup.sh` MUST remain the only thing that writes the report. No other script or build step MAY write
  it.
- **FR-004**: Nothing MAY be excluded from the report, and the copyleft check MUST stay as it is.
- **FR-005**: The constitution's Dependency audit rule MUST be amended to say the report is replaced on each run and
  that earlier dependency sets are found in version history. The constitution version MUST be bumped (a PATCH or MINOR
  bump, per its own amendment rules) and its Sync Impact Report updated.
- **FR-006**: `CLAUDE.md` MUST be updated to describe the new behavior and MUST no longer call the report append-only.
  Any other project document that says the report is append-only MUST be corrected the same way.
- **FR-007**: The committed report MUST be regenerated once with the new script, from a clean install of the lockfile,
  so that it holds a single current section.
- **FR-008**: No automated test MAY be written for the report or the script. The report is information for people,
  and the owner has decided it needs no tests. The acceptance scenarios are checked by hand.

### Key Entities

- **License report**: `reports/license-report.md`, a Markdown list of every installed package with its license, headed
  by the date and time it was produced. After this change it describes one moment only.
- **Setup script**: `./setup.sh`, the only writer of the report. It installs the project's added packages, runs the
  license check, and writes the report when the check passes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After any successful run of the setup script, the report holds exactly one dated section, and its date is
  that run's date.
- **SC-002**: A failed license check leaves the report byte-for-byte unchanged.
- **SC-003**: No project document says the report is append-only or must not be overwritten, and the constitution and
  assistant guidance describe the replace-on-run behavior.
- **SC-004**: Every earlier dependency set remains available through the project's version history.
- **SC-005**: The build and every existing test still pass, with no test added.

## Assumptions

- The owner wants the report to be a snapshot, not a log. History is the job of version control, which already keeps
  every committed version of the file.
- The change to the script is already made and correct: the first write, the date line, truncates the file and the rest
  of the section is written as before. No further change to the script's output format is wanted.
- The report in the working tree currently holds four sections, two of them from 2026-10-11, one produced by the owner
  before the vitest upgrade and one produced after it. Regenerating once replaces all four with a single current
  section.
- The constitution bump is the owner's call between PATCH (clarifying a rule) and MINOR (changing a rule). The spec
  treats it as a rule change, so MINOR is the suggested default, 1.6.0 to 1.7.0.
- This is a small change on the current branch, with no new branch, alongside the dependency updates for issue #48.
- The setup script keeps installing the Font Awesome kit at `@latest`, so it stays easy to update. If that ever causes a
  problem it is looked at then.
