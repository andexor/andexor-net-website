# Feature Specification: No Underlines on Any Link

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Remove the underline from the link to the home page. This applies to all links. Since links in the footer look good the way they are, all links should behave like this."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Links look like the footer links everywhere (Priority: P1)

A visitor sees links styled the same way across the whole site: in the color the footer links use,
with no underline, whether the link sits in the footer, in the body text of a content page, in a
card, or on the "Page not found" page. The "Go to the home page" link on the "Page not found" page
is the case that prompted this: it is underlined today and should not be.

**Why this priority**: This is the whole change. The footer links already look right to the owner,
and the underlined links elsewhere look inconsistent next to them.

**Independent Test**: Open the "Page not found" page, the Web Development page, and the home page.
Every link on each is shown without an underline, like the footer links.

**Acceptance Scenarios**:

1. **Given** the "Page not found" page, **When** it is viewed, **Then** the "Go to the home page"
   link has no underline.
2. **Given** a link in the body text of a content page, **When** it is viewed, **Then** it has no
   underline.
3. **Given** a link inside a card on a content page, **When** it is viewed, **Then** it has no
   underline.
4. **Given** any link on any page, **When** it is viewed at rest, hovered, or focused, **Then** it
   never shows an underline.
5. **Given** a link in the body or a card and a link in the footer, **When** they are compared,
   **Then** they follow the same rule: no underline, a color change on hover, and a visible focus
   ring. Their colors differ by design, since each is chosen for its own background.

---

### User Story 2 - Links still read as links (Priority: P1)

Without underlines, a visitor can still tell which words are links. Links are distinguishable from
the text around them, hovering changes their color, and keyboard focus shows a visible indicator.

**Why this priority**: Underlines are the usual signal that text is a link. Removing them must not
make links hard to find or break the site's accessibility rules.

**Independent Test**: Run the automated accessibility check on the "Page not found" page and the
Web Development page, hover each kind of link, and tab through them.

**Acceptance Scenarios**:

1. **Given** a link inside a sentence, **When** it is compared with the surrounding text, **Then**
   the two are clearly different in color, at the contrast the accessibility rules require.
2. **Given** any link, **When** the visitor hovers it, **Then** its color changes and nothing else
   about its shape changes.
3. **Given** any link, **When** the visitor tabs to it, **Then** a visible focus indicator appears.
4. **Given** the site's pages, **When** they are checked for accessibility, **Then** there are no
   WCAG 2.1 AA violations.

---

### Edge Cases

- A link that wraps across two lines must look the same on both lines, with no underline.
- A link in a regular card and a link in a featured (dark ink) card must both stay readable and
  distinguishable from the text around them. Featured cards have no links today; a link added
  there needs its own color check.
- Links that look like buttons or cards (for example the service cards on the home page) keep
  their current look; this change does not add or remove other styling.
- The logo link and navigation links keep their current look, which already has no underline.
- Future Markdown pages get the same link style automatically, with no per-page setting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: No link on the site MUST show an underline, at rest, on hover, or on focus.
- **FR-002**: Links in body text, in cards, and on the "Page not found" page MUST follow the same
  rule as the footer links: no underline, a color change on hover, and a visible focus ring. Their
  colors need not match the footer's.
- **FR-003**: Hovering a link MUST change its color and MUST NOT add any underline.
- **FR-004**: Links inside body text MUST remain distinguishable from the surrounding text and MUST
  meet the site's accessibility rules for that (WCAG 2.1 AA), without relying on an underline. To
  do this, body text in content pages and cards MUST use the brighter text color (`--slate-50`)
  and body links MUST use the stronger blue (`--blue-400`), which gives at least 3:1 contrast
  between link and text, and at least 4.5:1 between the link and its background.
- **FR-005**: Every link MUST show a visible focus indicator when reached by keyboard.
- **FR-006**: The rule MUST apply to links on pages added later (Markdown content pages) without any
  extra setting.
- **FR-007**: Existing link targets, wording, and layout MUST NOT change. Only text color and link
  color change, in content pages and cards.
- **FR-008**: The accessibility test that currently fails on the "Page not found" page when the
  underline is removed MUST pass on every browser and device the site is tested on.
- **FR-009**: Footer links MUST keep their current look.

### Key Entities

- **Link style**: The single look shared by all links: link color, hover color, focus indicator, and
  no underline.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every page checked (home, Web Development, "Page not found"), 0 links show an
  underline at rest, on hover, or on focus.
- **SC-002**: On 100% of body, card, and footer links checked, hovering changes the color and
  adds no underline, and keyboard focus shows a visible ring.
- **SC-003**: The automated WCAG 2.1 AA check reports 0 violations on the pages checked, in all six
  test browsers and devices (it fails on the "Page not found" page today when the underline is
  removed without changing colors).
- **SC-004**: 100% of links show a visible focus indicator when tabbed to.
- **SC-005**: Searching the site's stylesheets finds no rule that underlines a link.

## Assumptions

- "All links" means every link a visitor sees on the site's pages. Source-code and repository
  documents are not pages.
- The footer link behavior is the reference: no underline, a color change on hover. The footer keeps
  its own colors (`--blue-200`, white on hover); body and card links use their own, chosen so they
  stand out from text.
- This goes further than the current rule, which bans underline on hover but allows underline at
  rest for links in body text. That allowance, in the constitution (Principle VI) and in
  `specs/002-content-pages-card-template/spec.md` (Assumptions), must be amended to match.
- The owner chose to change colors rather than keep underlines on body links. A test run on
  2026-09-30 showed that removing the underline alone fails WCAG 1.4.1 on the "Page not found"
  page: the link color (`--blue-300`) and the body text color (`--slate-300`) are only 1.42:1
  apart, and 3:1 is required.
- The fix is brighter body text (`--slate-50`) with a stronger link blue (`--blue-400`). Measured
  against the dark page, link and text are 3.40:1 apart, the link is 4.65:1 against a card and
  5.22:1 against the page, and body text is above 15:1 against both.
- Featured dark cards use a different body color and have no links today. A link there would need
  its own check before it is added.
- Amendments required with this change: constitution Principle VI and `specs/002-content-pages-card-template/spec.md`
  currently allow underlines at rest on body links, and must say links are never underlined.
- Buttons and card-style links keep their present styling.
