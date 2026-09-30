# Quickstart: Validate "Business Services" Capitalization

## Prerequisites

Bun, Docker, and Playwright browsers per `setup.md`. Port 3000 free. Spec 012 built first (or in the
same pass).

## Automated

```bash
bun run lint
bunx tsc --noEmit
bun run test        # includes the new group-heading test
bun run test:e2e
grep -rIn "Business services" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=.git --exclude-dir=test-results \
  --exclude-dir=012-technical-services-caps --exclude-dir=013-business-services-caps .
```

Expected: everything passes, and the `grep` prints nothing.

## Manual

1. `./build.sh && ./run.sh`, open http://localhost:3000 and click "Contact Us".
2. Open "Primary need". The group headings read "Technical Services" and "Business Services", and
   the options under them are as before.
3. `^C` once: the container logs shutdown; `docker ps -a` shows no leftover container.
