# Contract: ContactPopup after spec 087

Amends `specs/001-homepage-contact-us/contracts/ui-contracts.md`. Everything not listed here is unchanged.

## Props

| Prop | Type | Required | Behavior |
|---|---|---|---|
| `open` | boolean | Yes | unchanged |
| `onClose` | `() => void` | Yes | unchanged |
| `sourcePath` | string | No | unchanged (spec 071) |
| `onSubmit` | `(request: ContactRequest) => Promise<void> \| void` | No | Delivers the request. Defaults to `sendContactRequest` from `src/lib/contact-service.ts`. A resolved promise (or a plain return) means delivered; a rejected promise means failed. |

`ContactRequest` is defined in `src/lib/contact-service.ts` and re-exported from `ContactPopup.tsx`.

## Behavior

1. Submitting a valid form reads the fields, then waits until the Send button is no longer pressed (`:active`
   false, no Enter or Space held) and one more frame has been painted, with the form still shown and Send still
   enabled and drawn normal. A second activation during this wait is ignored.
2. Then Send is disabled and `onSubmit` is called once with the `ContactRequest`.
3. While the promise is pending, the form stays, Send stays disabled, and no confirmation is shown.
4. When it resolves, the confirmation replaces the form and OK takes focus (spec 036).
5. When it rejects, the form stays with its values, a `role="alert"` message is shown above Send, and Send is
   enabled. Submitting again removes the message and repeats from step 1.
6. Closing the popup while the promise is pending aborts the default sender's request. A promise that settles after
   close changes nothing, then or on the next open.
7. Opening the popup shows the empty form, Send enabled, no message (spec 001 FR-013, FR-023).
8. An invalid form is never sent (spec 001 FR-010).

## Service module

`src/lib/contact-service.ts` exports `CONTACT_SERVICE_URL`, `CONTACT_TIMEOUT_MS`, `ContactRequest`, and
`sendContactRequest(request, signal?)`, which resolves on status 200 and rejects otherwise, after a `fetch`
rejection, or after `CONTACT_TIMEOUT_MS`. Unit tests import the URL constant; the Playwright fixture repeats the literal,
because e2e files do not import site code, and the service module's unit test pins the constant to the same
literal. Nothing else in the site may spell the address out.
