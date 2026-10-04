# Feature Specification: Keep the Not-Found Page Out of Search Results

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Add <meta name="robots" content="noindex, nofollow"> to the not-found page so that an invalid URL does not get indexed by search engines."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A missing address is not indexed by search engines (Priority: P1)

A search engine crawler follows a broken or mistyped link to an address that does not exist on the
site. The site answers with the "Page not found" page. That page tells the crawler not to index it
and not to follow its links, so the invalid address never shows up in search results and does not
dilute the site's real pages.

**Why this priority**: This is the whole request. Every unknown address is served by the same
not-found page, so without the instruction a crawler may list invalid addresses.

**Independent Test**: Request an unknown address and read the returned page. It contains
`<meta name="robots" content="noindex, nofollow">`, and no other page on the site does.

**Acceptance Scenarios**:

1. **Given** an unknown address, **When** the not-found page is returned, **Then** its head contains
   `<meta name="robots" content="noindex, nofollow">`.
2. **Given** the home page and all 9 content pages, **When** each is loaded, **Then** none contains a
   `robots` meta tag with `noindex` or `nofollow`.
3. **Given** an unknown address, **When** it is requested, **Then** the server still answers with
   the 404 status and the page is not redirected.

---

### Edge Cases

- The visible page, its headline, title, description, and the "Go to the home page" link are
  unchanged. The link still works for visitors. Only crawlers are told not to follow it.
- The instruction applies only to the not-found page. A page that exists is never marked
  `noindex` by this change.
- If a crawler is blocked from the page by other means, it cannot read the instruction, so this
  change does not add any rule that blocks crawlers from fetching it, and it does not add a
  `robots.txt`.
- The tag appears exactly once in the page's head, with exactly the content `noindex, nofollow`.
  The framework that builds the site also adds its own plain `<meta name="robots" content="noindex">`
  to its not-found page and that cannot be turned off. The two do not conflict: both say not to
  index, and the stricter one wins.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The not-found page MUST contain `<meta name="robots" content="noindex, nofollow">`
  exactly once in its head. Any other robots tag on that page (the framework's plain `noindex`) MUST
  NOT allow indexing.
- **FR-002**: No other page (home page and every content page) MUST contain a `robots` meta tag with
  `noindex` or `nofollow`.
- **FR-003**: The not-found page's 404 status, lack of redirects, visible content, and title
  MUST NOT change. (Its description is set by spec 028.)
- **FR-004**: The project MUST NOT contain a `robots.txt` file. The owner does not want one for now.
- **FR-005**: An automated check MUST fail if the not-found page lacks the tag, or if any other page
  has it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The not-found page's head has exactly 1 robots meta tag with content
  `noindex, nofollow`, and no robots tag that allows indexing.
- **SC-002**: 0 of the 10 other pages (home plus 9 content pages) contain a `noindex` or
  `nofollow` instruction.
- **SC-003**: The built site contains no `robots.txt`, and a request for `/robots.txt` gets the
  not-found page with status 404.
- **SC-004**: An unknown address still returns status 404.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- The instruction is a meta tag in the page's head, as the owner specified. A server header would
  also work but is not part of this request.
- The site has no `robots.txt` today, and none is added here or by any later change unless the owner
  asks. The owner's decision (2026-10-01): no `robots.txt` "at least not right now". If this changes, it is
  a separate request.
- This is a small metadata change. Implement directly; no plan or tasks needed.
