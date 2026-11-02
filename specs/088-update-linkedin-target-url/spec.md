# Feature Specification: Point the Footer LinkedIn Icon at the Company Page

**Feature Branch**: `104-update-linkedin-target-url`

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "As a Product Manager, I want to update the link target for the LinkedIn icon in the footer so that it points to the Andexor Network company page. Clicking on the LinkedIn icon in the footer will take you to the Andexor Network company page instead of my personal profile. OLD: https://www.linkedin.com/in/ejenkins/ NEW: https://www.linkedin.com/company/andexor/"

Builds on specs 042, 044, and 061, which added the footer's social icons, their accessible names, and their alt text.

## What the site does today

- The footer shows three social icons: LinkedIn, X, and GitHub. The X and GitHub icons go to Andexor's own accounts.
- The LinkedIn icon goes to the personal profile of the company's founder, `https://www.linkedin.com/in/ejenkins/`, not to a page that belongs to Andexor Network, Inc.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach the company page from the footer (Priority: P1)

A visitor who wants to follow or learn more about Andexor Network, Inc. on LinkedIn clicks the LinkedIn icon in the footer and lands on the company's LinkedIn page.

**Why this priority**: This is the whole change. The icon is branded as the company's, so it should lead to the company's page.

**Independent Test**: Open any page with the footer, click the LinkedIn icon, and check that the new tab opens `https://www.linkedin.com/company/andexor/`.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** a visitor clicks the LinkedIn icon, **Then** the Andexor Network company page, `https://www.linkedin.com/company/andexor/`, opens.
2. **Given** any page with the footer, **When** its links are read, **Then** no footer link points to `https://www.linkedin.com/in/ejenkins/`.
3. **Given** the footer, **When** a visitor uses the LinkedIn icon, **Then** it still opens in a new tab, keeps its accessible name, and looks and behaves like the X and GitHub icons (keyboard focus, hover color, size).

### Edge Cases

- The founder's personal profile link in the About Us page text (`content/about-us.md`) names a person, not the company, so it stays as it is.
- Pages that are not linked from the home page yet still get the same footer, so they get the new address too.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer's LinkedIn icon MUST link to `https://www.linkedin.com/company/andexor/`.
- **FR-002**: No other link in the footer MUST change, and the LinkedIn icon MUST keep opening in a new tab, with its accessible name, size, hover color, and focus ring unchanged.
- **FR-003**: The address `https://www.linkedin.com/in/ejenkins/` MUST NOT appear in the footer.
- **FR-004**: The site's rules still apply: no link underline at rest, on hover, or on focus, straight quotes only, always dark, and no copy, wording, color, or spacing tests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages with the footer, the LinkedIn icon leads to the Andexor Network company page in one click.
- **SC-002**: 0 footer links lead to the founder's personal LinkedIn profile.
- **SC-003**: The footer's other two social icons and its text links behave exactly as before.

## Assumptions

- `https://www.linkedin.com/company/andexor/` is the correct, live company page, as supplied by the owner.
- The icon's accessible name, "LinkedIn logo, Andexor profile, opens in new tab", is still accurate for a company page, so it does not change.
- The earlier specs that list the old address (042, 044, 061) describe what was built at the time and are not edited.
- No new tests are needed for the exact address. Existing footer checks cover the icon's name, size, and behavior.
