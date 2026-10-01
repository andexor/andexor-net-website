# Feature Specification: Standard Bullets on Content Pages

**Feature Branch**: `19-update-page-taglines`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Regarding bullet lists, checkmarks are good on the home page, but for all other pages, we should use a standard, you know, bullet icon."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lists on content pages use ordinary bullets (Priority: P1)

A visitor opens a content page such as Web Development. The bulleted lists inside the cards show a
small round bullet (a dot) in front of each item, like any ordinary bulleted list, instead of a
checkmark. The home page's service cards keep their checkmarks.

**Why this priority**: This is the change the owner asked for. A checkmark suggests "included" or
"done", which suits the short feature lists on the home page but not every list on a content page.

**Independent Test**: Open the home page and a content page side by side. The home page lists show
checkmarks. Every list on the content page shows a round bullet, and no checkmark appears anywhere on
the content page.

**Acceptance Scenarios**:

1. **Given** a content page with card lists, **When** it loads, **Then** every list item shows a
   round bullet and none shows a checkmark.
2. **Given** the home page, **When** it loads, **Then** every service card list item still shows its
   checkmark, unchanged.
3. **Given** a content page, **When** the bullets and the text are compared, **Then** the bullet sits
   level with the first line of its item, with the same spacing from the text as the checkmark had.
4. **Given** a content page card, **When** it loads, **Then** the bullet keeps the same gold color the
   checkmark had.
5. **Given** a list item whose text wraps to a second line, **When** it is viewed at 375 pixels wide,
   **Then** the second line lines up with the first line's text, not under the bullet.

---

### Edge Cases

- The page text, list structure, and order of items are unchanged. Only the marker in front of each
  item changes.
- All 9 content pages are covered, and any page added later gets the same bullet. The not-found page
  has no list.
- Lists in a plain Markdown page (one without the card layout) already use ordinary bullets and are not
  changed.
- The bullet is decoration. Screen readers still announce the list and its items as before.
- Item text, font size, spacing between items, and card layout are unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every bulleted list item inside a content page card MUST show a round bullet, not a
  checkmark.
- **FR-002**: The home page service card lists MUST keep their checkmarks, unchanged.
- **FR-003**: The bullet MUST keep the checkmark's color, its position
  beside the first line of text, and the spacing between it and the text.
- **FR-004**: List text, item spacing, and card layout MUST NOT change.
- **FR-005**: The design-system documents that describe card list markers, if any, MUST be updated to
  match.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 checkmark markers appear on any of the 9 content pages, and every list item on them has
  a round bullet.
- **SC-002**: The home page still shows a checkmark on all of its service card list items.
- **SC-003**: No horizontal scrolling at 320, 375, 768, and 1920 pixels wide on the home page and the
  content pages.
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- "A standard bullet icon" means a small solid round dot, the usual list bullet, drawn in the same gold
  the checkmark uses so the cards keep their accent, not the browser's default black or grey bullet.
  If the owner wants the text color instead, that is a small follow-up.
- "All other pages" means the content pages built from Markdown with the card layout. The not-found
  page has no list, and plain Markdown pages already show ordinary bullets.
- This is a small visual change to live pages. Implement directly; no plan or tasks needed.
