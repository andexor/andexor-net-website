# Quickstart: Validate Footer Page Links

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes content-links.test.tsx
bun run test:e2e    # includes footer-links.spec.ts, six projects
```

Expected: all pass.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000 and scroll to the footer.
2. Click each of Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead Generation,
   Growth Marketing, Process Re-engineering, and About Us. Each opens the page with that heading.
3. Repeat two of them from `/web-development` and from a made-up address such as `/nope`.
4. Hover a footer link: the color changes, with no underline. Click Contact, Privacy, or Terms:
   nothing happens, as before.
5. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
