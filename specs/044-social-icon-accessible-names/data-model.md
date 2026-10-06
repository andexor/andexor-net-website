# Data Model: Social Icon Accessible Names

No stored data. The footer's list of social links gains the final names.

| Link | Name (on the icon's `aria-label`) | URL |
|---|---|---|
| LinkedIn | `LinkedIn` | https://www.linkedin.com/in/ejenkins/ |
| X | `X` | https://x.com/andexor |
| GitHub | `GitHub` | https://github.com/andexor |

| Element | Rule |
|---|---|
| `<a>` (social link) | no `aria-label`; name comes from its icon |
| `<svg>` (icon) | `aria-label` is the name; not hidden (`aria-hidden="false"` from FontAwesome); no `alt` |
