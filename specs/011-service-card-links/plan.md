# Implementation Plan: Home Page Service Cards Link to Their Pages

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/011-service-card-links/spec.md`

## Summary

`Services.tsx` renders each card as a link to `service.href`, falling back to a placeholder
(`#seo`, `#ai`, `#growth`) when the entry has none. Only Web Development has an `href`. The fix is
to add `href` to the other three entries in `services-data.ts` (`/technical-seo`,
`/agentic-systems`, `/growth-marketing`), make `href` required, and drop the placeholder fallback
so a card can never again point at nothing (FR-005). The existing "approved pages" unit test is
extended, and it also checks that every card's page exists (FR-008). No new files in `src/`, no new
dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change

**Constraints**: cards keep their look, text, order, and hover behavior (FR-007); no link
underlines; no link to `#top`; every card leads to an existing, non-draft page

**Scale/Scope**: 3 data entries, 1 type change, 1 component fallback removed, 3 test files edited,
spec 001 FR-017 amended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. Three string values and one deleted fallback. No slug helper: the four hrefs are literal, like the existing one. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Cards that did nothing become working links; each is still one link with the card's heading as its name. |
| IV. Design & content consistency | Pass. Same `Card as="a"`, no new styles. No `#top` links. |
| V. Test-first | Pass. Tests are edited first and fail until the data change. |
| VI. Always-dark, no link underlines | Pass. No CSS change; the existing hover-underline test still runs. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Pass, with the owner's go-ahead: the pages stay Markdown, and linking them from the home page is what the owner asked for. |
| License header | No new source files. |

No violations; Complexity Tracking is empty. Governance: no constitution change. Principle VIII
needs no edit, since it says pages stay unlinked "until the site owner says it is ready", and the
owner has said so.

## Project Structure

### Documentation (this feature)

```text
specs/011-service-card-links/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── service-card-links.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/marketing/services-data.ts   # edit: href on 3 entries; href becomes required
src/components/marketing/Services.tsx       # edit: drop the `#tag` fallback; update the comment

tests/
├── unit/content-links.test.tsx             # edit: approved pages include the 3 card pages
├── unit/services.test.tsx                  # edit: each card's href is its page
└── e2e/homepage-content.spec.ts            # edit: each card opens its page

specs/001-homepage-contact-us/spec.md       # edit: FR-017 amendment note
```

**Structure Decision**: Existing single Next.js project; only the files above change.

## Design Decisions

- **Literal hrefs.** The four `href` values are written out in `services-data.ts`, as
  `/web-development` already is. Deriving them from the title would add a helper for four values.
- **Required `href`.** Making it required in `ServiceOffering` means a fifth card without a
  destination fails the type check, which is the cheapest guard for FR-005.
- **One approved list.** `content-links.test.tsx` holds the pages the owner has approved for
  linking. Spec 010 (footer) needs the same list, so it is one constant there, not a second one.
  Whichever feature is built first adds its pages; the other adds the rest.
- **Card and footer agree (FR-006)** is checked in the e2e spec by comparing where a card and its
  footer entry go. It only passes once spec 010 is built, so that assertion is added with 010's
  tasks; until then, only the card side is asserted.

## Complexity Tracking

None.
