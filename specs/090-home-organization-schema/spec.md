# Feature Specification: Organization Structured Data on the Home Page

**Feature Branch**: `108-organization-schema` (current branch; not created by this spec)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Add the following content to the <head> only on the home page. import organization from \"@/lib/schema/organization.json\"; import { JsonLD } from \"@/components/JsonLD\"; <JsonLD data={organization} />"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search engines read the company's details from the home page (Priority: P1)

A search engine or other crawler opens the home page and finds a machine-readable description of Andexor Network, Inc.: its name, web address, contact point, founder, founding date, logo, social profiles, service area, and slogan. The description is in the head of the page, so it is read with the rest of the page's head information.

**Why this priority**: This is the whole purpose of the feature. Nothing else on the site changes.

**Independent Test**: Load the built home page, find the structured data block in its head, and confirm it contains the Organization details from the organization file.

**Acceptance Scenarios**:

1. **Given** the built home page, **When** its head is read, **Then** an Organization structured data block is present in the head.
2. **Given** the structured data block, **When** it is parsed, **Then** it contains the values in the organization file, unchanged.
3. **Given** the structured data block, **When** a structured data validator checks it, **Then** it reports the Organization with no errors.

---

### User Story 2 - Other pages stay the same (Priority: P2)

Only the home page carries the structured data block. Content pages and the not-found page have the same head as before.

**Why this priority**: The owner asked for the home page only. Adding it everywhere would be an unplanned change.

**Independent Test**: Load each built page other than the home page and confirm none contains the Organization structured data block.

**Acceptance Scenarios**:

1. **Given** any built page other than the home page, **When** its head is read, **Then** it has no Organization structured data block.

---

### User Story 3 - The home page still loads and works (Priority: P3)

A visitor loads the home page and the page renders and responds as it did before. The structured data block is not shown as visible text and does not cause a page-load error.

**Why this priority**: The site's consent banner and page startup are sensitive to changes in the head. A broken home page is worse than no structured data.

**Independent Test**: Load the home page in a browser with no saved consent choice and with a saved choice. Confirm the page renders, the hero and footer are shown, and the browser console reports no hydration error.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** the home page loads, **Then** the page renders and the browser console shows no error about page hydration.
2. **Given** the home page, **When** it is viewed, **Then** no text from the structured data block is visible.

---

### Edge Cases

- The organization file changes later. The structured data block must reflect the new values after the next build, with no other edit.
- A value in the organization file contains a "<" character. It must not end the script block early.
- The consent script must remain the first script in the head, as the constitution requires. The structured data block must not come before it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The built home page MUST contain exactly one Organization structured data block in its head.
- **FR-002**: The structured data block MUST contain the values of the organization data file (`src/lib/schema/organization.json`), with no values added or removed by the build.
- **FR-003**: No built page other than the home page MUST contain the structured data block.
- **FR-004**: The structured data block MUST NOT be rendered as visible text on the home page.
- **FR-005**: The home page MUST NOT produce a page-hydration error for a first-time visitor or a visitor with a saved consent choice.
- **FR-006**: The consent script MUST remain the first script in the home page head.
- **FR-007**: The `<` character in the data MUST be escaped so the block cannot end early.

### Key Entities

- **Organization**: Andexor Network, Inc., described by the organization data file. Its details are the source of the block; this feature does not change them.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The built home page has exactly one Organization structured data block, in its head.
- **SC-002**: Zero built pages other than the home page contain the block.
- **SC-003**: A structured data validator reports zero errors for the home page's block.
- **SC-004**: The home page renders with zero page-hydration errors for both a first-time visitor and a returning visitor with a saved choice.
- **SC-005**: No text from the block is visible on the home page.

## Assumptions

- The organization data file is the source of truth. Its current values, including the slogan, are correct for this feature.
- The block is a schema.org Organization in JSON-LD. Nothing else, such as a WebSite or WebPage block, is added.
- Placing the block in the head, rather than in the page body, is part of the requirement. A component rendered in the page body would not meet it.
- The organization file and the JSON-LD component are untracked in this working tree while the branch `108-organization-schema` is developed. Committing them is part of that branch's work, not this spec.
- Automated tests follow the project's test rules: they check behavior such as placement, home-page-only presence, and startup, not the wording of the values.
