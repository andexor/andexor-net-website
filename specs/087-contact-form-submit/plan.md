# Implementation Plan: Submit the Contact Us Form

**Branch**: `102-contact-form-submit` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/087-contact-form-submit/spec.md`

## Summary

The Contact Us popup sends each valid submission to `https://andexor.net/api/contact` as a JSON POST and shows
"Request received" only after a 200 answer. A small module, `src/lib/contact-service.ts`, owns the address, the
request format, and a 10-second limit; `ContactPopup` calls it through its existing `onSubmit` seam, which now
means "deliver this request" and returns a promise. Before the request leaves, the popup waits until the Send button
is no longer pressed (mouse, touch, or a held key) and one more frame has been painted, so the visitor sees the
button come back up. A failed send keeps the form, shows a short announced message, and enables Send again. Tests
stand in for the service: unit tests pass an `onSubmit` promise or stub `fetch`, and the Playwright fixture answers
the service address on every test, so no test reaches the live service.

## Technical Context

**Language/Version**: TypeScript, React 19, Next.js 15 static export

**Primary Dependencies**: none added. `fetch`, `AbortController`, and `requestAnimationFrame` are built in.

**Storage**: N/A. The site keeps nothing; the service stores the request.

**Testing**: Vitest + Testing Library (jsdom, which provides `requestAnimationFrame`) for the popup and the service
module; Playwright for the flow, with the service answered by a route in `tests/e2e/fixtures.ts`.

**Target Platform**: Browsers in spec 001 FR-019/FR-020; site on Cloudflare Workers static assets; the service at
`https://andexor.net/api/contact` in a separate repository.

**Project Type**: Static web site calling one external web service from the browser.

**Performance Goals**: Confirmation within 1 second of the 200 answer; the whole send under 3 seconds on a normal
connection (spec SC-002). The release wait adds at most a frame or two after the button is let go.

**Constraints**: static export, no server code or API routes (constitution); no new dependencies; straight quotes;
license headers; Prettier; no copy, color, or spacing tests; always dark; no link underlines; keyboard and focus
behavior of the popup unchanged (specs 015, 036, and the Tab trap).

**Scale/Scope**: one new module, one component change, one fixture change, one CSS rule at most, four test files
touched, two contract documents, documentation lines in CLAUDE.md and spec 001's UI contract.

## Constitution Check

- I. Simplicity: one module and one prop change; no library, no state manager, no retry queue. Pass.
- II. Stack: React/Next.js static export unchanged; the request is made from the browser. Pass.
- III. Accessibility and performance: the failure message is a live region (`role="alert"`); focus behavior is
  untouched; the release wait is one or two frames. Pass.
- IV. Design consistency: the message reuses the form note styling; Send and OK are unchanged. No `#top` links,
  no underlines. Pass.
- V. Tests: behavior only (request sent with the fields, confirmation after 200 only, failure keeps entries and
  enables Send, send happens after release, late answer ignored). No wording, color, or spacing tests; the message
  text is not asserted. Pass.
