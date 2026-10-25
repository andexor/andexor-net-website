# Contract: Cookie Declaration in the footer

In every built page that has the footer, the copyright paragraph is followed directly by one container, then the social
row:

```html
<p class="an-footer__copyright">...</p>
<div data-raw-html=""><script id="CookieDeclaration" src="https://consent.cookiebot.com/ba75dc6a-d85e-4740-891e-dd0cc31a62dd/cd.js" type="text/javascript" async></script></div>
<div class="an-footer__social-row">...</div>
```

- The element appears once per page, only in the footer.
- `id`, `src`, `type`, and `async` do not change without a spec change.
- Cookiebot adds the declaration inside the container; the page's own markup is not changed by it.
- The built formatter may put whitespace inside the container; it does not change the element.
