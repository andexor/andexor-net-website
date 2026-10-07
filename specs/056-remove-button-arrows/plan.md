# Implementation Plan: Remove Button Arrows

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/056-remove-button-arrows/spec.md`

## Summary

Two `rightIcon={<ArrowRight ... />}` props are deleted: one in `CTABand.tsx` (Contact Us) and one in
`ContactPopup.tsx` (Send). `ArrowRight` leaves both Lucide imports, and `ContactPopup.tsx` keeps `X`; `CTABand.tsx` then
imports nothing from Lucide. The shared `Button` component and all styles stay as they are, since `.an-btn` is already a
centered flex row and a button with only a label centers it. The `ok-button` e2e test, which expects Send to hold one icon,
is changed to expect none, and one new check says neither button holds an icon. Details in [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. After this change `lucide-react` is still used for the popup's `X`.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/ok-button.spec.ts` updated; `tests/e2e/send-button-style.spec.ts` unchanged and must
still pass; a new `tests/e2e/button-no-arrow.spec.ts`); Vitest unchanged; existing popup focus and axe specs

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change (slightly less markup).

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; Button component unchanged.

**Scale/Scope**: Two components edited (one prop removed in each, one import trimmed in each), no CSS change, one test
edited, one test added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Removes markup and an import; adds nothing. |
| II. Component stack | Pass. The shared Button is untouched. |
| III. Accessibility & performance | Pass. Both buttons keep their text names; the icons were `aria-hidden` or decorative, so names do not change. Axe and focus tests stay. |
| IV. Design & content consistency | Pass. Both buttons change the same way, so Send and Contact Us still match, and OK still matches Send. |
| V. Test-first | Pass. The tests are written and seen to fail before the components change. |
| VI. Always-dark, no hover underline | Pass. No style change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/056-remove-button-arrows/
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
src/components/marketing/CTABand.tsx     # remove rightIcon and the lucide-react import
src/components/contact/ContactPopup.tsx  # remove rightIcon; import only X from lucide-react
tests/e2e/ok-button.spec.ts              # Send now has no icon: expect send.arrows to be 0
tests/e2e/button-no-arrow.spec.ts        # new: neither button holds an icon; labels are centered
```

**Structure Decision**: single Next.js project; one new test file, no new files in `src/`.

## Complexity Tracking

None.
