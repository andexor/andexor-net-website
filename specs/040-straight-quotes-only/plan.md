# Implementation Plan: Straight Quotes Only

**Branch**: `21-make-generated-content-readable` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/040-straight-quotes-only/spec.md`

## Summary

No curly quote exists in the built pages or in the repository outside the third-party Code of Conduct files, which stay
untouched. What the owner saw was the numeric escape for a straight apostrophe (`We&#x27;ll`) that React writes. This
feature has the post-build formatter write the plain character instead, teaches the DOM check that the two forms are
the same, adds an automated check that fails on any curly quote or reference to one (in the repository and in the built
site), and writes the rule into the project `CLAUDE.md`, `design/DESIGN.md`, the constitution, and `~/.claude/CLAUDE.md`. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, Bun, Next.js 15.5 (static export)

**Primary Dependencies**: Prettier (existing). No new dependencies.

**Storage**: N/A

**Testing**: Vitest (`tests/unit/straight-quotes.test.ts`, additions to `format-html.test.ts` and `content.test.ts`)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change; the HTML gets a few bytes smaller.

**Constraints**: The DOM stays identical (spec 038), so hydration is unaffected; the check's own source contains no
banned characters (it uses numeric code points, and is searched after writing, because backslash escapes can be turned into
the real character when a file is written); the Code of Conduct files are not modified or checked.

**Scale/Scope**: One formatter function, one check, four documents.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. No dependency; one replace step and one test. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Same DOM, same rendering. |
| IV. Design & content consistency | Pass. A rule in the design document, as the constitution asks for appearance rules. |
| V. Test-first | Pass. The check and its cases are written with the change. |
| VI. Always-dark, no hover underline | Pass. No CSS touched. |
| VII. Graceful shutdown | Pass. Docker shutdown check rerun. |
| VIII. Markdown content | Pass. Markdown content is not edited; a test guards its rendering. |
| Technology constraints | Pass. License headers on the new test; Prettier formatting; no `reports/license-report.md` change. |

The constitution gains one new rule under Technology Constraints and moves to version 1.6.0 (MINOR); no principle is
changed.

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/040-straight-quotes-only/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── quote-rule.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
scripts/format-html.ts                   # plain apostrophe and quote step before Prettier; gate decodes both forms
tests/unit/format-html.test.ts           # cases for the new step and the gate
tests/unit/content.test.ts               # Markdown keeps straight quotes
tests/unit/straight-quotes.test.ts       # new: the check, repository and built site
CLAUDE.md                                # new section
design/DESIGN.md                         # new line
.specify/memory/constitution.md          # new rule under Technology Constraints, version 1.6.0, Sync Impact Report
~/.claude/CLAUDE.md                      # new section (outside the repository)
~/.claude/projects/.../memory/           # feedback note, so a later session recalls the rule
```

**Structure Decision**: Keep the single Next.js project; no new directories.

## Implementation Order

1. Tests for the formatter step, the gate, and the check (written first, failing).
2. The formatter step and the gate change in `scripts/format-html.ts`.
3. The check, `tests/unit/straight-quotes.test.ts`.
4. The four rule files (project `CLAUDE.md`, `design/DESIGN.md`, the constitution, `~/.claude/CLAUDE.md`) and the memory note.
5. Build, run all tests, confirm the Code of Conduct files are unchanged, Docker shutdown check.

## Complexity Tracking

No constitution violations to justify.
