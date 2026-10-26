# Data Model: Cookies Page

No stored data. Two things are defined.

## Marker

| Field | Value |
| ----- | ----- |
| Syntax | The line `<!-- cookie-declaration -->`, alone on its line in a Markdown page |
| Where | Any Markdown page under `content/`; used in `content/cookies.md` |
| Effect | Replaced by the Cookie Declaration script element, once per page |
| Extra markers | Dropped, with a build warning naming the page |
| Other raw HTML | Dropped, as before |

## Script element (output)

| Attribute | Value |
| --------- | ----- |
| `id` | `CookieDeclaration` |
| `src` | `https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js` |
| `type` | `text/javascript` |
| `async` | present |

## Footer entry

| Field | Value |
| ----- | ----- |
| Column | COMPANY, after Security |
| Text | `Cookies` |
| Target | `/cookies`, same tab |
