# Implementation Plan: Service Card Hover

**Branch**: `25-tweak-borders-box-shadows-and-transitions-on-cards` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/047-service-card-hover/spec.md`

## Summary

On the home page, a service card gets a 2px gold ring on hover, does not move, and has no border color change. It moves
2px right and 2px down only while pressed. In `src/styles/components.css` the `.an-card--hover:hover` rule changes:
`transform` is deleted, `box-shadow` becomes `0 0 0 2px var(--gold-500)`, and `border-color` is deleted. The press rule
in `src/styles/marketing.css` is kept, and its comment is corrected because the hover lift it mentions is gone. One e2e
test checks the computed values on hover and while pressed. Details in [research.md](research.md).

## Technical Context

**Language/Version**: CSS (plain, one stylesheet), TypeScript 5.7 for the test, Bun, Next.js 15.5 (static export)

**Primary Dependencies**: None new. Uses the existing `--gold-500` token.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/service-card-hover.spec.ts`, new); existing home page, link-style, and axe tests

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No underline in any state; no change to the resting look, the transition, or the press rule; the gold
is a token, not a literal; no count assertions; Prettier formatting; straight quotes.

**Scale/Scope**: One rule edited (one value changed, two declarations removed), one comment corrected, one new test file.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Edits one existing rule, adds no rule or token. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. A 2px gold ring on the dark surface is clearly visible (see research.md); the axe checks stay. |
| IV. Design & content consistency | Pass. Press now matches the buttons' 2px movement, and hover uses the gold accent. |
| V. Test-first | Pass. The test is written and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. No underline; the hover signal is a ring. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. Prettier formatting; no new dependency. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/047-service-card-hover/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

No `contracts/`: the feature adds no interface.

### Source Code (repository root)

```text
src/styles/components.css             # .an-card--hover:hover: gold ring only, no transform, no border-color
src/styles/marketing.css              # comment on the service card :active rule only
tests/e2e/service-card-hover.spec.ts  # new: computed styles at rest, on hover, and while pressed
```

**Structure Decision**: single Next.js project; no new files in `src/`.

## Complexity Tracking

None.
