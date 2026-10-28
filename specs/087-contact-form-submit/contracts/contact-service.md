# Contract: Contact Service

The agreement between the site (this repository) and the contact service (separate repository). Either side
changing it must change this file first.

## Request

- Method: `POST`
- URL: `https://andexor.net/api/contact` (fully qualified, from every origin the site is served from)
- Headers: `Content-Type: application/json`. No other request headers. No cookies or credentials
  (`credentials: "omit"`).
- Body: one JSON object with exactly these six string members, always all present:

```json
{
    "name": "Jordan Reyes",
    "email": "jordan@example.com",
    "phone": "",
    "website": "example.com",
    "help": "We need a new site.",
    "sourcePath": "/web-development"
}
```

| Member | Meaning | Constraints the site applies |
|---|---|---|
| `name` | the visitor's name | non-empty (browser `required`) |
| `email` | the visitor's email address | non-empty, browser `type="email"` shape |
| `phone` | the visitor's phone number, free text | may be empty; no format enforced |
| `website` | the visitor's website, free text | may be empty; no format enforced |
| `help` | what the visitor wants help with | may be empty; at most 250 characters |
| `sourcePath` | the path of the page that opened the popup, for example `/` or `/web-development` | always set by the site, never typed by the visitor |

The service should validate these again; the site's checks are browser-side only.

## Answer

- `200`: the request was accepted. The site then shows "Request received". The body is ignored and may be empty.
- Any other status: the site treats the send as failed, keeps the form, and lets the visitor retry. The body is
  ignored.
- No answer within 10 seconds: the site aborts the request and treats the send as failed. The service may still
  have accepted it; the site does not try to find out.

## CORS

The service must allow the origins the site is served from. Checked 2026-10-28, it answers a preflight
`OPTIONS https://andexor.net/api/contact` with:

```
HTTP 204
Access-Control-Allow-Origin: <the request's Origin, when it is http://localhost:3000, http://localhost:8787, or https://andexor.net>
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

and the `POST` answer carries the same `Access-Control-Allow-Origin`. `https://andexor.net` is the site's own
origin, so the header is not needed there, but it is harmless. No `Access-Control-Allow-Credentials` is needed,
because the site sends no credentials. A new local origin (another port) must be added on the service side.

## Open point

The member names are the site's `ContactRequest` names. If the service expects different names, change this file
and `src/lib/contact-service.ts` together before implementing.
