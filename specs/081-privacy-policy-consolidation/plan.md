# Implementation Plan: Privacy Policy Consolidation

**Branch**: `89-update-privacy-content-and-links` | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/081-privacy-policy-consolidation/spec.md`

## Summary

Rename the three policy Markdown files with `git mv` and repoint every link to them. Append the Cookie Policy's body to
the Privacy Policy as Sections 20 to 25, with the cookie-declaration marker last, and turn the Privacy Policy's links to
`/cookies` into in-page references. In the footer, rename and reorder the Company links, point Do Not Sell or Share at
the Cookie Declaration section, and add Privacy Settings, a small client component whose click calls
`window.Cookiebot.renew()`. Remove `content/cookies.md` and its sitemap entry. Update the tests that name the routes and
add behavior tests for the new link.

## Technical Context

**Language/Version**: TypeScript / React (Next.js static export), Markdown content

**Primary Dependencies**: none added; Cookiebot's `renew()` is already on the page through `uc.js` (spec 076)

**Storage**: N/A

**Testing**: vitest (`content-links`), Playwright (`footer-links`, `cookie-declaration`, `contact-popup-links`, plus the
existing no-top-links and accessibility suites)

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Constraints**: no `#top` links; no link underlines; straight quotes; Markdown content stays Markdown; the marker is
handled by `src/lib/content.ts` unchanged; the whitespace script and hydration rules in CLAUDE.md

**Scale/Scope**: three renames, one merged content file, one removed content file, one new component, one edited
component, the popup's two hrefs, the sitemap, `security.txt`, four tests, two docs

## Constitution Check

- Static export, Bun, no server code: pass. The Privacy Settings click runs in the browser only.
- Markdown content pages: pass; the policies stay Markdown and `content.ts` is untouched.
- No `#top` links: pass. `href="#"` has an empty fragment, and the click's default is prevented so the page does not
  move; `tests/unit/no-top-links.test.ts` and `tests/e2e/no-top-links.spec.ts` keep checking.
- No link underlines: pass; the new link uses the existing `.an-footer__col-link` rules.
- Straight quotes: pass; the merged text is checked by `tests/unit/straight-quotes.test.ts`.
- Tests for behavior only: pass; see spec FR-009.
- Spec first, issue-driven: this spec; issue #89, on its branch.

## Project Structure

### Documentation (this feature)

```text
specs/081-privacy-policy-consolidation/
├── spec.md
├── plan.md
└── tasks.md
```

No research, data model, contracts, or quickstart: nothing new is researched, the one interface (Cookiebot's `renew()`)
is documented by Cookiebot, and the spec's Independent Tests are the quickstart.

### Source Code (repository root)

```text
content/privacy-policy.md                      (renamed; Sections 20-25 appended; cookie links repointed; dates)
content/terms-of-service.md                    (renamed; links to the other policies updated)
content/security-policy.md                     (renamed; link to the Terms updated)
content/cookies.md                             (removed)
content/sitemap.xml                            (new addresses; /cookies entry removed)
content/README.md                              (the marker now lives in privacy-policy.md)
public/.well-known/security.txt                (/security-policy)
src/components/marketing/PrivacySettingsLink.tsx  (new "use client" link: preventDefault, window.Cookiebot?.renew())
src/components/marketing/Footer.tsx            (Company labels, order, hrefs; Do Not Sell href; Privacy Settings entry)
src/components/contact/ContactPopup.tsx        (two hrefs)
src/styles/marketing.css                       (footer grid: two columns between 721px and 860px, see below)
tests/unit/content-links.test.tsx              (approved footer pages)
tests/e2e/footer-links.spec.ts                 (routes; column order; Privacy Settings; Do Not Sell fragment)
tests/e2e/cookie-declaration.spec.ts           (/privacy-policy)
tests/e2e/contact-popup-links.spec.ts          (routes)
CLAUDE.md                                      (where the Cookie Declaration lives)
```

**Structure Decision**: the footer stays a server-rendered component; only the Privacy Settings link is a client
component, so the rest of the footer does not pick up an event handler it does not need.

## Footer width at tablet sizes

The footer grid is `1.4fr repeat(3, 1fr)` with 32px gaps, stacking to one column at 720px and below. Its `fr` tracks
cannot shrink below each column's widest unwrappable item: the logo lockup is 256px, Web Development 128px, Process
Re-engineering 164px, and the Company column, once its links read Terms Of Service and Privacy Settings, 120px (it was
about 65px with About Us as the widest). With the gaps and padding the four columns need about 812px, so a 768px tablet
overflowed by 20px (the responsive and not-found tests caught it). The fix is a two-column grid between 721px and
860px: brand and Technical Services in the first row, Business Services and Company in the second. The owner reviews the
tablet layout before committing.
