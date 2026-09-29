# Implementation Plan: Content Pages, Card Template, and Web Development Page

**Branch**: `retrospective-specs` | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-content-pages-card-template/spec.md`

**Note**: This is an as-built plan. It records decisions already implemented in commits
`0438462`, `bc947ba`, `b6065d3`, `c9b78ab`, `80e8ce1`, and `099c92a`. No application code changes
are planned here.

## Summary

Markdown files under `content/` are rendered to static HTML at build time by one catch-all
route. A `layout: cards` front matter switch renders a hero band plus one card per `##` section.
The Web Development page is the first content page and is linked from the home page. Sitewide,
the site is always dark, hover never underlines, and the static file server shuts down cleanly on
SIGINT and SIGTERM.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (App Router, `output: "export"`)

**Primary Dependencies**: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`,
`rehype-slug`, `rehype-external-links`, `rehype-stringify`, `gray-matter`

**Storage**: Files (`content/*.md`, `public/` images). No database.

**Testing**: Vitest (unit), Playwright (e2e, run against the production build served by `server.ts`), ESLint

**Target Platform**: Static `out/` directory served by `Bun.serve` in a Docker container

**Project Type**: Web (static site)

**Performance Goals**: Same as spec 001 (LCP under 2.5s on simulated fast 4G). Rendering happens at
build time only.

**Constraints**: No SSR, ISR, or API routes. Raw HTML in Markdown is dropped. 320px to 1920px
viewports. No hover underline. Always dark.

**Scale/Scope**: One content page today. Supports any number of `.md` files.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Simplicity & YAGNI | Pass with note | The Markdown pipeline adds 8 dependencies. Justified by spec FR-001 to FR-013 (owner writes all copy). Card layout is used by one page today but is the stated template for future service pages. |
| II. Modern Component-Based Stack | Pass | Next.js, React, SSG. |
| III. Accessibility & Performance | Partial | Hero image has alt text, keyboard focus styles exist. No automated a11y or keyboard e2e test covers content pages yet (see tasks). |
| IV. Design & Content Consistency | Pass | Reuses the footer, logo, tokens, and `an-` class naming. |
| V. Test-First Quality Gates | Partial | Unit tests cover routing, front matter, rendering, and cards. Dark mode has e2e coverage. No e2e for content pages, home-page links, or server shutdown. |
| VI. Always-Dark and Color-Only Hover | Pass | Dark aliases unconditional with `color-scheme: dark`. No hover underline rules found. |
| VII. Graceful Container Shutdown | Pass, unverified in tests | `server.ts` handles both signals. Not covered by an automated check. |
| VIII. Markdown-Authored Content Pages | Pass | Page is `content/web-development.md`, unlinked pages policy documented. |

Post-design re-check: same result. The two "Partial" items are test gaps, not violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-content-pages-card-template/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-contracts.md
└── tasks.md
```

### Source Code (repository root)

```text
content/
├── README.md                     # authoring rules (not published)
└── web-development.md            # first content page

public/
└── web-development.svg           # hero illustration

src/
├── app/[...slug]/page.tsx        # catch-all route, static params, metadata, 404
├── lib/content.ts                # walk, front matter, Markdown, card splitting
├── components/
│   ├── content/ContentPage.tsx   # header, hero, cards, prose, footer
│   └── marketing/
│       ├── Logo.tsx              # href prop ("#top" default, "/" on content pages)
│       ├── Footer.tsx            # ITEM_HREFS wires Web Development
│       ├── Services.tsx          # card href
│       └── services-data.ts      # href field on Web Development
└── styles/
    ├── content.css               # prose article styles
    ├── cards.css                 # hero fade, tiles, columns, narrow stacking
    ├── globals.css               # imports
    └── tokens/{base,colors}.css  # always-dark, no hover underline

server.ts                         # SIGINT/SIGTERM handlers
design/tokens/base.css            # hover underline rule removed

tests/
├── unit/content.test.ts
└── e2e/dark-mode.spec.ts
```

**Structure Decision**: Single Next.js project. Content lives outside `src/` so the owner edits
Markdown without touching code.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |
