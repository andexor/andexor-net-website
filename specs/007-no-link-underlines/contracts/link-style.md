# Contract: Link Style

## Scopes

| Selector | Sets | Effect |
|----------|------|--------|
| `.an-prose` | `--text-body: var(--slate-50)`, `--text-link: var(--blue-400)` | Content pages, "Page not found" |
| `.an-tile` | same | Cards |

## Link rules

| Selector | Declarations |
|----------|--------------|
| `.an-prose a`, `.an-tile a` | `color: var(--text-link)`; no `text-decoration` line |
| `.an-prose a:hover`, `.an-tile a:hover` | `color: var(--blue-300)` |
| `.an-prose a:focus-visible`, `.an-tile a:focus-visible` | existing gold ring, unchanged |

## Guarantees checked by tests

- No stylesheet rule whose selector targets a link sets an underline, at rest or on hover.
- Computed `text-decoration-line` is `none` at rest, hover, and focus for links on `/`,
  `/web-development`, and `/nope`.
- Hover changes a body or card link's color.
- axe reports no WCAG 2.1 AA violations on `/nope` and `/web-development`, in all six projects.

## Limits

- A link inside `.an-tile--ink` would be `--blue-400` on `--blue-200` text (2.45:1) and fail.
  Add its own color when one is needed.
