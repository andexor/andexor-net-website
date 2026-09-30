# Quickstart: Validate the Footer "Contact Us"

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free.

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes contact-provider.test.tsx
bun run test:e2e    # includes footer-contact.spec.ts, contact-flow.spec.ts, six projects
```

Expected: all pass.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000 and scroll to the footer.
2. The Company column reads "About Us" and "Contact Us". Hover "Contact Us": the color changes, with no
   underline.
3. Click it: the same Contact Us popup opens as from the hero button. The address bar does not change.
4. Fill the form and send it: the "Request received" confirmation shows. Click "Done".
5. Tab to the footer's "Contact Us", press Enter to open the popup, close it with the close button:
   focus is back on the footer entry.
6. Repeat steps 3 and 5 on `/web-development` and on a made-up address such as `/nope`.
7. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
