# Research: Submit the Contact Us Form

## Where the request is made

- **Decision**: In the browser, from `ContactPopup`, through a small module `src/lib/contact-service.ts`.
- **Rationale**: The site is a static export with no server code (constitution), and the service lives in another
  repository, so the browser is the only place the site can send from. A module keeps the address, the format, and
  the limit in one file that the unit test and the Playwright fixture both import, so tests cannot drift from the
  code.
- **Alternatives**: a proxy in `server.ts` or a Worker route (adds server code and would differ between local and
  production); posting the form natively with `action`/`method` (leaves the page, loses the confirmation screen).

## How the popup reaches the module

- **Decision**: Keep the `onSubmit` prop, change its type to return a promise, and default it to
  `sendContactRequest`.
- **Rationale**: Spec 001's UI contract named `onSubmit` as the seam for a later backend. Using it keeps the popup
  testable with a plain function and the provider untouched. A default avoids wiring in the provider for the one
  real caller.
- **Alternatives**: call `fetch` inside the popup and stub `fetch` in every popup test (more test setup, and the
  request format would be tested through the popup instead of the module); a React context for the service
  (needless indirection).

## Request format

- **Decision**: `POST`, `Content-Type: application/json`, body with the six `ContactRequest` fields as they are
  named in the site (`name`, `email`, `phone`, `website`, `help`, `sourcePath`), all strings, empty strings for
  blank optional fields; `credentials: "omit"`.
- **Rationale**: JSON is what a web service expects and what the service's CORS answer allows (`Content-Type` is
  the one allowed header). Sending every field keeps the service's view uniform (spec edge case). No cookies are
  needed, so omitting credentials keeps the service's CORS answer simple (no `Allow-Credentials`, no per-origin
  echo needed for credentials).
- **Alternatives**: `application/x-www-form-urlencoded` (a "simple" request that skips the preflight, but the
  service already answers the preflight, and JSON is easier for the service to validate);
  `multipart/form-data` (nothing to upload).
- **Open point for the owner**: the field names are the site's. If the service expects other names, the contract
  document is the place to change them before implementation; see `contracts/contact-service.md`.

## Success and failure

- **Decision**: Only status 200 is success; the answer body is ignored. Any other status, a `fetch` rejection
  (network down, CORS refused), or no answer within 10 seconds is a failure.
- **Rationale**: The owner said 200. Reading nothing from the body means the service can change its answer freely.
  Ten seconds matches spec 001 SC-003.
- **Alternatives**: any 2xx (the owner was specific); reading a JSON `ok` flag (couples the site to the body).

## The 10-second limit

- **Decision**: An `AbortController` aborted from `setTimeout`, cleared in `finally`, combined with the popup's own
  controller (close aborts too).
- **Rationale**: `AbortSignal.timeout()` and `AbortSignal.any()` are recent and jsdom's `AbortSignal` lacks them in
  some versions, so the unit test would need shims. A controller and a timer work everywhere and are five lines.
- **Alternatives**: `AbortSignal.timeout(10_000)` (cleaner, less portable in tests); `Promise.race` with a timer
  (leaves the request running).

## Seeing the button come back up

- **Decision**: Before disabling Send and sending, wait until the submit button no longer matches `:active` and no
  activation key is held, then one more animation frame.
- **Rationale**: `:active` is the browser's own pressed state and is what the pressed rule in `marketing.css` keys
  on, so asking the button whether it still matches `:active` is the direct question. For a mouse or touch, `click`
  fires after release, so the wait is usually just the one frame that paints the unpressed state. For the keyboard,
  Chrome fires `click` on Enter keydown, so `submit` can run while Enter is still held; a keydown/keyup listener on
  the panel tracks Enter and Space so the wait ends on keyup. The extra frame guarantees the unpressed state has
  been painted while the form is still on screen, which is what the owner asked to see. Disabling Send only after
  this wait keeps the button in its normal look during it; a ref blocks a second activation meanwhile, so spec 001
  FR-023's no-duplicate rule still holds.
- **Alternatives**: a fixed delay (arbitrary, and still wrong for a held key); `setTimeout(0)` (no paint
  guarantee); listening for `pointerup`/`keyup` only (misses the paint); disabling at once and delaying only the
  request (the disabled look at 50% opacity would replace the normal look before the visitor sees the release).
- **jsdom**: vitest's jsdom runs with `pretendToBeVisual`, so `requestAnimationFrame` exists; `:active` never
  matches there, so unit tests see the wait as "a frame later", which is what the release-before-send test asserts.

## A late answer after close

- **Decision**: The popup aborts the in-flight controller when it closes or unmounts, and a settled send checks
  the controller before touching state.
- **Rationale**: Spec FR-008. The popup component stays mounted and renders null when closed, so state set by a late
  promise would survive to the next open. Aborting makes the `fetch` reject at once and the guard covers custom
  `onSubmit` functions that ignore the signal.
- **Alternatives**: a generation counter alone (works, but leaves the request running); unmounting the popup
  component on close (changes spec 014's provider structure for no gain).

## The failure message

- **Decision**: A `role="alert"` paragraph above Send, reusing the form note's class, shown only after a failure
  and removed when a new send starts, on close, and on reopen.
- **Rationale**: `role="alert"` is announced without moving focus, so the Tab trap and spec 036 focus behavior are
  untouched. Reusing the note style adds no color (spec assumption, constitution IV and VI).
- **Alternatives**: `aria-live="polite"` (an error warrants assertive); focusing the message (moves focus away from
  the form for no gain); a toast outside the panel (outside the dialog and the inert boundary).

## Testing without the service

- **Decision**: A Playwright route for the exact `CONTACT_SERVICE_URL` in the shared fixture, answering 200 and
  recording bodies, with per-test overrides; unit tests use promises and a stubbed `fetch`.
- **Rationale**: Thirteen existing e2e files press Send; one fixture covers them all, the same way
  `stubCookiebot` does. Playwright applies the most recently registered route first, so a test can answer 500 or
  delay without touching the fixture. No test ever reaches the live service, which would create real contact
  requests.
- **Alternatives**: a mock server on another port (more moving parts); an environment variable that points the
  site at a test address (a second address to keep straight, and the spec wants the one fully-qualified URL).

## CORS

- Checked on 2026-10-28 with preflight requests: the service answers `OPTIONS` with 204,
  `Access-Control-Allow-Origin` echoing `http://localhost:3000`, `http://localhost:8787`, and
  `https://andexor.net`, `Access-Control-Allow-Methods: POST, OPTIONS`, and
  `Access-Control-Allow-Headers: Content-Type`. The site's request fits inside that: JSON body, no credentials, no
  other headers. The `public/_headers` file sets only caching, and there is no Content-Security-Policy, so nothing
  on the site blocks the call.
