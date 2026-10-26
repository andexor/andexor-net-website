# Feature Specification: Footer Text Size

**Feature Branch**: `87-implement-cookiebot`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Change the font size for the copyright line and the line below it so they are both 16px,
the same as the rest of the links in the footer."

Follows spec 078 (the Do Not Sell or Share My Personal Information link under the copyright line) and spec 001 (the home page and
footer). The copyright line and the link below it are 13px, and the column links around them are 16px.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The footer text is one size (Priority: P1)

A visitor reads the footer and sees the copyright line and the "Do Not Sell or Share My Personal Information" link at
the same size as the footer's column links.

**Why this priority**: The two lines are smaller than everything around them, which makes them harder to read and makes
the footer look uneven.

**Independent Test**: Run `bun run build`, serve `out/`, open any page, and compare the two lines with the column links.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** the copyright line is read, **Then** its text is 16px.
2. **Given** any page with the footer, **When** the "Do Not Sell or Share My Personal Information" link is read,
   **Then** its text is 16px, the same as the column links.
3. **Given** a 360px-wide phone screen, **When** the footer is read, **Then** both lines are fully visible and the page
   does not scroll sideways.

## Requirements *(mandatory)*

- **FR-001**: The copyright line in the footer MUST be 16px.
- **FR-002**: The link below the copyright line MUST be 16px.
- **FR-003**: Nothing else about the two lines changes: their text, colors, spacing, link target, and the absence of an
  underline stay as they are.

## Success Criteria *(mandatory)*

- **SC-001**: The two lines are the same size as the column links on every page.
- **SC-002**: No page scrolls sideways at 360px because of the larger text.

## Assumptions

- "The line below it" is the Do Not Sell or Share My Personal Information link.
- "16px" matches the column links, which are 16px.
- No test is written for the pixel size (project rule: no tests for exact pixel sizes). The 360px check is covered by
  the existing no-sideways-scroll checks.
