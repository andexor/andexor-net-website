# Contract: Service Card Links

## Rules

- Each home page service card is one `<a>` whose `href` is the address of its page (table in
  `data-model.md`).
- No card's `href` starts with `#`.
- Each `href` matches a published, non-draft file under `content/`.
- A card and the footer entry of the same name have the same `href` (once spec 010 is built).
- Cards keep their look; hover is the existing card hover, with no underline.

## Checked by tests

| Check | Where |
|-------|-------|
| Card links to content pages are exactly the four approved pages, and each page is published | `tests/unit/content-links.test.tsx` (edited) |
| Each service in `SERVICES` has an internal `href` that does not start with `#` | `tests/unit/services.test.tsx` (edited) |
| On `/`, activating each card opens a page whose heading matches the card title | `tests/e2e/homepage-content.spec.ts` (edited) |
| A missing `href` is a type error | `bunx tsc --noEmit` |
| No hover underline, no `#top` link | existing `no-hover-underline.test.ts`, `no-top-links.test.ts` |
