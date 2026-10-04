# Feature Specification: Page Title Format

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Make sure all page titles are the H1 text + " | Andexor Network"."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every page title is its headline plus the company name (Priority: P1)

A visitor, or a search engine, sees a page's title in the browser tab and in search results. On
every page the title is the page's headline, then a space, a vertical bar, a space, and "Andexor
Network". For example, the Web Development page's title is "Web Development | Andexor Network" and
the home page's title is "Enterprise services for small business | Andexor Network".

**Why this priority**: The owner wants the URL, headline, description, and title to agree for search
results (see spec 028). The home page is the one page whose title does not follow the pattern today:
it is just "Andexor Network".

**Independent Test**: Load every page (the home page, all 9 content pages, and the not-found page)
and compare each page's title with its visible headline. Each title is exactly the headline text
followed by " | Andexor Network".

**Acceptance Scenarios**:

1. **Given** the home page, **When** its title is read, **Then** it is exactly "Enterprise services
   for small business | Andexor Network".
2. **Given** each content page, **When** its title is read, **Then** it is exactly its headline text
   followed by " | Andexor Network".
3. **Given** an unknown address, **When** the not-found page loads, **Then** its title is exactly
   "Page not found | Andexor Network".
4. **Given** any page, **When** its title is compared with its visible headline, **Then** the text
   before " | Andexor Network" is identical to the headline.

---

### Edge Cases

- Nine content pages and the not-found page already follow the pattern. They are checked, not
  assumed, and are only changed if a title is found not to match.
- When the owner edits a page's headline or title, the two can drift apart. A check that fails
  when any page's title does not equal its headline plus " | Andexor Network" prevents that.
- Visible headlines, descriptions, and addresses are unchanged. This spec only affects titles.
- Titles contain no extra spaces, and the separator is the plain vertical bar with one space on each
  side.
- The product name "Andexor Network" (no "Inc.") is unchanged (spec 005).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page's title MUST be its headline text followed by " | Andexor Network".
- **FR-002**: The home page's title MUST be exactly "Enterprise services for small business |
  Andexor Network".
- **FR-003**: The not-found page's title MUST be exactly "Page not found | Andexor Network", and the
  content pages' titles MUST remain their headline text followed by " | Andexor Network".
- **FR-004**: An automated check MUST fail if any page's title is not its headline followed by
  " | Andexor Network", so the rule holds when pages are added or edited.
- **FR-005**: Headlines, descriptions, addresses, and the 404 status MUST NOT change.
- **FR-006**: The content authoring instructions (`content/README.md`) and any other document that
  describes how titles are formed MUST say the title is the headline plus " | Andexor Network", so
  the owner can follow the rule without asking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On all 11 pages (home, 9 content pages, not-found), the title equals the headline text
  plus " | Andexor Network", character for character.
- **SC-002**: The home page's title no longer reads just "Andexor Network".
- **SC-003**: The automated check fails when a page's title is changed to anything else, and passes
  on the current site.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- "H1 text" means the visible headline text of the page, with nothing added or removed. The home
  headline is "Enterprise services for small business" (spec 027).
- This depends on spec 027 (the new home headline) and fits with spec 028 (meta descriptions). If
  a headline changes again, its title changes with it.
- The title text for content pages comes from each page's own front matter, and the owner may edit
  it. The automated check in FR-004 is what keeps those titles honest.
- This is a small metadata change. Implement directly; no plan or tasks needed.
