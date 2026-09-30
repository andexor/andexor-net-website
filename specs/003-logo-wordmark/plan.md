# Implementation Plan: Single-Line "Andexor Network" Logo Wordmark

**Branch**: `13-update-the-style-of-the-404-page` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-logo-wordmark/spec.md`

## Summary

`src/components/marketing/Logo.tsx` is already shared by the content-page header and the home
footer. This change (1) drops the "Network, Inc." tagline, (2) sets the wordmark to "Andexor
Network" at 26px beside the 38px mark, sized by two separate settings, (2b) drops ", Inc." from page titles, (3) makes the mark decorative so the name is announced once, and (4)
makes the home page's hero brand row use the same component through a `hero` size variant, so
the site has one lockup definition. No new dependencies, routes, or files in `src/`.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (App Router, `output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright (e2e against the production build), ESLint

**Target Platform**: Static `out/` directory served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change. The lockup stays server-rendered HTML plus one SVG.

**Constraints**: One line at 320px width; always-dark palette; no hover underline; wordmark in
the Play display font already loaded by `src/styles/fonts.css`.

**Scale/Scope**: 1 component, 3 callers (`ContentPage`, `Footer`, `Hero`), 2 stylesheets.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. Removes the unused `compact` prop and the tagline styles. Adds one `size` prop only because the hero needs the design-specified larger size. |
| II. Component stack | Pass. Same Next.js SSG stack. |
| III. Accessibility & performance | Pass. Mark becomes `alt=""` so the name is read once (FR-009). One-line fit at 320px is a test. |
| IV. Design & content consistency | Pass. This change exists to enforce it: one shared lockup, reused everywhere. |
| V. Test-first | Pass. Unit and e2e tests are written with the change (see tasks). |
| VI. Always-dark, color-only hover | Pass. Wordmark colors come from existing tokens; no hover rule added. |
| VII. License header | Pass. No new source files; edited files keep their headers. |
| VIII. Spec policy | Pass. Amend spec 001/002 where they describe the two-line wordmark. |

No violations. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-logo-wordmark/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── logo-component.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── marketing/
│   │   ├── Logo.tsx          # edit: single-line wordmark, size variant, decorative mark
│   │   ├── Hero.tsx          # edit: brand row renders <Logo size="hero" />
│   │   └── Footer.tsx        # edit: pass href="#top" explicitly (default changes)
│   └── content/
│       └── ContentPage.tsx   # unchanged (already <Logo href="/" />)
└── styles/
    ├── marketing.css         # edit: lockup styles, remove tagline, hero brand styles move to lockup, footer column width
    └── content.css           # unchanged

tests/
├── unit/logo.test.tsx        # new
└── e2e/                      # edit homepage-content, content-page-a11y; add logo.spec.ts
```

**Structure Decision**: Keep the existing single-project layout. The component stays in
`components/marketing/` where its callers already import it.

## Design Decisions

- **Size rule.** Two custom properties size the lockup: `--logo-mark-size` (38px) for the image
  and `--logo-wordmark-size` (26px) for the text. They are separate because the mark's SVG has
  transparent padding, so matching boxes does not match what is visible; the owner chose the
  sizes by eye. At 320px the lockup (about 256px) fits in the 288px available, so no smaller
  phone size is needed.
- **Hero variant.** `design/README.md` sets the hero brand row to a 72–112px mark with 32–54px text
  (about half the mark). So `size="hero"` overrides both settings with the design's values.
- **Link vs. no link.** `href` becomes optional. With `href` the lockup is an `<a>`; without it a
  `<div>`. The hero brand row has no link (it is the top of the page), and the footer passes
  `href="#top"` explicitly.
- **Titles.** Page titles drop ", Inc." (`layout.tsx`, `not-found.tsx`, `[...slug]/page.tsx`). Only the footer copyright line keeps it.
- **Footer fit.** The footer's first column (1.4fr) is narrower than the new lockup at desktop. Widen
  that column, checked by measuring in the e2e test, rather than shrinking the lockup.
- **Accessibility.** Mark `alt=""`; the visible text is the accessible name.

## Complexity Tracking

Not needed; no constitution violations.
