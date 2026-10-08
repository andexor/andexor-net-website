# Feature Specification: Social Icon Descriptions

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Set the alt text for the social media icons as follows: LinkedIn: LinkedIn logo, Andexor profile, opens in new tab. X: X logo, Andexor profile, opens in new tab. GitHub: GitHub logo, Andexor organization, opens in new tab"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Social icons say where they go (Priority: P1)

The three social icons in the footer (LinkedIn, X, GitHub) are named only "LinkedIn", "X", and "GitHub" today (spec 044).
A visitor using a screen reader, or whose icons fail to load, learns nothing about what the link opens. After this
change each icon has a full description: which logo it is, whose page it leads to, and that it opens in a new tab.
Nothing looks different on screen.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open any page, find the three social icons in the footer, and read each one's name: they match the
table below exactly.

| Icon     | Description                                                  |
|----------|--------------------------------------------------------------|
| LinkedIn | LinkedIn logo, Andexor profile, opens in new tab             |
| X        | X logo, Andexor profile, opens in new tab                    |
| GitHub   | GitHub logo, Andexor organization, opens in new tab          |

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the LinkedIn icon link is read by assistive technology, **Then** its name
   is "LinkedIn logo, Andexor profile, opens in new tab".
2. **Given** any page with the footer, **When** the X icon link is read, **Then** its name is "X logo, Andexor profile,
   opens in new tab".
3. **Given** any page with the footer, **When** the GitHub icon link is read, **Then** its name is "GitHub logo, Andexor
   organization, opens in new tab".
4. **Given** the footer, **When** it is viewed, **Then** the icons look, size, color, and behave exactly as before, and
   each link still opens its page in a new tab.
5. **Given** the footer, **When** each icon is read, **Then** each is announced once, with one name, as an image inside a
   link (not twice).

---

### Edge Cases

- HTML has no alt attribute on an inline SVG icon. Spec 044 settled that the name goes on the icon as its accessible
  label, not as an `alt` attribute (which would be invalid there). The owner's "alt text" means that name, and it is
  written the same way.
- The names include commas. A screen reader reads them as short pauses, which is intended.
- The names replace the three short names from spec 044; both must not exist at once. A link whose name is just
  "LinkedIn", "X", or "GitHub" no longer exists in the footer.
- The text "opens in new tab" matches how the links behave today. If a link stops opening a new tab, its description
  must be changed with it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The LinkedIn icon's name MUST be exactly "LinkedIn logo, Andexor profile, opens in new tab".
- **FR-002**: The X icon's name MUST be exactly "X logo, Andexor profile, opens in new tab".
- **FR-003**: The GitHub icon's name MUST be exactly "GitHub logo, Andexor organization, opens in new tab".
- **FR-004**: Each name MUST be on the icon image, as in spec 044, not on the link, so each icon is announced once as an
  image in a link. No `alt` attribute is written on the icons.
- **FR-005**: The look, size, color, spacing, destinations, and new-tab behavior of the icons MUST NOT change.
- **FR-006**: The tests from spec 044 (`tests/e2e/social-icon-names.spec.ts`) that expect the short names MUST be updated
  to expect the full descriptions, and any other test that finds these links by the short names MUST be updated. Tests
  MUST NOT count anything.
- **FR-007**: Spec 044 MUST be marked as superseded for the names, so the two specs do not contradict each other.
- **FR-008**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Social icon**: a footer link to one of the company's social profiles, drawn as a Font Awesome icon, with a name that
  says which logo it is, whose profile or organization it opens, and that it opens in a new tab.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every page, 100% of the footer social icons have the exact description in the table.
- **SC-002**: No footer social link is named only "LinkedIn", "X", or "GitHub".
- **SC-003**: The icons look identical before and after, and each link still opens its page in a new tab.
- **SC-004**: All existing tests pass (with the name expectations updated), and no new accessibility violations appear.

## Assumptions

- "Alt text" means the icon's accessible name, written as spec 044 does, because an `alt` attribute is not valid on an
  inline SVG.
- The descriptions are used exactly as given, with the owner's wording ("Andexor profile" for LinkedIn and X, "Andexor
  organization" for GitHub), whatever the account behind each link is.
- The social icons appear only in the footer.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
