# Implementation Plan: Combine Page Scripts

**Branch**: `21-make-generated-content-readable` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/041-combine-page-scripts/spec.md`

## Summary

Each built page ends with 13 small inline scripts that carry the framework's data. This feature combines them into one
script (step 1) and moves that script into an external file `out/_next/static/data/<hash>.js`, with a preload hint in the
head (step 2). Both steps were prototyped on copies of the built site: no console errors, the Contact popup and
and a page reached through a link work in Chromium and Firefox, and on a 1.6 Mbps connection step 1 costs nothing measurable and
step 2 costs about 27 to 33 ms with the preload hint, against 47 to 62 ms without it. A new data check runs the original and the
new scripts in a sandbox and fails the build if the data differs. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, Bun, Next.js 15.5 (static export)

**Primary Dependencies**: Prettier (existing); `node:vm` and `node:crypto` (built in). No new dependencies.

**Storage**: Files in `out/_next/static/data/`

**Testing**: Vitest (new `tests/unit/combine-scripts.test.ts`, additions to `build-output.test.ts`,
`straight-quotes.test.ts`, `formatting.test.ts`), Playwright (existing hydration test plus one slow-connection check)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: At most one extra file per page; the Contact button works within 5 s on a 1.6 Mbps, 150 ms
connection (measured about 3.2 s).

**Constraints**: No change to what a visitor sees or to hydration; the head scripts and the framework's script files stay
as they are; the formatting, DOM check, and straight quotes rules still apply.

**Scale/Scope**: 11 built pages; one new build script module.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. No dependency; one small module, justified by the owner's request. |
| II. Component stack | Pass. Next.js SSG unchanged; the step works on its output. |
| III. Accessibility & performance | Pass. Measured cost is tens of milliseconds, with a preload hint; a budget check is added. |
| IV. Design & content consistency | Pass. No visible change. |
| V. Test-first | Pass. Unit, built-output, and browser checks are written first. |
| VI. Always-dark, no hover underline | Pass. No CSS touched. |
| VII. Graceful shutdown | Pass. Docker shutdown check rerun. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. License header on the new module; Prettier formatting; Technology Constraints (formatting, quotes) hold for the data file; no change to `reports/license-report.md`. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/041-combine-page-scripts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── built-page-scripts.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
scripts/combine-scripts.ts        # new: finds the trailing data scripts, combines them, moves them to a file, checks the data
scripts/format-site.ts            # calls it for each page before formatting; writes the data files
scripts/site-files.ts             # new group for out/_next/static/data/*.js
tests/unit/combine-scripts.test.ts          # new
tests/unit/build-output.test.ts             # data scripts gone, data file present and formatted
tests/unit/straight-quotes.test.ts          # includes the data files
tests/unit/formatting.test.ts               # includes the data files
tests/e2e/readable-output.spec.ts           # existing hydration checks; one slow-connection check added
specs/041-combine-page-scripts/spec.md      # FR-010 reworded (names match content, not byte-for-byte builds)
```

**Structure Decision**: Keep the single Next.js project. The new logic is one module next to the other build scripts.

## Implementation Order

1. Tests for combining, moving, and the data check (written first, failing).
2. `scripts/combine-scripts.ts` step 1, then wire it into `scripts/format-site.ts`; run all checks (go or no-go).
3. Step 2 (external file and preload hint), the file group, and the built-output and formatting tests; run all checks again
   (go or no-go).
4. The slow-connection check; the full test run; Docker shutdown check.
5. Reword FR-010; update `CLAUDE.md` Formatting section with a line about the data file.

## Complexity Tracking

No constitution violations to justify.
