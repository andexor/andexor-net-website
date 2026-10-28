# Implementation Plan: Remove the Title Suffix

**Branch**: `98-cleanup-titles` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/085-remove-title-suffix/spec.md`

## Summary

Stop appending " | Andexor Network" to page titles. Three places set a title (the root layout default for the home
page, the Markdown page route, and the not-found page); each loses the suffix. The content authoring guide and the
comments that describe the suffix are corrected, and the existing metadata e2e test and the not-found e2e test are
updated to expect the bare title.

## Technical Context

**Language/Version**: TypeScript / React (Next.js static export)

**Primary Dependencies**: none added

**Storage**: N/A

**Testing**: Playwright e2e. `tests/e2e/page-metadata.spec.ts` keeps its check that the title follows the H1 text, minus
the suffix. `tests/e2e/not-found-style.spec.ts` checks the not-found title.

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Constraints**: straight quotes; license headers kept; Prettier formatting; no tests for copy (the title test checks
that the title follows the H1, which is behavior, so it stays)

**Scale/Scope**: three source lines, two comments, one documentation line, two test edits

## Constitution Check

- Static export, Bun, no server code: pass.
- Markdown content pages: only the authoring guide text changes; no page is converted.
- No `#top` links, no link underlines, always dark, straight quotes: pass; no markup or styles change.
- Tests for behavior only: pass; the title-follows-H1 test stays, and the suffix constant is removed from it.
- Spec first, issue-driven: this spec; the issue is #98.

## Project Structure

### Documentation (this feature)

```text
specs/085-remove-title-suffix/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
└── checklists/requirements.md
```

No data model or contracts: no data and no new interface.

### Source Code (repository root)

```text
src/app/layout.tsx                  # default title without the suffix; fix the comment
src/app/not-found.tsx               # title "Page not found"
src/app/[...slug]/page.tsx          # title is page.title
content/README.md                   # title bullet no longer mentions the suffix
tests/e2e/page-metadata.spec.ts     # drop SUFFIX; fix the header comment
tests/e2e/not-found-style.spec.ts   # expect "Page not found"
```

## Design

- `layout.tsx`: `title: "Enterprise services for small business"`. Comment says the title and meta description are
  both the headline text.
- `not-found.tsx`: `title: "Page not found"`.
- `[...slug]/page.tsx`: `title: page.title`.
- `content/README.md`: the `title` bullet says to write the same text as the page's `# Heading`, with no mention of a
  suffix.
- Tests: `await expect(page).toHaveTitle(h1)`; the not-found test expects `"Page not found"`.
- The `| Andexor Network, Inc.` table cells in the policy pages are address text, not titles, and stay.
- Older specs (028, 029, 030) are history and are not edited; this spec supersedes the suffix requirement.
