# Implementation Plan: Social Icon Descriptions

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/061-social-icon-alt-text/spec.md`

## Summary

In `Footer.tsx`, the `label` of each entry in `SOCIAL_LINKS` becomes the full description from the spec, and it stays
the `aria-label` on the icon's `<svg>` (spec 044), so each link is announced once. The two e2e specs that find the links
by the old short names are updated to the new names. Spec 044 is marked as superseded for the names. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/social-icon-names.spec.ts`, `tests/e2e/homepage-content.spec.ts`; the existing
`social-icon-size`, `social-link-colors`, and a11y specs unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; no `alt` attribute on the SVG
icons; the FontAwesome stylesheet is not touched.

**Scale/Scope**: One component edited (three strings), two test files edited, one older spec annotated. No new files in
`src/`.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Three strings change. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Each icon keeps one accessible name, now more informative, and says it opens a new tab. axe must still pass. |
| IV. Design & content consistency | Pass. Nothing visible changes. |
| V. Test-first | Pass. The tests are updated first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/061-social-icon-alt-text/
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
src/components/marketing/Footer.tsx            # SOCIAL_LINKS labels become the full descriptions
tests/e2e/social-icon-names.spec.ts            # expect the full descriptions on the svg's aria-label
tests/e2e/homepage-content.spec.ts             # find the footer social links by the full descriptions
specs/044-social-icon-accessible-names/spec.md # note that the names are superseded by spec 061
```

**Structure Decision**: single Next.js project; no new files.

## Complexity Tracking

None.
