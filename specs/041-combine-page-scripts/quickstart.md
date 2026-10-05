# Quickstart: Validate Combine Page Scripts

Prerequisites: Bun and Docker per `setup.md`; port 3000 free.

## 1. Tests

```bash
bun run format:check
bun run lint
bun run test
bun run test:e2e --project=chromium
```

Expected: all pass.

## 2. See the page source

```bash
bun run build
tail -12 out/index.html
ls out/_next/static/data
head -20 out/_next/static/data/*.js
```

Expected: the end of the page has one script element with an address, and no inline data scripts. `out/_next/static/data`
holds one file per page, formatted.

## 3. Try it in a browser

```bash
bun run server.ts
```

Open `http://localhost:3000`, click Contact Us (the popup opens), then follow a service card link (the page changes
without a full reload). The browser console shows no errors.

## 4. Prove the data check

Temporarily edit `scripts/combine-scripts.ts` to drop one piece of the data, run `bun run build`, and see the build stop
naming the page. Revert the edit.

## 5. Docker

`./build.sh`, `./run.sh`, load the home page, one `Ctrl+C`: the shutdown line appears and `docker ps -a` shows no
leftover container (Principle VII).
