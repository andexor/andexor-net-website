# Implementation Plan: Card Title Beside Icon

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/050-card-title-beside-icon/spec.md`

## Summary

In each of the eight service cards, the `<h3>` moves from below the top row into `.an-services__card-top`, to the right
of the icon tile. The row gets a 16px gap, aligns its items to the center, and the title is left-aligned and wraps. The
icon tile never shrinks. The change is one element moved in `Services.tsx` and three small CSS edits in
`marketing.css`. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/homepage-content.spec.ts` or a new card-title spec), Vitest
(`tests/unit/services.test.tsx`, which reads the `h3` inside each link); existing axe and overflow checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; the card stays one link.

**Scale/Scope**: One component edited, one stylesheet edited, one e2e test added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Moves one element and adjusts three rules; adds no component. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. The title stays an `h3` inside the link, so the heading outline and accessible name are unchanged. Axe checks stay. |
| IV. Design & content consistency | Pass. All eight cards change the same way, using existing tokens and spacing. |
| V. Test-first | Pass. The layout test is written and seen to fail before the markup moves. |
| VI. Always-dark, no hover underline | Pass. No color or hover change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/050-card-title-beside-icon/
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
src/components/marketing/Services.tsx   # move the h3 into the card-top div, after the icon tile
src/styles/marketing.css                # card-top gap and alignment; tile does not shrink; title margin 0
tests/e2e/card-title-beside-icon.spec.ts # new: title right of icon, centered, inside card, left-aligned
tests/unit/services.test.tsx            # unchanged unless it relies on the h3's position
```

**Structure Decision**: single Next.js project; one new test file, no new files in `src/`.

## Complexity Tracking

None.
