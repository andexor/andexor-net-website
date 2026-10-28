# Quickstart: Escape Closes the Cookiebot Dialog

Prerequisites: `bun install`; port 3000 free (Cookiebot only allows ports 3000 and 8787, spec 082).

1. `bun run build`, then `bun server.ts`, and open `http://localhost:3000/` with cookies for `localhost` cleared. The
   Cookiebot dialog shows.
2. Press Escape once, with no click first. The dialog closes. In the browser's developer tools, look at the saved
   `CookieConsent` cookie: it matches the one saved by clearing cookies, reloading, and using the Close button instead.
3. Scroll to the footer and use Privacy Settings, then Do Not Sell or Share My Personal Information. Each time, Escape
   closes the dialog. Try with focus on a button inside the dialog.
4. In the dialog's expanded Details view, check whether a Close button exists and whether Escape closes it (see plan,
   Risks).
5. With the dialog closed, press Escape: nothing happens. Open Contact Us and press Escape: it closes. Close the dialog
   with its Close button, then with an action button, each time pressing Escape afterward (nothing happens), and reopen it
   from the footer and press Escape (it closes; the listener was added again).
6. `bun run test:e2e -- cookiebot-escape contact-escape`. Stop the server with Ctrl+C.

Expected: Escape does what the Close button does, and nothing else changes.
