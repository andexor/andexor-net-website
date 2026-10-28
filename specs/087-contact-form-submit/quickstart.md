# Quickstart: Submit the Contact Us Form

Prerequisites: `bun install`, port 3000 free. No test below reaches the live service.

1. `bun run test` passes. `tests/unit/contact-service.test.ts` proves the request shape and the 200/failure/limit
   behavior; `tests/unit/contact-popup.test.tsx` proves release-before-send, waiting for the answer, the failure
   path, retry, reopen, and the ignored late answer.
2. `bun run test:e2e` passes. The fixture answers `https://andexor.net/api/contact` with 200 for every test;
   `tests/e2e/contact-submit.spec.ts` checks the body, the wait for the answer, the failure path, and the held
   Enter key (chromium).
3. `bun run build`, then `bun run format:check` and `bun run lint` pass.
4. By hand, against the live service (this creates a real contact request, so use a recognizable name such as
   "Test, please ignore"): `./build.sh && ./run.sh`, open `http://localhost:3000`, open Contact Us, fill in Name
   and Email, press Send with the mouse and watch the button come back up before "Request received" appears. In
   the browser's network panel there is one `OPTIONS` and one `POST` to `https://andexor.net/api/contact`, the
   `POST` body has the six fields, and the status is 200.
5. Failure path by hand: in the browser's developer tools, block requests to `andexor.net/api/contact` (or go
   offline), press Send: the form stays with the entries, a message says the request could not be sent, Send is
   enabled again, and a screen reader announces the message. Unblock and press Send again: the message goes and
   "Request received" appears.
6. Keyboard: Tab to Send, hold Enter for a second, then release: the request is sent on release (network panel), not
   while held. Hold Space and release: the same.
7. Close while sending: throttle the network to slow 3G, press Send, press Esc while the request is pending, open the
   popup again: the empty form shows and no confirmation appears later.
8. Accessibility: `tests/e2e/contact-popup-a11y.spec.ts` still passes (no new axe violations with the message shown
   is covered by the failure test in `contact-submit.spec.ts`).
