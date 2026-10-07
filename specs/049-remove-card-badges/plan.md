# Implementation Plan: Remove Card Badges

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/049-remove-card-badges/spec.md`

## Summary

The eight service cards on the home page stop showing their tag badge. `Services.tsx` no longer renders `Badge` and no
longer imports it; `services-data.ts` loses the `tag` and `badgeTone` fields. The `Badge` component and `.an-badge`
styles stay as shared design-system parts. One e2e test checks that no `.an-badge` is on the home page and that card
heights do not change. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/homepage-content.spec.ts`), Vitest (`tests/unit/services.test.tsx`); existing axe
and overflow checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change (slightly less HTML).

**Constraints**: Cards keep their height; no count assertions; no underline; Prettier formatting; straight quotes.

**Scale/Scope**: Two source files edited, no CSS change, one or two test files edited.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Removes markup and unused data fields; adds nothing. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Each card's accessible name loses only the tag word. Axe checks stay. |
| IV. Design & content consistency | Pass. All eight cards change the same way. The shared `Badge` stays for reuse. |
| V. Test-first | Pass. The test is written and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. No style change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/049-remove-card-badges/
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
src/components/marketing/Services.tsx       # drop the Badge import and element
src/components/marketing/services-data.ts   # drop tag and badgeTone from the type and all 8 entries
tests/e2e/homepage-content.spec.ts          # new: no .an-badge on the page; card height unchanged
tests/unit/services.test.tsx                # unchanged unless it reads tag
```

**Structure Decision**: single Next.js project; no new files in `src/`.

## Complexity Tracking

None.
