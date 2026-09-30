# Contract: Not-Found Page

## Rendered structure (for any unknown address)

```text
<div id="top">
  <header class="an-content-header"> logo linking to / </header>
  <main>
    <section class="an-cardhero an-cardhero--solo">
      (no .an-cardhero__grid)
      <div class="an-cardhero__inner">
        <div class="an-cardhero__art"> <img src="/404.png" alt="Gold isometric laptop ..." width=1024 height=1024> </div>
        <div class="an-cardhero__text">
          (no .an-cardhero__eyebrow)
          <h1>Page not found</h1>
          <div class="an-cardhero__intro"><p>We could not find that page. <a href="/">Go to the home page</a>.</p></div>
        </div>
      </div>
    </section>
    (no .an-cards, no .an-tile)
  </main>
  <footer> shared footer </footer>
</div>
```

## Behavior

- Title: "Page not found | Andexor Network". Status: 404 (unchanged).
- No redirect: the requested address stays in the address bar. Unknown addresses are answered
  with the contents of `404.html` and a 404 status (`server.ts`), never a redirect to another
  address. A test asserts the address after loading equals the address requested (FR-013).
- The link goes to `/`; no underline; color changes on hover; focus ring on keyboard focus.
- At 320px, 768px, and 1280px: no horizontal scrolling; illustration and text arranged as on the
  Web Development page at the same width.
- `/web-development` still has `.an-cardhero__grid`, an eyebrow, and its cards.
- axe reports no WCAG 2.1 AA violations, in all six projects.
