# Data Model: Move Pages and Static Resources

**Feature**: specs/093-move-pages-static-resources | **Date**: 2026-11-07

There is no runtime data. The entities below are the fixed tables the implementation, the tests, and the documents
share.

## Prefix table

The reserved prefixes and what each holds. Written into the constitution (Principle VIII), `content/README.md`, and
`CLAUDE.md`.

| Prefix          | Holds                                                                                                 | Source                        |
| --------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| `/`             | Home page and the root crawler files only: robots.txt, sitemap.xml, favicons, manifest, browserconfig | `src/app/page.tsx`, `public/`, `content/robots.txt`, `content/sitemap.xml` |
| `/services/`    | Service pages                                                                                         | `content/services/*.md`       |
| `/company/`     | About Us and the policies                                                                             | `content/company/*.md`        |
| `/api/`         | The contact service, in its own repository                                                            | not this repository           |
| `/.well-known/` | security.txt and anything RFC 8615 asks for                                                           | `public/.well-known/`         |
| `/_next/`       | Framework output                                                                                      | written by `next build`       |
| `/static/`      | Static files like fonts, logos, images, etc.                                                          | `public/static/`              |

Rule: a new page goes under an existing prefix, a new prefix needs a spec, and a moved URL keeps a permanent redirect.

## Address map

One row per moved address. Drives `public/_redirects`, the link updates, and the redirect-list test.

| Old                       | New                                | Kind     | Status |
| ------------------------- | ---------------------------------- | -------- | ------ |
| `/web-development`        | `/services/web-development`        | page     | 301    |
| `/web-hosting`            | `/services/web-hosting`            | page     | 301    |
| `/technical-seo`          | `/services/technical-seo`          | page     | 301    |
| `/agentic-systems`        | `/services/agentic-systems`        | page     | 301    |
| `/cost-reduction`         | `/services/cost-reduction`         | page     | 301    |
| `/lead-generation`        | `/services/lead-generation`        | page     | 301    |
| `/growth-marketing`       | `/services/growth-marketing`       | page     | 301    |
| `/process-re-engineering` | `/services/process-re-engineering` | page     | 301    |
| `/about-us`               | `/company/about-us`                | page     | 301    |
| `/privacy-policy`         | `/company/privacy-policy`          | page     | 301    |
| `/security-policy`        | `/company/security-policy`         | page     | 301    |
| `/terms-of-service`       | `/company/terms-of-service`        | page     | 301    |
| `/fonts/*`                | `/static/fonts/:splat`             | resource | 301    |
| `/images/*`               | `/static/images/:splat`            | resource | 301    |
| `/logo/*`                 | `/static/logo/:splat`              | resource | 301    |
| `/services`               | `/`                                | section  | 302    |
| `/company`                | `/`                                | section  | 302    |

Validation rules (enforced by the redirect-list unit test):

- Each of the twelve moved pages in this map has exactly one page row, with status 301. The list is fixed: a page
  added later under `/services/` or `/company/` is not in it and needs no redirect.
- Every page row's new address is a published content page.
- Each of the three resource rows points at a folder that exists under `public/static/`.
- The two section rows point at `/`.
- No row's new address starts with `/fonts/`, `/images/`, or `/logo/`, or is an old page address.

## Resource files (22)

| Folder                 | Files                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `public/static/fonts/` | play-400.woff2, play-700.woff2, roboto-variable.woff2, source-code-pro-variable.woff2            |
| `public/static/images/`| 404.png, about-2.png, about-us.png, agentic-systems.png, city-grid.svg, cookies.png, cost-reduction.png, growth-marketing.png, lead-generation.png, privacy.png, process-re-engineering.png, security.png, technical-seo.png, terms.png, web-development.png, web-hosting.png |
| `public/static/logo/`  | andexor-logo.svg, logo-gold.svg, logo-outline.svg                                                 |

## Redirect rule

One line of `public/_redirects`: `source destination status`. Source is an absolute path, optionally ending in `*`.
Destination is an absolute path, with `:splat` where the source had `*`. Status is 301 or 302 here. Lines starting
with `#` are comments (the license header). The file is copied to `out/_redirects` by the build and is not served.

## Cache rule

One block of `public/_headers`: a path pattern line followed by an indented `Cache-Control` line.

| Pattern            | Cache-Control                              | Replaces    |
| ------------------ | ------------------------------------------ | ----------- |
| `/static/fonts/*`  | `public, max-age=31536000, immutable`      | `/fonts/*`  |
| `/static/images/*` | `public, max-age=2592000`                  | `/images/*` |
| `/static/logo/*`   | `public, max-age=2592000`                  | `/logo/*`   |

All other blocks are unchanged.

## Reference sites (where an address is written)

Every place an old address appears today, grouped by what it names. The tasks file turns this into edits.

- **Page links**: `Footer.tsx` (`ITEM_HREFS`), `services-data.ts` (card `href`), `ContactPopup.tsx` (Privacy,
  Terms), body links in `content/services/web-development.md`, `cost-reduction.md`, `technical-seo.md`, and
  `content/company/privacy-policy.md`, `security-policy.md`, `terms-of-service.md`; `src/lib/schema/ed.json`
  (`url`); `public/.well-known/security.txt`.
- **Images**: frontmatter `image:` in all 12 pages; `not-found.tsx`; `cards.css` (`city-grid.svg`).
- **Logo**: `Logo.tsx`, `ContactPopup.tsx`, `schema/organization.json`, `schema/ed.json`.
- **Fonts**: `layout.tsx` (preloads), `fonts.css` (`@font-face`).
- **Tests**: `tests/unit/content-links.test.tsx`, `services.test.tsx`, `contact-popup.test.tsx`,
  `not-found.test.tsx`, `contact-service.test.ts`, `contact-provider.test.tsx`; `tests/e2e/` specs that visit a
  page or check a `src` (footer-links, homepage-content, contact-popup-links, contact-popup-logo, not-found-style,
  font-loading, phone-links, cookie-declaration, and the rest that `goto` a content page).
- **Documents**: `content/README.md`, `CLAUDE.md`, `.specify/memory/constitution.md`.
