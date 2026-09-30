# Data Model: Not-Found Page

No stored data. The one entity is a page layout description.

## Hero layout (`CardsLayout`)

| Field | Not-found value | Notes |
|-------|-----------------|-------|
| `eyebrow` | omitted | No label above the headline (FR-004). |
| `image` | `{ src: "/404.png", alt: "Gold isometric laptop showing 404 next to a magnifying glass with a question mark" }` | FR-002. |
| `headingHtml` | `Page not found` | Same headline as today. |
| `introHtml` | `<p>We could not find that page. <a href="/">Go to the home page</a>.</p>` | Same wording as today. |
| `cardsHtml` | `""` | Empty means no cards block (FR-003). |
| `grid` (new, optional) | `false` | Absent or `true` shows the grid (Markdown pages, unchanged). |

Rules: `grid` defaults to shown; the cards block renders only when `cardsHtml` is non-empty; the
`--solo` class is applied exactly when there are no cards.
