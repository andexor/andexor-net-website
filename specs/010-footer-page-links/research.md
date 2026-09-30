# Research: Footer Page Links

## Decision 1: Fill the existing `ITEM_HREFS` map

- **Decision**: Add eight entries to `ITEM_HREFS` in `Footer.tsx`: Web Hosting `/web-hosting`,
  Technical SEO `/technical-seo`, Agentic Systems `/agentic-systems`, Cost Reduction
  `/cost-reduction`, Lead Generation `/lead-generation`, Growth Marketing `/growth-marketing`,
  Process Re-engineering `/process-re-engineering`, About Us `/about-us`.
- **Rationale**: The footer already looks up `ITEM_HREFS[item]` first. "Web Development" works this
  way today, so no logic changes. Each address matches a file in `content/` (route = path).
- **Alternatives considered**: Generate `/${slugify(item)}` for every entry. Rejected: it would
  also link "Contact" to a page that does not exist, and it ties the address to the label, so a
  relabel would silently change a URL.

## Decision 2: Leave Contact, Privacy, and Terms as they are

- **Decision**: No change. "Contact" falls through to `#contact`; Privacy and Terms stay `#privacy`
  and `#terms`.
- **Rationale**: Nothing on the site has `id="contact"`, so `#contact` is a placeholder that does
  nothing; no page exists for any of the three. The Contact Us popup is opened from the hero and
  CTA band buttons, and wiring the footer to it is a different feature.
- **Alternatives considered**: Make "Contact" open the popup. Rejected as out of scope for this
  request ("pages"); it can be a separate spec.

## Decision 3: Verify pages exist with the existing unit test

- **Decision**: Extend `tests/unit/content-links.test.tsx`, which already renders the footer, lists
  internal links, and checks them against `listContentSlugs()` (published, non-draft pages).
- **Rationale**: FR-007 needs a failing check when a page is removed or renamed. The mechanism
  exists; it needs the nine footer pages in the approved list and the footer's links compared to it.
- **Alternatives considered**: A build-time link checker. Rejected as a new dependency for a
  problem the existing test solves.

## Decision 4: Click-through coverage in one new e2e file

- **Decision**: `tests/e2e/footer-links.spec.ts` loops over the eight entries and, from `/`,
  `/web-development`, and `/nope`, clicks the footer link and expects the URL and the level 1
  heading.
- **Rationale**: Covers User Stories 1 to 3 and SC-001 to SC-003. Data-driven, so one loop, not 24
  hand-written tests.

## Findings from the code

- `Footer.tsx` today: only "Web Development" is in `ITEM_HREFS`; the rest use `#<slug>`.
- The labels "Agentic Systems" and "About Us" are already changed in the working tree and match the
  page titles.
- All eight pages exist and are not drafts: `content/web-hosting.md`, `technical-seo.md`,
  `agentic-systems.md`, `cost-reduction.md`, `lead-generation.md`, `growth-marketing.md`,
  `process-re-engineering.md`, `about-us.md`.
- `tests/unit/content-links.test.tsx` fails as soon as the footer links a content page that is not
  in `APPROVED`, so it must be edited in the same change.
- Footer link text is in `tests/e2e/keyboard-navigation.spec.ts` and similar only by role, not by
  address, so no other test depends on the placeholder addresses.

No open questions.
