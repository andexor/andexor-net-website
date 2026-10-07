# Implementation Plan: Logo Alt Text

**Branch**: `27-add-more-cards-to-the-home-page` | **Date**: 2026-10-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/059-logo-alt-text/spec.md`

## Summary

`Logo.tsx` exports one constant, `LOGO_ALT = "Andexor Network logo"`, and uses it as the alt text of the lockup's mark
(`alt=""` today). `ContactPopup.tsx` imports the same constant for its header logo. That covers the hero, the footer, the
content page header, the not-found page, and the popup. The Logo unit test and the popup logo tests are updated, the
unit tests that look up the header link by its exact name are updated for its new accessible name, and a unit test is
added that fails if any `logo-gold.svg` image in the rendered components has other alt text. Details in
[research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (static export), Bun

**Primary Dependencies**: None new.

**Storage**: N/A

**Testing**: Vitest (`tests/unit/logo.test.tsx`, `tests/unit/contact-popup.test.tsx`); Playwright
(`tests/e2e/contact-popup-logo.spec.ts`, and the existing a11y and brand specs, unchanged)

**Target Platform**: Linux (Docker, Bun serving `out/`)

**Project Type**: Static web site (Next.js SSG)

**Performance Goals**: No change.

**Constraints**: No count assertions; no underline; Prettier formatting; straight quotes; license header on any new file;
the header logo must still link to `/` and never to `#top`.

**Scale/Scope**: Two components edited, two to three test files edited. No new files in `src/`.

## Constitution Check

*GATE: passed before Phase 0; re-checked after Phase 1.*

| Principle | Result |
|---|---|
| I. Simplicity & YAGNI | Pass. One constant, two uses. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass, with a noted trade-off. The mark is no longer decorative, so the name is announced twice, as the owner asked. axe must still pass. |
| IV. Design & content consistency | Pass. Nothing visible changes. |
| V. Test-first | Pass. The tests are updated first and seen to fail before the source changes. |
| VI. Always-dark, no hover underline | Pass. No CSS change. |
| VII. Graceful shutdown | Pass. Not affected. |
| VIII. Markdown content | Pass. Untouched. |
| Technology constraints | Pass. |

**Post-design re-check**: no violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/059-logo-alt-text/
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
src/components/marketing/Logo.tsx           # export LOGO_ALT; use it as the mark's alt; update the comment about decorative
src/components/contact/ContactPopup.tsx     # import LOGO_ALT for the header logo's alt
tests/unit/logo.test.tsx                    # alt is LOGO_ALT; link name is "Andexor Network logo Andexor Network"; all-logo-images check
tests/unit/contact-popup.test.tsx           # popup logo alt
tests/e2e/contact-popup-logo.spec.ts        # alt "Andexor Network logo" on both screens
```

**Structure Decision**: single Next.js project; no new files.

## Complexity Tracking

None.
