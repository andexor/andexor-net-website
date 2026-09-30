# Data Model: Link Style

No stored data. The one entity is a set of style values.

## Link style

| Property | Body and card links | Footer links |
|----------|---------------------|--------------|
| Underline | None (rest, hover, focus) | None |
| Link color | `--blue-400` (`--text-link` in `.an-prose` and `.an-tile`) | unchanged |
| Hover color | `--blue-300` | unchanged |
| Focus | Existing 3px gold ring | unchanged |
| Surrounding text color | `--slate-50` (`--text-body` in `.an-prose` and `.an-tile`) | n/a |

Rules: link vs surrounding text at least 3:1; link vs its background at least 4.5:1; dark
featured cards (`.an-tile--ink`) keep `--blue-200` text and have no links today.
