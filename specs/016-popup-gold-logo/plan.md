# Implementation Plan: Gold Logo in the Contact Us Popup

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/016-popup-gold-logo/spec.md`

## Summary

The popup header in `ContactPopup.tsx` shows `<img src="/logo/andexor-logo.svg">`, the boxed
blue-and-gold mark, styled with a 34px square and an 8px corner radius (`.an-contact-header__logo` in
`src/styles/marketing.css`). The fix is to point that image at `/logo/logo-gold.svg` and drop the corner
radius, which only made sense for the box. Both files are 96 by 96 squares, so the 34px size and the
header layout stay as they are. Two guards keep it true: a unit test on the popup's header logo, and a
unit test that pins where `logo-gold.svg` may be referenced in `src/` (the shared lockup and the popup
header), which replaces the loose "only the lockup" wording of spec 003. An e2e test checks the logo
loads and sits where it did. No new files in `src/`, no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change, and slightly better: the gold logo is already loaded by the site's
header, hero, and footer, so opening the popup no longer needs a separate image request for the boxed file

**Constraints**: same size (34px) and position; the logo stays decorative (`alt=""`); nothing else in
the popup changes; no other logo on the site changes

**Scale/Scope**: 1 `src` attribute, 1 CSS declaration, 2 unit test edits, 1 new e2e spec, spec 003's
documents and `design/README.md` amended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One attribute and one removed CSS line. No new component: the popup shows the mark alone, so the shared lockup (mark plus wordmark) is the wrong tool. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. The image stays decorative with an empty `alt`, the title beside it names the popup, and the axe checks for both popup states still run. The gold file is already cached from other pages. |
| IV. Design & content consistency | Pass, and improved: the popup now uses the same mark as the header, hero, and footer. |
| V. Test-first | Pass. Tests are written first and fail until the change. |
| VI. Always-dark, no link underlines | Pass. The popup header is dark (`--blue-800`), which is the surface the gold mark is designed for. No link styles change. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Not affected. |
| License header | New e2e spec file gets the SPDX header. |

No violations; Complexity Tracking is empty. No constitution change.

## Project Structure

### Documentation (this feature)

```text
specs/016-popup-gold-logo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── popup-header-logo.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/contact/ContactPopup.tsx   # edit: <img src="/logo/logo-gold.svg"> (alt stays "")
src/styles/marketing.css                  # edit: drop border-radius from .an-contact-header__logo

tests/
├── unit/contact-popup.test.tsx           # edit: header logo is the gold mark, decorative, in both states
├── unit/logo.test.tsx                    # edit: logo-gold.svg is referenced in exactly two src files
└── e2e/contact-popup-logo.spec.ts        # new: loads, 34px, no box, same place, from hero and footer

specs/003-logo-wordmark/{data-model.md,contracts/logo-component.md,spec.md}   # edit: popup is the second place
design/README.md                          # edit: the popup header line (boxed logo, radius 8px)
```

**Structure Decision**: Existing single Next.js project; the change is inside `ContactPopup` and its
stylesheet.

## Design Decisions

- **Change the file, not the component.** The header needs the mark without the wordmark, so the
  shared `Logo` lockup does not fit. The popup keeps its own `<img>` and only the file changes.
- **Drop the corner radius.** `border-radius: 8px` rounded the box's corners. The gold mark has no
  box, so the radius does nothing; removing it keeps the stylesheet honest. Width and height stay 34px.
- **Pin where the mark may appear.** Spec 003's test only checks that the hero, footer, and content
  shell do not mention `logo-gold.svg`. It would not notice a fourth place. A new test lists every
  file under `src/` that contains `logo-gold.svg` and expects exactly `Logo.tsx` and `ContactPopup.tsx`,
  so the exception is explicit and any new use is a deliberate edit.
- **Keep the boxed file.** `public/logo/andexor-logo.svg` is a brand asset (the design system lists it
  for email authentication) and may be used elsewhere; the popup just stops referencing it.
- **Look at it once.** A visual check of the popup header (a screenshot read during implementation)
  confirms the gold mark reads well over the header's faint gold glow. No pixel-comparison test.
- **Update the design note.** `design/README.md` says the popup header has a "Boxed logo 34px, radius
  8px". The owner's request overrides it, so the line is corrected; the mock files under
  `design/ui_kits/` are copies from the design tool and are left alone.

## Complexity Tracking

None.
