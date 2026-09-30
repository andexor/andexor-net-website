# Quickstart: Validate No Link Underlines

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes the stylesheet no-underline check
bun run test:e2e    # includes link-style.spec.ts and the axe specs, all six projects
```

Expected: all pass. The axe spec on `/nope` is the one that failed when the underline was removed
without the color change.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000/nope.
2. "Go to the home page" has no underline and is blue. Hover it: it turns lighter blue.
3. Open `/web-development`: no underlined links; card text is bright white-gray.
4. Open `/`: the footer links look exactly as before.
5. Tab to a link: the gold focus ring appears.
6. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
