# Quickstart: Validate the Gold Popup Logo

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes the header-logo test and the "two places" test
bun run test:e2e    # includes contact-popup-logo.spec.ts, six projects
```

Expected: all pass.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000 and click the hero "Contact Us" button.
2. In the popup header, the logo is the gold mark with no blue box behind it, beside the "Contact Us"
   title. It reads clearly over the header's faint gold glow.
3. Send the form. On "Request received" the header shows the same gold logo.
4. Open the popup from the footer on `/web-development`: the same logo.
5. Compare the header layout with before: the title is in the same place and the header is the same height.
6. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
