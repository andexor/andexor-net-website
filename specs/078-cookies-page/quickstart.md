# Quickstart: Cookies Page

## Prerequisites

Port 3000 free. `bun install` done.

## Check the build

```sh
bun run sitemap
bun run format:check
bun run test
bun run test:e2e -- tests/e2e/cookie-declaration.spec.ts tests/e2e/footer-links.spec.ts --project=chromium
```

Expected: all pass. `/cookies` has the script element, no other page does, and the footer link opens the page.

## Check with the real Cookiebot

Serve `out/` with `bun server.ts`, then use a Playwright context that routes `https://andexor.net/**` to
`http://localhost:3000`, so Cookiebot sees the real domain. Load `/cookies` 10 times, with and without a saved consent
choice. Expected: the page hydrates every time, the declaration appears where the marker is, there are no page
errors, and there is no sideways scroll at 360, 768, and 1280 pixels. Click Allow all: the page stays up.

## Check by hand

Open a page, find "Cookies" in the Company column of the footer, and follow it.
