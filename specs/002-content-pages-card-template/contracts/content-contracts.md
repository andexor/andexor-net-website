# Contracts: Content Pages, Card Template, and Web Development Page

## Authoring contract (owner to site)

See `content/README.md` for the full text. Summary:

- A `.md` file under `content/` publishes at the matching route after a rebuild.
- Front matter fields are listed in `../data-model.md`.
- Body starts with a single `#` heading. GFM works. Raw HTML is dropped. Images live in `public/`.
- `layout: cards`: `##` sections become cards; `>> Label` is the card label.

## Route contract

| Request | Response |
|---|---|
| Published content route | Page with title `<title> | Andexor Network, Inc.` |
| Draft, README, root index, unknown route | 404 page |
| `/web-development` | Card page: eyebrow "Technical services", H1 "Web Development", 9 cards, 2 featured |

## Link contract

| Link | Target |
|---|---|
| Logo on content pages | `/` |
| Logo in the home page hero and in every footer | Not a link (amended by spec 008) |
| Web Development service card and footer link | `/web-development` |
| Any link beginning `http` inside content | New tab, `rel="noopener noreferrer"` |

## Appearance contract

- `color-scheme: dark` and the dark aliases apply at `:root` with no media query.
- No selector matching `:hover` sets `text-decoration: underline`.

## Process contract (server.ts)

| Event | Behavior |
|---|---|
| First SIGINT or SIGTERM | Log `Received <signal>, shutting down`; stop accepting; drain; exit 0 |
| Later signals | Ignored |
| No drain within 5 seconds | Exit with status 1 |
