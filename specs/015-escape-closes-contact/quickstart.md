# Quickstart: Validate Esc Closes the Contact Us Popup

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes the Esc cases in contact-popup.test.tsx
bun run test:e2e    # includes contact-escape.spec.ts, six projects
```

Expected: all pass. The real-dropdown test runs in Chromium only.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000.
2. Tab to the hero "Contact Us" button and press Enter. Without touching anything else, press Esc: the
   popup closes.
3. Open it again and type in "Full name". Press Esc: it closes. Open it again: the form is empty.
4. Fill the form and send it. On "Request received", press Esc: it closes.
5. Press Esc with the popup closed: nothing happens.
6. Open the popup, click the "Primary need" list so it drops down, and press Esc: only the list
   closes. Press Esc again: the popup closes. The Chromium e2e test covers this. Trying it by hand in
   Firefox and Safari is optional and low priority.
7. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
