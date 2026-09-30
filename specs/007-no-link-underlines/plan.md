# Implementation Plan: No Underlines on Any Link

**Branch**: `13-update-the-style-of-the-404-page` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-no-link-underlines/spec.md`

## Summary

Two stylesheet rules underline links at rest: `.an-prose a` (`src/styles/content.css`, body text on
content pages, including "Page not found") and `.an-tile a` (`src/styles/cards.css`, cards).
Removing them alone fails WCAG 1.4.1 (`link-in-text-block`): the link color and body text color
are 1.42:1 apart and 3:1 is required. So within those two scopes only, body text becomes brighter
(`--slate-50`) and links become `--blue-400`, and hover gets an explicit color. Then the
constitution (Principle VI), spec 002, `CLAUDE.md`, and a unit test are amended so the rule reads
the same everywhere.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`); plain CSS

**Primary Dependencies**: none added (`@axe-core/playwright` already present)

**Storage**: N/A

**Testing**: Vitest (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change (CSS only)

**Constraints**: WCAG 2.1 AA (Principle III); always-dark palette (VI); no hover underline (VI);
footer links unchanged (FR-009)

**Scale/Scope**: 2 CSS files, 1 unit test, 2 e2e specs, constitution, `CLAUDE.md`, spec 002

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. Two scoped custom-property overrides and two removed declarations. No new tokens, files, or dependencies. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass, and this is the point: the accessibility check is the acceptance gate (FR-008, SC-003). |
| IV. Design & content consistency | Pass. One link look for every link. Reuses existing tokens (`--slate-50`, `--blue-400`, `--blue-300`). |
| V. Test-first | Pass. Tests are written first: a no-underline check, a computed-style check, and the existing axe specs. |
| VI. Always-dark, color-only hover | **Amended by this feature.** Today it allows "underlines at rest on inline body links". This plan changes it to no underlines at all. The amendment is a task, and the constitution is versioned (1.3.0, MINOR: the rule is materially expanded). |
| VII. Graceful shutdown | Not affected. Verified by the usual Docker check. |
| VIII. Markdown content pages | Pass. Styles apply to Markdown pages automatically. |
| License header | No new source files except tests, which get the header. |

Governance needs the amendment to follow the constitution's own process: rationale (owner
decision, this spec), version bump, and a review of dependent templates (`.specify/templates/*`
mention no underline rule, so nothing to change there).

## Project Structure

### Documentation (this feature)

```text
specs/007-no-link-underlines/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── link-style.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/styles/
├── content.css        # edit: .an-prose gets color overrides; a loses underline; hover color
└── cards.css          # edit: .an-tile gets color overrides; a loses underline; add hover color

tests/
├── unit/no-hover-underline.test.ts   # edit: also fail on any link rule that underlines (rest or hover)
└── e2e/link-style.spec.ts            # new: computed styles on three pages, rest/hover/focus

.specify/memory/constitution.md       # amend Principle VI, bump to 1.3.0, Sync Impact Report
CLAUDE.md                             # "No underline on hover" section -> no underline on links
specs/002-content-pages-card-template/   # spec.md, research.md, quickstart.md wording
design/DESIGN.md                      # line 112 ("links underline" on hover) contradicts; see Design Decisions
```

**Structure Decision**: Keep the existing layout. No new component; the two scopes already exist.

## Design Decisions

- **Scope of the color change.** Override the two custom properties on the two containers only:
  `.an-prose` and `.an-tile` get `--text-body: var(--slate-50)` and `--text-link: var(--blue-400)`.
  Anything inside them, including the link, inherits. The home page, footer, and buttons do not
  change (FR-007, FR-009). Setting `--text-body` on the same element that uses it as `color`
  works because custom properties resolve on the element itself.
- **Remove, don't override.** Delete `text-decoration: underline` and `text-underline-offset` from
  `.an-prose a` and `.an-tile a`. The global `a { text-decoration: none }` in
  `src/styles/tokens/base.css` then applies, so nothing has to say "none" again.
- **Hover color.** `.an-prose a:hover` currently uses `--text-heading`, which is `--slate-50`, the
  same as the new body text, so the link would seem to vanish into the text on hover. Use
  `--blue-300` (the old link color, a lighter blue) for hover in both scopes. `.an-tile a` has no
  hover rule today, so one is added (FR-003, and spec 002's "color changes on hover").
- **Dark featured cards** (`.an-tile--ink`) keep their `--blue-200` body text. A `--blue-400`
  link on `--blue-200` text is 2.45:1, so it would fail if a link were added. None exist today.
  A test note and the contract record this; no code is added for a case that does not exist
  (Principle I).
- **Design system doc.** `design/DESIGN.md` line 112 says links underline on hover. That is the
  design system's default and this site already overrides it (spec 002). Add a note there only if
  the owner wants the design docs kept in step; the constitution and `CLAUDE.md` govern.
- **Hover/focus cue (WCAG G183).** The automated rule tests links at rest. Hover is color-only
  by owner rule, and keyboard focus keeps its visible ring. Recorded as an accepted limit.

## Complexity Tracking

Not needed. The one principle change (VI) is the purpose of the feature, not a violation.
