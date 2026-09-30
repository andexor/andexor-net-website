# Quickstart: Validate the Consistent Left Edge

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test
bun run test:e2e     # includes tests/e2e/left-edge.spec.ts
```

Expected: all pass. The new spec fails before the CSS change and passes after it.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000 in a normal (not headless) browser with
   classic scrollbars, for example a desktop browser window about 1365px wide on Windows or Linux.
2. Open the home page, then `/web-development`, then a made-up address such as `/nope`. The header
   logo and the page content stay exactly in the same place on all three.
3. In DevTools, select `.an-content-header__inner` on `/web-development` and on `/nope`: the same
   distance from the left edge on both.
4. Resize the window: the pages stay lined up at every width.
5. Read `design/DESIGN.md` section 4: the rule is there.
6. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
