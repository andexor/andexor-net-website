# Quickstart: Overwrite License Report

1. `./setup.sh`: the script ends without "Copyleft license found", and `grep -n -E '^20[0-9]{2}-'
   reports/license-report.md` prints one line, dated now. (`node_modules` already matches the lockfile; if that is
   ever in doubt, delete it and run `bun install --frozen-lockfile` first, since `bun install` and `bun update` do not
   remove packages the lockfile has dropped.)
2. `./setup.sh` a second time: the report still has one date line, newer than the first.
3. `grep -n -i 'append' .specify/memory/constitution.md CLAUDE.md CONTRIBUTING.md setup.md`: no hit says the report is
   append-only or must not be overwritten. `grep -n 'Version' .specify/memory/constitution.md | tail -1` shows 1.7.0
   and Last Amended 2026-10-11.
4. `bun run test`, `bun run lint`, and `bun run format:check` are clean, with no new test added. The e2e suite is not
   affected and need not run.
