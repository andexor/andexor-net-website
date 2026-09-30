# Data Model: Service Cards

No stored data. The one entity is the service card, defined in `services-data.ts`.

## Service card (`ServiceOffering`)

| Field | Change |
|-------|--------|
| `icon`, `tag`, `badgeTone`, `title`, `description`, `bullets` | unchanged |
| `href` | now required; the address of the card's page |

## Cards and their pages

| Card title | Badge | `href` | Page file |
|------------|-------|--------|-----------|
| Web Development | Web | `/web-development` (unchanged) | `content/web-development.md` |
| Technical SEO | SEO | `/technical-seo` (new) | `content/technical-seo.md` |
| Agentic Systems | AI | `/agentic-systems` (new) | `content/agentic-systems.md` |
| Growth Marketing | Growth | `/growth-marketing` (new) | `content/growth-marketing.md` |

Rules: `href` is an internal address that matches a published (non-draft) file under `content/`,
is never a `#` placeholder, and is never `#top`.
