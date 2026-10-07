# Implementation Plan: Card Bullet Icon Size

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/053-card-bullet-icon-size/spec.md`

## Summary

Two CSS edits in `marketing.css`: the override rule for the square-check icon goes from 15 to 24 pixels, and
`.an-services__bullet` goes from `font-size: 13px` to `14px`, the value `.an-services__card-body` already uses. The
bullet is already a centered flex row with an 8px gap, so the icon stays centered with one or two lines of text. The
spec 051 and 052 e2e test is updated to expect 24 by 24, 14px text equal to the description's size, and a centered icon.
No markup changes. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/card-bullet-check-icon.spec.ts`, updated), Vitest (unchanged); existing axe and
overflow checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by the override rule.

**Scale/Scope**: One stylesheet edited (two values), one e2e test edited.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Two values change; nothing is added. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Text grows from 13 to 14px, which helps legibility. Icon stays hidden from assistive technology. Axe and overflow checks stay. |
| IV. Design & content consistency | Pass. Bullet text now matches the description's size. |
| V. Test-first | Pass. The test is updated and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. No color or hover change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/053-card-bullet-icon-size/
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
src/styles/marketing.css                     # .fa-square-check rule 15px -> 24px; .an-services__bullet font-size 13px -> 14px
tests/e2e/card-bullet-check-icon.spec.ts     # expect 24x24, 14px text equal to the description, icon centered in its bullet
```

**Structure Decision**: single Next.js project; no new files in `src/` or `tests/`.

## Complexity Tracking

None.
