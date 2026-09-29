# Data Model: Content Pages, Card Template, and Web Development Page

No persistence. These shapes exist at build time only.

## Content page (front matter)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | No | Falls back to first `#` heading, then humanized file name |
| `description` | string | No | Meta description; omitted if absent |
| `draft` | boolean | No | `true` skips the page |
| `layout` | `"cards"` | No | Any other value renders the plain article layout |
| `eyebrow` | string | No | Cards only. Small label above the headline |
| `image` | string | No | Cards only. Path under `public/` |
| `image_alt` | string | No | Cards only. Defaults to empty text |
| `featured` | string[] | No | Cards only. Exact `##` heading texts for dark cards |

## Route mapping

| File | Route |
|---|---|
| `content/<a>.md` | `/<a>` |
| `content/<a>/<b>.md` | `/<a>/<b>` |
| `content/<a>/index.md` | `/<a>` |
| `content/index.md` | none |
| `content/README.md` (any case) | none |

Direct file wins if both `a.md` and `a/index.md` exist.

## Card

| Field | Source |
|---|---|
| heading | `##` text |
| label (optional) | `>> Label` line right after heading |
| body | Remaining nodes until the next `##` |
| featured | Heading text is in `featured` |
| order (`--i`) | 1-based reading order |
| column | odd index in column 1, even in column 2 |

## Card hero

| Field | Source |
|---|---|
| headline | The `h1` |
| intro | Nodes before the first `##` |
| eyebrow, image, alt | Front matter |

## Service offering (home page addition)

`ServiceOffering.href?: string`. When set, the service card links to it; otherwise to `#<tag>`.
