# Quickstart: Validate the Logo Wordmark

## Prerequisites

Bun, Docker, and Playwright browsers installed per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bun run test            # unit, includes tests/unit/logo.test.tsx and no-hover-underline
bun run test:e2e        # builds the site and serves out/ in production mode
```

Expected: all pass. The e2e run checks, on `/`, `/web-development`, and a missing URL, that the
header (or hero) and footer show "Andexor Network" on one line, no "Network, Inc." lockup text
exists, the mark is 38px and the wordmark 26px, the lockup fits at 320px and at desktop width, and page titles have no ", Inc.".

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000.
2. Home page: hero shows the mark and "Andexor Network"; footer shows the lockup on one line.
3. Open `/web-development` and `/nope`: header and footer show the same single-line wordmark.
4. Shrink the window to 320px wide: no horizontal scroll, lockup on one line.
5. Hover the header logo: color changes, no underline.
6. Check the browser tab titles: "Andexor Network", "Web Development | Andexor Network".
7. Press `^C` once in the terminal: the container logs its shutdown and stops.
   `docker ps -a` shows no leftover container.
