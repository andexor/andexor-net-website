# Data Model: Remove Card Badges

## Service offering (`services-data.ts`)

| Field | Change |
|---|---|
| `tag` | Removed. |
| `badgeTone` | Removed. |
| `kind`, `icon`, `title`, `href`, `description`, `bullets` | Unchanged. |

Validation: unchanged from spec 048. Each entry has one `kind`, an existing route as `href`, a one-sentence
description, and three bullets.
