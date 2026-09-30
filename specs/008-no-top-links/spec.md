# Feature Specification: No Links to "#top", and a Plain Footer Logo

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "The logo and wordmark in the footer are wrapped in a link to "#top". This should not be a link. Furthermore, there should never be a link to "#top" anywhere."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The footer logo is not a link (Priority: P1)

A visitor looking at the footer sees the logo mark and the "Andexor Network" wordmark as plain
branding. It is not a link: it does not react to hover, it does not appear in keyboard tab order,
and screen readers do not announce it as a link.

**Why this priority**: This is the case the owner found. Today the footer logo is wrapped in a
link to `#top`, which scrolls the page up and adds a link no one asked for.

**Independent Test**: Open the home page, the Web Development page, and the "Page not found" page.
In each footer, the logo lockup is not inside a link, and tabbing through the page never lands on
it.

**Acceptance Scenarios**:

1. **Given** any page, **When** the footer is viewed, **Then** the logo and wordmark are shown but
   are not a link.
2. **Given** a keyboard user tabbing through a page, **When** focus reaches the footer, **Then** no
   stop lands on the footer logo.
3. **Given** a screen reader listing the page's links, **When** it reaches the footer, **Then** the
   footer logo is not listed as a link.
4. **Given** the footer logo, **When** a visitor hovers or clicks it, **Then** nothing happens and
   the page does not scroll.

---

### User Story 2 - No link to "#top" anywhere (Priority: P1)

No link anywhere on the site goes to `#top`: not in the footer, the header, cards, Markdown pages,
or any component added later. Links that go to another page, such as the header logo on content
pages (which goes to the home page) and "Go to the home page", are unaffected.

**Why this priority**: The owner wants this as a standing rule for the whole site, so it must not
come back in a new page or component.

**Independent Test**: On every page, list all links. None has an address ending in `#top`. A check
also runs over the site's source so a new `#top` link fails the build's tests.

**Acceptance Scenarios**:

1. **Given** any page on the site, **When** all its links are listed, **Then** none goes to
   `#top`.
2. **Given** a Markdown page whose author writes a link to `#top`, **When** the site is checked,
   **Then** the check fails and names the file.
3. **Given** the header logo on a content page, **When** it is activated, **Then** it still goes to
   the home page.

---

### Edge Cases

- The header logo on content pages links to the home page (`/`), not `#top`. It stays a link.
- The home page's hero brand row is already not a link and stays that way.
- The footer's other links (Web Development, Privacy, Terms, social icons, and so on) are not
  changed by this. Placeholder links whose address is `#` are outside this rule.
- The `id` on the page that used to be the target may stay if something else needs it; it is not a
  link.
- A visitor who wants to return to the top uses the browser or keyboard. The site adds no "back to
  top" control.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer logo and wordmark MUST NOT be a link, on every page that shows the footer.
- **FR-002**: The footer logo MUST keep its current look (mark, wordmark, size, and light color).
- **FR-003**: No link anywhere on the site MUST go to `#top`.
- **FR-004**: The rule MUST hold for pages and components added later. An automated check MUST fail
  if any source file, including Markdown content, links to `#top`.
- **FR-005**: The header logo on content pages MUST keep linking to the home page.
- **FR-006**: The home page hero brand row MUST stay a non-link.
- **FR-007**: The footer logo MUST NOT appear in keyboard tab order or be announced as a link.

### Key Entities

- **Logo lockup**: The logo mark plus wordmark. It is a link only where it goes to another page (the
  header on content pages); in the footer and the home page hero it is plain branding.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages checked (home, Web Development, "Page not found"), the footer logo
  is not inside a link.
- **SC-002**: On 100% of pages checked, 0 links have an address ending in `#top`.
- **SC-003**: Tabbing through each page never focuses the footer logo. (The automated tab-order
  check skips WebKit, as the site's other keyboard tests do, because Safari skips links when
  tabbing by default. The footer logo is a plain block, so it has no tab stop in any browser.)
- **SC-004**: Adding a link to `#top` anywhere in the site's source makes the automated tests fail.
- **SC-005**: The footer logo looks exactly as it does today.

## Assumptions

- "Anywhere" means every page a visitor can reach and every source file that builds one:
  components, styles, and Markdown pages. Sample content inside tests is outside the rule.
- Removing the link is enough; the footer logo does not need another action.
- The header logo on content pages is a link to the home page and is a different case, so it stays.
- This amends earlier requirements that made the footer logo scroll to the top: spec 002 (FR-010),
  the Amendments in spec 001, and spec 003's logo contract. Those must be updated to match.
- Like the underline rule, this is a standing owner rule and is recorded in the constitution or
  `CLAUDE.md`, so it does not have to be repeated.
