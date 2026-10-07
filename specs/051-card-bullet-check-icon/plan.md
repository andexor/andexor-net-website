# Implementation Plan: Card Bullet Check Icon

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/051-card-bullet-check-icon/spec.md`

## Summary

The Lucide `Check` that starts each bullet in the eight service cards is replaced by FontAwesome's duotone `faCheck`,
rendered with `FontAwesomeIcon` like the service icons. The icon keeps the `an-services__bullet-icon` class (gold, no
shrink) and gets a 15px size through one override rule named from its two classes, as the project's FontAwesome sizing
pattern requires. `Services.tsx` no longer imports from `lucide-react`. One e2e test checks size and color. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun; plain CSS

**Primary Dependencies**: None new. `@awesome.me/kit-0a6c11d394/icons/duotone/solid` and
`@fortawesome/react-fontawesome` are already used by the service icons.

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/card-bullet-check-icon.spec.ts`), Vitest (`tests/unit/services.test.tsx`, which
reads bullet text only); existing axe and overflow checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change. One more icon definition is bundled, and the Lucide `Check` stays in use by the
Contact Us popup.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; never patch FontAwesome's
stylesheet; icon sized by an override rule.

**Scale/Scope**: One component edited, one stylesheet edited, one e2e test added.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Swaps one element and adds one CSS rule; no new component. |
| II. Component stack | Pass. Uses the same FontAwesome packages as the service icons. |
| III. Accessibility & performance | Pass. The icon keeps `aria-hidden`, so card names are unchanged. Axe checks stay. |
| IV. Design & content consistency | Pass. Bullets now use the same icon family as the card icons, with the existing gold token. |
| V. Test-first | Pass. The test is written and seen to fail before the component changes. |
| VI. Always-dark, no hover underline | Pass. No hover or theme change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/051-card-bullet-check-icon/
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
src/components/marketing/Services.tsx        # FontAwesomeIcon faCheck in place of Lucide Check; drop the lucide import
src/styles/marketing.css                     # .svg-inline--fa.fa-check { width: 15px; height: 15px }
tests/e2e/card-bullet-check-icon.spec.ts     # new: icon is 15x15, gold, text position unchanged
tests/unit/services.test.tsx                 # unchanged
```

**Structure Decision**: single Next.js project; one new test file, no new files in `src/`.

## Complexity Tracking

None.
