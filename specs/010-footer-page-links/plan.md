# Implementation Plan: Footer Links to the New Stub Pages

**Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-footer-page-links/spec.md`

## Summary

`Footer.tsx` gives every entry `ITEM_HREFS[item] ?? "#" + slugify(item)`, and only "Web Development"
is in `ITEM_HREFS`. The fix is to add the other eight pages (`/web-hosting`, `/technical-seo`,
`/agentic-systems`, `/cost-reduction`, `/lead-generation`, `/growth-marketing`,
`/process-re-engineering`, `/about-us`) to `ITEM_HREFS`. "Contact" keeps its `#contact`
placeholder, as do Privacy and Terms. The existing "approved pages" unit test is extended so it
also proves each footer page exists (FR-007), and an e2e test clicks each link from the home
page, a content page, and the not-found page. Absolute addresses (`/about-us`) already work from
every page, which is what FR-002 needs. No new files in `src/`, no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.5 (`output: "export"`)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Vitest + Testing Library (unit), Playwright + axe (e2e, six projects), ESLint

**Target Platform**: Static `out/` served by `server.ts` in Docker (unchanged)

**Project Type**: Static web site

**Performance Goals**: No change

**Constraints**: footer look, wording, and colors unchanged (FR-004); no underlines; no `#top`;
Contact, Privacy, Terms, social links, and Web Development unchanged (FR-003); each address matches
a published (non-draft) file under `content/`

**Scale/Scope**: 8 map entries, 1 comment, 3 test files edited, spec 001 FR-017 amended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Result |
|-----------|--------|
| I. Simplicity & YAGNI | Pass. Eight string values in an existing map. No new helper or component. |
| II. Component stack | Pass. Unchanged. |
| III. Accessibility & performance | Pass. Dead links become working links; link text is unchanged. |
| IV. Design & content consistency | Pass. Same footer component and classes; no `#top`. |
| V. Test-first | Pass. Tests are edited first and fail until the map is filled. |
| VI. Always-dark, no link underlines | Pass. No CSS change; `no-hover-underline.test.ts` still runs. |
| VII. Graceful shutdown | Not affected; the usual Docker check still applies. |
| VIII. Markdown-authored pages | Pass, with the owner's go-ahead. The rule says a page is not linked from the footer until the owner says it is ready; the owner has said so for these eight. Pages stay Markdown. |
| License header | No new source files. |

No violations; Complexity Tracking is empty. No constitution change: Principle VIII already allows
linking once the owner says a page is ready.

## Project Structure

### Documentation (this feature)

```text
specs/010-footer-page-links/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── footer-links.md
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/components/marketing/Footer.tsx        # edit: 8 entries in ITEM_HREFS; update the FR-017 comment

tests/
├── unit/content-links.test.tsx            # edit: footer links are the 9 approved pages, all published
└── e2e/footer-links.spec.ts               # new: each link opens its page from /, a content page, and /nope

specs/001-homepage-contact-us/spec.md      # edit: FR-017 amendment note
```

**Structure Decision**: Existing single Next.js project; only the files above change.

## Design Decisions

- **Literal map entries.** `ITEM_HREFS` already holds `/web-development` as a literal. Adding eight
  more keeps one rule. Deriving `/${slugify(item)}` would work for all eight today, but it would
  also turn "Contact" into `/contact` and hide the placeholder; keeping the fallback only for
  "Contact" is clearer.
- **Keep the `slugify` fallback.** "Contact" still needs `#contact`, so the fallback stays.
- **Absolute addresses** (leading `/`) resolve the same from `/`, `/web-development`, and the
  not-found page, which covers User Story 3 with no extra code.
- **One approved list, shared with spec 011.** `content-links.test.tsx` gets two named constants:
  `CARD_PAGES` (the four card pages, from 011) and `FOOTER_PAGES` (the nine footer pages,
  including Web Development). `APPROVED` is their sorted union. Whichever feature is built first
  adds its constant; the other adds the rest.
- **New e2e file, not an edit.** Footer behavior spans three page types, so
  `tests/e2e/footer-links.spec.ts` covers it in one place instead of spreading it across three
  specs. It is data-driven over the eight entries.
- **Card and footer agree (spec 011 FR-006)** is asserted by 011's US2 task, not here.

## Complexity Tracking

None.
