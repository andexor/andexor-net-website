# Implementation Plan: Readable Generated Code

**Branch**: `21-make-generated-content-readable` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/038-readable-generated-code/spec.md`

## Summary

Make everything the build produces and everything in the repo easy to read: HTML, CSS, and JavaScript pretty-printed
with 4-space indents and a 120-character target, the site's own script code in a separate unminified file, and the
same style for the TypeScript and TSX source. Prettier (already installed) does the formatting. A small `webpack` hook
in `next.config.ts` puts all `src/` code in one `site-*.js` chunk and marks it so Next's minifier skips it. A post-build
script, `scripts/format-site.ts`, formats the built HTML, CSS, and `site` chunk. React hydration rejects the extra
whitespace that pretty-printed HTML adds, so the script injects a tiny inline script into each page's `<head>` that
strips that whitespace before React hydrates, and a gate compares the DOM before and after formatting and fails the
build on any difference (see [research.md](research.md), section 4).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun runtime

**Primary Dependencies**: Prettier ^3.4 (existing devDependency, installed 3.9.9). No new dependencies.

**Storage**: N/A (files only)

**Testing**: Vitest (new `tests/unit/formatting.test.ts`), Playwright (new `tests/e2e/readable-output.spec.ts`), the
existing suites as the regression gate

**Target Platform**: Linux (Docker, Bun runtime serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change to Core Web Vitals targets in the existing performance spec. HTML grows by whitespace and about 700 bytes of inline script
(expected under 50%); the `site` chunk is unminified but compresses well, and vendor chunks stay minified.

**Constraints**: Must not change appearance or behavior (FR-007); formatted HTML must give the same DOM after the whitespace script runs (no hydration errors); `bun`/Docker workflow unchanged;
license headers stay first in every source file; `reports/license-report.md` is not touched.

**Scale/Scope**: 13 HTML pages, 1 site CSS file, 1 site JS chunk, about 70 source files.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. No new dependency, one config hook, one script. |
| II. Modern component stack | Pass. Next.js SSG is unchanged. |
| III. Accessibility & performance | Pass with a watch item: unminified site chunk and pretty HTML add bytes; measured in quickstart and the existing performance e2e. |
| IV. Design & content consistency | Pass. No visual change. |
| V. Test-first quality gates | Pass. New formatting and hydration tests are written with the change. |
| VI. Always-dark, no hover underline | Pass. Reformatting CSS must not change rules; grep for hover underlines before done. |
| VII. Graceful shutdown | Pass. `server.ts` is only reformatted; the Docker shutdown check is rerun. |
| VIII. Markdown content | Pass. `content/` is untouched; only its rendered HTML is formatted. |
| Technology constraints | Pass. Bun, `build.sh`/`run.sh`/`debug.sh` unchanged. License headers kept. Prettier is not a runtime dependency, so the license report is unaffected, but `./setup.sh` is rerun if `package.json` changes. |

The constitution and `CLAUDE.md` gain a short formatting rule (see tasks): that is a MINOR constitution amendment
(new rule under Technology Constraints).

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/038-readable-generated-code/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── formatting-rules.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
.prettierrc.json          # tabWidth 4, printWidth 120
.prettierignore           # design/, out/, .next/, specs/, content/, reports/, lock files, *.md
next.config.ts            # site chunk + KeepSiteReadable webpack hook
package.json              # build, format, format:check scripts
scripts/
└── format-site.ts        # post-build: Prettier over out/, whitespace script injection + DOM gate, file-group lookup
src/                      # reformatted to 4 spaces (mechanical commit); FONT_LOADER_SCRIPT restyled
tests/
├── unit/formatting.test.ts          # rules on source + built custom files; names the file on failure
└── e2e/readable-output.spec.ts      # no console/hydration errors on three page types
CLAUDE.md, CONTRIBUTING.md, .specify/memory/constitution.md   # record the rule (FR-010)
```

**Structure Decision**: Keep the existing single Next.js project. Add one `scripts/` directory for the post-build
pass, with the file-group lookup in one module shared by the pass and the unit test so they cannot disagree.

## Implementation Order

1. Build `scripts/format-site.ts` (placeholders, Prettier, whitespace script, DOM gate) and its test; the risky part goes first.
2. `next.config.ts` hook, then `package.json` scripts, `.prettierrc.json`, `.prettierignore`.
3. Mechanical reformat of the source in its own commit, then restyle `FONT_LOADER_SCRIPT`.
4. Formatting test and e2e hydration test.
5. Docs and constitution update; run `./setup.sh` only if dependencies changed; Docker build and shutdown check.

## Complexity Tracking

No constitution violations to justify.
