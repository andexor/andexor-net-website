# Implementation Plan: Move Pages and Static Resources

**Branch**: `118-move-pages-and-static-resources` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/093-move-pages-static-resources/spec.md` (issue #118)

## Summary

Give the site a fixed set of address prefixes: service pages under `/services/`, About Us and the policies under
`/company/`, fonts, images, and logos under `/static/`, with the home page and the crawler files staying at the root.
Source files move to match (`content/services/`, `content/company/`, `public/static/`), so the existing "path is the
route" loader and the sitemap generator produce the new addresses without code changes. Every reference the site
emits is updated. A `public/_redirects` file, read by Cloudflare Workers Static Assets, answers every old address
with a 301 to the new one in production. Caching rules follow the resources. The prefix table and the placement rule
are written into the constitution (1.9.0 to 1.10.0), `content/README.md`, and `CLAUDE.md`.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 15 (`output: "export"`), Bun 1.4 for scripts, tests, and the
Docker runtime.

**Primary Dependencies**: unchanged. No package is added. The one new file is a plain-text `public/_redirects`.

**Storage**: files only. Markdown in `content/`, static files in `public/`, built site in `out/`.

**Testing**: Vitest unit tests (`bun run test`), Playwright end-to-end tests against the built site served by
`server.ts` (`bun run test:e2e`).

**Target Platform**: Cloudflare Workers with Static Assets (production, `wrangler.jsonc`, no Worker code), the Bun
static server in Docker (local), `wrangler dev` (preview).

**Project Type**: static marketing website.

**Performance Goals**: no regression. Fonts keep the one-year immutable cache, images and logos the 30-day cache,
each at the new prefix. Font preloads name the new addresses so no font is fetched twice.

**Constraints**: redirects must come from the static-assets redirect file, because the Worker has no code and must
not gain any (CLAUDE.md, Toolchain). No trailing-slash support is added. Redirects are required in production only;
the local server and tests must not depend on them. The straight-quotes, no-hover-underline, and no-#top rules apply
to every file written.

**Scale/Scope**: 12 pages, 3 resource folders (23 files), 17 redirect rules, 3 cache rules, about 40 source and
test files that name an old address, 3 documents.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Note |
| --- | --- | --- |
| I. Simplicity and YAGNI | Pass | One plain-text redirect file, no dependency, no code path. The content loader and sitemap already handle nested folders, so nothing is written for them. Section landing pages are not built; `/services` and `/company` redirect to `/` until one exists. |
| II. Modern component stack | Pass | Same framework, same static export, same hosting. |
| III. Accessibility and performance | Pass | No markup or behavior changes. Cache lifetimes carry over per prefix. Preloads name the new font addresses so no font is fetched twice. Permanent redirects keep inbound links and search standing. |
| IV. Design and content consistency | Pass | Shared components keep their structure; only `href` and `src` values change. No link goes to `#top`. |
| V. Test-first quality gates | Pass | Tests cover stated behavior: every moved address has a redirect rule to an address that exists, and no built page or stylesheet refers to an old prefix (spec FR-005, FR-006, FR-007). Existing tests only have their addresses updated. No test is written for wording, the headers file's lifetimes, or the documents (FR-013 lifetimes are checked by reading, not by a test, because a lifetime is a tuning value, not behavior). |
| VI. Always dark, no underline | Pass | Untouched. |
| VII. Graceful shutdown | Pass | `server.ts` is not changed. It already answers `/services` (a directory with no page) with the 404 page, verified: Bun's file API reports a directory as not existing. |
| VIII. Markdown content pages | Pass, amended | Pages stay Markdown and move folders. The principle gains the "URL structure" paragraph the issue asks for; MINOR bump 1.9.0 to 1.10.0 (materially expanded guidance). |
| Technology constraints | Pass | Static export, Bun, Prettier formatting, Wrangler for deploy. No OpenNext or vinext. |
| Development workflow | Pass | Issue #118, branch `118-move-pages-and-static-resources` exists, spec before code, `git commit -s` ending `Closes #118.`, PR only when asked. |
| Governance | Pass | Rationale and version bump recorded in the constitution's sync report. Templates checked: none name a route or resource folder. |

No violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/093-move-pages-static-resources/
├── plan.md              # This file
├── research.md          # Phase 0: decisions on redirect mechanism, statuses, layout, testing
├── data-model.md        # Phase 1: address map, prefix table, redirect and cache rules
├── quickstart.md        # Phase 1: how to verify locally, in preview, and in production
├── contracts/
│   └── urls.md          # Phase 1: the site's public address surface after the move
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Files that move (`git mv`, so history follows):

```text
content/
├── README.md                          # stays; Routes section rewritten
├── robots.txt, sitemap.xml            # stay (crawler files at the root)
├── services/                          # new
│   ├── agentic-systems.md
│   ├── cost-reduction.md
│   ├── growth-marketing.md
│   ├── lead-generation.md
│   ├── process-re-engineering.md
│   ├── technical-seo.md
│   ├── web-development.md
│   └── web-hosting.md
└── company/                           # new
    ├── about-us.md
    ├── privacy-policy.md
    ├── security-policy.md
    └── terms-of-service.md

public/
├── _headers                           # stays; three rules renamed
├── _redirects                         # new
├── favicon*, android-chrome-*, apple-touch-icon.png, mstile-*, site.webmanifest, browserconfig.xml  # stay
├── .well-known/security.txt           # stays; three addresses updated
└── static/                            # new
    ├── fonts/    (4 files, from public/fonts/)
    ├── images/   (15 files, from public/images/)
    └── logo/     (3 files, from public/logo/)
```

Files that change in place:

```text
src/app/layout.tsx                     # font preload addresses
src/app/not-found.tsx                  # 404 illustration address
src/components/contact/ContactPopup.tsx  # logo, Privacy and Terms links
src/components/marketing/Logo.tsx      # logo
src/components/marketing/Footer.tsx    # ITEM_HREFS
src/components/marketing/services-data.ts  # card hrefs
src/lib/schema/organization.json       # logo
src/lib/schema/ed.json                 # url, logo
src/styles/fonts.css                   # font addresses
src/styles/cards.css                   # city-grid.svg address
content/**/*.md                        # frontmatter image, body links
tests/unit/*.test.ts(x), tests/e2e/*.spec.ts  # addresses only, plus the two new checks
.specify/memory/constitution.md        # Principle VIII paragraph, version 1.10.0, sync report
content/README.md                      # Routes section, image examples
CLAUDE.md                              # Markdown content pages paragraph, route examples
```

Files that need no change (verified): `src/lib/content.ts` (walks folders, `folder/index.md` is `/folder`),
`scripts/generate-sitemap.ts` (joins slug segments), `scripts/copy-crawler-files.ts` (root crawler files stay),
`server.ts` (nested `.html` lookup already works, a bare directory falls to 404), `wrangler.jsonc`, `next.config.ts`,
`Dockerfile`, `build.sh`.

**Structure Decision**: single project, as today. Pages move into two folders under `content/`, resources into one
`static/` folder under `public/`. No new module, component, or script.

## Phase 0: Research

See [research.md](research.md). Decisions, in short:

1. Redirects come from `public/_redirects`, which Next copies to `out/` and Workers Static Assets reads. 17 rules.
2. Moved pages and resource folders get `301`. The two section placeholders, `/services` and `/company`, get `302`,
   because they are temporary by the issue's own words and a cached `301` would keep returning visitors away from a
   future landing page.
3. No rule for trailing-slash variants.
4. Source files move; the loader, sitemap, and server already support the layout.
5. Verification in production is by hand after deploy; in the repository, a unit test reads `public/_redirects` and
   checks it against the content slugs and `public/static/`, and the built-output test checks that no page or
   stylesheet refers to an old prefix.
6. Constitution bump is MINOR, to 1.10.0.

## Phase 1: Design

- [data-model.md](data-model.md): the address map, the prefix table, and the shape of a redirect rule and a cache
  rule.
- [contracts/urls.md](contracts/urls.md): the public address surface after the move, which is what tests,
  documents, and the other repository (the contact service) rely on.
- [quickstart.md](quickstart.md): build, test, and check steps, including the optional preview check with
  `wrangler dev` and the production check with `curl` after the owner deploys.

### Constitution Check after design

Unchanged from the table above. The design adds one plain-text file and two focused tests and removes nothing.

## Complexity Tracking

None. No constitution gate is violated.
