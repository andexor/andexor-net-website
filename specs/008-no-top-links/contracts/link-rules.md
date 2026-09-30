# Contract: Link Rules

## Rules

- No link's `href` has the fragment `top` (`#top`, `/#top`, `/page#top`), anywhere in `src/` or
  `content/`, or on any rendered page.
- The footer logo lockup is a `<div>`, not inside any `<a>`, and has no tab stop.
- The header logo on content pages is `<a href="/">`.
- The hero brand row is a `<div>`.
- `id="top"` may remain on page wrappers; it is not a link.

## Checked by tests

| Check | Where |
|-------|-------|
| No source file links to `#top` (`href="#top"`, `href={"#top"}`, `href: "#top"`, Markdown `](#top)`) | `tests/unit/no-top-links.test.ts` (scans `src/` and `content/`) |
| The scanner itself detects each pattern | same file, guard test |
| Footer logo is not a link and is not listed among links | `tests/unit/logo.test.tsx` |
| On `/`, `/web-development`, `/nope`: no link ends in `#top`; the footer lockup is not inside an `<a>`; tabbing never focuses it; clicking it does not scroll | `tests/e2e/no-top-links.spec.ts` |
| Header logo still goes to `/` | `tests/e2e/no-top-links.spec.ts` and `tests/e2e/web-development.spec.ts` (existing) |
| Home page hero lockup is a `<div>`, not a link | `tests/e2e/no-top-links.spec.ts` |
| The scanner finds a `#top` link in a temporary file and names it | `tests/unit/no-top-links.test.ts` (temporary directory, no real source edited) |
