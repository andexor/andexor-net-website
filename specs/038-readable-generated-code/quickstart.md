# Quickstart: Validate Readable Generated Code

Prerequisites: Bun and Docker installed per `setup.md`. Port 3000 free.

## 1. Source is formatted

```bash
bun run format:check
bun run lint
bun run test
```

Expected: all pass. `format:check` lists no files.

## 2. Build output is readable

```bash
bun run build
head -40 out/index.html
ls out/_next/static/chunks/site-*.js
head -30 out/_next/static/chunks/site-*.js
head -30 out/_next/static/css/*.css
```

Expected: indented HTML at 4 spaces per level with a small script first in `<head>`, a separate unminified `site-*.js`, and a multi-line CSS file.

List the long lines for review (each should be one unbreakable value):

```bash
awk 'length > 120 { print FILENAME ":" FNR ": " length }' out/index.html out/_next/static/chunks/site-*.js out/_next/static/css/*.css
```

## 3. Nothing changed for the visitor

```bash
bun run test:e2e --project=chromium
```

Expected: the existing suite and `readable-output.spec.ts` pass, with no console errors on the home page, a content
page, and the not-found page.

## 4. Docker path

```bash
./build.sh
./run.sh
```

Open `http://localhost:3000`, view source, and confirm the formatted HTML. Press `Ctrl+C` once: the app logs its
shutdown and `docker ps -a` shows no leftover container (Principle VII).

## 5. Enforcement works

Temporarily put a tab in `src/styles/cards.css`, run `bun run test`, and see the failure name the file. Revert it.

## Recorded check: a site change touches only the site chunk (T022)

2026-10-05: changed one sentence in `src/components/marketing/Hero.tsx` and rebuilt. Only
`out/_next/static/chunks/site-<hash>.js` changed name; the framework, main, vendor, and polyfill chunks and the CSS kept
their names. The change was reverted.
