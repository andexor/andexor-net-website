# Quickstart: Validate Grid and Flexbox Card Columns

Prerequisites: Bun and Docker per `setup.md`; port 3000 free.

## 1. Tests

```bash
bun run format:check
bun run lint
bun run test
bun run test:e2e --project=chromium
```

Expected: all pass, including the new unit tests for the marks and `card-grid.spec.ts`.

## 2. See it

```bash
bun run build
bun run server.ts
```

Open `http://localhost:3000/web-development` at about 1280 px wide:

- Nine cards stack on the left and eight on the right, each in written order.
- Techno Bits is below both columns, full width, with its list in two columns.
- The gap between the columns and between cards is 24px, as before.

Narrow the window below 860 px: one column, in written order.

## 3. Try the marks

Copy a card page to `content/try.md`, then:

- add a second `||` in one row: the build stops, naming `content/try.md`;
- put `||` directly under a paragraph with no blank line: the build stops, naming the file;
- put `||` as the last line: the right half stays empty.

Delete `content/try.md` afterward.

## 4. Docker

`./build.sh`, `./run.sh`, check the page, then one `Ctrl+C`: the shutdown line appears and `docker ps -a` shows no
leftover container (Principle VII).
