# Research: Technical and Business Card Bands

## Rendering

- **Decision**: Keep one `Services` component. It loops over two kinds, `technical` and `business`, and renders one
  `<section>` each, with the heading and sub-heading from a small table and the cards filtered from `SERVICES`.
- **Rationale**: "Duplicate the services section" is satisfied in the page without duplicating code. The card markup,
  classes, and styles are unchanged.
- **Alternatives**: two copies of the component (duplicated code); two components (an extra layer for no gain).

## Order

- **Decision**: Order the entries in `SERVICES` as the footer lists them, technical four then business four, so the
  filter keeps footer order. The footer's `COLUMNS` and `ITEM_HREFS` stay as they are; a test compares card titles with
  the footer's entries.
- **Rationale**: The footer is the stated source. Sharing one list between footer and cards would be a refactor the
  spec does not ask for.

## Section identity

- **Decision**: The technical section is `id="technical-services"` (renamed from `services`) and the business section
  is `id="business-services"`, so the pair is balanced. Each
  section gets `aria-labelledby` pointing at its heading.
- **Rationale**: No test, link, or content uses `#services` any more. Labeled regions meet FR-010.

## Spacing

- **Decision**: The section rule has `padding: var(--section-y) 24px`, so two stacked sections would double the gap
  between bands. Check in the browser; if the gap looks too large, remove the top padding of the second section with
  one rule.
- **Alternatives**: wrap both in one container (changes the structure the tests and anchor rely on).

## New card content (drafts for the owner to edit)

| Title | Tag | Tone | Icon |
|---|---|---|---|
| Web Hosting | Hosting | accent | Server |
| Cost Reduction | Cost | brand | TrendingDown |
| Lead Generation | Leads | accent | Filter |
| Process Re-engineering | Process | brand | Route |

Tones alternate within each band, as the existing cards alternate. Descriptions and bullets are drafted in
`services-data.ts` during implementation, in the style of the existing cards, and the owner reviews them.

## Tests

- **Decision**: Update the unit test and the three e2e files that read `#services`. Add checks that each section's
  card titles equal the footer entries of its column, in order, and that each card's link matches the footer link.
- **Rationale**: SC-002 and FR-011. No assertion counts cards: titles are compared as lists derived from the footer.
