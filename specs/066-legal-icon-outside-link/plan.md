# Implementation Plan: Legal Icon Outside Link

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/066-legal-icon-outside-link/spec.md`

## Summary

In `ContactPopup.tsx`, move each `<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />` out of its `<a>`
so it is the next sibling right after the closing `</a>`. In `marketing.css`, give the icon the link's resting white
(it no longer inherits it from the link). The spec 065 test is changed to look for the icon after the link and to check
the link holds no `svg`. Spec 065 is annotated as superseded for the icon's position. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/contact-legal-new-tab.spec.ts` updated; the popup links, a11y, keyboard, notice-text,
and footer link specs unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; no whitespace text nodes in
React output; no `alt` or `aria-label` on the icons; the FontAwesome stylesheet is not touched.

**Scale/Scope**: Two moved elements in one component, one CSS rule edited, one test file edited, one older spec annotated.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Two elements move; one CSS property is added. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Icons stay hidden and unfocusable; links keep their names and focus order. axe must still pass. |
| IV. Design & content consistency | Pass. The note looks almost the same. |
| V. Test-first | Pass. The test is updated first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No underline anywhere. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/066-legal-icon-outside-link/
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
src/components/contact/ContactPopup.tsx          # icons move to just after each </a>
src/styles/marketing.css                         # the icon is white, set from .an-contact-form__legal
tests/e2e/contact-legal-new-tab.spec.ts          # icon is the link's next sibling; the link holds no svg
specs/065-contact-legal-new-tab/spec.md          # note: icon position superseded by spec 066
```

**Structure Decision**: single Next.js project; no new files in `src/` or `tests/`.

## Complexity Tracking

None.
