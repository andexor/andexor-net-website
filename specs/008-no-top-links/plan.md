# Implementation Plan: No Links to "#top", and a Plain Footer Logo

**Branch**: `13-update-the-style-of-the-404-page` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-no-top-links/spec.md`

## Summary

The only link to `#top` in `src/` is `href="#top"` on the footer's `<Logo>` in `Footer.tsx`. The
`Logo` component already renders a plain `<div>` when it has no `href` (added for the hero), so the
fix is to stop passing `href` there. To keep the rule true, a unit test scans `src/` and `content/`
for any link to `#top`, an e2e test lists every link on three pages, and the standing rule is
recorded in the constitution and `CLAUDE.md`. Earlier specs that said the footer logo scrolls to
the top are amended. No new files in `src/`, no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change

**Constraints**: WCAG 2.1 AA; the footer logo keeps its look (FR-002); header logo on content pages
still links to `/` (FR-005); hero brand row stays a non-link (FR-006)

**Scale/Scope**: 1 component call site, 1 new unit test, 1 new e2e spec, 2 test edits, constitution,
`CLAUDE.md`, 3 earlier specs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. One prop removed at one call site. The guard is one small test, justified by FR-004 (rule must hold for future pages). |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. A non-interactive logo removes a redundant tab stop and a link that announces as "Andexor Network" twice on a page. |
| IV. Design & content consistency | Pass, and extended: the standing rule is added here (see Design Decisions). |
| V. Test-first | Pass. The tests are written first and fail until the footer change. |
| VI. Always-dark, no link underlines | Not affected. |
| VII. Graceful shutdown | Not affected; verified by the usual Docker check. |
| VIII. Markdown-authored pages | Pass. The guard also scans `content/`. |
| License header | New test files get the header. |

Governance: the rule is recorded as MINOR 1.4.0 (new prohibition), with a Sync Impact Report entry.
`.specify/templates/*` mention no `#top` rule, so nothing to change there.

## Project Structure

### Documentation (this feature)

```text
specs/008-no-top-links/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── link-rules.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/marketing/Footer.tsx    # edit: <Logo light /> with no href
src/components/marketing/Logo.tsx      # edit: header comment (plain block when there is no href)

tests/
├── unit/no-top-links.test.ts          # new: scan src/ and content/ for links to #top
├── unit/logo.test.tsx                 # edit: footer logo is not a link
└── e2e/no-top-links.spec.ts           # new: all links on three pages, tab order, hover/click does nothing

.specify/memory/constitution.md        # Principle IV: no links to #top; bump to 1.4.0
CLAUDE.md                              # new "No links to #top" section; version reference
specs/001-homepage-contact-us/spec.md  # Amendments: footer logo is not a link
specs/002-content-pages-card-template/spec.md          # FR-010
specs/002-content-pages-card-template/contracts/content-contracts.md   # "Logo on home page" row
specs/003-logo-wordmark/contracts/logo-component.md    # Footer caller row
```

**Structure Decision**: Keep the existing layout. No new component.

## Design Decisions

- **Remove `href`, don't add a special case.** `Logo` with no `href` already renders
  `<div class="an-logo-lockup ...">`. The footer passes only `light`. The hero passes `size` and
  `light`. The header passes `href="/"`. Nothing else uses `Logo`.
- **`id="top"` stays.** `ContentPage` and `Hero` keep `id="top"`; tests use `#top` as a scope
  selector, and it is not a link. Removing it is a separate cleanup nobody asked for (Principle I).
- **The guard scans source, not just the rendered pages.** The unit test reads every `.ts`
  and `.tsx` file under `src/`, and every `.md` under `content/`, and fails on a link to `#top`: `href="#top"`, `href={"#top"}`, `href: "#top"`, and Markdown `](#top)`. A page
  test alone would miss a page nobody has visited. Rendered `href` values ending in `#top` are also
  checked in e2e on three pages.
- **Limits of the scan.** The source scan finds literal links only. A link built at runtime (for
  example `href={TOP}`, or the footer's `` `#${slugify(item)}` `` placeholders) is not caught by it;
  the e2e check on the rendered pages (`/`, `/web-development`, `/nope`) covers those pages. This is
  accepted: nothing builds a `#top` link at runtime, and a new pattern would show up in the e2e
  check or in review.
- **Constitution change.** Principle IV is changed by task T011 in this feature, as specs 006 and 007
  did for their principles. The rationale, version bump, and Sync Impact Report entry are in this
  plan and in T011, which meets the constitution's amendment process (no separate
  `/speckit-constitution` run).
- **What counts as a link to `#top`.** Any `href` whose fragment is exactly `top`, with or without a
  path (`#top`, `/#top`, `/page#top`). Placeholder `#` links and other anchors are outside the rule.
- **Where the standing rule lives.** Principle IV (Design & Content Consistency) gets one sentence,
  and `CLAUDE.md` gets a short section with the same wording as the underline rule: never do it,
  fix conflicting text on sight, don't ask again.
- **Earlier specs.** Spec 002 FR-010, spec 001's Amendments, the 002 content contract, and the 003
  logo contract are updated. Historical `tasks.md` and `plan.md` files in earlier specs are records
  of what was done and are left alone.

## Complexity Tracking

Not needed.
