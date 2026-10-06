# Implementation Plan: Social Link Colors

**Branch**: `23-use-fontawesome-icons` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/045-social-link-colors/spec.md`

## Summary

The footer social links' icon color becomes blue-300 at rest, blue-200 on hover, and blue-400 while pressed. In
`src/styles/marketing.css` the resting color (`var(--blue-200)`) and hover color (`var(--blue-100)`) of
`.an-footer__social-link` change, and `color: var(--blue-400)` is added to the existing `:active` rule, which already
comes after `:hover` so the press color wins. One e2e test checks the three computed colors. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: CSS (plain, one stylesheet), TypeScript 5.7 for the test, Bun, Next.js 15.5 (static export)

**Primary Dependencies**: None new. Uses the existing `--blue-200`, `--blue-300`, `--blue-400` tokens.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/social-link-colors.spec.ts`, new); existing `link-style.spec.ts` (no underline) and
axe checks

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No underline in any state; no other change to the links (specs 043 and 044); the colors are tokens, not
literals; Prettier formatting; straight quotes.

**Scale/Scope**: Three declarations in one rule set, one new test file.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Three color declarations, no new token, no new rule block. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Icon contrast against the button is above 3:1 in every state (see research.md); the axe checks stay. |
| IV. Design & content consistency | Pass. Uses design tokens named by the owner; the existing color transition applies. |
| V. Test-first | Pass. The color test is written and seen to fail before the CSS changes. |
| VI. Always-dark, no hover underline | Pass. Color change only; the underline test stays. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. Prettier formatting; no new dependency. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/045-social-link-colors/
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
src/styles/marketing.css                      # .an-footer__social-link: color, :hover color, :active color
tests/e2e/social-link-colors.spec.ts          # new: computed colors at rest, hover, and press
```

**Structure Decision**: single Next.js project; no new files in `src/`.

## Complexity Tracking

None.
