# Feature Specification: Home Page Service Cards Link to Their Pages

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Update the service cards on the home page to link to the appropriate new pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Each service card opens its page (Priority: P1)

A visitor reading the "Four disciplines, all in one place" section on the home page clicks a
service card and lands on the page for that service. Web Development already does. Technical SEO,
Agentic Systems, and Growth Marketing now do too, so no card is a dead end.

**Why this priority**: The cards are the most prominent way into the services. Three of the four
do nothing today, though their pages now exist.

**Independent Test**: On the home page, activate each of the four cards in turn. Each one opens
the page whose heading matches the card's title.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor activates the "Technical SEO" card, **Then** the
   Technical SEO page opens.
2. **Given** the home page, **When** a visitor activates the "Agentic Systems" card, **Then** the
   Agentic Systems page opens.
3. **Given** the home page, **When** a visitor activates the "Growth Marketing" card, **Then** the
   Growth Marketing page opens.
4. **Given** the home page, **When** a visitor activates the "Web Development" card, **Then** the
   Web Development page opens, as before.

---

### User Story 2 - Cards and footer agree (Priority: P2)

A visitor who reaches a service through a card and one who reaches it through the footer land on
the same page.

**Why this priority**: Two routes to one page must not drift apart, but the card links deliver the
value on their own.

**Independent Test**: For each of the four services, compare the page opened by the card with the
page opened by the footer entry of the same name. They are the same page.

**Acceptance Scenarios**:

1. **Given** a service that has both a card and a footer entry, **When** each is activated, **Then**
   both open the same page.

---

### Edge Cases

- The four cards are Web Development, Technical SEO, Agentic Systems, and Growth Marketing. Web
  Hosting, Cost Reduction, Lead Generation, and Process Re-engineering have pages but no card, and
  this feature adds none.
- Each card is one link as a whole, as today. Activating it by mouse, touch, or keyboard (Enter
  while focused) opens the page.
- The cards keep their look. Hover is signaled by the existing card hover, not by an underline.
- A card's link works only if its page exists. The pages are stubs, so a visitor may see little
  more than a title and image.
- The cards' category badges (Web, SEO, AI, Growth) and their text do not change, so a card does
  not have to match the page's category label word for word.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Technical SEO" card MUST open the Technical SEO page.
- **FR-002**: The "Agentic Systems" card MUST open the Agentic Systems page.
- **FR-003**: The "Growth Marketing" card MUST open the Growth Marketing page.
- **FR-004**: The "Web Development" card MUST keep opening the Web Development page.
- **FR-005**: No card MUST link to a placeholder or to `#top`. Every card MUST lead to an existing
  page.
- **FR-006**: Each card MUST lead to the same page as the footer entry of the same name.
- **FR-007**: The cards' look, text, order, and hover and focus behavior MUST be unchanged. No
  underline at rest, on hover, or on focus.
- **FR-008**: An automated check MUST fail if any service card's link does not lead to an existing
  page, so a renamed or removed page cannot leave a dead card.

### Key Entities

- **Service card**: A home page card with a title, category badge, description, and bullets, and
  the page it opens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 4 of 4 service cards open a page whose heading matches the card's title.
- **SC-002**: 4 of 4 cards open the same page as the footer entry of the same name.
- **SC-003**: 0 cards have a placeholder address.
- **SC-004**: The home page looks the same as before, apart from where the three cards lead.
- **SC-005**: Removing or renaming one of the four pages makes the automated tests fail.

## Assumptions

- The card-to-page mapping is by name: Technical SEO, Agentic Systems, and Growth Marketing each
  have a page of that name. No card is combined with another page.
- The pages' addresses follow their file names under `content/`, as the site's content page rule
  says, and the footer feature (spec 010) uses the same addresses.
- The owner's request counts as the signal that these pages are ready to be linked from the home
  page (constitution Principle VIII).
- Adding cards for the four services that have none is outside this feature.
- This amends spec 001 FR-017, which says service card links other than Web Development are
  placeholders. That requirement must be updated to match.
