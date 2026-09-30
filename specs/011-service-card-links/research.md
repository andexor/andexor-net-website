# Research: Service Card Links

## Decision 1: Add `href` to the data, not the component

- **Decision**: Set `href` on the Technical SEO, Agentic Systems, and Growth Marketing entries in
  `services-data.ts`. Make `href` a required field.
- **Rationale**: `Services.tsx` already renders `service.href`. Web Development works this way
  today, so the other three follow the same path with no component logic.
- **Alternatives considered**: Derive `href` from the title with the footer's `slugify`. Rejected:
  it needs a shared helper for four values, and `Agentic Systems` to `agentic-systems` works but
  `Process Re-engineering` shows how fragile title-to-slug rules get. Literal strings are clearer.

## Decision 2: Remove the placeholder fallback

- **Decision**: Delete the `?? #tag` fallback in `Services.tsx`.
- **Rationale**: It is what produced `#seo`, `#ai`, and `#growth`. With `href` required it can
  never run, and leaving it would hide a missing destination instead of failing the type check.
- **Alternatives considered**: Keep it as a safety net. Rejected: FR-005 says no card links to a
  placeholder.

## Decision 3: Verify pages exist in a unit test, not at build time

- **Decision**: Extend `tests/unit/content-links.test.tsx`, which already checks that approved
  links resolve to published (non-draft) pages using `listContentSlugs()`.
- **Rationale**: FR-008 needs a failing check when a page is removed or renamed. The test exists;
  it just needs the three new pages in the approved list and the card links compared against it.
- **Alternatives considered**: A build-time link checker. Rejected as a new dependency for a
  problem the existing test solves.

## Decision 4: No new e2e file

- **Decision**: Add the card-click check to `tests/e2e/homepage-content.spec.ts`, next to the
  existing "4 service cards" check, and leave `web-development.spec.ts` alone.
- **Rationale**: It is homepage behavior, and that spec already visits `/` and finds the cards.

## Findings from the code

- Card hrefs today: Web Development `/web-development`; the other three fall back to `#seo`,
  `#ai`, `#growth`.
- The pages exist and are not drafts: `content/technical-seo.md`, `agentic-systems.md`,
  `growth-marketing.md`.
- `tests/unit/content-links.test.tsx` fails as soon as any card links a content page not in
  `APPROVED`, so it must be edited in the same change.
- `tests/unit/services.test.tsx` counts links with `getAllByRole("link")` (4) and stays valid.

No open questions.
