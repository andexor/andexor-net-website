# Feature Specification: Consistent Page Left Edge

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "All pages must have a consistent left margin. The home page is good at 15px. The web-development page is good at 15px. But the not-found page is silly, having 22.5px for the an-content-header__inner class. This is wrong because it is inconsistent. And it is wrong to have a fraction of a pixel. Please update the not-found page to use 15px. Add a rule in DESIGN.md noting that all pages must use a consistent left margin of 15px." Follow-up from the owner: the difference only shows on the not-found page, which is short and does not scroll on a large screen, while the other pages scroll.

> **Finding**: The difference is caused by the browser's vertical scrollbar, not by a margin in the
> stylesheet. On pages long enough to scroll, a classic scrollbar (15px wide) takes width from the
> page, so the centered content sits 7.5px further left than on a page that does not scroll. In a
> 1365px-wide window with classic scrollbars, the left edge was 15px on the home and
> web-development pages and 22.5px on the not-found page (verified 2026-09-30). The site has no
> fixed 15px margin; that number is what a 1365px window produces here (at 1440px it is 52.5px on
> scrolling pages), so the requirement is that every page uses the same left edge, not a fixed
> number.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Content starts in the same place on every page (Priority: P1)

A visitor moves between the home page, a service page, and the "Page not found" page. The header
logo, headings, cards, and footer start at the same distance from the left edge of the window on
every page, whether or not the page is long enough to scroll. Nothing jumps sideways when a visitor
goes from a scrolling page to a short one.

**Why this priority**: This is the visual anomaly the owner found. A page that is 7.5px out of line
looks like a mistake, and it makes the site feel unfinished.

**Independent Test**: In a window with visible scrollbars, open the home page, the Web Development
page, and an address the site does not have. The left edge of the header logo is identical on all
three, at several window widths.

**Acceptance Scenarios**:

1. **Given** a window with classic (visible) scrollbars, **When** the visitor opens the home page,
   the Web Development page, and the "Page not found" page, **Then** the header logo and the hero
   text start at exactly the same distance from the left edge on all three.
2. **Given** the same window, **When** the visitor goes from a page that scrolls to one that does
   not, **Then** the content does not shift sideways.
3. **Given** a window with overlay scrollbars (phones, or systems that hide them), **When** the
   visitor opens the same three pages, **Then** the left edge is again identical on all three.
4. **Given** any window width from 320px to 1600px, **When** any two pages are compared, **Then**
   their left edges match.

---

### User Story 2 - The rule is written down (Priority: P2)

The design guide says that every page must use the same left edge, that the visible scrollbar must
not change it, and how the site achieves this, so a future page cannot break it without anyone
noticing.

**Why this priority**: The owner asked for a rule in the design guide. Without it the same problem
returns when a page is added.

**Independent Test**: Read `design/DESIGN.md`. It has a rule that all pages use a consistent left
edge, regardless of page length or scrollbars. A test fails if a page's left edge differs.

**Acceptance Scenarios**:

1. **Given** the design guide, **When** the layout section is read, **Then** it states the rule and
   the reason (a scrolling page's scrollbar must not move the content).
2. **Given** a new page is added later, **When** the automated tests run (hidden or overlay
   scrollbars), **Then** a left edge that differs from the other pages fails the test.

---

### Edge Cases

- A page that becomes taller or shorter (for example after a window resize) must not move.
- Fractional positions (such as 52.5px) can occur at some window widths because centered content
  can land on half a pixel. This requirement is about pages matching each other, not about whole
  numbers; whole numbers are not guaranteed at every width.
- The contact popup and other overlays are not pages and are not affected.
- Browsers that do not support reserving the scrollbar space keep today's behavior; it is only a
  small shift and never breaks the layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On every page, the content's left edge (header logo, headings, cards, footer) MUST be
  identical at any given window width.
- **FR-002**: A visible vertical scrollbar MUST NOT change the left edge. A page that scrolls and one
  that does not MUST line up.
- **FR-003**: The "Page not found" page MUST have the same left edge as the home page and the
  Web Development page (the case that was 7.5px off).
- **FR-004**: The design guide (`design/DESIGN.md`) MUST state that all pages use one consistent left
  edge, that scrollbars and page length must not change it, and that a new page must follow it.
- **FR-005**: An automated check MUST fail if any page's left edge differs from the others with
  hidden or overlay scrollbars. Windows with classic visible scrollbars are not tested (owner
  decision, 2026-09-30: they are essentially obsolete); the fix for them is the reserved gutter.
- **FR-006**: The change MUST NOT alter the layout width, padding, or look of any page in windows
  with overlay scrollbars.

### Key Entities

- **Left edge**: The distance from the left of the window to the start of the page content. It must
  be the same for every page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With visible scrollbars, the left edge of the header logo differs by 0px across the
  home page, the Web Development page, and the "Page not found" page, at 320px, 768px, 1365px,
  1440px, and 1600px window widths.
- **SC-002**: Going from a page that scrolls to one that does not moves the content by 0px.
- **SC-003**: In windows with overlay scrollbars, every page looks exactly as it does today.
- **SC-004**: `design/DESIGN.md` contains the rule.
- **SC-005**: Adding a page whose left edge differs (with hidden or overlay scrollbars) makes the
  automated tests fail.

## Assumptions

- The owner's "15px" is what a 1365px-wide window with 15px scrollbars produces on the scrolling
  pages. The site has no fixed 15px left margin: the layout is a centered container up to 1320px
  wide with 24px side padding (`design/README.md`), so the left edge depends on window width. The
  requirement is therefore that all pages match, not that they use 15px. If the owner wants a fixed
  15px side margin at every width, that is a separate, sitewide redesign of the 24px side padding.
- The fix is to reserve space for the scrollbar on every page, so a scrollbar appearing or not never
  changes the page width. This is supported by current Chrome, Firefox, and Safari.
- The design guide rule is worded in terms of consistency, not a fixed number of pixels, because a
  fixed "15px" would be wrong at other window widths and on other systems. The owner confirmed this wording on
  2026-09-30.
- Windows with classic, always-visible scrollbars are no longer tested. The owner decided on
  2026-09-30 that they are essentially obsolete, so the test that launched a Chromium with visible
  scrollbars was removed. The reserved gutter (`scrollbar-gutter: stable`) stays in place, so
  those windows still line up; it is just not covered by an automated test.
