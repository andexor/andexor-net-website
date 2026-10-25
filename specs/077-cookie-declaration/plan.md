# Implementation Plan: Cookie Declaration

**Branch**: `87-implement-cookiebot` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/077-cookie-declaration/spec.md`

## Summary

Put Cookiebot's Cookie Declaration script element in the footer, right after the copyright line, on every page that has the
footer (the home page and the Markdown content pages; the 404 page has no footer). The element goes in `Footer.tsx` inside
a small container that React renders from a string (`dangerouslySetInnerHTML`, `data-raw-html=""`), the same way the site
renders Markdown. React then leaves the container's content alone, so the declaration that Cookiebot's script adds next to
its element cannot cause a hydration mismatch. A prototype of this on the home page, served as andexor.net with the real
Cookiebot scripts, hydrated on 4 of 4 loads with no errors, and the declaration appeared inside the container.

## Technical Context

**Language/Version**: TypeScript on Bun; Next.js static export (`output: "export"`)

**Primary Dependencies**: none added; the script is loaded by the browser from `https://consent.cookiebot.com`

**Storage**: N/A

**Testing**: Playwright e2e against `out/` served by `server.ts`; the new test stubs Cookiebot as the others do
(`tests/e2e/fixtures.ts`)

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Performance Goals**: no cost beyond Cookiebot's own file; the element is `async`, so it blocks nothing (SC-004)

**Constraints**: hydration must succeed on every load (FR-004); no sideways scrolling (FR-005); footer order unchanged
(FR-006); the build's formatter and DOM gate must pass; no text with a newline rendered by React

**Scale/Scope**: one component, one test, two spec-linked notes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Static export, Bun, no server code: pass.
- Readable Prettier output: pass; the container is marked `data-raw-html` so the formatter treats it with
  whitespace-safe settings.
- No link underlines, no `#top` links, straight quotes, always dark: pass; the declaration's colors are set in Cookiebot
  Manager if needed (spec edge case). No `prefers-color-scheme` switching is added.
- Footer `role` and landmark structure unchanged: pass.
- Tests for behavior, not copy: the test checks position and attributes in the built HTML, and no text of the declaration.
- No counting checks in tests: pass; the test checks each page, not how many.
- License header on new files: no new source file, except possibly a test file, which gets the header.
- Spec first, issue-driven: spec exists; issue is #87, as on the branch.

Post-design re-check: pass, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/077-cookie-declaration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── footer-element.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
src/components/marketing/Footer.tsx   # container with the script element, after the copyright line
src/styles/marketing.css              # only if the declaration needs width or overflow rules
tests/e2e/cookie-declaration.spec.ts  # new: position and attributes in built HTML, no overflow
```

**Structure Decision**: no new directories. The footer component owns the placement.

## Complexity Tracking

None.
