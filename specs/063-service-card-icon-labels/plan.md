# Implementation Plan: Service Card Icon Labels

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/063-service-card-icon-labels/spec.md`

## Summary

Add an `iconLabel` string to each entry in `SERVICES` (`services-data.ts`), and in `Services.tsx` pass it as the
`aria-label` of the title icon's `FontAwesomeIcon` instead of `aria-hidden="true"`. Font Awesome then renders
`<svg role="img" aria-label="...">` without `aria-hidden`, the same way the footer social icons work (specs 044, 061).
The bullet check marks keep `aria-hidden`. A new e2e spec checks the eight labels. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/service-card-icon-labels.spec.ts`; existing `card-title-beside-icon`,
`card-bullet-check-icon`, `homepage-content`, and a11y specs unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; license header on the new test
file; no `alt` attribute on the SVG icons; the FontAwesome stylesheet is not touched.

**Scale/Scope**: Two source files edited (one field added to eight entries, one attribute swapped), one test file added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One field and one attribute. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Each title icon gets one accessible name; axe must still pass, and the card link's name now includes the icon label. |
| IV. Design & content consistency | Pass. Nothing visible changes. |
| V. Test-first | Pass. The new test is written first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/063-service-card-icon-labels/
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
src/components/marketing/services-data.ts       # new iconLabel field on every service
src/components/marketing/Services.tsx           # title icon: aria-label={service.iconLabel}, no aria-hidden
tests/e2e/service-card-icon-labels.spec.ts      # new: eight labels, role img, not hidden, bullets still hidden
```

**Structure Decision**: single Next.js project; one new test file.

## Complexity Tracking

None.
