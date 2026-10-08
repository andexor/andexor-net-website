# Data Model: Legal Icon Outside Link

No data changes. The markup order in the Contact Us note changes:

| before (spec 065)                          | after (spec 066)                           |
|--------------------------------------------|--------------------------------------------|
| `<a>Privacy<svg/></a> \| <a>Terms<svg/></a>` | `<a>Privacy</a><svg/> \| <a>Terms</a><svg/>` |

Each `svg` is the Font Awesome duotone arrow-up-right-from-square icon with `aria-hidden="true"`, no `aria-label`, no
`alt`. The links keep `target="_blank"`, `rel="noopener noreferrer"`, and their `aria-label`s.
