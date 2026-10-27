# Feature Specification: Cookiebot Automatic Blocking

**Feature Branch**: `91-cookiebot-automatic-blocking`

**Created**: 2026-10-27

**Status**: Implemented. The Privacy Policy page problem is fixed (see Open problem, fixed).

**Input**: User description: "For Cookiebot, I know we tried auto mode before and it didn't work. I want to try it again.
Edit the Cookiebot script to add data-blockingmode="auto"." Then: "It looks like the big blocker was the build script
that combines script blocks. Make a note in the specs that we don't need that anymore, since it interferes with
Cookiebot." And: "Clean it up. Remove the unused combine-scripts and its tests and update CLAUDE.md."

Follows spec 076 (Cookiebot, which dropped automatic mode after launch) and retires spec 041 (combine page scripts).

## Why

Production serves a Cloudflare script that Cookiebot has to know about. In manual mode each such script has to be marked
by hand. In automatic mode Cookiebot finds scripts itself, so the owner wants it back on.

## What the code did

- The Cookiebot element had no `data-blockingmode`, so Cookiebot ran in manual mode (spec 076, Changes after launch).
- The build moved the framework's data scripts into `out/_next/static/data/<hash>.js` (spec 041).

## Findings

- With automatic mode and the external data script, a first-time visitor often saw a blank page. Cookiebot handles
  external scripts after the document has been parsed. By then the framework has closed its data stream, so React starts
  with no page data ("Connection closed"), then removes the page content. The font script's class on `<html>` is lost
  with it, so `body { visibility: hidden }` stays and the page looks blank. React error #418 follows in the console.
- With the data scripts left inline, as Next.js writes them, the home page, a content page, and the 404 page loaded in
  every fresh-visitor test, on `server.ts` (`localhost:3000`) and on `bun run preview` (`localhost:8787`).
- A build with no post-build formatter at all (plain `next build` plus the Cookiebot element) also loaded, so the
  formatter's own scripts (whitespace and focus) are not the blocker.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cookiebot runs in automatic mode (Priority: P1)

The owner views the source of any built page and finds the Cookiebot element first in `<head>`, with
`data-blockingmode="auto"`. A first-time visitor sees the page and the banner.

**Acceptance Scenarios**:

1. **Given** a built page, **When** the owner reads its source, **Then** the Cookiebot element is the first element in
   `<head>`, once, with `id`, `src`, `data-cbid`, `data-blockingmode="auto"`, and `type="text/javascript"`, and without
   `async` or `defer`.
2. **Given** a visitor with no saved choice, **When** they load `/`, a content page, or a missing address, **Then** the
   page is visible and works and the Cookiebot banner appears, with no React error #418.

### User Story 2 - The data scripts stay inline (Priority: P1)

**Acceptance Scenarios**:

1. **Given** the built site, **Then** each page keeps the framework's data in inline scripts, no page refers to
   `/_next/static/data/`, and `out/_next/static/data/` does not exist.

## Requirements *(mandatory)*

- **FR-001**: The Cookiebot element MUST be `<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
  data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd" data-blockingmode="auto" type="text/javascript"></script>`, first in
  `<head>` on every page.
- **FR-002**: The build MUST NOT combine the framework's data scripts or move them to an external file.
  `scripts/combine-scripts.ts`, its tests, and the `built-data-js` file group are removed.
- **FR-003**: `CLAUDE.md` and spec 041 MUST say the combine step is retired and why.
- **FR-004**: A test MUST fail if a built page refers to `/_next/static/data/`.
- **FR-005**: The Cookie Declaration script element MUST NOT be in the page HTML. The marker in
  `content/privacy-policy.md` produces the empty slot, and the browser adds the script after hydration.
- **FR-006**: A test MUST fail if `/privacy-policy` has the script element in its HTML, lacks the slot, or throws a
  hydration error on load.
- **FR-007**: Each built page MUST include `COOKIEBOT_DIALOG_SCRIPT` in `<head>`, after the Cookiebot, whitespace, and
  focus scripts, so Cookiebot's dialog elements end up at the end of `<body>` and never in front of the page's own first
  element. A unit test covers its behavior.

## Open problem, fixed

`/privacy-policy` rendered blank for a first-time visitor in automatic mode, with React error #418 in the console. It
happens only when the Cookiebot cookie is not set yet (only then does Cookiebot add its dialog), and it showed on this
page because the page is large, so hydration starts late. There were two causes, and both had to be fixed. Testing the
built page with only one fixed failed 8 of 8 loads.

**Cause 1: Cookiebot's dialog goes in front of the page's first element.** Next.js puts a hidden `<div hidden>` first in
`<body>` for the page's metadata (every page has it). Cookiebot adds its dialog and the dialog's underlay, two `<div>`
elements, at the start of `<body>`. If that happens before React hydrates, React matches Cookiebot's first `<div>` to the
metadata `<div>`, finds no `hidden` attribute, and throws #418. React then rebuilds the page, which drops the class on
`<html>` that the font script added, and `body { visibility: hidden }` stays, so the page looks blank.
The full message came from running `next dev` behind a small proxy that put the Cookiebot element first in `<head>`:
`<div> + hidden={true} - hidden={null}`, and a log of `<body>`'s children at that moment showed the two Cookiebot
elements first, then `DIV[hidden]`, then `DIV#top`. Next.js 15.5 offers no build setting to remove the metadata `<div>`
from a static export.

- **Fix**: a small inline script, `COOKIEBOT_DIALOG_SCRIPT` in `scripts/format-html.ts`, added to `<head>` after the focus
  script. It watches `<body>` and moves Cookiebot's elements (ids starting `CybotCookiebot`) to the end of `<body>` as
  soon as they are added, before React runs. It moves only a run of Cookiebot elements that leads the body, so two of them
  never move each other. (A first version without that check made two elements move each other forever and froze the
  tab.)

**Cause 2: the Cookie Declaration script in the page HTML.** The page had
`<script id="CookieDeclaration" src=".../cd.js" async>` inside the article. Cookiebot's `cd.js` writes the declaration
into the page beside its own element, and that can happen before React hydrates the page, so React finds a different
article than the server sent.

- **Fix**: the page HTML holds an empty slot, `<div id="cookie-declaration-slot" data-src="...cd.js">`, and a small client
  component, `src/components/content/CookieDeclaration.tsx`, adds the script element to the slot after hydration. This is
  the way Cookiebot documents loading the declaration in single-page apps. Cookiebot finds the element by its id,
  `CookieDeclaration`, as before. `data-cookieconsent="ignore"` on the element did not help.

**Checked**: on `localhost:8787` (`bun run preview`) with all cookies cleared before each load, `/privacy-policy`,
`/`, and `/web-development` loaded every time (7 of 7), with the metadata `<div>` first in `<body>` and the dialog last.
The failure itself was reproduced only in `next dev`, where React names the element.

## Success Criteria

- **SC-001**: Fresh-visitor loads of `/`, a content page, and `/nope` hydrate every time in automatic mode.
- **SC-002**: The same for `/privacy-policy`, which also shows the Cookie Declaration.
