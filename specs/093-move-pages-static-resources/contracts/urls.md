# Contract: Public Addresses After the Move

**Feature**: specs/093-move-pages-static-resources | **Date**: 2026-11-07

This is the address surface the site presents to visitors, crawlers, the contact service's repository, and the
tests. Anything not listed is unchanged.

## Pages (200)

| Address                            | Source file                                    |
| ---------------------------------- | ---------------------------------------------- |
| `/`                                | `src/app/page.tsx`                             |
| `/services/web-development`        | `content/services/web-development.md`          |
| `/services/web-hosting`            | `content/services/web-hosting.md`              |
| `/services/technical-seo`          | `content/services/technical-seo.md`            |
| `/services/agentic-systems`        | `content/services/agentic-systems.md`          |
| `/services/cost-reduction`         | `content/services/cost-reduction.md`           |
| `/services/lead-generation`        | `content/services/lead-generation.md`          |
| `/services/growth-marketing`       | `content/services/growth-marketing.md`         |
| `/services/process-re-engineering` | `content/services/process-re-engineering.md`   |
| `/company/about-us`                | `content/company/about-us.md`                  |
| `/company/privacy-policy`          | `content/company/privacy-policy.md`            |
| `/company/security-policy`         | `content/company/security-policy.md`           |
| `/company/terms-of-service`        | `content/company/terms-of-service.md`          |

Any other address answers the 404 page with status 404 (production, preview, and local), except the redirects
below (production and preview).

## Static resources (200)

| Address prefix     | Source folder          | Cache-Control                         |
| ------------------ | ---------------------- | ------------------------------------- |
| `/static/fonts/`   | `public/static/fonts/` | `public, max-age=31536000, immutable` |
| `/static/images/`  | `public/static/images/`| `public, max-age=2592000`             |
| `/static/logo/`    | `public/static/logo/`  | `public, max-age=2592000`             |

## Root files (200, unchanged)

`/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/favicon.svg`, `/favicon-16x16.png`, `/favicon-32x32.png`,
`/favicon-48x48.png`, `/favicon-96x96.png`, `/android-chrome-192x192.png`, `/android-chrome-512x512.png`,
`/apple-touch-icon.png`, `/mstile-150x150.png`, `/site.webmanifest`, `/browserconfig.xml`,
`/.well-known/security.txt`, `/.well-known/gpc.json`.

## Redirects (production and preview only)

| Request                   | Answer                                       |
| ------------------------- | -------------------------------------------- |
| `/<old page>`             | `301 Location: /services/<page>` or `/company/<page>`, per the address map |
| `/fonts/<file>`           | `301 Location: /static/fonts/<file>`         |
| `/images/<file>`          | `301 Location: /static/images/<file>`        |
| `/logo/<file>`            | `301 Location: /static/logo/<file>`          |
| `/services`               | `302 Location: /`                            |
| `/company`                | `302 Location: /`                            |

The local static server (`server.ts`) answers these with the 404 page. Tests must not depend on the redirects.

## What crawlers read

- `/sitemap.xml` lists `/` and the twelve page addresses above, nothing else.
- `/.well-known/security.txt` names `/company/security-policy` as Contact, Policy, and Acknowledgments.
- The home page's Organization and Person structured data name `/static/logo/logo-gold.svg` as the logo and
  `/company/about-us` as the person's page.

## What the site itself emits

No page, stylesheet, or script shipped by the site refers to `/fonts/`, `/images/`, `/logo/`, or an old page
address. The Contact Us form still posts to `https://andexor.net/api/contact` with `sourcePath` set to the page's
new address.

## Other repository

The contact service (`/api/contact`) receives `sourcePath` values such as `/services/web-development` instead of
`/web-development`. It stores the value; nothing there parses it. No change is required, but the owner may want to
know when reading reports.
