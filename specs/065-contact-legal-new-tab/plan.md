# Implementation Plan: Contact Legal Links In New Tab

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/065-contact-legal-new-tab/spec.md`

## Summary

In `ContactPopup.tsx`, the two legal links get `target="_blank"`, `rel="noopener noreferrer"`, and an `aria-label`
("Privacy, opens in new tab", "Terms, opens in new tab"), and each gets a `FontAwesomeIcon` of
`faArrowUpRightFromSquare` (duotone solid, from the Pro kit) with `aria-hidden="true"` after its text. A sizing rule for
`.svg-inline--fa.fa-arrow-up-right-from-square` is added in `marketing.css`, following the spec 043 pattern. Spec 062's
popup same-tab test is replaced by a new-tab test, and spec 062 is annotated. The footer is untouched. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new (the icon is in the existing Font Awesome Pro kit).

**Storage**: N/A

**Testing**: Playwright (new `tests/e2e/contact-legal-new-tab.spec.ts`; `contact-popup-links.spec.ts` updated; the
popup a11y, keyboard, notice-text, and footer link specs unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; license headers; no `alt` or
`aria-label` on the icons; the FontAwesome stylesheet is not touched; the icon sizing rule goes in
`src/styles/marketing.css`.

**Scale/Scope**: One component edited, one CSS rule added, one test file added, one test file updated, one older spec
annotated.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Two attributes, one icon, one CSS rule per link. |
| II. Component stack | Pass. Uses the existing Font Awesome Pro kit and `FontAwesomeIcon`. |
| III. Accessibility & performance | Pass. Names say the links open a new tab; icons are hidden; focus order unchanged. axe must still pass. |
| IV. Design & content consistency | Pass. Matches the footer social links' new-tab pattern and wording. |
| V. Test-first | Pass. The new test is written first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No underline added; the icon takes the link color and hover. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/065-contact-legal-new-tab/
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
src/components/contact/ContactPopup.tsx          # new tab, aria-label, and icon on each legal link
src/styles/marketing.css                         # .svg-inline--fa.fa-arrow-up-right-from-square sizing rule
tests/e2e/contact-legal-new-tab.spec.ts          # new: new tab, names, hidden icons, size, footer unchanged
tests/e2e/contact-popup-links.spec.ts            # replace the same-tab navigation with new-tab expectations
specs/062-footer-legal-links/spec.md             # note that the popup links' same-tab behavior is superseded
```

**Structure Decision**: single Next.js project; one new test file.

## Complexity Tracking

None.
