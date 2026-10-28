# Quickstart: Remove the Title Suffix

1. `bun run build`, then check built pages: `grep -l "| Andexor Network</title>" out -r` prints nothing, and
   `grep -o "<title>[^<]*" out/web-development.html` shows only the page title.
2. `bun run test:e2e -- page-metadata not-found-style` passes (port 3000 must be free).
3. Open the home page, a content page, and a made-up address; each tab title is the bare headline.
4. Grep the changed files for curly quotes and for " | Andexor Network" in `src/`, `tests/`, and `content/README.md`;
   nothing is found.
