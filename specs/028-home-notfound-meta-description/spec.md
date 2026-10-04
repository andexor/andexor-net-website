# Feature Specification: Home and Not-Found Meta Descriptions

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "For best results in SEO, the URL, H1, and meta description should match. Most of the pages are good. The meta description needs to be updated on the home page and the not-found page to match the H1 text on those pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The home page description matches its headline (Priority: P1)

A search engine, or a person sharing the home page link, reads the page's meta description. It says
"Enterprise services for small business", the same words as the visible headline, instead of the
longer older sentence "Enterprise-grade web, SEO, AI, and marketing services at small business
prices."

**Why this priority**: The owner wants the headline and the description to agree for search
results. The home page is the most visited page.

**Independent Test**: Load the home page and read its meta description. It equals the page's
headline text exactly.

**Acceptance Scenarios**:

1. **Given** the home page, **When** its meta description is read, **Then** it is exactly
   "Enterprise services for small business".
2. **Given** the home page, **When** the headline and the meta description are compared, **Then**
   they are the same text.
3. **Given** the home page, **When** its page source is searched for the older sentence ("Enterprise-grade
   web, SEO, AI, and marketing services at small business prices."), **Then** there is no match.

---

### User Story 2 - The not-found page description matches its headline (Priority: P1)

A visitor lands on a missing address. The page's meta description says "Page not found", the same
words as its visible headline, instead of inheriting the home page's description.

**Why this priority**: Today the not-found page repeats the home page's description, which describes
a page that is not there.

**Independent Test**: Request an unknown address and read the meta description in the returned page.
It equals the headline text exactly.

**Acceptance Scenarios**:

1. **Given** an unknown address, **When** the not-found page loads, **Then** its meta description is
   exactly "Page not found".
2. **Given** the not-found page, **When** the headline and the meta description are compared,
   **Then** they are the same text.
3. **Given** an unknown address, **When** it is requested, **Then** it still returns the 404 status
   and is not redirected.

---

### Edge Cases

- The content pages (Web Development, About Us, and the rest) already match their H1, so they are
  not changed. This is checked, not assumed (see SC-003).
- The browser tab titles are not part of this change. The home page title stays "Andexor Network" and
  the not-found title stays "Page not found | Andexor Network".
- The visible headlines are unchanged.
- The site-wide default description stops being the home page's wording. Any page that sets its own
  description keeps it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page's meta description MUST be exactly "Enterprise services for small
  business", identical to its headline text.
- **FR-002**: The not-found page's meta description MUST be exactly "Page not found", identical to
  its headline text.
- **FR-003**: The not-found page MUST NOT inherit the home page's description.
- **FR-004**: The meta descriptions of the content pages MUST NOT change, and each MUST equal that
  page's headline text.
- **FR-005**: Titles, headlines, and the not-found page's 404 status MUST NOT change.
- **FR-006**: Documents that quote the old home page description (if any) MUST be updated to match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the home page, the meta description equals the headline text, character for
  character.
- **SC-002**: On the not-found page, the meta description equals the headline text, character for
  character.
- **SC-003**: On all 9 content pages, the meta description equals the headline text.
- **SC-004**: A case-sensitive search for "Enterprise-grade web, SEO, AI, and marketing services"
  finds 0 matches in the site outside specs that quote it as history.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- "Match the H1 text" means the description is the headline text with nothing added or removed. The
  headlines are "Enterprise services for small business" (spec 027) and "Page not found".
- URL matching is already handled: the content pages' addresses follow their file names and
  headlines, and the owner said most pages are already good. This spec does not change any address.
- The two descriptions are short by search engine norms; the owner chose the wording, so length is not
  changed.
- Content page descriptions are checked against their headlines as part of this spec. If one is found
  not to match, it is reported to the owner and not changed here.
- This depends on spec 027 (the new home headline). If the headline changes again, the description
  changes with it.
- This is a small metadata change. Implement directly; no plan or tasks needed.
