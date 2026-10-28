# Research: Preconnect to the Cookiebot CDN

## Which origin

- **Decision**: Hint `https://consentcdn.cookiebot.com` only.
- **Rationale**: Lighthouse names it. The script origin `consent.cookiebot.com` is requested at once from the first tag
  in the head, so an earlier hint cannot help.
- **Alternatives**: `dns-prefetch` alone (saves only the lookup); hinting both origins (no gain for the second).

## Where the hint is added

- **Decision**: The formatter step that already injects the Cookiebot script (`scripts/format-html.ts`).
- **Rationale**: Cookiebot's markup is already injected there, outside React, so the hint reaches every page, adds no
  hydration risk, and needs no per-page code. It goes before the Cookiebot script so the connection starts first.
- **Alternatives**: Next.js metadata or a layout `<link>` (React would place it after the Cookiebot script and would
  have to match the injected DOM); a Cloudflare `Link` header (`wrangler.jsonc` has no Worker code, and local `server.ts`
  would not match production).

## `crossorigin`

- **Decision**: Use `crossorigin`.
- **Rationale**: The consent script fetches its configuration with cross-origin requests; a preconnect without
  `crossorigin` opens a connection those requests cannot reuse.
- **Alternatives**: Two hints (with and without); not needed, the script does not make credentialed requests.

## Verification

- Lighthouse before and after on the home page; the audit "Preconnect to required origins" should drop the origin.
  Lab LCP varies run to run, so compare several runs.
