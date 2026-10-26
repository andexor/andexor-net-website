# Implementation Plan: Cookiebot

**Branch**: `87-implement-cookiebot` | **Date**: 2026-10-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/076-cookiebot/spec.md`

## Summary

Put the Cookiebot script element first inside `<head>` of every built page. It cannot be done in `src/app/layout.tsx`:
Next.js writes its own `<meta charset>` and viewport tags before the layout's children, and the build then puts the
data-script preload hint and the whitespace script (spec 038) at the very start of `<head>`. So the element is added by
the build step that already owns the start of `<head>`, `scripts/format-html.ts` (step 6), in front of the whitespace
script. One constant holds the element; the build covers every page, including new Markdown pages, with no per-page work.

## Technical Context

**Language/Version**: TypeScript on Bun; Next.js static export (`output: "export"`)

**Primary Dependencies**: none added. The script is loaded from `https://consent.cookiebot.com/uc.js` by the browser.

**Storage**: N/A

**Testing**: Playwright e2e against `out/` served by `server.ts`

**Target Platform**: Cloudflare Workers static assets (`out/`); local Docker via `server.ts`

**Project Type**: Static web site

**Performance Goals**: no extra cost beyond Cookiebot's own file (SC-004)

**Constraints**: first element in `<head>`; no `async` or `defer`; the DOM (Document Object Model) gate in
`format-html.ts` must still pass; the data-script preload step must not move anything in front of it.

**Scale/Scope**: every built page (home, content pages, 404)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Static export, Bun, no server code: pass (build-script change only).
- Readable, Prettier-formatted output: pass; the element is one line like the whitespace script's glue.
- No links, underlines, `#top`, quotes, or always-dark changes: pass, nothing visual of the site's own changes.
- Tests for behavior, not copy: one test checks position and attributes of the element, not banner text.
- License header on new source files: any new file gets the SPDX header. Pass.
- Spec first: this spec exists before the change. Pass.
- Third-party script, new site-wide behavior: allowed, recorded in the spec's Assumptions.

Post-design re-check: pass, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/076-cookiebot/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── head-element.md
└── tasks.md             # /speckit-tasks, not created here
```

### Source Code (repository root)

```text
scripts/
└── format-html.ts       # add COOKIEBOT_SCRIPT; insert it before WHITESPACE_SCRIPT; ignore it in the DOM gate
tests/e2e/
└── cookiebot.spec.ts    # new: every built page starts <head> with the element
```

**Structure Decision**: no new directories. Existing build step owns the start of `<head>`, so the change lives there.

## Complexity Tracking

None.
