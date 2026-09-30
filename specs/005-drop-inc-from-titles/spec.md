# Feature Specification: Drop ", Inc." from Page Titles

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: As-built (retrospective)

**Input**: User description: "Drop ", Inc." from page titles. Browser tab titles read "Andexor Network" for the home page and "<Page> | Andexor Network" for other pages (for example "Web Development | Andexor Network" and "Page not found | Andexor Network"). "Andexor Network, Inc." appears only in the footer copyright line, not in titles or the page body. The owner reviewed Apple, Google, and Microsoft: none of them use ", Inc." in titles or the page body; it appears only in the footer."

> **Retrospective note**: This change was built and verified before this spec was written. It
> amends the page-title rule in `specs/002-content-pages-card-template/spec.md` (which said the
> site appends "| Andexor Network, Inc.") and FR-010 in `specs/003-logo-wordmark/spec.md`. Both
> were updated to match. Where they differ, this spec is the detailed record of the title rule.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean titles in browser tabs (Priority: P1)

A visitor sees "Andexor Network" as the browser tab title on the home page, and
"<Page> | Andexor Network" on every other page, for example "Web Development | Andexor Network".
The "Page not found" page reads "Page not found | Andexor Network". No title contains ", Inc.".

**Why this priority**: Tab titles, bookmarks, history, and search results all show the title. The
shorter name reads like other well-known company sites and fits more of the page name in a narrow
tab.

**Independent Test**: Open the home page, the Web Development page, and a URL that does not exist.
Read each browser tab title.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** they read the tab title, **Then** it is
   "Andexor Network".
2. **Given** a visitor on the Web Development page, **When** they read the tab title, **Then** it
   is "Web Development | Andexor Network".
3. **Given** a visitor on a URL that does not exist, **When** they read the tab title, **Then** it
   is "Page not found | Andexor Network".
4. **Given** any Markdown content page added later, **When** its title is shown, **Then** it reads
   "<page title> | Andexor Network".

---

### User Story 2 - The legal name only in the footer (Priority: P1)

"Andexor Network, Inc." appears in exactly one place on the site: the footer copyright line
("© 2026 Andexor Network, Inc. All rights reserved."). It does not appear in titles, headings,
the logo, or the page body.

**Why this priority**: The legal form belongs where a legal notice goes. The owner's review of
Apple, Google, and Microsoft found none of them use ", Inc." in titles or the page body.

**Independent Test**: On the home page, a content page, and the "Page not found" page, search the
visible text for "Network, Inc.". Exactly one match appears on each, in the footer copyright line.

**Acceptance Scenarios**:

1. **Given** any page, **When** its visible text is searched for "Network, Inc.", **Then** the only
   match is the footer copyright line.
2. **Given** any page, **When** its footer is viewed, **Then** the copyright line still reads
   "© 2026 Andexor Network, Inc. All rights reserved."

---

### Edge Cases

- A content page with no explicit title falls back to its first heading or file name, and still
  gets the "| Andexor Network" suffix.
- The site-wide default title (used when a page sets none) is "Andexor Network".
- Source file license headers and the repository's own documents keep the legal name; they are not
  visitor-facing pages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page title MUST be "Andexor Network".
- **FR-002**: Every other page title MUST be "<page title> | Andexor Network", including the
  "Page not found" page.
- **FR-003**: No page title MUST contain ", Inc.".
- **FR-004**: "Andexor Network, Inc." MUST appear in the footer copyright line and nowhere else in
  a page's visible text.
- **FR-005**: The footer copyright line MUST keep its current wording.

### Key Entities

- **Page title**: The text shown in the browser tab, made of the page's own title plus the
  "| Andexor Network" suffix (none on the home page).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages checked (home, Web Development, "Page not found"), the tab title
  contains "Andexor Network" and does not contain ", Inc.".
- **SC-002**: On 100% of pages checked, the visible text contains "Network, Inc." exactly once, in
  the footer copyright line.
- **SC-003**: The footer copyright line is word-for-word unchanged.

## Assumptions

- The owner reviewed Apple, Google, and Microsoft, and none use ", Inc." in titles or the page body;
  it appears only in the footer. This site follows that practice.
- The legal name stays in the footer because that is where a legal notice belongs.
- Repository documents and source file headers are not visitor-facing pages and keep the legal name.
- This spec records an already built and verified change (see `specs/003-logo-wordmark/`, Phase 7),
  so it has no separate plan or task list.
