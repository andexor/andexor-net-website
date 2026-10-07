# Data Model: Technical and Business Card Bands

## Service offering (`services-data.ts`)

| Field | Notes |
|---|---|
| `kind` | New. `"technical"` or `"business"`. Decides the section. |
| `icon` | A `lucide-react` icon. |
| `tag` | Short badge text. |
| `badgeTone` | `"brand"` or `"accent"`. |
| `title` | Same as the footer entry. |
| `href` | Same as the footer entry's address. |
| `description` | One sentence. |
| `bullets` | Three short strings. |

Entries are listed in footer order: Web Development, Web Hosting, Technical SEO, Agentic Systems, Cost Reduction, Lead
Generation, Growth Marketing, Process Re-engineering.

## Service section (table in `Services.tsx`)

| Field | Notes |
|---|---|
| `kind` | Matches the offering's `kind`. |
| `id` | `services` (technical), `business-services` (business). |
| `heading` | Technical: "Technical services built to scale". Business: "Business services that drive growth". |
| `lede` | Technical: "Web, hosting, search, and AI that stay fast as you grow." Business: "Lower costs, more leads, and better processes, with campaigns to match." |

Validation: every offering has exactly one kind; each `href` is an existing content route; no two offerings share a
title.
