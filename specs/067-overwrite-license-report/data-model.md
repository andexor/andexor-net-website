# Data Model: Overwrite License Report

No application data changes. One file's shape changes.

## reports/license-report.md

| | before (specs through 066) | after (spec 067) |
|---|---|---|
| Written by | `./setup.sh`, appending | `./setup.sh`, replacing |
| Sections | one per successful run, oldest first | exactly one, from the latest successful run |
| On a failed copyleft check | unchanged | unchanged |
| History | inside the file | in version control |

One section is: an ISO 8601 timestamp with seconds and zone (`date --iso-8601=seconds`) on line 1, a line holding a
single space, then the license checker's Markdown list, one `- [name@version](repository) - LICENSE` line per installed
package, sorted by name. (The old file began each section with an extra single-space line; the first write now is the
timestamp, which truncates the file.)

## Documents that describe the report

| Document | Statement after this feature |
|---|---|
| `.specify/memory/constitution.md` (Technology Constraints, Dependency audit) | `./setup.sh` replaces the report with one dated section; it is the only writer; history is in version control. Version 1.7.0. |
| `CLAUDE.md` (Toolchain) | Same, in workflow wording; still says not to add another script that writes the report. |

## State transitions

```text
run ./setup.sh
  copyleft found  -> exit 1, report unchanged
  check passes    -> report := one new section (previous content discarded)
```
