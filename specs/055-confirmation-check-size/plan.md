# Implementation Plan: Confirmation Check Size

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/055-confirmation-check-size/spec.md`

## Summary

The scoped rule from spec 054, `.an-contact-confirmation__icon .svg-inline--fa.fa-square-check`, changes from 28px to
64px, and gains `flex: none` so the 56px badge cannot squeeze the larger box. Nothing else in the stylesheet or the
component changes. The badge stays 56px, so the icon box extends 4px past the circle on every side, centered, and
draws nothing there. The spec 054 e2e test is updated to expect 64 by 64, a centered icon, a check mark that lies inside
the circle, and a heading that has not moved. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/contact-confirmation-icon.spec.ts`, updated); Vitest unchanged; existing popup
focus, Escape, and axe specs

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by an override rule; the card bullet rule (24px) must not change.

**Scale/Scope**: One stylesheet edited (one value changed, one declaration added), one e2e test edited.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One value and one declaration. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Icon stays `aria-hidden`; focus order and text unchanged; a larger confirmation mark helps visibility. Axe and focus tests stay. |
| IV. Design & content consistency | Pass. Same colors and badge; the card bullets are not affected. |
| V. Test-first | Pass. The test is updated and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. No color or hover change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/055-confirmation-check-size/
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
src/styles/marketing.css                       # scoped confirmation icon rule: 28px -> 64px, add flex: none
tests/e2e/contact-confirmation-icon.spec.ts    # expect 64x64, centered, check mark inside the circle, heading not moved
```

**Structure Decision**: single Next.js project; no new files.

## Complexity Tracking

None.
