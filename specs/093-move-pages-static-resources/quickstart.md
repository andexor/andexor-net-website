# Quickstart: Verifying the Move

**Feature**: specs/093-move-pages-static-resources | **Date**: 2026-11-07

Read [contracts/urls.md](contracts/urls.md) for the expected addresses and [data-model.md](data-model.md) for the
address map. This guide only says how to check them.

## Prerequisites

- Bun, Docker, and the Playwright browsers per `setup.md`.
- Port 3000 free (`lsof -i :3000`); the end-to-end run reuses whatever listens there.
- Wrangler on Node (nvm) only for the optional preview check.

## 1. Build and unit tests

```bash
bun run sitemap            # regenerates content/sitemap.xml from the moved files
bun run build              # next build, crawler files, formatter
bun run test               # unit tests, including the redirect-list test and the built-output checks
bun run format:check
```

Expected: the build succeeds, `out/` holds `services/*.html`, `company/*.html`, `static/{fonts,images,logo}/`,
`_headers`, and `_redirects`, and every unit test passes.

## 2. Quick greps over the build output

```bash
grep -rlE '"/(fonts|images|logo)/' out --include='*.html' --include='*.css'   # expect no output
grep -oE 'https://andexor.net/[a-z/-]+' content/sitemap.xml | sort -u          # expect / plus 12 new addresses
grep -E '^(Contact|Policy|Acknowledgments):' out/.well-known/security.txt       # expect /company/security-policy
cat out/_redirects                                                              # 17 rules
```

## 3. End-to-end tests

```bash
bun run test:e2e
```

Expected: every spec passes against the local static server. Specs visit the new addresses; none asks the local
server for a redirect.

## 4. Local server behavior (spec FR-009)

With `bun run server.ts` running:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/services/web-development   # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/company/about-us           # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/static/logo/logo-gold.svg  # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/favicon.ico                # 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/web-development            # 404 (no redirect locally)
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/services                   # 404 (no redirect locally)
```

## 5. Optional: redirects in preview

`wrangler dev` reads `out/_redirects` and `out/_headers` the way production does.

```bash
bun run preview            # serves out/ on 8787
curl -sI http://localhost:8787/web-development | grep -iE '^(HTTP|location)'   # 301, /services/web-development
curl -sI http://localhost:8787/logo/logo-gold.svg | grep -iE '^(HTTP|location)' # 301, /static/logo/logo-gold.svg
curl -sI http://localhost:8787/services | grep -iE '^(HTTP|location)'          # 302, /
curl -sI http://localhost:8787/static/fonts/play-400.woff2 | grep -i cache-control  # max-age=31536000, immutable
```

This check is a convenience, not a requirement. If preview disagrees with production, production is the reference.

## 6. Production, after the owner deploys

The plan does not run `wrangler deploy`. Once the owner has deployed:

```bash
for p in web-development about-us privacy-policy; do curl -sI https://andexor.net/$p | grep -iE '^(HTTP|location)'; done
curl -sI https://andexor.net/images/404.png | grep -iE '^(HTTP|location)'
curl -sI https://andexor.net/services | grep -iE '^(HTTP|location)'
curl -s https://andexor.net/sitemap.xml | grep -c '<loc>'                      # 13
curl -sI https://andexor.net/favicon.ico | head -1                             # 200
```

Expected: 301 with the new address for every moved page and resource, 302 to `/` for the two sections, 13 sitemap
entries, favicon 200.

## 7. Documents

Read, do not test: Principle VIII in `.specify/memory/constitution.md` shows the prefix table and version 1.10.0;
the Routes section of `content/README.md` and the Markdown content pages paragraph of `CLAUDE.md` say where pages
go and what stays at the root.
