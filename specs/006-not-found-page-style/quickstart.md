# Quickstart: Validate the Not-Found Page Style

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes tests/unit/not-found.test.tsx
bun run test:e2e    # includes tests/e2e/not-found-style.spec.ts and the axe specs, six projects
```

Expected: all pass. The e2e spec checks `/nope` at 320px, 768px, and 1280px for the image, the
headline, the link, no cards, no eyebrow, no grid, no horizontal scroll, and that `/web-development`
still has its grid, eyebrow, and cards.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000/nope.
2. The address bar still says `/nope` (the page does not redirect). Dark hero with the gold 404 laptop beside "Page not found" and the sentence with a link home.
   No card, no small label, no grid pattern.
3. Hover the link: lighter blue, no underline. Tab to it: gold focus ring.
4. Resize to 320px: image above the text, nothing scrolls sideways.
5. Open `/web-development`: looks exactly as before.
6. Press `^C` once: the container logs shutdown and stops; `docker ps -a` shows no leftover.
