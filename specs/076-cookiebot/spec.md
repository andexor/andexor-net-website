# Feature Specification: Cookiebot

**Feature Branch**: `87-implement-cookiebot`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "Add this CookieBot script as the first element under the <head> on all pages.
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd"
data-blockingmode="auto" type="text/javascript"></script>"

Applies to every page the site builds: the home page, the Markdown content pages (spec 002), and the 404 page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors are asked for cookie consent (Priority: P1)

A visitor opens any page of the site and the Cookiebot consent banner loads, so the visitor can accept or decline
cookies before anything that needs consent is set.

**Why this priority**: Consent has to be collected on every page, not only the first one a visitor lands on, and it has
to load first. The site sets no cookies or trackers of its own that need holding back, so Cookiebot runs in its default blocking mode, manual, and leaves the site's own scripts alone.

**Independent Test**: Run `bun run build`, serve `out/`, and open the home page, a content page, and a missing address.
View each page's source.

**Acceptance Scenarios**:

1. **Given** a finished build, **When** the source of any built page is read, **Then** the Cookiebot script element is
   the first element inside `<head>`.
2. **Given** the script element, **When** its attributes are read, **Then** they are exactly `id="Cookiebot"`,
   `src="https://consent.cookiebot.com/uc.js"`, `data-cbid="ba75dc6a-d85e-4740-891e-dd0cc31a62dd"`,
   and `type="text/javascript"`, with no `data-blockingmode` attribute.
3. **Given** a visitor with no saved consent choice, **When** a page loads, **Then** the Cookiebot banner is shown.
4. **Given** a visitor who has made a choice, **When** they open another page, **Then** the banner is not shown again.

---

### User Story 2 - New pages get the script without extra work (Priority: P2)

An owner adds a Markdown page in `content/` and the built page has the script, with nothing to remember or copy.

**Why this priority**: Content pages are added by the owner and must not be able to miss consent collection.

**Independent Test**: Add a page to `content/`, build, and read its source.

**Acceptance Scenarios**:

1. **Given** a new `.md` file in `content/`, **When** the site is built, **Then** the page's `<head>` starts with the
   script element, with no change to the Markdown.

## Edge Cases

- The build adds its own small inline script first in each page's `<head>` (the whitespace script, spec 041 and the
  Formatting rules in `CLAUDE.md`). The Cookiebot script goes before it, so it is the first element.
- The script is blocking and loaded from another site. If it fails to load, the page still renders and works, without
  the banner.
- The Cookiebot script never appears in `<body>` or twice in one page.
- The built-page formatter and the data-script combiner must still pass; the Cookiebot element is not an inline script
  and must be left as it is.
- The Cookiebot script is on every page, so it must not need a link to `#top` or any other change to links.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every built page, including the home page, content pages, and the 404 page, MUST contain the Cookiebot
  script element exactly as given in the input, as the first child of `<head>`.
- **FR-002**: The element MUST keep the attributes and values from the input, except that `data-blockingmode` is left out (see Changes after launch), and MUST NOT be given
  `async` or `defer` (Cookiebot is meant to run first).
- **FR-003**: Pages added in `content/` MUST get the element with no per-page work.
- **FR-004**: The element MUST stay first after the build's formatting and script-combining steps run.
- **FR-005**: A test checks the behavior, not the wording: every built page has the element as the first child of
  `<head>`. It does not check the banner's text or look.

- **FR-006**: Every page MUST hydrate and show its content on every load, whether or not the visitor has a saved consent
  choice, and after the visitor closes the banner with any button, without a reload.

## Changes after launch

The input asked for `data-blockingmode="auto"`. On andexor.net that broke every load where the visitor had no saved
choice: the page stayed unhydrated, and after "Allow All" the screen was blank until reloads. In automatic mode Cookiebot
holds back each script it finds, including the page's external data script (spec 041), until it has its configuration.
The framework closes its data stream when the document finishes loading, so a data script that arrives late throws
"Connection closed" and the page never hydrates. With a saved choice Cookiebot is faster, so it was flaky. Manual mode,
which is the default when the attribute is left out, touches no scripts. Built locally and served as andexor.net, hydration succeeded 0 of 6 loads in automatic mode and
6 of 6 in manual mode. If the site ever adds scripts that set cookies, mark them for Cookiebot by hand
(`type="text/plain" data-cookieconsent="..."`); do not go back to automatic mode without a test on the live domain.

**Update (2026-10-27, spec 082):** automatic mode is back on. The cause above was the external data script, so spec 041
is retired and the data scripts stay inline. FR-002 and the "no `data-blockingmode`" wording in this spec no longer
apply; spec 082 has the current rule. `tests/e2e/cookiebot.spec.ts` now expects `data-blockingmode="auto"`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the site's built pages have the Cookiebot element as the first element in `<head>`.
- **SC-002**: A first-time visitor sees the consent banner on whichever page they open first.
- **SC-003**: A visitor who has made a choice is not asked again on the next page.
- **SC-004**: The home page's load time does not get worse by more than the time Cookiebot's own file takes to load.

## Assumptions

- The Cookiebot account and the domain `andexor.net` are already set up with the given ID, and the banner's text,
  languages, and look are managed in Cookiebot, not in this site.
- The always-dark design is not changed; the banner follows Cookiebot's own settings.
- The site's own Contact Us form and pages set no cookies or trackers that need separate handling in this feature.
- A cookie declaration page (Cookiebot's second script) is out of scope.
- Cookiebot is a third-party service that collects visitor data under its own terms.
