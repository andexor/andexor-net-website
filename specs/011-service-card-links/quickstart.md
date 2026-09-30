# Quickstart: Validate Service Card Links

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes content-links.test.tsx and services.test.tsx
bun run test:e2e    # includes homepage-content.spec.ts, six projects
```

Expected: all pass.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000.
2. In "Four disciplines, all in one place", click each card. Technical SEO, Agentic Systems,
   Growth Marketing, and Web Development each open the page with the matching heading.
3. Hover a card: the existing hover shows, with no underline.
4. Tab to a card and press Enter: the page opens.
5. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
