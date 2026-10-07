# Implementation Plan: Technical and Business Card Bands

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/048-technical-business-card-bands/spec.md`

## Summary

The home page's one services section (4 cards) becomes two sections of 4 cards each, technical then business, in the
footer's order. `services-data.ts` gains four entries (Web Hosting, Cost Reduction, Lead Generation, Process
Re-engineering) and a `kind` on every entry. `Services.tsx` renders one section per kind from a small data table that
holds the heading and sub-heading. The existing `.an-services*` styles are reused as they are. Tests that assume one
`#services` section are updated, and new tests check titles, order, and links. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. Icons come from `lucide-react`, already in use.

**Storage**: N/A

**Testing**: Vitest (`tests/unit/services.test.tsx`), Playwright (`homepage-content.spec.ts`, `list-markers.spec.ts`,
`service-card-hover.spec.ts`, axe checks)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change; four more small cards of static HTML.

**Constraints**: No underline in any state; no link to `#top`; no count assertions in tests; Prettier formatting;
straight quotes; license header on new files; a newline never in React-rendered text.

**Scale/Scope**: One data file, one component, no new CSS rules expected, three test files touched.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One component renders both sections from data; no new abstraction, token, or dependency. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Each section is a labeled region; headings stay in order; axe checks stay. |
| IV. Design & content consistency | Pass. Same card component and styles; no `#top` link. |
| V. Test-first | Pass. Tests are written and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. Existing styles only. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. The pages are untouched; cards link to the existing routes. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/048-technical-business-card-bands/
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
src/components/marketing/services-data.ts   # +4 entries, a kind on each, section headings
src/components/marketing/Services.tsx       # one section per kind
src/styles/marketing.css                    # only if the gap between the two sections needs adjusting
tests/unit/services.test.tsx                # updated for two sections
tests/e2e/homepage-content.spec.ts          # updated selectors; new order and link checks
tests/e2e/list-markers.spec.ts              # updated if it reads #services (now #technical-services)
tests/e2e/service-card-hover.spec.ts        # updated if it reads #services (now #technical-services)
```

**Structure Decision**: single Next.js project; no new source files.

## Complexity Tracking

None.
