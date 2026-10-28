# Feature Specification: Preconnect to the Cookiebot CDN

**Feature Branch**: `100-preconnect-cookiebot`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Add a preconnect hint for https://consentcdn.cookiebot.com. Lighthouse estimates this will reduce LCP time by 100ms. Create an issue and branch."

Builds on specs 076 and 082, which added the Cookiebot consent script and its automatic blocking mode.

## What the site does today

- Every page loads the Cookiebot consent script first in its head (spec 076). That script then fetches the consent banner's configuration and files from a second Cookiebot address, `https://consentcdn.cookiebot.com`.
- The browser does not open its connection to that second address until the consent script asks for something from it. The connection setup (name lookup, connection, and secure handshake) happens late, on the way to showing the banner and the page.
- Lighthouse reports this as a missed opportunity and estimates that connecting early would cut the Largest Contentful Paint (LCP) time by about 100 ms.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Faster first view of the page (Priority: P1)

A visitor opens any page of the site and sees its main content sooner, because the browser starts connecting to the Cookiebot consent CDN while it is still reading the page head.

**Why this priority**: This is the whole change, and speed of the first view is the reason for it.

**Independent Test**: Run a Lighthouse performance audit on the home page and a content page before and after the change, and compare the LCP time and the "Preconnect to required origins" finding.

**Acceptance Scenarios**:

1. **Given** any built page, **When** its head is read, **Then** it contains a preconnect hint for `https://consentcdn.cookiebot.com`.
2. **Given** a Lighthouse performance audit of the home page, **When** it finishes, **Then** it no longer lists `https://consentcdn.cookiebot.com` under "Preconnect to required origins".
3. **Given** the same audit before and after the change, **When** the LCP times are compared, **Then** the time after is lower by roughly the 100 ms Lighthouse estimated (allowing for run-to-run noise).
4. **Given** a visitor who has already answered the consent banner, **When** a page loads, **Then** the banner, its answer buttons, and the footer's cookie links behave exactly as before.

### Edge Cases

- The Page not found page and the Privacy Policy page get the same hint as every other page.
- A visitor whose browser ignores preconnect hints sees the same page as today, only without the speed-up.
- The hint must not slow the Cookiebot script itself: it stays first in the head, loaded the same way as today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every built page MUST contain a preconnect hint for `https://consentcdn.cookiebot.com` in its head.
- **FR-002**: The hint MUST be marked as a cross-origin connection, so the browser can reuse it for the requests the consent script makes to that address.
- **FR-003**: The hint MUST come before the Cookiebot consent script in the head, so the connection starts as early as possible. The Cookiebot script itself MUST still be the first script, and its attributes MUST NOT change.
- **FR-004**: The change MUST NOT alter what the consent banner does, when it appears, or how the site behaves for a visitor with or without a saved choice. In particular, the page must still hydrate without errors (spec 082).
- **FR-005**: The built page MUST still have the same DOM after formatting as before the formatter's checks (the build fails if not), and no line of built HTML may start with `>`.
- **FR-006**: The site's rules still apply: no link underline at rest, on hover, or on focus, straight quotes only, always dark, and no copy, wording, color, or spacing tests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of built pages, the head contains the preconnect hint for `https://consentcdn.cookiebot.com`.
- **SC-002**: A Lighthouse performance audit of the home page no longer reports a missing preconnect to `https://consentcdn.cookiebot.com`.
- **SC-003**: The home page's LCP time in a Lighthouse audit is lower than before the change, by up to about 100 ms.
- **SC-004**: The consent banner still appears for a first-time visitor and can be answered, and the page shows no console errors.

## Assumptions

- Lighthouse's estimate (about 100 ms) is a lab estimate; real gains vary with the visitor's network, so the success measure is the Lighthouse audit, not a guaranteed number.
- The hint is added only for `https://consentcdn.cookiebot.com`. The other Cookiebot address, `https://consent.cookiebot.com`, serves the script that is already first in the head, so it does not need a hint.
- The hint is added by the same build step that already adds the Cookiebot script to each page's head (spec 076), so every page gets it, including pages added later.
- No new tests are needed for the exact wording of the hint. One behavior check that the built pages contain it is enough, next to the existing build-output checks.
