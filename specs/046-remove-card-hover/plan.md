# Implementation Plan: Remove Card Hover

**Branch**: `25-tweak-borders-box-shadows-and-transitions-on-cards` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/046-remove-card-hover/spec.md`

## Summary

Cards (`.an-tile`) stop reacting to the pointer. In `src/styles/cards.css` the `.an-tile:hover` rule is deleted, and so
is the `transition` on `.an-tile`, which only animated that rule. One e2e test checks that a card's computed position,
shadow, and border color are the same with the pointer over it as at rest. Details in [research.md](research.md).

## Technical Context

**Language/Version**: CSS (plain, one stylesheet), TypeScript 5.7 for the test, Bun, Next.js 15.5 (static export)

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/card-no-hover.spec.ts`, new); existing card, link-style, and axe tests

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change (slightly less CSS).

**Constraints**: Resting look unchanged; link hover color and focus ring inside cards unchanged; no count assertions;
Prettier formatting; straight quotes.

**Scale/Scope**: One rule and one declaration removed, one new test file.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Code is deleted, nothing added to the CSS. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Removes motion on hover; nothing else changes. |
| IV. Design & content consistency | Pass. Non-interactive cards no longer look interactive. |
| V. Test-first | Pass. The test is written and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. No underline or theme change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. Prettier formatting; no new dependency. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/046-remove-card-hover/
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
src/styles/cards.css                  # delete .an-tile:hover and the .an-tile transition
tests/e2e/card-no-hover.spec.ts       # new: computed styles at rest and with the pointer over a card
```

**Structure Decision**: single Next.js project; no new files in `src/`.

## Complexity Tracking

None.
