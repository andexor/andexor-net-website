# Quickstart: Validate Straight Quotes Only

Prerequisites: Bun installed per `setup.md`.

## 1. Tests

```bash
bun run format:check
bun run lint
bun run test
```

Expected: all pass, including `tests/unit/straight-quotes.test.ts`.

## 2. See the plain apostrophes

```bash
bun run build
grep -c "We'll" out/index.html
grep -c "&#x27;" out/index.html
```

Expected: the first count is above 0, the second is 0.

## 3. Prove the check

Put a right single quote (type it with your keyboard compose key, or paste one) in a temporary file under `src/`, run
`bun run test`, and see the failure name that file and line. Remove the file afterward.

## 4. The rule files

Open `CLAUDE.md`, `design/DESIGN.md`, `.specify/memory/constitution.md`, and `~/.claude/CLAUDE.md` and find the straight
quotes rule in each; the constitution's version line reads 1.6.0. Confirm
`git diff` shows no change to `CODE_OF_CONDUCT.md` or `CODE_OF_CONDUCT.adoc`.

## 5. Docker

`./build.sh`, `./run.sh`, check the home page source, one `Ctrl+C`: the shutdown line appears and `docker ps -a` shows
no leftover container.
