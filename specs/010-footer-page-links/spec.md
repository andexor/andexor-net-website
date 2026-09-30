# Feature Specification: Footer Links to the New Stub Pages

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Create empty stubs of all other pages mentioned in the footer. The pages have been created. All that is left now is to update the links in the footer to point to the new pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Footer service links open their pages (Priority: P1)

A visitor scrolling to the footer sees the Technical Services and Business Services columns.
Each entry now opens its own page instead of doing nothing: Web Hosting, Technical SEO, Agentic
Systems, Cost Reduction, Lead Generation, Growth Marketing, and Process Re-engineering. (Web
Development already works.) Each page is an empty stub: the shared page layout with its title and
image, and no further copy yet.

**Why this priority**: These seven links are the main gap. Today they go nowhere, so a visitor who
is curious about a service hits a dead end.

**Independent Test**: On the home page, activate each of the seven footer entries in turn. Each
one opens a page whose heading matches the entry and whose layout matches the Web Development page.

**Acceptance Scenarios**:

1. **Given** the home page footer, **When** a visitor activates "Web Hosting", **Then** the "Web
   Hosting" page opens.
2. **Given** the home page footer, **When** a visitor activates any of the other six entries
   listed above, **Then** the page with that name opens.
3. **Given** any of the new pages, **When** it is viewed, **Then** it shows the shared header and
   footer, the page heading, and the page image, and reports no error.

---

### User Story 2 - The About Us link opens its page (Priority: P1)

A visitor who wants to know who is behind the company activates "About Us" in the Company column
of the footer and lands on the About Us page (also a stub).

**Why this priority**: It is the same fix as story 1 for the third column, and "About Us" is one of
the first things a prospective customer looks for.

**Independent Test**: Activate "About Us" in the footer of the home page. The About Us page opens.

**Acceptance Scenarios**:

1. **Given** the footer on any page, **When** a visitor activates "About Us", **Then** the About Us
   page opens.

---

### User Story 3 - Footer links work from every page (Priority: P2)

The footer appears on the home page, the content pages, and the "Page not found" page. Its links
lead to the same pages from all of them.

**Why this priority**: A relative or page-specific address would work on the home page and break
elsewhere. It is a common mistake, but the home page case already delivers the value.

**Independent Test**: From the Web Development page and from the "Page not found" page, activate
each updated footer link. Each opens the right page.

**Acceptance Scenarios**:

1. **Given** the footer on a content page, **When** a visitor activates "Growth Marketing",
   **Then** the Growth Marketing page opens, not a broken address.
2. **Given** the footer on the "Page not found" page, **When** a visitor activates any updated
   link, **Then** the matching page opens.

---

### Edge Cases

- "Contact", "Privacy", and "Terms" are placeholder links today (activating them does nothing) and
  have no pages. They are not changed by this feature.
- The footer's social links, and the "Web Development" link, are unchanged.
- A footer entry always matches the page's own title (for example, "Agentic Systems" and
  "About Us"), so the footer and the page heading never disagree.
- A visitor on a stub page who activates that page's own footer link stays on that page and sees
  no error.
- The stub pages are reachable only through the footer; the home page's service cards are not
  changed here.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each of these footer entries MUST open the page of the same name: Web Hosting,
  Technical SEO, Agentic Systems, Cost Reduction, Lead Generation, Growth Marketing, Process
  Re-engineering, and About Us.
- **FR-002**: The links MUST work from every page that shows the footer, including the home page,
  the content pages, and the "Page not found" page.
- **FR-003**: The footer's existing behavior MUST be unchanged for "Web Development", "Contact",
  "Privacy", "Terms", and the social links.
- **FR-004**: The footer's look, wording, and link colors MUST be unchanged. Links MUST NOT gain an
  underline at rest, on hover, or on focus.
- **FR-005**: No footer link MUST go to `#top`.
- **FR-006**: The new pages MUST be the Markdown pages already added under `content/`. Their copy
  is not written by this feature; they stay empty stubs.
- **FR-007**: An automated check MUST fail if any of the eight footer entries above does not lead
  to an existing page, so a renamed or removed page cannot leave a dead footer link.

### Key Entities

- **Footer entry**: A label in one of the three footer columns and the page address it opens.
- **Stub page**: A content page with a title, a category label, an image, and a heading, and no
  body copy yet.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 8 of 8 listed footer entries open the page of the same name, from the home page.
- **SC-002**: The same 8 links open the right page from a content page and from the "Page not
  found" page.
- **SC-003**: 0 of the eight new pages reports an error or shows a missing image.
- **SC-004**: The footer looks the same as before, apart from where its links lead.
- **SC-005**: Removing or renaming one of the eight pages makes the automated tests fail.

## Assumptions

- The owner has said these pages are ready to be linked, which lifts the rule that content pages
  stay out of the footer until then. Constitution Principle VIII may need a note that the footer
  now links to them.
- "All other pages mentioned in the footer" means the eight pages that now exist. "Contact" has no page (the
  Contact Us popup is opened from the home page buttons, not the footer), and "Privacy" and "Terms"
  are legal pages nobody has asked for yet, so all three keep their placeholder links.
- The footer labels "Agentic Systems" and "About Us" replace the older "AI Systems" and "About",
  already changed in the working tree, and match the page titles.
- The home page service card that used to read "AI Systems" reads "Agentic Systems" now. Making
  the service cards link to their pages is a separate change.
- Page addresses follow the file names (for example, `content/web-hosting.md` is `/web-hosting`),
  as the existing content page rule says.
- Like other small live-site tweaks, this does not need a large amendment of earlier specs beyond
  updating spec 001 FR-017, which says all footer links other than Web Development are
  placeholders.
