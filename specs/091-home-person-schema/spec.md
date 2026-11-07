# Feature Specification: Person Structured Data on the Home Page

**Feature Branch**: `110-person-schema` (current branch; not created by this spec)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Add a Person schema snippet to the home page, just like we did for the Organization schema. I already created the JSON file to get it started."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search engines read the CEO's details from the home page (Priority: P1)

A search engine or other crawler opens the home page and finds a machine-readable description of Ed Jenkins, CEO of Andexor Network, Inc.: his name, job title, description, contact details, profiles, languages, areas of knowledge, and skills. The description is in the head of the page, next to the Organization description from spec 090.

**Why this priority**: This is the whole purpose of the feature. Nothing else on the site changes.

**Independent Test**: Load the built home page, find the Person structured data block in its head, and confirm it contains the values from the person data file.

**Acceptance Scenarios**:

1. **Given** the built home page, **When** its head is read, **Then** a Person structured data block is present in the head.
2. **Given** the Person structured data block, **When** it is parsed, **Then** it contains the values in the person data file, unchanged.
3. **Given** the Person structured data block, **When** a structured data validator checks it, **Then** it reports the Person with no errors.

---

### User Story 2 - Other pages stay the same (Priority: P2)

Only the home page carries the Person structured data block. Content pages and the not-found page have the same head as before.

**Why this priority**: The owner asked for the home page only. Adding it everywhere would be an unplanned change.

**Independent Test**: Load each built page other than the home page and confirm none contains the Person structured data block.

**Acceptance Scenarios**:

1. **Given** any built page other than the home page, **When** its head is read, **Then** it has no Person structured data block.

---

### User Story 3 - The home page still loads and works (Priority: P3)

A visitor loads the home page and the page renders and responds as it did before. The structured data block is not shown as visible text and does not cause a page-load error.

**Why this priority**: The site's consent banner and page startup are sensitive to changes in the head. A broken home page is worse than no structured data.

**Independent Test**: Load the home page in a browser with no saved consent choice and with a saved choice. Confirm the page renders, the hero and footer are shown, and the browser console reports no hydration error.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** the home page loads, **Then** the page renders and the browser console shows no error about page hydration.
2. **Given** the home page, **When** it is viewed, **Then** no text from the Person structured data block is visible.

---

### Edge Cases

- The person data file changes later. The structured data block must reflect the new values after the next build, with no other edit.
- A value in the person data file contains a "<" character. It must not end the script block early.
- The consent script must remain the first script in the head, as the constitution requires. The Person block must not come before it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The built home page MUST contain exactly one Person structured data block in its head.
- **FR-002**: The Person structured data block MUST contain the values of the person data file (`src/lib/schema/ed.json`), with no values added or removed by the build.
- **FR-003**: No built page other than the home page MUST contain the Person structured data block.
- **FR-004**: The Person structured data block MUST NOT be rendered as visible text on the home page.
- **FR-005**: The home page MUST NOT produce a page-hydration error for a first-time visitor or a visitor with a saved consent choice.
- **FR-006**: The consent script MUST remain the first script in the home page head.
- **FR-007**: The `<` character in the data MUST be escaped so the block cannot end early.
- **FR-008**: On the home page, the Person block MUST come after the Organization block from spec 090 and before the whitespace, focus, and dialog scripts.
- **FR-009**: The Organization structured data block from spec 090 MUST keep its current content and position, except for the order change in FR-008.

### Key Entities

- **Person**: Ed Jenkins, CEO of Andexor Network, Inc., described by the person data file. Its details are the source of the block; this feature does not change them.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The built home page has exactly one Person structured data block, in its head.
- **SC-002**: Zero built pages other than the home page contain the Person block.
- **SC-003**: A structured data validator reports zero errors for the home page's Person block.
- **SC-004**: The home page renders with zero page-hydration errors for both a first-time visitor and a returning visitor with a saved choice.
- **SC-005**: No text from the Person block is visible on the home page.

## Assumptions

- The person data file is the source of truth. Its current values are correct for this feature, including the skills and areas of knowledge it lists.
- The block is a schema.org Person in JSON-LD, added the same way as the Organization block in spec 090: by the build, for the home page only, not by a component in the page body.
- The Person block is a separate block from the Organization block. The Organization block's founder entry is not changed by this feature.
- The email address and telephone number in the Person block are already published in the Organization block on the home page, so this feature adds no new contact details to the page.
- Every property in the file is a schema.org Person property with a valid value type. Pronouns were removed because schema.org lists them only as a pending term that expects a structured value, not a plain string, and validators disagree about it.
- The person data file is untracked in this working tree while the branch `110-person-schema` is developed. Committing it is part of that branch's work, not this spec.
- Automated tests follow the project's test rules: they check behavior such as placement, home-page-only presence, and startup, not the wording of the values.
