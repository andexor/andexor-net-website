# Implementation Plan: Close Square X

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/057-close-square-x/spec.md`

## Summary

In `ContactPopup.tsx` the Lucide `<X size={22} strokeWidth={3} aria-hidden="true" />` in the Close button is replaced by
`<FontAwesomeIcon icon={faSquareX} aria-hidden="true" />`, and `lucide-react` is no longer imported. In `marketing.css`
one override rule sizes the icon to 22px inside the Close button, and the button rule gets `--fa-secondary-opacity: 0`, so
the icon's square layer is clear and only the white X mark shows over the glossy black button. Nothing else about the
button changes. One new e2e test checks the icon on both screens. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. `faSquareX` comes from the duotone module already used for the other icons.
`lucide-react` has no use left in `src/` after this change.

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/contact-close-icon.spec.ts`); the existing popup focus, Escape, keyboard, and axe
specs that click or focus the Close button by its name; Vitest unchanged

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. Lucide's X is no longer bundled for the popup.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by an override rule scoped to the Close button; the other icon rules must not change.

**Scale/Scope**: One component edited, one stylesheet edited (one rule added, one declaration added), one e2e test added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One element swapped, one rule added, one declaration added. |
| II. Component stack | Pass. Same FontAwesome packages as the other icons. |
| III. Accessibility & performance | Pass. The button keeps `aria-label="Close"` and the icon keeps `aria-hidden`. Focus, Escape, and axe tests stay. |
| IV. Design & content consistency | Pass. Same icon family as the rest of the site; the glossy button is untouched. |
| V. Test-first | Pass. The test is written and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. No color, hover, or underline change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/057-close-square-x/
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
src/components/contact/ContactPopup.tsx   # FontAwesomeIcon faSquareX in place of Lucide X; drop the lucide-react import
src/styles/marketing.css                  # .an-contact-header__close icon rule at 22px; button gets --fa-secondary-opacity: 0
tests/e2e/contact-close-icon.spec.ts      # new: square-x, 22x22, white, transparent, clear square, centered, both screens
```

**Structure Decision**: single Next.js project; one new test file, no new files in `src/`.

## Complexity Tracking

None.
