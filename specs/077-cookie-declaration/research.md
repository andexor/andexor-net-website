# Research: Cookie Declaration

## 1. How the element gets into the footer

- **Decision**: Render a `<div data-raw-html="" dangerouslySetInnerHTML={{ __html: "<script ...></script>" }} />` in
  `Footer.tsx`, between the copyright paragraph and the social row.
- **Rationale**: Cookiebot's script finds its element by `id="CookieDeclaration"` and inserts the declaration next to it
  (`insertBefore`). That adds nodes React did not render. React does not compare or patch the content of an element
  filled with `dangerouslySetInnerHTML`, so there is nothing to mismatch. The server HTML has a real script element, so
  the browser runs it while parsing, which a script created by React in the browser would not. The same pattern already
  carries the Markdown pages, and `data-raw-html` is how the formatter and the whitespace script know to leave it alone.
  Prototype result: home page served as andexor.net, 4 of 4 loads hydrated, no console or page errors, the declaration
  inserted inside the container, no horizontal overflow.
- **Alternatives considered**:
  - A plain `<script>` element in JSX: React 19 treats `async` scripts with `src` as resources and may move or
    deduplicate them, and the nodes Cookiebot adds beside it sit among React's children, where hydration can fail.
  - Adding the element in the build step, as the consent script is (spec 076): that script goes in `<head>`, which React
    does not manage; in the footer the element would be unexpected markup inside React's tree.
  - Loading it from a client component after mount: needs script-loading code, and the declaration would appear late.
  - `next/script`: adds client code and does not give the exact element the owner supplied.

## 2. Attributes

- **Decision**: Use the element as given: `id`, `src`, `type="text/javascript"`, `async`.
- **Rationale**: The script looks itself up by id. `async` is what the owner supplied and keeps it from blocking.

## 3. Which pages

- **Decision**: Every page that renders `Footer`: the home page and the content pages (via `ContentPage`).
- **Rationale**: `not-found.tsx` does not render the footer, so it is out of scope. New Markdown pages get it through
  `ContentPage`, with no per-page work (FR-003).

## 4. Layout

- **Decision**: Keep the declaration in the first footer column, as asked, and check it at phone, tablet, and desktop
  widths. Add overflow and width rules in `marketing.css` only if the check shows a problem.
- **Rationale**: In the prototype, the declaration showed as short text (the site has not been scanned yet), so it fit.
  After the scan it will be a table of cookies, and that is what needs the check; the table is Cookiebot's markup and is
  styled by Cookiebot, so rules should be limited to containing it (`max-width: 100%`, `overflow-x: auto`).

## 5. Tests

- **Decision**: One e2e test that reads each page's built HTML and checks that the element, with its four attributes, is
  the next element after the copyright paragraph, plus a check that the page does not scroll sideways at phone width.
  Cookiebot requests are stubbed as in the other specs. No test of the declaration's text.
- **Rationale**: Tests cover behavior and the rules in `CLAUDE.md`, not copy. Hydration is already covered by
  `readable-output.spec.ts`; it uses the stub, so it cannot catch a Cookiebot-specific problem, which is why the real
  check is in `quickstart.md`.

## 6. Checking against the real Cookiebot

- **Decision**: Check by serving the build as andexor.net with the real scripts (quickstart step 4), then once on the
  live site after deploy.
- **Rationale**: Cookiebot refuses localhost, and the consent script broke hydration only where the real service ran
  (spec 076). Stubbed tests cannot show that.
