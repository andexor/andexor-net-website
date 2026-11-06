# Implementation Plan: Organization Structured Data on the Home Page

**Branch**: `108-organization-schema` (current git branch; the setup script reported `090-home-organization-schema`, which is the spec directory name) | **Date**: 2026-11-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/090-home-organization-schema/spec.md`

## Summary

Put one schema.org Organization block (JSON-LD) in the head of the built home page only. The values come from `src/lib/schema/organization.json`. The block is added by the existing post-build HTML formatter (`scripts/format-html.ts`), not by React: a `<script>` rendered from a page component lands in the body, and the request is for the head. The existing `JsonLD` component is rendered to a string at build time with `react-dom/server`, so the component stays the single place that writes the script tag. The block goes after the Cookiebot script and before the whitespace script, and the formatter's DOM check ignores it, as it already does for the Cookiebot scripts.

## Technical Context

**Language/Version**: TypeScript 5.9 (`typescript` ^5.9.3), run by Bun

**Primary Dependencies**: Next.js 15.5 (`output: "export"`, static site generation), React 19.3 and `react-dom/server` (already installed, used only at build time), Prettier 3.9 (formatter), no new dependencies

**Storage**: N/A. The data is the JSON file already in the repository.

**Testing**: Vitest 4 (`bun run test`, unit tests in `tests/unit/`, which read `out/` after `bun run build`); Playwright for end-to-end (`bun run test:e2e`), unchanged

**Target Platform**: Static files in `out/`, served by `server.ts` in Docker and by Cloudflare Workers static assets

**Project Type**: Web site (static export)

**Performance Goals**: No measurable change. The block is about 1.2 KB of inline JSON in the head of one page. It must not delay first paint or the consent banner.

**Constraints**: The consent script stays the first script in the head (constitution, Technology Constraints; spec FR-006). The page must not raise a hydration error (spec FR-005). The formatter must prove the DOM is unchanged, apart from the scripts it adds on purpose.

**Scale/Scope**: One built page (`out/index.html`) gets one script; the other built pages are unchanged.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md` v1.9.0:

- **I. Simplicity & YAGNI**: Passes. No new dependency or layer. The insertion reuses the formatter step that already adds the Cookiebot scripts, and the component the owner named is reused, not replaced. Requirement traced to spec FR-001 to FR-003.
- **II. Component-based stack**: Passes. Next.js static export, as recorded in Technical Context. No migration.
- **III. Accessibility & performance**: Passes. Nothing visible changes. The block is `application/ld+json`, which browsers do not run. Its size is small, and it adds no request.
- **IV. Design & content consistency**: Passes. No link, no visible element, no new style.
- **V. Test-first quality gates**: Passes. Tests check behavior only: placement, home-page-only presence, the data matching the source file, and the DOM check. No test asserts wording or copy.
- **VI. Always-dark, color-only hover**: Not applicable. No styles change.
- **VII. Graceful container shutdown**: Not applicable. No container or server change.
- **VIII. Markdown-authored content pages**: Passes. The home page stays a React page, as the constitution allows. Content pages are not touched.
- **Technology Constraints**: Straight quotes only; the JSON contains none. The SPDX header is kept on any new source file. Prettier formatting applies to new TypeScript. No third-party service.
- **Development Workflow**: Passes. Work comes from spec 090, and the commit uses `git commit -s`, with a closing reference once an issue exists.

Result: no violations. Complexity Tracking is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/090-home-organization-schema/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── home-page-head.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2, created by /speckit-tasks (not by this plan)
```

### Source Code (repository root)

```text
scripts/
├── format-html.ts       # Changed: add the home-page JSON-LD block to <head>; DOM check ignores it
└── format-site.ts       # Changed: pass the block only for out/index.html

src/
├── components/
│   └── JsonLD.tsx       # Existing (untracked): renders the script tag; now also used at build time
└── lib/schema/
    └── organization.json # Existing (untracked): the data

tests/unit/
├── format-html.test.ts  # Changed: the formatter adds the block when asked and the DOM check still passes
└── build-output.test.ts # Changed: built home page has the block after Cookiebot; other pages do not
```

**Structure Decision**: Keep the work in the build step that already writes the head scripts. The React page and layout are not changed, so the client render and hydration are unchanged.

## Phase 0 outcome

See [research.md](research.md). All technical unknowns are resolved. No NEEDS CLARIFICATION markers remain.

## Phase 1 outcome

- [data-model.md](data-model.md): the Organization data and the block are described; no new data.
- [contracts/home-page-head.md](contracts/home-page-head.md): the head order of the built home page, which search engines and the consent banner rely on.
- [quickstart.md](quickstart.md): how to build, inspect the output, and check the page in a browser.

## Post-design constitution re-check

Design adds no new dependency, layer, or page. Re-check result: passes, same as above.

## Complexity Tracking

Not applicable. No violations.
