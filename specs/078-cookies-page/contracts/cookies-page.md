# Contract: Cookies page and footer link

## Built page `/cookies`

- `out/cookies/index.html` (or the site's usual path for a content page) contains, inside the page body's
  `data-raw-html` element, exactly one element with `id="CookieDeclaration"`, `src`
  `https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js`, `type="text/javascript"`, and `async`.
- The element is at the marker's position in the page text.
- The page has no other `<script>` element from the Markdown.

## Every other page

- No element with `id="CookieDeclaration"`, including in the footer.

## Footer

- The COMPANY column has an `<a class="an-footer__col-link" href="/cookies">Cookies</a>`, after Security, with no
  `target` attribute.
- The copyright line is followed directly by the social row.

## Sitemap

- `content/sitemap.xml` lists `https://andexor.net/cookies`.
