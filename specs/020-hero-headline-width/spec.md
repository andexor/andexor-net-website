# Feature Specification: Hero Headline Width

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "The H1 on the process-re-engineering page is wrapping. Change the max-width from 10em to 14em and apply it to all pages to make them consistent with the home page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Process Re-engineering headline fits on one line (Priority: P1)

A visitor opens the Process Re-engineering page. The headline "Process Re-engineering" appears on a
single line in the hero, at wide and medium desktop widths, instead of breaking after "Process".

**Why this priority**: This is the reported problem. The headline is the first thing a visitor
reads, and a break in the middle of a two-word title looks like a layout error.

**Independent Test**: Open the Process Re-engineering page at 1280 pixels wide and at 1920 pixels
wide. The headline is one line.

**Acceptance Scenarios**:

1. **Given** the Process Re-engineering page on a desktop-width window, **When** it loads, **Then**
   the headline is on one line.
2. **Given** the same page on a narrow window where the hero text column is too small for the
   headline, **When** it loads, **Then** the headline still wraps between words and never overflows
   the screen or causes horizontal scrolling.

---

### User Story 2 - Every hero headline has the same width limit as the home page (Priority: P2)

On every page with a card hero (the eight service pages, About Us) and on the not-found page, the
headline may be as wide as 14 times its own font size before wrapping, the same limit the home page
headline uses. A visitor moving between the home page and any other page sees headlines that wrap
by the same rule.

**Why this priority**: The fix should not be special to one page, and a shared limit keeps future
pages with longer titles from hitting the same problem.

**Independent Test**: Open each page with a hero. No headline wraps earlier than the home page's
headline would at the same font size. Headlines longer than the limit still wrap between words.

**Acceptance Scenarios**:

1. **Given** any page with a hero, **When** its headline is measured, **Then** its width limit is
   14 times the headline's font size.
2. **Given** a short headline such as "Web Hosting", **When** the page loads, **Then** it looks as
   it did before, on one line.
3. **Given** a headline longer than 14 times its font size, **When** the page loads, **Then** it
   wraps onto balanced lines between words.

---

### Edge Cases

- Only the headline's width limit changes. Font, size, weight, color, spacing, and the tagline's
  width are unchanged.
- The headline is still allowed to wrap: on phones and narrow windows the hero stacks or narrows and
  the headline breaks between words.
- The not-found page uses the same hero, so its headline ("Page not found") follows the same limit.
- A longer limit must not push the hero text into the illustration or off the right edge at any
  width.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The headline in every page hero (Markdown card pages and the not-found page) MUST
  have a maximum width of 14 times its font size, the same as the home page headline.
- **FR-002**: The Process Re-engineering headline MUST fit on one line at viewport widths of 1280
  pixels and wider.
- **FR-003**: Headlines longer than the limit MUST still wrap between words, with balanced lines,
  and MUST NOT overflow the hero or cause horizontal scrolling at any viewport width.
- **FR-004**: No other hero style (font, size, weight, color, spacing, tagline width, illustration
  size) MUST change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Process Re-engineering headline is 1 line tall at 1280 and 1920 pixels wide.
- **SC-002**: All 9 card pages and the not-found page share the same headline width limit as the
  home page.
- **SC-003**: No horizontal scrolling at viewport widths of 320, 768, and 1920 pixels on any hero
  page.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- The home page headline limit is 14em, as recorded in `design/README.md`. The hero on the other
  pages had 10em, which is what made "Process Re-engineering" wrap.
- This is a small style fix to live pages. The owner asked for a spec anyway, so it is written
  before the change, in the same way as the other specs.
- The change applies to `.an-cardhero h1` only. The home page is not touched.
