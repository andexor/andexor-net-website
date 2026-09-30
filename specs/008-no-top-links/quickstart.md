# Quickstart: Validate No Links to "#top"

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes tests/unit/no-top-links.test.ts and logo.test.tsx
bun run test:e2e    # includes tests/e2e/no-top-links.spec.ts, six projects
```

Expected: all pass.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000.
2. Scroll to the footer. Hover the logo: no pointer cursor, no color change. Click it: nothing
   happens and the page does not scroll.
3. Press Tab repeatedly through the footer: focus never lands on the logo.
4. Open `/web-development`: the header logo still goes to the home page; the footer logo is plain.
5. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
