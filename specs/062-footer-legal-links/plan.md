# Implementation Plan: Privacy and Terms Links

**Branch**: `29-add-or-edit-alt-text-for-images` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/062-footer-legal-links/spec.md`

## Summary

In `Footer.tsx`, `ITEM_HREFS` maps Privacy to `/privacy` and Terms to `/terms`. In `ContactPopup.tsx`, the two
`href="#privacy"` and `href="#terms"` attributes become `/privacy` and `/terms`. The pages already exist as Markdown in
`content/`. The footer link test and a popup test are updated first, and spec 001's FR-017 note is amended. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/footer-links.spec.ts` updated; a popup link test added; `contact-popup-a11y` and
`keyboard-navigation` unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; no link to `#top`; Prettier formatting; straight quotes.

**Scale/Scope**: Two components edited (two strings each), one test file edited, one test file added or extended, one
older spec annotated. No new files in `src/`.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. Four strings change. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Link names, order, and focus order are unchanged. axe must still pass. |
| IV. Design & content consistency | Pass. Nothing visible changes. |
| V. Test-first | Pass. Tests are updated first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. The pages stay Markdown; nothing is converted to `.tsx`. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/062-footer-legal-links/
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
src/components/marketing/Footer.tsx             # ITEM_HREFS: Privacy -> /privacy, Terms -> /terms; fix the comment
src/components/contact/ContactPopup.tsx         # the note's two links -> /privacy and /terms
tests/e2e/footer-links.spec.ts                  # Privacy and Terms join PAGES; placeholder test removed
tests/e2e/contact-popup-links.spec.ts           # new: popup links open the two pages
specs/001-homepage-contact-us/spec.md           # FR-017 note: Privacy and Terms are linked by spec 062
```

**Structure Decision**: single Next.js project; one new test file, no new source files.

## Complexity Tracking

None.