- VI. Always dark, color-only hover: no new colors or hover styles. Pass.
- VII. Graceful shutdown: `server.ts` untouched. Pass.
- VIII. Markdown content: untouched. Pass.
- Technology constraints: no server-side logic in this repository; the third-party call is justified by the spec
  (it is the owner's own service). Straight quotes, license headers, Prettier. Pass.
- Workflow: issue #102, branch `102-contact-form-submit`, spec written first. Pass.

Re-check after design: no change, still pass. No Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/087-contact-form-submit/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── contact-service.md    # request and answer the service and the site agree on; CORS
│   └── ui-contract.md        # ContactPopup props and states after this feature
├── checklists/requirements.md
└── tasks.md                  # /speckit-tasks
```

### Source Code (repository root)

```text
src/lib/contact-service.ts                  # NEW: CONTACT_SERVICE_URL, CONTACT_TIMEOUT_MS, sendContactRequest()
src/components/contact/ContactPopup.tsx     # onSubmit returns a promise and defaults to sendContactRequest; release
                                            # wait; in-flight guard; failure message; stale-answer guard; abort on close
src/styles/marketing.css                    # at most one rule for the failure message if the note class is not enough
tests/unit/contact-service.test.ts          # NEW: URL, method, JSON body, no credentials; 200 resolves; other
                                            # statuses, network failure, and the 10 s limit reject
tests/unit/contact-popup.test.tsx           # submission awaits onSubmit; release before send; failure path; retry;
                                            # reopen clears; late answer ignored
tests/e2e/fixtures.ts                       # stubContactService(context): answers the service address with 200 and
                                            # records bodies; applied to every test like stubCookiebot
tests/e2e/contact-submit.spec.ts            # NEW: body carries the six fields; confirmation waits for the answer;
                                            # failure keeps entries and enables Send; held Enter delays the send
specs/001-homepage-contact-us/contracts/ui-contracts.md   # pointer to contracts/ui-contract.md
CLAUDE.md                                   # short "Contact service" paragraph
```

## Design

### The service module (`src/lib/contact-service.ts`)

- `export const CONTACT_SERVICE_URL = "https://andexor.net/api/contact"` (spec FR-001, fully qualified).
- `export const CONTACT_TIMEOUT_MS = 10_000` (spec assumption, matches spec 001 SC-003).
- `export async function sendContactRequest(request: ContactRequest, signal?: AbortSignal): Promise<void>`:
  `fetch` with `method: "POST"`, `headers: { "Content-Type": "application/json" }`, `credentials: "omit"`,
  `body: JSON.stringify(request)`, and a signal that is the caller's signal combined with a timer of
  `CONTACT_TIMEOUT_MS` (an `AbortController` aborted from `setTimeout`, cleared in `finally`; not
  `AbortSignal.timeout`, see research). Resolves when `response.status === 200`; otherwise throws
  `new Error(...)` naming the status. A `fetch` rejection (network, CORS, abort) propagates. The body of the answer
  is never read.
- `ContactRequest` moves here from `ContactPopup.tsx` (the popup re-exports it so nothing else changes), because
  the contract belongs with the sender.

### The popup (`src/components/contact/ContactPopup.tsx`)

- Props: `onSubmit?: (request: ContactRequest) => Promise<void> | void`, default `sendContactRequest`. The
  provider passes nothing. Tests pass their own.
- State: `sent`, `submitting` (Send disabled, request in flight), `failed` (message shown). A `busyRef` guards
  from the moment Send is activated until the send settles, so a second activation during the release wait is
  ignored (spec 001 FR-023 with the release wait in front of it). A `controllerRef` holds the in-flight
  `AbortController`.
- `handleSubmit` (async):
  1. `preventDefault()`; if `busyRef.current`, return; set it; read the `FormData` now (the form is still mounted).
  2. `setFailed(false)` (spec FR-006).
  3. `await whenReleased(form)`: resolves once the submit button no longer matches `:active` and no activation
     key (Enter or Space) is held, then after one more `requestAnimationFrame`, so the unpressed state has been
     painted with the form still on screen (spec FR-003).
  4. `setSubmitting(true)` (disabled look; `.an-btn:disabled` already sets `transform: none`, and the pressed rule
     is already `:not(:disabled):active`, so a disabled Send cannot look pressed, spec FR-004).
  5. `const controller = new AbortController()`; `controllerRef.current = controller`;
     `await onSubmit(request)` inside try/catch. The default `onSubmit` is wrapped so it receives
     `controller.signal`; a custom `onSubmit` just gets the request.
  6. If `controller.signal.aborted` (closed while in flight), do nothing (spec FR-008). On success `setSent(true)`.
     On failure `setSubmitting(false); setFailed(true)`. In `finally` clear `busyRef` and `controllerRef`.
- Close: the existing `open` effect, when `open` becomes false, aborts `controllerRef.current`. The existing
  open-reset sets `sent`, `submitting`, and `failed` to false and resets the form (spec FR-007). Unmount aborts too.
- Key tracking for `whenReleased`: a `keydown`/`keyup` listener on the panel records whether Enter or Space is
  down, in a ref, installed by the effect that already runs while `open`. Chrome fires `click` on Enter keydown,
  so the key can still be held when `submit` runs; Space fires on keyup, so it is already released.
- The failure message: `<p role="alert" className="an-contact-form__note an-contact-form__error">` placed directly
  above the Send button, rendered only while `failed`. Text: "We could not send your request. Please try again."
  (not tested). It reuses the note's size, color, and centering; `an-contact-form__error` exists only as a hook
  and gets a rule only if the gap to the button needs one.
- The Tab order is unchanged: the message is not focusable. OK still takes focus on success (spec 036).

### Tests

- Unit, service module: stub `fetch` with `vi.fn()`; assert URL, method, header, `credentials: "omit"`, and the
  parsed body; 200 resolves; 201, 400, 500 reject; a rejected `fetch` rejects; with fake timers, a `fetch` that
  never settles rejects after 10 s with an abort.
- Unit, popup: the existing "calls onSubmit" test becomes async (`findByRole`). New: Send is still enabled and
  `onSubmit` not yet called synchronously after the click, and called after frames pass (release before send);
  with a deferred promise the form and a disabled Send stay until it resolves; a rejected promise keeps the values,
  shows an alert, and enables Send; a second click sends again and removes the alert; closing and reopening removes
  the alert; a promise that resolves after close does not show the confirmation on reopen.
- E2E: `stubContactService` routes the exact service address (repeated as a literal, since e2e files do not import
  site code; the service module's unit test pins the constant to the same literal) to a 200 and is applied in
  the `context` fixture. `contact-submit.spec.ts` overrides it per test with `page.route` (later routes win) for
  the recorded body, a 500, a 500 ms delay (heading absent and Send disabled meanwhile, then present), and
  `keyboard.down("Enter")` on the focused Send with a pause before `keyboard.up` (no request recorded while held;
  recorded after). The held-key test runs on chromium only, where Enter fires on keydown; the other projects skip
  it.
- No test asserts the message wording, colors, or spacing. Existing e2e files that press Send need no change
  because the fixture answers the service.

### Documentation

- `CLAUDE.md`: a short paragraph under Markdown content pages or Toolchain: the form posts to the fully-qualified
  service address, the module that owns it, that tests must never reach the live service, and that a local send
  reaches the live service and creates a real request.
- `specs/001-homepage-contact-us/contracts/ui-contracts.md`: a line under "Extension seam" pointing to
  `specs/087-contact-form-submit/contracts/ui-contract.md`.
