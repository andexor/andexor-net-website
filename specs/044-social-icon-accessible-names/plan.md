# Implementation Plan: Social Icon Accessible Names

**Branch**: `23-use-fontawesome-icons` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/044-social-icon-accessible-names/spec.md`

## Summary

The footer's three social icons stop being hidden from assistive technology and carry their own names, "LinkedIn", "X",
and "GitHub", through `aria-label` on the `<svg>` (not on the `<a>`, and not `alt`, which is invalid there). In
`Footer.tsx`, each entry's `label` becomes the brand spelling and is passed to `FontAwesomeIcon` as `aria-label`, and
the link's own `aria-label` and the icon's `aria-hidden="true"` are removed. The link then takes its name from the icon.
One test is updated and one added. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, Bun, Next.js 15.5 (static export), React 19

**Primary Dependencies**: `@fortawesome/react-fontawesome` (existing, spec 042). No new dependencies.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/homepage-content.spec.ts` updated, `tests/e2e/social-icon-names.spec.ts` added),
existing axe checks (`homepage-a11y.spec.ts`, `content-page-a11y.spec.ts`)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No visible change; specs 042 and 043 behavior stays; straight quotes; Prettier formatting.

**Scale/Scope**: One component (`Footer.tsx`), two test files.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One attribute moves from the link to the icon. No new code paths or dependencies. |
| II. Component stack | Pass. Same FontAwesome component; Next.js SSG unchanged. |
| III. Accessibility & performance | Pass. This improves accessibility; the axe checks stay in place and must show no new violation. |
| IV. Design & content consistency | Pass. No visible change. |
| V. Test-first | Pass. The label test is updated and the new test is written before the change. |
| VI. Always-dark, no hover underline | Pass. No CSS touched. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. License header stays; Prettier formatting; no curly quotes; no new dependency. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/044-social-icon-accessible-names/
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
src/components/marketing/Footer.tsx          # labels become "LinkedIn", "X", "GitHub"; aria-label moves to the icon
tests/e2e/homepage-content.spec.ts           # look the links up by the new names
tests/e2e/social-icon-names.spec.ts          # new: names, no aria-hidden="true", no alt, no aria-label on the link
```

**Structure Decision**: single Next.js project; no new files in `src/`.

## Complexity Tracking

None.
