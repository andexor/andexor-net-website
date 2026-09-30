# Data Model: Logo Lockup

No stored data. The one entity is a presentational component.

## Logo lockup

| Property | Values | Notes |
|----------|--------|-------|
| Mark | `/logo/logo-gold.svg` | Decorative (`alt=""`). Also shown alone, without the wordmark, in the Contact Us popup header (spec 016). |
| Wordmark text | `Andexor Network` | Single line. Defined once, in the component. |
| `light` | boolean, default false | Footer's light-on-dark text color. |
| `size` | `default` or `hero`, default `default` | `default` = header/footer (mark 38px, text 26px); `hero` = home page top (design-system sizes). |
| `href` | optional string | Present: renders a link. Absent: renders a non-link block. |

The old `compact` property and the "Network, Inc." tagline are removed.
