# Contract: Footer Links

## Rules

- Each of the nine page entries in `data-model.md` is one `<a>` whose `href` is its page address.
- Every such address matches a published, non-draft file under `content/`.
- The same links appear, with the same addresses, in the footer on every page (home, content pages,
  not-found).
- "Privacy", "Terms", and the social links are unchanged. ("Contact Us" opens the contact popup; see
  spec 014.)
- No footer link goes to `#top`; none is underlined at rest, on hover, or on focus.

## Checked by tests

| Check | Where |
|-------|-------|
| The footer's internal links are exactly the nine approved pages, and each is published | `tests/unit/content-links.test.tsx` (edited) |
| From `/`, `/web-development`, and `/nope`: each of the eight new links opens its page (URL and level 1 heading) | `tests/e2e/footer-links.spec.ts` (new) |
| Privacy and Terms keep their placeholder addresses | `tests/e2e/footer-links.spec.ts` |
| No hover underline, no `#top` link | existing `no-hover-underline.test.ts`, `no-top-links.test.ts` |
| Renaming or removing a page fails a test | the unit test above (published-pages check) |
