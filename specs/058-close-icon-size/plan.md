# Implementation Plan: Close Icon Size

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/058-close-icon-size/spec.md`

## Summary

One scoped CSS rule from spec 057, `.an-contact-header__close .svg-inline--fa.fa-square-x`, changes from 22px to 36px and
gains `flex: none` so the 38px button's flex layout cannot squeeze the icon. The button, its 38 by 38 size, its
gradient, and every other rule stay as they are. The spec 057 e2e test is updated to expect 36 by 36, an icon box that lies
inside the button, and an unchanged header height. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/contact-close-icon.spec.ts`, updated); existing popup focus, Escape, keyboard, and axe
specs; Vitest unchanged

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; the button size (38px) and the other icon rules must not change.

**Scale/Scope**: One stylesheet edited (one value changed, one declaration added), one e2e test edited.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One value and one declaration. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. A larger X is easier to see; name, focus, and `aria-hidden` unchanged. Focus, Escape, and axe tests stay. |
| IV. Design & content consistency | Pass. Same button, colors, and icon family. |
| V. Test-first | Pass. The test is updated and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. No color, hover, or underline change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/058-close-icon-size/
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
src/styles/marketing.css                   # .an-contact-header__close .svg-inline--fa.fa-square-x: 22px -> 36px, add flex: none
tests/e2e/contact-close-icon.spec.ts       # expect 36x36, icon inside the button, header height unchanged
```

**Structure Decision**: single Next.js project; no new files.

## Complexity Tracking

None.
