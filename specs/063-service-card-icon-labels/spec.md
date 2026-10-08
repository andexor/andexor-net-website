# Feature Specification: Service Card Icon Labels

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Set an aria-label on the images in the cards on the home page like this: Web Development: source code icon, Web Hosting: web servers icon, Technical SEO: magnifying glass icon, Agentic Systems: A.I. chip icon, Cost Reduction: line chart trending down icon, Lead Generation: sales funnel icon, Growth Marketing: line chart trending up icon, Process Re-engineering: roadmap icon"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Service card icons describe themselves (Priority: P1)

Each of the eight service cards on the home page shows an icon beside its title. Today those icons are hidden from
assistive technology, so a visitor using a screen reader hears nothing about them. After this change each icon has a
short description of what it shows. Nothing looks different on screen.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the home page, find the icon in each of the eight service cards, and read its label: they
match the table below exactly.

| Card                   | Icon label                          |
|------------------------|-------------------------------------|
| Web Development        | source code icon                    |
| Web Hosting            | web servers icon                    |
| Technical SEO          | magnifying glass icon               |
| Agentic Systems        | A.I. chip icon                      |
| Cost Reduction         | line chart trending down icon       |
| Lead Generation        | sales funnel icon                   |
| Growth Marketing       | line chart trending up icon         |
| Process Re-engineering | roadmap icon                        |

**Acceptance Scenarios**:

1. **Given** the home page, **When** the icon in each service card is read by assistive technology, **Then** its label is
   the text in the table for that card, exactly.
2. **Given** the home page, **When** it is viewed, **Then** the icons and cards look, size, color, and behave exactly as
   before, and each card still links to its page.
3. **Given** a card, **When** it is read by a screen reader, **Then** the icon is announced once, as an image, with one
   label, followed by the card's title and text.

---

### Edge Cases

- The check-mark icons beside each card's bullet points are decoration and stay hidden from assistive technology. Only
  the one icon beside each card's title gets a label.
- The label is written exactly as the owner gave it, including "A.I." with periods and "Re-engineering" with a hyphen
  (that is the card title's own spelling).
- The labels are descriptions of the pictures, not the service names; the card title still names the service.
- If a card's icon is swapped for a different picture later, its label must be changed with it.
- The icons appear in the cards only on the home page. Content pages do not use these icons.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The icon in each of the eight home page service cards MUST have the label shown for it in the table in User
  Story 1, exactly.
- **FR-002**: Each label MUST be set as an `aria-label` on the icon image itself, and the icon MUST be exposed to
  assistive technology as an image (no longer hidden), so it is announced once with that label. No `alt` attribute is
  written (it is not valid on an inline SVG, as in specs 044 and 061).
- **FR-003**: The bullet-point check-mark icons MUST stay hidden from assistive technology.
- **FR-004**: The look, size, color, spacing, layout, and link behavior of the cards MUST NOT change.
- **FR-005**: The labels MUST live with each service's other card data, so a service's icon and its label are changed
  together.
- **FR-006**: A test MUST check each card's icon label against the table. Tests MUST NOT count anything.
- **FR-007**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Service card icon**: the picture beside a service card's title on the home page, with a label that says what the
  picture shows.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the home page, 100% of the service card title icons have the exact label in the table.
- **SC-002**: No service card title icon is hidden from assistive technology, and no bullet check-mark icon is exposed.
- **SC-003**: The page looks identical before and after, and each card still opens its page.
- **SC-004**: All existing tests pass and no new accessibility violations appear.

## Assumptions

- "Images in the cards" means the one icon beside each service card's title; the bullet check marks are decoration.
- "aria-label" is used because an inline SVG has no alt attribute; this matches how spec 061 names the footer icons.
- The labels are used exactly as given, including their wording and capitalization.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
