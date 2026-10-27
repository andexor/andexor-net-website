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
- [x] T008 In `src/lib/content.ts`, make the cookie-declaration marker produce
  `<div id="cookie-declaration-slot" data-src="...">` instead of the script element. Add
  `src/components/content/CookieDeclaration.tsx` (client component, adds the script to the slot in an effect) and render
  it in `ContentPage`.
- [x] T009 Update `tests/unit/cookie-declaration-marker.test.ts` and `tests/e2e/cookie-declaration.spec.ts` for the slot
  (no script element in the HTML), and add an e2e case that the script is added after load with no hydration error.
- [x] T010 Update `CLAUDE.md` (Cookie Declaration rule). Test fresh-visitor loads of `/privacy-policy` on
  `localhost:3000`.
- [x] T011 Reproduce the error with the full message: `next dev` on port 3001 behind a scratch proxy on port 3000 that
  puts the Cookiebot element first in `<head>` (Cookiebot only allows ports 3000 and 8787), and log `<body>`'s children
  when React hydrates.
- [x] T012 In `scripts/format-html.ts`, add `COOKIEBOT_DIALOG_SCRIPT` (moves Cookiebot's elements from the start of
  `<body>` to the end), inject it after the focus script, and leave it out when comparing the page's DOM.
- [x] T013 Add `tests/unit/cookiebot-dialog-script.test.ts` (the dialog and its underlay end up last, the page's first
  elements stay first, nothing else moves, no endless moving).
- [x] T014 Update `CLAUDE.md` (Formatting rules) for the dialog script. Test first-visit loads on `localhost:8787`.
