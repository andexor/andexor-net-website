# Quickstart: Validating Content Pages, Card Template, and Web Development Page

## Prerequisites

Docker, Bun. From the repo root.

## Automated checks

```bash
bun install
bun run lint
bun run test          # unit tests (content routing, front matter, Markdown, cards)
bun run test:e2e      # Playwright (includes dark-mode)
```

## Manual run

```bash
./build.sh && ./run.sh   # http://localhost:3000
```

1. Home page: click the Web Development service card. Expect `/web-development`.
2. Home page: click Web Development in the footer. Expect `/web-development`.
3. Web Development page: H1 reads "Web Development"; nine cards; last two are dark; the logo
   returns to `/`.
4. Resize to 320px: one column, equal-width cards, no horizontal scroll.
5. Set the OS or browser to light mode and reload: page stays dark.
6. Hover over footer, card, and body links: color changes, and no link is underlined at rest, on
   hover, or on focus (amended by spec 007).
7. Visit `/nope`: 404 page in the Web Development hero style with the 404 image; the address
   stays `/nope` (amended by spec 006).
8. Add `content/test.md` with `# Test`; rebuild; `/test` exists. Add `draft: true`; rebuild; 404.
9. In the terminal running `./run.sh`, press `Ctrl+C` once. Expect `Received SIGINT, shutting down`
   and a prompt. `docker ps -a` shows no leftover container.

## Verified results (2026-09-29)

- Graceful shutdown (Constitution VII, SC-005): with `--rm`, one SIGINT gave `Received SIGINT,
  shutting down`, exit 0 in under 1 second, and no leftover container. `docker stop` gave
  `Received SIGTERM, shutting down`, exit 0, and no leftover container.
- `bun run test`: 48 unit tests pass.
- `bun run test:e2e` on Chromium, Firefox, and Pixel 7: 163 passed, 2 skipped, in about 42
  seconds. Playwright now builds the site and serves `out/` with `server.ts` (the same output
  Docker serves), so the real 404 page is covered too.
- WebKit, iPhone, and iPad projects are not verified. WebKit launches, then every page hangs during
  setup (30 second timeout), including existing specs such as `homepage-a11y`. It fails the same
  way under Bun and under Node 24, with and without display variables, and under `xvfb`, and the
  needed system packages are installed. It looks like a Playwright WebKit incompatibility with this
  machine, not a problem with the specs. Run those projects in CI or on another machine.
- Port 3000 must be free before running e2e. Playwright reuses whatever server is already
  listening there, and a leftover `next dev` will make the run use dev mode.
