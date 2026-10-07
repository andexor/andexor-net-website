# Implementation Plan: Confirmation Square Check

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/054-confirmation-square-check/spec.md`

## Summary

In `ContactPopup.tsx` the Lucide `<Check size={28} strokeWidth={2.5} />` inside `.an-contact-confirmation__icon` is
replaced by `<FontAwesomeIcon icon={faSquareCheck} aria-hidden="true" />`. In `marketing.css` one new override rule sizes
the icon to 28px only inside that badge, and the badge rule gets `--fa-secondary-opacity: 0` so the square layer is
clear and only the check mark shows over the round light green circle. The badge's size, shape, background, and color
are untouched. One new e2e test checks size, color, centering, and transparency. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. `faSquareCheck` and `FontAwesomeIcon` are already used by the card bullets.

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/contact-confirmation-icon.spec.ts`), Vitest (`tests/unit/contact-popup.test.tsx`,
unchanged unless it reads the icon); existing popup focus and axe tests

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. The icon definition is already bundled for the cards.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by an override rule; the card bullet rule (24px) and this rule (28px) must not affect each other.

**Scale/Scope**: One component edited, one stylesheet edited (one rule added, one declaration added), one e2e test added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One element swapped, one rule added, one declaration added. |
| II. Component stack | Pass. Same FontAwesome packages as the cards. |
| III. Accessibility & performance | Pass. The icon keeps `aria-hidden`; focus order and text are unchanged. Popup axe and focus tests stay. |
| IV. Design & content consistency | Pass. Same icon family as the cards; same green tokens. |
| V. Test-first | Pass. The test is written and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. No hover or theme change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/054-confirmation-square-check/
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
src/components/contact/ContactPopup.tsx        # FontAwesomeIcon faSquareCheck in place of Lucide Check; Check leaves the lucide import
src/styles/marketing.css                       # .an-contact-confirmation__icon svg rule at 28px; badge gets --fa-secondary-opacity: 0
tests/e2e/contact-confirmation-icon.spec.ts    # new: 28x28, success-600, transparent, clear square, centered in the 56px circle
```

**Structure Decision**: single Next.js project; one new test file, no new files in `src/`.

## Complexity Tracking

None.
