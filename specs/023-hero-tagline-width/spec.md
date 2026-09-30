# Feature Specification: Hero Tagline Width

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "On all other pages, update the an-cardhero__intro class to set the max-width to 40em."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Taglines on every hero page may run as wide as the home page subhead (Priority: P1)

On every page with a card hero (the eight service pages and About Us) and on the not-found page, the
line under the headline may be as wide as 40 times its font size before wrapping. This matches the
home page, whose supporting line was given the same limit (spec 022). A visitor moving between the
home page and any other page sees supporting text that wraps by the same rule.

**Why this priority**: This is the owner's request. It keeps the taglines from wrapping early, and
it keeps longer future taglines from being squeezed into a narrow column, as the headlines were
before spec 020.

**Independent Test**: Open each hero page at 1920, 1280, and 768 pixels wide. Each tagline is one
line, as before. Give a page a tagline longer than 32 times its font size and it stays on one line
until it reaches 40.

**Acceptance Scenarios**:

1. **Given** any page with a hero, **When** its tagline's width limit is measured, **Then** it is 40
   times the tagline's font size.
2. **Given** the current taglines, **When** any hero page loads at 768 pixels or wider, **Then** the
   tagline is one line, the same as before.
3. **Given** a tagline longer than the limit, **When** the page loads, **Then** it wraps between
   words and never overflows the hero or causes horizontal scrolling.

---

### Edge Cases

- Only the width limit changes. Font, size, color, spacing, and link styling in the tagline are
  unchanged.
- The limit is a ceiling, not a width: a tagline on a narrow screen is still limited by the space
  next to the illustration, so phones look the same as before.
- The not-found page's sentence and its link use the same rule.
- The hero's headline width (spec 020), the eyebrow spacer (spec 021), and the home page are not
  touched.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The tagline under the headline in every page hero (Markdown card pages and the
  not-found page) MUST have a maximum width of 40 times its font size.
- **FR-002**: Taglines MUST still wrap between words when they do not fit, and MUST NOT cause
  horizontal scrolling at any viewport width.
- **FR-003**: No other hero style (font, size, color, spacing, link style, headline width,
  illustration size) MUST change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 9 card pages and the not-found page share a tagline width limit of 40 times the
  tagline's font size.
- **SC-002**: Every current tagline is 1 line tall at 1920, 1280, and 768 pixels wide, and no page
  shows a change in line count at 375 pixels wide.
- **SC-003**: No horizontal scrolling at viewport widths of 320, 375, 768, and 1920 pixels on any
  hero page.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- "All other pages" means every page that uses the card hero: the eight service pages, About Us, and
  the not-found page. The home page has its own rule (spec 022).
- The tagline's font size is 18 pixels, so 40em is about 720 pixels, up from about 576 pixels.
- The current taglines are short, so this change is not visible today. It lets a longer tagline run
  wider before it wraps.
