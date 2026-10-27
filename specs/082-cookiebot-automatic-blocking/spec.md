# Feature Specification: Cookiebot Automatic Blocking

**Feature Branch**: `91-cookiebot-automatic-blocking`

**Created**: 2026-10-27

**Status**: In progress. The Privacy Policy page still fails in automatic mode (see Open problem).

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

## Open problem

`/privacy-policy` renders blank for a first-time visitor in automatic mode, in both the raw `next build` output and the
formatted build. The page has the `<script id="CookieDeclaration">` element (spec 078 and 081) in its HTML. With that
element removed the page loads, and in manual mode it loads. `data-cookieconsent="ignore"` on the element did not help.
The likely fix is to add the Declaration script from the browser after hydration. Until then, automatic mode should not
go to production without a decision on this page.

## Success Criteria

- **SC-001**: Fresh-visitor loads of `/`, a content page, and `/nope` hydrate every time in automatic mode.
- **SC-002**: The same for `/privacy-policy` (open).
