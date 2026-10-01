# Feature Specification: Home Headline and Footer Tagline Wording, Headline Width

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "On the home page, change the headline text to "Enterprise services for small business" and remove the max-width. Also, remove the max-width on the H1 on all other pages."

**Follow-up**: Owner added: "Update [the footer tagline] to match the one in the hero on the home page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The home headline is shorter and runs on one line (Priority: P1)

A visitor opens the home page. The headline reads "Enterprise services for small business". It is
shorter than the old "Enterprise-grade services at small business prices", and it is no longer
squeezed into a narrow column, so on a normal desktop screen it sits on one line.

**Why this priority**: This is the copy and layout change the owner asked for, and the headline is
the first thing visitors read.

**Independent Test**: Open the home page at 1280 and 1920 pixels wide. The headline is exactly
"Enterprise services for small business" and is one line tall. At 375 pixels it wraps between words
with no horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** the home page, **When** it loads, **Then** the headline reads exactly "Enterprise
   services for small business".
2. **Given** the home page, **When** its text is searched for "Enterprise-grade services at small
   business prices", **Then** there is no match in the hero.
3. **Given** the home page at 1280 pixels wide and wider, **When** it loads, **Then** the headline
   is not limited to a narrow column and fits on one line.
4. **Given** the home page at 375 pixels wide, **When** it loads, **Then** the headline wraps
   between words and nothing scrolls horizontally.

---

### User Story 2 - Page headlines on every other page are not width-limited (Priority: P1)

A visitor opens any content page (Web Development, About Us, and the rest) or the not-found page.
The headline in the hero is no longer held to a narrow column, so a longer headline such as
"Process Re-engineering" is not forced onto a second line while there is room beside it.

**Why this priority**: The owner asked for the same width treatment on every page, so headlines
behave the same everywhere.

**Independent Test**: Open each content page and the not-found page at 1280 pixels wide. No headline
wraps because of a width limit. At 375 pixels they wrap between words with no horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** any content page or the not-found page, **When** it loads at 1280 pixels wide, **Then**
   the headline has no maximum width and wraps only when it reaches the edge of the hero's content
   area.
2. **Given** a content page with an illustration beside the headline, **When** it loads at 1280
   pixels wide, **Then** the headline does not run under or over the illustration.
3. **Given** any such page at 375 pixels wide, **When** it loads, **Then** the headline wraps between
   words and nothing scrolls horizontally.

---

### User Story 3 - The footer tagline matches the home headline (Priority: P1)

A visitor scrolls to the footer, on the home page or any other page. The tagline under the logo
reads "Enterprise services for small business", the same words as the home page headline, so the
site says one thing in both places.

**Why this priority**: The footer repeated the old headline, so leaving it would bring the old
wording back.

**Independent Test**: Open the home page and a content page and look at the footer. The tagline is
"Enterprise services for small business", and the old wording appears nowhere on the site.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** it loads, **Then** the footer tagline reads
   "Enterprise services for small business".
2. **Given** the home page, **When** the hero headline and the footer tagline are compared, **Then**
   their words are identical.
3. **Given** the footer at 375 pixels wide and wider, **When** it loads, **Then** the tagline
   wraps without horizontal scrolling, and its font, size, and color are unchanged.

---

### Edge Cases

- The home headline's wording and the footer tagline's wording change. The page taglines and the
  home subhead are not part of this change.
- Font, size, weight, color, and spacing of every headline are unchanged. Only the width limit is
  removed (home page and all other pages).
- The tagline's own width limit (spec 023) and the hero's other layout are unchanged.
- Balanced line breaking stays on, so a headline that does wrap still breaks evenly.
- The design-system documents and sample code that quote the old headline or its 14em width are
  updated to match, so they do not bring it back.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page headline MUST read exactly "Enterprise services for small business".
- **FR-002**: The home page headline MUST have no maximum width.
- **FR-003**: The headline on every other page (all content pages and the not-found page) MUST have
  no maximum width.
- **FR-004**: The footer tagline MUST read exactly "Enterprise services for small business", the
  same words as the home page headline.
- **FR-005**: No other headline or hero style (font, size, weight, color, spacing, tagline width,
  illustration, backdrop) MUST change.
- **FR-006**: The home headline MUST follow the copy rules in `design/README.md`: no dashes, no "&".
- **FR-007**: Every other place in the project that quotes the old home headline or the 14em limit
  for headlines (the design-system README, sample component, and bundle, the first feature's
  documents, and the home page test) MUST be updated to match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A case-sensitive search for "Enterprise-grade services" finds 0 matches in the site,
  the design-system files, and the tests, outside the page tagline on About Us ("Enterprise-grade
  services, sized for your business.") and the specs that quote the old wording as history.
- **SC-002**: The home headline is 1 line tall at 1280 and 1920 pixels wide.
- **SC-003**: No headline on any page has a maximum width, checked on the home page, all 9 content
  pages, and the not-found page.
- **SC-004**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide on any of these pages.
- **SC-005**: All existing automated tests pass after the change.

## Assumptions

- This supersedes the headline width limit set in spec 020 (`specs/020-hero-headline-width/`) and
  the headline wording from the first feature. Those specs are left as written, with a note pointing
  to this one.
- "Remove the max-width" means no maximum width at all, not a different number. The headline can
  grow as wide as the hero's content area.
- The footer tagline keeps its two-line layout, with the break after "services", as before: "Enterprise
  services" on the first line and "for small business" on the second.
- The About Us page tagline ("Enterprise-grade services, sized for your business.") is a different
  line and is not changed.
- The new headline is shorter, so it is expected to stay on one line wherever there is room. At
  phone widths it wraps, as before.
- The design-system files are kept in step with the site, as in specs 013, 022, and 024. If
  `design/` is re-copied from the design tool, it may need the same edit again.
- This is a small copy and style change to live pages. Implement directly; no plan or tasks needed.
