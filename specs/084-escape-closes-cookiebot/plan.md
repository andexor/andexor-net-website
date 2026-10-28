# Implementation Plan: Escape Closes the Cookiebot Dialog

**Branch**: `96-escape-from-cookiebot-dialog` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/084-escape-closes-cookiebot/spec.md`

## Summary

Add one small client component, `CookiebotEscape`, rendered once in the root layout. It listens for Escape on the
document and, while Cookiebot's dialog is showing, clicks Cookiebot's own Close button, so the result is exactly what
the Close button gives. It is based on the code the owner supplied, with the input-method check the Contact Us popup
already has (spec 015). The key listener exists only while the dialog is showing (FR-005): it is added when Cookiebot
reports the dialog displayed and removed when the dialog closes. The two popups are never open together, so no
ordering between them is designed. One new e2e test file checks the behavior against a stand-in dialog.

## Technical Context

**Language/Version**: TypeScript / React (Next.js static export)

**Primary Dependencies**: none added; Cookiebot's dialog and Close button are already on the page (specs 076, 081, 082)

**Storage**: N/A (Cookiebot saves the choice itself when its Close button is clicked)

**Testing**: Playwright e2e. Cookiebot is stubbed in the tests (`fixtures.ts`), so the test adds a stand-in dialog and
Close button with Cookiebot's element ids. No unit test: there is no logic outside the browser.

**Target Platform**: Cloudflare Workers static assets; local Docker via `server.ts`

**Project Type**: Static web site

**Constraints**: the component renders nothing, so it adds nothing to the built HTML and cannot cause a hydration
difference (spec 082 concerns); no `#top` links; no link underlines; straight quotes; license header; formatting rules in
CLAUDE.md; no tests for copy, colors, or spacing

**Scale/Scope**: one new component, one line in the layout, one new test file

## Constitution Check

- Static export, Bun, no server code: pass. The listener runs in the browser.
- Markdown content pages: not touched.
- No `#top` links, no link underlines, always dark, straight quotes: pass; no markup or styles change.
- Graceful shutdown: not affected.
- License header: on the new `.tsx` and the new test file.
- Tests for behavior only: pass; the tests check what Escape does, not wording.
- Spec first, issue-driven: this spec; the issue is #96.

## Project Structure

### Documentation (this feature)

```text
specs/084-escape-closes-cookiebot/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
└── checklists/requirements.md
```

No data model or contracts: no data, and the only interface is Cookiebot's own dialog.

### Source Code (repository root)

```text
src/components/marketing/CookiebotEscape.tsx   # new: document keydown listener, renders null
src/app/layout.tsx                             # renders <CookiebotEscape /> before <ContactProvider>
tests/e2e/cookiebot-escape.spec.ts             # new: behavior tests with a stand-in dialog
```

## Design

1. **Component.** `CookiebotEscape` is a `"use client"` component that returns `null`. One `useEffect` listens on
   `window` for Cookiebot's `CookiebotOnDialogDisplay` event. If the dialog is already showing when the effect runs
   (Cookiebot loaded first), it starts at once.
2. **Listener lifetime.** On display, it adds a `keydown` listener to `document`. It removes the listener when the
   Close button is clicked (by the visitor or by the handler, so Escape needs no separate removal), when Cookiebot
   reports `CookiebotOnAccept` or `CookiebotOnDecline` (the visitor used an action button), and on cleanup. The Close
   click is seen by a capturing `click` listener on `document`, added and removed with the key listener, that checks
   whether the target is inside `.CybotCookiebotBannerCloseButton`. Renewing the banner from the footer displays the dialog again and adds it again.
3. **Handler.** It ignores the event unless `key` is `Escape`, and ignores it when `defaultPrevented` or `isComposing` is
   set. It finds `#CybotCookiebotDialog`; if it is missing or its computed `display` is `none`, it removes itself and
   returns. Otherwise it finds the visible `.CybotCookiebotBannerCloseButton` inside the dialog (a button with that class and no id; the
   element with the id `CybotCookiebotBannerCloseButtonE2E` is a hidden copy); if present, it calls `preventDefault()`
   and then `click()` on it; that click removes the listeners as above.
4. **Held key.** The listener is gone after the first press, so repeats do nothing.
5. **Tests** (`cookiebot-escape.spec.ts`). Each test adds a stand-in `#CybotCookiebotDialog` with a
   `.CybotCookiebotBannerCloseButton` whose click hides the dialog and counts the click:
   - Escape with the dialog showing clicks Close once and the dialog is hidden; with focus on the page, on the
     dialog's Close button, and on a link behind it.
   - Escape before the dialog is displayed, or after it is closed (by Escape or by a button), clicks nothing, and the
     page is unchanged.
   - Clicking the Close button with the mouse, then displaying nothing: Escape clicks nothing. Same after an action
     button.
   - Displaying the dialog again (the footer link) makes Escape work again.
   - Escape while an input method is composing (a dispatched `keydown` with `isComposing`) clicks nothing.

## Risks

- The dialog id and the Close button class come from Cookiebot, not from this site. If Cookiebot renames them, Escape
  silently stops working and the stand-in test still passes. Checked against the real dialog on 2026-10-28: the first
  version, which looked for `#CybotCookiebotBannerCloseButton` (from the supplied code), found nothing. The quickstart checks it against the real Cookiebot, and `research.md` records where
  the ids were taken from.
- The event names come from Cookiebot. `CookiebotOnDialogDisplay` was confirmed to fire when the banner is reopened
  with `renew()`; the quickstart checks the first visit and the footer links.
- Cookiebot only runs on ports 3000 and 8787 (spec 082), so the real-dialog check is manual.
- If the real Close button does not exist in some dialog layouts (for example the expanded Details view), Escape does
  nothing there. The spec ties Escape to the Close button, so that is accepted; the quickstart looks for it.
