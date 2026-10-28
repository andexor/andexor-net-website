# Research: Escape Closes the Cookiebot Dialog

## Decision 1: Click Cookiebot's Close button, do not call its API

**Decision**: the handler clicks `#CybotCookiebotBannerCloseButton`.

**Rationale**: the spec requires the same result as the Close button (FR-001). Clicking the button runs Cookiebot's own
code for that, including the saved choice and the focus handling, so nothing about its behavior is copied into the site.

**Alternatives considered**: calling `Cookiebot.submitCustomConsent` or `Cookiebot.hide()`: would copy Cookiebot's
decision about what "close" saves, and could drift from the button. Rejected.

## Decision 2: One document listener in the root layout

**Decision**: a render-nothing client component in the layout. It waits for Cookiebot's dialog-display event, then
listens on `document` only until the dialog closes: Close button clicked (including by Escape), or an action button used (owner decision, 2026-10-28).

**Rationale**: the dialog is added by Cookiebot's script outside React, so React props and refs cannot reach it. The
document listener works wherever focus is (FR-003), on every page (FR-002), and does not touch the page markup, so it
cannot disturb hydration (spec 082).

**Alternatives considered**: a script added by the post-build formatter: more moving parts, and it would be one more
inline script. A `MutationObserver` on the dialog: kept as the fallback if the display event does not fire (see plan, Risks).

## Decision 3: Ignore handled and composing key presses, as the popup does

**Decision**: the handler ignores events already prevented or composing, and prevents the default when it closes the
dialog.

**Rationale**: matches the Contact Us popup (spec 015) and the owner's code. The popup and the dialog are never open
together, so no ordering between them is designed.

## Decision 4: Test with a stand-in dialog

**Decision**: the e2e test adds elements with Cookiebot's ids instead of loading Cookiebot.

**Rationale**: the test fixture stubs Cookiebot (spec 076), because it refuses `localhost` outside ports 3000 and 8787.
The behavior under test is ours (when to click), not Cookiebot's.

**Source of the selectors**: the dialog is `#CybotCookiebotDialog`. The owner's supplied code looked for
`#CybotCookiebotBannerCloseButton`, but the live dialog has no such id: the visible Close button is a `<button>` with
the class `CybotCookiebotBannerCloseButton` and `aria-label="Close banner"`, and the id `CybotCookiebotBannerCloseButtonE2E`
belongs to a hidden copy. Found by inspecting the dialog on `localhost:3000` on 2026-10-28.
