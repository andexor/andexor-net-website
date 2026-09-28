# Data Model: Homepage and Contact Us Popup

This feature has no persistence layer (FR-018: contact requests are not delivered or stored
anywhere by this feature). The "entities" below are in-memory/UI data shapes only, scoped to the
running page.

## Contact Request

Represents the values a visitor enters into the Contact Us popup form. Exists only in component
state for the lifetime of the open popup; never persisted, transmitted, or logged by this
feature.

| Field | Type | Required | Validation |
|---|---|---|---|
| `fullName` | string | Yes | Non-empty (native `required`) |
| `workEmail` | string | Yes | Non-empty, valid email format (native `type="email"` + `required`) |
| `companyWebsite` | string | Yes | Non-empty (native `required`); no format enforcement beyond that, per design reference |
| `primaryNeed` | enum or `"Something else"` | Yes | Must be one of the Service Offering names below, or the literal `"Something else"`; the placeholder ("Select a service…") is not a valid submission value |

**State transitions**:

- `(empty form)` → **filled** as the visitor types/selects values.
- **filled + valid** → `submitted`, on submit: form view is replaced by the confirmation view
  (`Request received`). No value round-trips back into the form.
- Popup **closed** (via ×, scrim click, or "Done") → any in-progress Contact Request values are
  discarded. Reopening always starts from an empty form (FR-013).

## Service Offering

Static, hard-coded content describing one of Andexor Network's four service disciplines.
Rendered in the homepage Services section and reused as the option list in the Contact Request's
`primaryNeed` field (technical services group).

| Field | Type | Notes |
|---|---|---|
| `icon` | icon name | Lucide icon identifier (`code-2`, `search`, `bot`, `line-chart`) |
| `badgeTone` | `"brand"` \| `"accent"` | Controls Badge component color per design spec |
| `title` | string | e.g. "Web Development" |
| `description` | string | One-sentence summary |
| `bullets` | string[] | Supporting capability list (2–3 items) |

Fixed content set (from `design/README.md`, Services section):

1. Web Development (brand) — "Brochure site, blog, forms, shop" / "Content management system" /
   "Web application"
2. Technical SEO (accent) — "Site audit" / "Content strategy" / "Maps, social media"
3. AI Systems (brand) — "Knowledge Base" / "Digital assistant, scheduling" / "Workflow
   automation"
4. Growth Marketing (accent) — "Newsletters, branded email" / "Social media marketing" / "Paid
   advertising"

## Primary Need option list

Static enum used by the Contact Request form's "Primary need" field (not a separate persisted
entity, just the selector's allowed values):

- **Technical services**: Web Development, Web Hosting, Technical SEO, AI Systems
- **Business services**: Cost Reduction, Lead Generation, Growth Marketing, Process
  Re-engineering
- Something else
