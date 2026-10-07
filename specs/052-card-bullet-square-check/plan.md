# Implementation Plan: Card Bullet Square Check

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/052-card-bullet-square-check/spec.md`

## Summary

The FontAwesome duotone `faCheck` that starts each bullet in the eight service cards (spec 051) is replaced by
`faSquareCheck`. The element keeps its `an-services__bullet-icon` class (no shrink) and its 15px size, which comes
from the one override rule in `marketing.css`; that rule changes its selector from `.fa-check` to `.fa-square-check`.
`.an-services__bullet-icon` changes its color to `--gold-300` and gets a transparent background and a zero-opacity second layer (`--fa-secondary-opacity: 0`). The spec 051 e2e test
is updated to expect the new class, the new color, and a transparent background. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. `faSquareCheck` is in the same duotone module already used.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/card-bullet-check-icon.spec.ts`, updated), Vitest (`tests/unit/services.test.tsx`,
reads bullet text only); existing axe and overflow checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. One icon definition is swapped for another.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by an override rule named from the svg's classes.

**Scale/Scope**: One component edited, one stylesheet edited, one e2e test edited.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Swaps one import and renames one selector; no new code paths. |
| II. Component stack | Pass. Same FontAwesome packages. |
| III. Accessibility & performance | Pass. The icon keeps `aria-hidden`; card names are unchanged. Axe checks stay. |
| IV. Design & content consistency | Pass. Same icon family and size, and an existing gold token (`--gold-300`). |
| V. Test-first | Pass. The test is updated and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. No hover or theme change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/052-card-bullet-square-check/
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
src/components/marketing/Services.tsx        # faCheck becomes faSquareCheck (import and icon prop)
src/styles/marketing.css                     # fa-check rule becomes fa-square-check; bullet icon color gold-300, transparent background, secondary layer clear
tests/e2e/card-bullet-check-icon.spec.ts     # expect class fa-square-check instead of fa-check
```

**Structure Decision**: single Next.js project; no new files in `src/` or `tests/`.

## Complexity Tracking

None.
