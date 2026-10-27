# Tasks: Cookiebot Automatic Blocking

**Input**: `/specs/082-cookiebot-automatic-blocking/spec.md`. As built, written after the work.

**Tests**: behavior tests only. No wording, count, or style tests.

- [x] T001 In `scripts/format-html.ts`, add `data-blockingmode="auto"` to `COOKIEBOT_SCRIPT`.
- [x] T002 In `tests/e2e/cookiebot.spec.ts`, expect `data-blockingmode="auto"` instead of its absence.
- [x] T003 Delete `scripts/combine-scripts.ts` and `tests/unit/combine-scripts.test.ts`. In `scripts/format-site.ts`,
  remove the import, the `dataFiles` map, and the loop that wrote data files; `formatPage` formats the page only.
- [x] T004 Remove the `built-data-js` group from `scripts/site-files.ts` and from `site-files.test.ts`,
  `straight-quotes.test.ts`, and `formatting.test.ts`.
- [x] T005 In `tests/unit/build-output.test.ts`, replace the data-file test with one that fails if a page refers to
  `/_next/static/data/` or the folder exists.
- [x] T006 Update `CLAUDE.md` (Formatting rules) and add the retirement note to `specs/041-combine-page-scripts/spec.md`;
  add update notes to `specs/076-cookiebot/spec.md` and `research.md`.
- [x] T007 Run `bun run build`, `bun run test`, and `bun run format:check`. Test fresh-visitor loads on `localhost:3000`
  and `localhost:8787`.
- [ ] T008 Fix `/privacy-policy` in automatic mode (spec.md, Open problem): add the Cookie Declaration script from the
  browser after hydration instead of in the page HTML, then test fresh-visitor loads.
