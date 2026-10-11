# Implementation Plan: Overwrite License Report

**Branch**: `48-update-dependencies` | **Date**: 2026-10-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/067-overwrite-license-report/spec.md`

## Summary

The owner has already changed `setup.sh` so its first write to `reports/license-report.md` truncates the file (`>`) and the
rest of the dated section is appended to that fresh file as before. The remaining work is to make the project agree with
the script: amend the constitution's Dependency audit rule (1.6.0 to 1.7.0), fix the matching paragraph in `CLAUDE.md`,
and regenerate the committed report once so it holds a single section. The report is information for people, so the
owner wants no tests for it. Details in [research.md](research.md).

## Technical Context

**Language/Version**: Bash (`setup.sh`), Markdown (constitution, `CLAUDE.md`, report), Bun 1.3

**Primary Dependencies**: None new. `license-checker-rseidelsohn` 5.x already produces the report.

**Storage**: One Markdown file, `reports/license-report.md`, committed to the repository.

**Testing**: None added, by the owner's decision: the report is an FYI for humans. The script is checked by hand per
[quickstart.md](quickstart.md). The existing suite must still pass.

**Target Platform**: Linux (Ubuntu LTS), Bash, Bun

**Project Type**: Static web site (Next.js SSG); this feature touches only its tooling and documents.

**Performance Goals**: None. The report shrinks from about 2700 lines to about 670.

**Constraints**: `./setup.sh` stays the only writer of the report (no new script writes it); straight quotes; the
copyleft check and its "report unchanged on failure" behavior are untouched; the Font Awesome kit stays at `@latest` in
the script so it is easy to update.

**Scale/Scope**: One line already changed in `setup.sh`; two document edits; one constitution bump; one regenerated
report.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One redirect character changed in the script; no new dependency, script, or option. The report becomes a snapshot and version control keeps history, which is simpler than a growing log. |
| II. Component stack | Pass. Not affected. |
| III. Accessibility & performance | Pass. Not affected. |
| IV. Design & content consistency | Pass. Not affected. |
| V. Test-first | Pass, with a noted exception. The owner decided the report needs no tests: it is information for people, not site behavior, and no visitor-facing regression can come from it. The script is checked by hand in the quickstart, and the existing suite must still pass. |
| VI. Always-dark, no hover underline | Pass. Not affected. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Not affected. |
| Technology constraints: Dependency audit | Amended by this feature. The rule "append-only and MUST NOT be overwritten" is replaced; see research.md. Until the amendment lands, the changed script contradicts the constitution, which is why the amendment is part of this feature and not deferred. |
| Technology constraints: Licenses, Quotes, Formatting | Pass. Nothing is excluded from the report; the copyleft check is unchanged; straight quotes. |
| Development workflow | Pass. Issue-driven on the current branch (#48); the spec was written before the document edits. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/067-overwrite-license-report/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

No `contracts/`: the feature exposes no interface. The script's one output is described in data-model.md.

### Source Code (repository root)

```text
setup.sh                                  # already changed: first write truncates the report
.specify/memory/constitution.md           # Dependency audit rule rewritten; version 1.7.0; Sync Impact Report entry
CLAUDE.md                                 # toolchain paragraph: report is replaced each run, not append-only
reports/license-report.md                 # regenerated once by ./setup.sh: one section
```

**Structure Decision**: single Next.js project; no changes under `src/` or `tests/`.

## Complexity Tracking

None.
