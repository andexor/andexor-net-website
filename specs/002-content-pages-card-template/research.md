# Research: Content Pages, Card Template, and Web Development Page

All decisions below are already implemented. There are no open clarifications.

## Markdown pipeline

- **Decision**: `unified` with `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`,
  `rehype-external-links`, `rehype-stringify`. Front matter via `gray-matter`.
- **Rationale**: Build-time only, no client JavaScript, GFM support, and raw HTML dropped by
  default (safe even though content is trusted).
- **Alternatives considered**: MDX (rejected: allows code in content and the owner wants plain
  Markdown); `next-mdx-remote` and `@next/mdx` (same reason, plus extra config); hand-written
  `.tsx` pages (rejected by the owner: they must be able to edit copy directly).

## Routing

- **Decision**: One catch-all route `src/app/[...slug]/page.tsx` with `dynamicParams = false`
  and `generateStaticParams` from the content folder. A placeholder slug is emitted when there
  are no pages because `output: "export"` rejects an empty list.
- **Rationale**: Path equals route, no per-page code, unknown addresses 404.
- **Alternatives considered**: One route file per page (rejected: code per page); a generated
  route table (rejected: extra moving part).

## Draft and README handling

- **Decision**: `draft: true` and `README.md` are skipped when listing; a root `index.md` is
  ignored because `/` is the home page.
- **Rationale**: Lets the owner write ahead of publishing and keep authoring docs beside the
  content.

## Card layout

- **Decision**: Split the rendered HTML tree at `h1` and `h2` nodes. Deal cards into two columns
  (odd, even) and set a `--i` reading-order variable. On narrow screens, columns flatten so cards
  stack in reading order at equal width (`align-items: stretch`). A `>> Label` line becomes the
  card label. Featured cards are matched by exact heading text.
- **Rationale**: Two staggered columns look better on wide screens; flattening keeps reading
  order on phones. Markdown stays plain.
- **Alternatives considered**: CSS multi-column (rejected: reading order breaks); front matter
  list of cards (rejected: duplicates copy).

## Hero background

- **Decision**: Linear gradient from `--surface-ink` (0 to 35%) to `--surface-page` (100%).
- **Rationale**: Removes the hard edge between hero and first cards (issue #7).

## Always-dark

- **Decision**: Put the dark alias values unconditionally in `src/styles/tokens/colors.css` with
  `color-scheme: dark`, deliberately differing from `design/tokens/colors.css`.
- **Rationale**: Brand decision (one look for all visitors).
- **Alternatives considered**: Keep `prefers-color-scheme` switching (rejected by the owner).

## No hover underline

- **Decision**: Remove `a:hover { text-decoration: underline }` from both `design/tokens/base.css`
  and `src/styles/tokens/base.css`. Amended by spec 007: body links are no longer underlined at rest
  either; they stand out by color and change color on hover.
- **Rationale**: Hover underline causes a rendering flicker.

## Graceful shutdown

- **Decision**: In `server.ts`, handle SIGINT and SIGTERM once: log, `server.stop()`, exit 0,
  with a 5-second `setTimeout(... exit(1)).unref()` fallback. Later signals are ignored.
- **Rationale**: PID 1 in Docker ignores these signals without handlers.
- **Note**: The fallback exits with status 1, not 0. That is consistent with FR-028 (forced
  exit) and is not treated as a defect.

## Linking policy

- **Decision**: Home page service card and footer link to `/web-development` via an optional
  `href` on service data and an `ITEM_HREFS` map in the footer. Other items keep `#slug`
  placeholders.
- **Rationale**: The owner approves pages one at a time.
