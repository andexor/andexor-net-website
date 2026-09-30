# Implementation Plan: Not-Found Page Style

**Branch**: `13-update-the-style-of-the-404-page` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-not-found-page-style/spec.md`

## Summary

The Web Development page's hero (`.an-cardhero`, rendered by `ContentPage` when it is given a
`cards` layout) already has the arrangement the not-found page should use. So the not-found page
passes `ContentPage` a hero-only layout: the 404 image, the headline, and the explanation with its
link, no cards, no eyebrow, and no grid. Two small options are added to the existing layout
(`grid` and "no cards"), the hero gets a compact bottom edge when no cards follow, and the link in
the hero gets its own colors so it passes the accessibility check without an underline. No new
files in `src/`, no new dependencies, and the Web Development page renders exactly as before.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`); plain CSS

**Primary Dependencies**: none added

**Storage**: `public/404.png` (already in the repo, 1024x1024 with transparency)

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint. The
e2e spec also asserts the URL stays as requested and the status is 404 (FR-013).

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged; the server already
returns `404.html` with a 404 status)

**Project Type**: Static web site

**Performance Goals**: No regression. One extra image (about the size of the Web Development one)
loads on the not-found page only.

**Constraints**: WCAG 2.1 AA; always-dark palette; no link underlines (constitution VI, 1.3.1);
Web Development page unchanged (FR-012)

**Scale/Scope**: 3 source files (`not-found.tsx`, `ContentPage.tsx`, `content.ts` type), 1
stylesheet, 1 unit test, 1 new e2e spec

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. Reuses the existing hero and layout type. Adds one optional field (`grid`) and one CSS modifier, because the spec requires no grid and a tighter bottom edge. No frontmatter option is added for `grid`, since no Markdown page needs it yet. |
| II. Component stack | Pass. Same Next.js SSG stack. |
| III. Accessibility & performance | Pass, with one design decision: the hero's intro text is blue-200, and a link in it would fail the link-versus-text check without an underline. See Design Decisions. Image gets alt text; axe is the acceptance gate. |
| IV. Design & content consistency | Pass. Reuses the shared hero, header, and footer. |
| V. Test-first | Pass. Tests are written first (unit, e2e). |
| VI. Always-dark, no link underlines | Pass. No underline anywhere; hover is a color change. |
| VII. Graceful shutdown | Not affected; verified by the usual Docker check. |
| VIII. Markdown-authored pages | Pass. Not-found is a framework special page, not a routable content page, and stays a hand-written component (spec 002 FR-006). Constitution 1.3.2 names it as the one exception. Authoring it as `content/404.md` would also publish a `/404` route through the catch-all, which is wrong. |
| License header / spec policy | New test file gets the header. Spec 002 (FR-006) is amended to point at this spec. |

No violations. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-not-found-page-style/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── not-found-page.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/not-found.tsx                  # edit: build a hero-only CardsLayout, render <ContentPage cards=...>
├── components/content/ContentPage.tsx # edit: grid only when cards.grid !== false; cards block only when cardsHtml is not empty; solo class
├── lib/content.ts                     # edit: add optional `grid?: boolean` to CardsLayout (Markdown pages unaffected)
└── styles/cards.css                   # edit: .an-cardhero--solo bottom padding and intro/link colors

tests/
├── unit/not-found.test.tsx            # edit: image, no cards, no eyebrow, no grid, link
└── e2e/not-found-style.spec.ts        # new: three widths, no horizontal scroll, structure, Web Development unchanged

specs/002-content-pages-card-template/spec.md   # edit: FR-006 points at spec 006
```

**Structure Decision**: Keep the existing layout. The not-found page becomes another caller of
`ContentPage`'s hero, as the Web Development page is.

## Design Decisions

- **Reuse the hero, not a copy.** `not-found.tsx` builds a `CardsLayout` object
  (`image`, `headingHtml`, `introHtml`, `cardsHtml: ""`, `grid: false`) and passes it to
  `ContentPage`. The heading and intro HTML are trusted literals, as they are now.
- **Two optional switches.** `grid?: boolean` (grid shown unless it is `false`) and "render the
  cards block only if `cardsHtml` is not empty". Both default to today's behavior, so Markdown
  pages, including Web Development, render identically (FR-012).
- **Bottom edge.** The hero has `padding-bottom: calc(var(--space-12) + 56px)` so cards can pull up
  over it. Without cards that is empty space above the footer. Add `.an-cardhero--solo` (applied
  when there are no cards) with `padding-bottom: var(--space-12)`, and the matching override in the
  860px media query (which uses 88px today).
- **Hero link colors.** The hero intro text is `--blue-200`. A link there without an underline
  needs 3:1 against the text, and `--blue-400` on `--blue-200` is 2.45:1. Under
  `.an-cardhero--solo`, the intro text becomes `--slate-50` and its links `--blue-400` (hover
  `--blue-300`), the same pair used in `.an-prose` and `.an-tile` (3.40:1; 4.5:1 or better against
  the hero band). This slightly brightens the intro text on this page only; the Web Development
  hero is untouched.
- **Alt text.** "Gold isometric laptop showing 404 next to a magnifying glass with a question
  mark", written for someone who cannot see it.
- **Image size.** The 1024x1024 PNG is displayed at up to 280px, as on the Web Development page
  (`width`/`height` attributes prevent layout shift). A smaller file is a possible later
  optimization, not part of this change.
- **No redirect.** `server.ts` answers unknown addresses with `404.html` and a 404 status, and the
  Next config has no redirects. Nothing here changes that; a test asserts it (FR-013).
- **Status and title.** Unchanged. The static 404 page is still generated by `not-found.tsx` and
  still served with a 404 status; the metadata title stays "Page not found | Andexor Network".

## Complexity Tracking

Not needed.
