# Data Model: Logo Lockup Link Rules

No stored data. The one entity is the logo lockup and where it is a link.

## Logo lockup

| Location | Link? | `Logo` props |
|----------|-------|--------------|
| Header, content pages | Yes, to `/` | `href="/"` |
| Hero brand row, home page | No | `size="hero"`, `light` |
| Footer, every page | No (changed) | `light` |

Rule: `href` is never `#top`, or any address whose fragment is `top`.
