# Data Model: Submit the Contact Us Form

## Contact Request

The visitor's inquiry, read from the form when Send is activated. Unchanged from spec 001 as amended by specs 068,
070, 071, and 073; this feature only sends it.

| Field | Type | Required | Source | Notes |
|---|---|---|---|---|
| `name` | string | yes | Name field | browser validation (`required`) |
| `email` | string | yes | Email field | browser validation (`required`, `type="email"`) |
| `phone` | string | no | Phone field | empty string when blank |
| `website` | string | no | Website field | empty string when blank |
| `help` | string | no | How can we help you? | at most 250 characters (spec 073); empty string when blank |
| `sourcePath` | string | always set | hidden field | path of the page that opened the popup (spec 071), `/` at least |

Every field is always present in the request, as a string. The type lives in `src/lib/contact-service.ts` and is
re-exported by `ContactPopup.tsx`.

## Contact Service

External. Receives a Contact Request at `https://andexor.net/api/contact` and answers with status 200 when it has
accepted it. The site reads nothing else from the answer. See `contracts/contact-service.md`.

## Popup states

The popup's state while open. `busy` is a ref, not rendered; the rest drive what is shown.

| State | sent | submitting | failed | busy | What the visitor sees |
|---|---|---|---|---|---|
| Form | false | false | false | false | the form, Send enabled |
| Releasing | false | false | false | true | the form, Send enabled and drawn normal; a second activation is ignored |
| Sending | false | true | false | true | the form, Send disabled |
| Failed | false | false | true | false | the form with entries, the failure message, Send enabled |
| Received | true | false | false | false | "Request received", OK focused |

Transitions:

- Form or Failed, Send activated on a valid form -> Releasing (the message is removed at once).
- Releasing, button no longer pressed and a frame painted -> Sending (request leaves now).
- Sending, status 200 -> Received.
- Sending, any other status, `fetch` rejects, or 10 s pass -> Failed.
- Any state, popup closed -> the in-flight request (if any) is aborted; a settled answer after that changes nothing.
- Popup opened -> Form (state reset, form reset), whatever the state was.
