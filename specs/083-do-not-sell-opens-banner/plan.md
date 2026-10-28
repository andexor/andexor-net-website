# Implementation Plan: Do Not Sell Opens the Cookie Banner

**Branch**: not created yet (see spec.md) | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/083-do-not-sell-opens-banner/spec.md`

## Summary

Turn the footer's Do Not Sell or Share My Personal Information link into the same kind of control as Privacy Settings:
`PrivacySettingsLink` takes the link's text and class, and the footer renders both links with it, so both call
`window.Cookiebot.renew()` and neither navigates. React cannot write HTML comments, so the two comments (`For GDPR`
before Privacy Settings, `For CCPA` before Do Not Sell) are added to each built page's HTML by the post-build pass,
before the page is formatted, the way the framework's duplicate `noindex` tag is already removed there. Replace the one
e2e test for the old target, add behavior tests for the new one and for the comments, and update the two docs that
describe the old link.

## Technical Context

**Language/Version**: TypeScript / React (Next.js static export); Bun scripts for the post-build pass

**Primary Dependencies**: none added; Cookiebot's `renew()` is already on the page (specs 076 and 081)

**Storage**: N/A

**Testing**: Playwright (`footer-links`, plus a raw-HTML check of the comments), vitest (`format-html`) for the post-build
function

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Constraints**: no `#top` links (`href="#"` has an empty fragment and its click is prevented, as Privacy Settings
already does); no link underlines; shared link color; straight quotes; the formatter's rules in CLAUDE.md (no newline in
React text, DOM equality check); `PrivacySettingsLink` is a client component, so the text must come in as `children`, not
be built from a newline

**Scale/Scope**: one component changed, one component call site, one post-build function, four test edits, two doc
sentences

## Constitution Check

- Static export, Bun, no server code: pass. The click runs in the browser; the comments are written at build time.
- Markdown content pages: not touched.
- No `#top` links: pass; `tests/unit/no-top-links.test.ts` and `tests/e2e/no-top-links.spec.ts` keep checking.
- No link underlines: pass; the Do Not Sell link keeps `.an-footer__legal-link`, which has none.
- Always dark, shared link color: pass; no style changes.
- Straight quotes: pass; the comments contain none.
- License header: no new source file (a new function goes in an existing script, a new test in an existing spec file).
- Tests for behavior only: pass; the tests check what the links do and where the comments are, not the wording of the
  copy (the comment text is the owner's required content, FR-004).
- Spec first, issue-driven: this spec; an issue still has to be opened.

## Project Structure

### Documentation (this feature)

```text
specs/083-do-not-sell-opens-banner/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
└── checklists/requirements.md
```

No data model or contracts: no data, and the one interface (`window.Cookiebot.renew()`) is Cookiebot's own.

### Source Code (repository root)

```text
src/components/marketing/PrivacySettingsLink.tsx   # takes children and className; same click behavior
src/components/marketing/Footer.tsx                # Do Not Sell uses it; DO_NOT_SELL_HREF and its comment removed
scripts/format-html.ts                             # addPrivacyComments(html, name), exported, with its unit test
scripts/format-site.ts                             # formatPage calls it
tests/e2e/footer-links.spec.ts                     # old target test replaced; new behavior and comment tests
CLAUDE.md                                          # the Cookie Declaration paragraph's footer sentence
specs/081-privacy-policy-consolidation/spec.md     # a note that spec 083 changed the Do Not Sell target
```

## Design

1. **Component.** `PrivacySettingsLink({ className, children })` renders `<a href="#" className onClick>{children}</a>`.
   The footer passes `Privacy Settings` and `Do Not Sell or Share My Personal Information` as single-line children.
2. **Footer.** The Do Not Sell anchor becomes `<PrivacySettingsLink className="an-footer__legal-link">`. Remove
   `DO_NOT_SELL_HREF` and the comments that describe it. Update the comment above `Footer` (spec 083).
3. **Comments.** `addPrivacyComments` (in `scripts/format-html.ts`, which tests can import; `format-site.ts` runs the whole
   build when imported) runs on the raw built page (one line, before formatting). It puts `<!-- For GDPR -->`
   directly before the `<a ...>Privacy Settings</a>` element and `<!-- For CCPA -->` directly before the
   `<a ...>Do Not Sell or Share My Personal Information</a>` element, and throws, naming the page, unless each link is
   found exactly once. The patterns match an `<a>` start tag, so the footer's text inside the framework's data scripts
   (JSON, not tags) is never touched. Because it changes the page before `formatHtml` reads it, the formatter's DOM
   equality check sees the comments on both sides. React skips comment nodes that are not Suspense markers when it
   hydrates, so hydration is unaffected (checked in the quickstart).
4. **Tests.**
   - `footer-links.spec.ts`: replace the old test with: the Do Not Sell link calls `renew()` once, leaves the address and
     scroll position alone, and works from the keyboard (reusing `countRenewCalls`); Privacy Settings is unchanged.
   - A raw-HTML check on `/`, `/web-development`, `/privacy-policy`, and `/nope` that each comment is directly before its
     link.
   - `tests/unit/format-html.test.ts`: `addPrivacyComments` puts each comment directly before its link, and throws, naming
     the page, when a link is missing or appears twice.

## Risks

- A future change to the footer markup, such as a wrapper `<span>` inside the anchor, would stop the patterns matching.
  The build then fails with the page name, which is the intent.
- The Cookie Declaration section is no longer reachable from the footer. The Privacy Policy's own links to it remain
  (spec FR-007), and `tests/e2e/cookie-declaration.spec.ts` keeps checking the section.
