# Feature Specification: Technical and Business Card Bands

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Add more cards to the home page so that there is one card for each one of the 8 service
pages. Duplicate the services section into technical and business sections. Arrange the cards so that all of the
technical ones are together in one band, in the order in which they appear in the footer. Do the same for the business
services. Both sections need to have a heading and sub-heading just as it is now."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every service has a card, grouped by kind (Priority: P1)

A visitor scrolls the home page and finds two sections one after the other. The first is for technical services and
holds four cards: Web Development, Web Hosting, Technical SEO, and Agentic Systems. The second is for business
services and holds four cards: Cost Reduction, Lead Generation, Growth Marketing, and Process Re-engineering. Each
section has its own heading and sub-heading, laid out the way the current services section is. Each card is a link to
its service page, so all 8 service pages can be reached from the home page.

**Why this priority**: This is the whole request. Today only 4 of the 8 services have a card, and they are mixed
together.

**Independent Test**: Open the home page. Find the two service sections, read each one's heading, sub-heading, and card
titles in order, and follow each card's link.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor looks below the hero, **Then** there are two service sections, technical
   first and business second, each with a heading and a sub-heading styled like the current section's.
2. **Given** the technical section, **When** its cards are read in order, **Then** they are Web Development, Web
   Hosting, Technical SEO, Agentic Systems, the same order as the footer's TECHNICAL SERVICES column.
3. **Given** the business section, **When** its cards are read in order, **Then** they are Cost Reduction, Lead
   Generation, Growth Marketing, Process Re-engineering, the same order as the footer's BUSINESS SERVICES column.
4. **Given** any of the 8 cards, **When** a visitor clicks it, **Then** they go to that service's page, the same
   address as the footer entry of the same name.
5. **Given** the home page, **When** the cards are counted by kind, **Then** no technical card is in the business
   section, no business card is in the technical section, and no service has two cards.

---

### User Story 2 - The new cards look like the existing ones (Priority: P2)

A visitor sees no difference in design between the four existing cards and the four new ones. Every card has the same
parts, an icon tile, a short tag, a title, a one-sentence description, and three bullets, and reacts the same way to
hover, press, and keyboard focus.

**Why this priority**: Consistency is required by the design system, but the cards must exist first.

**Independent Test**: Compare a new card with an existing card at rest, on hover, while pressed, and with keyboard
focus.

**Acceptance Scenarios**:

1. **Given** a new card, **When** it is compared with an existing card, **Then** it has the same parts in the same
   arrangement, with the same spacing, colors, and type.
2. **Given** any card, **When** the pointer is over it, it is pressed, or it has keyboard focus, **Then** it shows the
   same gold ring, press movement, and focus ring as the others (spec 047), and nothing is underlined.
3. **Given** the home page at phone, tablet, and desktop widths, **When** each section is viewed, **Then** its four
   cards fit the same responsive grid as today's cards, with no horizontal scrolling.

---

### Edge Cases

- A band holds 4 cards, so on a wide screen each band is one row of four, as the current grid is. On narrower screens
  the cards wrap within their own band: a band never shares a row with the other band's cards.
- The footer is the source of the order. If the footer's order changes later, the home page order is not changed
  automatically; this spec fixes the order at the one in the footer today.
- The old `#services` anchor is renamed `#technical-services` to match `#business-services`. Nothing in the source,
  tests, or content links to `#services`, so no link breaks.
- The service pages are already linked from the footer, and the cards link to the same addresses.
- Nothing links to `#top`, and no link is underlined in any state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST have two service sections in this order: technical, then business. The single
  services section of today is replaced by them.
- **FR-002**: Each section MUST have a heading and a sub-heading in the same structure and styling as the current
  section's heading and lede. The two sections MUST NOT reuse the same text.
- **FR-003**: The technical section MUST hold exactly these cards, in this order: Web Development, Web Hosting,
  Technical SEO, Agentic Systems.
- **FR-004**: The business section MUST hold exactly these cards, in this order: Cost Reduction, Lead Generation,
  Growth Marketing, Process Re-engineering.
- **FR-005**: There MUST be one card per service page and no more: the 8 cards link to `/web-development`,
  `/web-hosting`, `/technical-seo`, `/agentic-systems`, `/cost-reduction`, `/lead-generation`, `/growth-marketing`,
  and `/process-re-engineering`.
- **FR-006**: Each new card MUST have an icon, a short tag, a title, a one-sentence description, and three bullets, like
  the existing cards, and MUST be one link to its page with no placeholder address.
- **FR-007**: Within a section the cards MUST form one band: they are adjacent, share the section's grid, and no card
  of the other kind is between them.
- **FR-008**: The existing four cards keep their current content, apart from their position in their section.
- **FR-009**: Existing visual rules apply to all 8 cards: the card hover, press, and focus behavior from specs 046 and
  047, always-dark colors, no link underlines, and the left-edge alignment of spec 009.
- **FR-010**: Each section MUST be a labeled region: its heading names it for assistive technology, and the heading
  levels stay in order (one `h1` in the hero, `h2` for each section heading, `h3` for each card title).
- **FR-011**: The build and every existing test MUST still pass. Tests that assume a single services section MUST be
  updated to the new structure. New tests MUST check each section's cards by title and order and each card's link
  address, and MUST NOT assert a number of cards.

### Key Entities

- **Service card**: a link to one service page, with an icon, tag, title, description, and three bullets.
- **Service section**: a heading, a sub-heading, and a band of service cards of one kind, technical or business.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach every one of the 8 service pages from the home page cards, each in one click.
- **SC-002**: The titles of the cards in the technical section, read in order, equal the footer's TECHNICAL SERVICES
  entries, and those in the business section equal the footer's BUSINESS SERVICES entries.
- **SC-003**: Each section's heading and sub-heading render in the same font, size, color, and spacing as the current
  section's.
- **SC-004**: At 360, 768, and 1280 pixel widths there is no horizontal scrolling, and no card overlaps another.
- **SC-005**: All existing tests pass (after updating those that assumed one section), and the page has no
  accessibility violations at WCAG 2.1 AA that it did not have before.

## Assumptions

- "The services section" is the current section with the heading "Business and technical services, all in one place"
  and the lede "Web, SEO, AI, and marketing under one roof." Both new sections are copies of its structure.
- "Just as it is now" is read as: same layout and styling, with wording of their own. Proposed wording, for the owner
  to edit: technical heading "Technical services built to scale", sub-heading "Web, hosting, search, and AI that stay
  fast as you grow."; business heading "Business services that drive growth", sub-heading "Lower costs, more leads, and
  better processes, with campaigns to match."
- The four new cards need copy that does not exist yet. It is drafted from each page's title and eyebrow, and the owner
  will edit it. Drafted tags: Hosting, Cost, Leads, Process. Drafted descriptions and bullets follow the style of the
  existing cards (one sentence beginning "We'll" or a plain statement of the outcome, three short bullets).
- Icons for the new cards are chosen from the icon set already in use, one that suits each subject.
- Names are balanced: the technical section is `technical-services` and the business section is `business-services`,
  with matching `-heading` ids. When a section is duplicated, the original is renamed too.
- The service cards' hover and press behavior is the one specified in specs 046 and 047.
- This is a small addition on the current branch, with no new branch. The owner reviews UI changes before committing,
  so it is left uncommitted when built.
