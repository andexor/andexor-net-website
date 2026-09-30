# Feature Specification: Not-Found Page Style

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Style the not-found page similar to the web-development page, with the following exceptions: Use 404.png as the hero image. Do not put the text into a card. Do not add eyebrows on the page. Do not add the faint grid as that is most appropriate for any of the Technical Services pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A branded "Page not found" page (Priority: P1)

A visitor who follows a broken or mistyped address lands on a "Page not found" page that looks
like the rest of the site's service pages: a dark hero band with a large illustration on one side
and the headline and a short explanation on the other, fading into the page background. The
illustration is the gold laptop with a magnifying glass and "404" (`404.png`). The message is not
in a card, there is no small label above the headline, and the faint engineering grid is not shown.

**Why this priority**: This is the whole change. Today the page is a plain block of text, which
feels unfinished next to the Web Development page, and a broken link is a moment when a branded,
friendly page matters.

**Independent Test**: Open an address that does not exist, such as `/nope`, at desktop and phone
widths. The page shows the hero layout with the 404 illustration, the headline "Page not found",
the explanation with a link home, and the site header and footer, with no card, no label above the
headline, and no grid.

**Acceptance Scenarios**:

1. **Given** a visitor at an address that does not exist, **When** the page loads, **Then** it
   shows a dark hero band with the 404 illustration beside the headline and explanation, in the
   same arrangement as the Web Development page.
2. **Given** the "Page not found" page, **When** it is viewed, **Then** the headline and
   explanation sit directly on the hero band and not inside a card.
3. **Given** the "Page not found" page, **When** it is viewed, **Then** no small label appears
   above the headline.
4. **Given** the "Page not found" page, **When** it is viewed, **Then** the faint grid pattern that
   the Web Development page shows is absent.
5. **Given** the "Page not found" page, **When** the visitor activates "Go to the home page",
   **Then** they arrive at the home page.

---

### User Story 2 - Works on every screen size (Priority: P2)

On a phone-width screen, the hero keeps the same look, with the illustration and text arranged the
way the Web Development page arranges them, and nothing overflows or scrolls sideways.

**Why this priority**: Many visitors arrive on phones, and a broken layout on an error page makes a
bad moment worse.

**Independent Test**: View `/nope` at 320px, 768px, and 1280px widths. The layout is readable and
has no horizontal scrolling at each.

**Acceptance Scenarios**:

1. **Given** a 320px-wide screen, **When** the page is viewed, **Then** the illustration and text
   are arranged as on the Web Development page at that width, with no horizontal scrolling.
2. **Given** any screen width, **When** the page is viewed, **Then** the headline and explanation
   are fully readable against the dark band.

---

### User Story 3 - Still accessible and still the right kind of error (Priority: P2)

The page keeps meeting the site's accessibility rules and still tells browsers and search engines
that the address was not found.

**Why this priority**: Restyling must not break what the page already does.

**Independent Test**: Run the accessibility check on `/nope`, tab to the link, and confirm the
illustration has a text description and the page still reports "not found".

**Acceptance Scenarios**:

1. **Given** the "Page not found" page, **When** it is checked for accessibility, **Then** it has
   no WCAG 2.1 AA violations.
2. **Given** the illustration, **When** it is read by a screen reader, **Then** it has a text
   description of what it shows.
3. **Given** the "Page not found" page, **When** the visitor tabs to the link, **Then** it has a
   visible focus indicator.

---

### Edge Cases

- The page shows exactly one top-level headline, "Page not found".
- With no cards below the hero, the hero still fades into the page background without a hard edge
  or a large empty gap before the footer.
- The illustration has a transparent background, so it must look right on the dark hero band.
- The page keeps the always-dark palette and never shows a light background flash.
- The browser tab title stays "Page not found | Andexor Network".
- Hovering the link changes its color and does not underline it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Page not found" page MUST use the same hero layout as the Web Development page:
  a dark band fading into the page background, with an illustration on one side and the headline
  and explanation on the other.
- **FR-002**: The hero illustration MUST be the 404 image (`404.png`), with a text description.
- **FR-003**: The headline and explanation MUST NOT be placed in a card.
- **FR-004**: The page MUST NOT show a small label (eyebrow) above the headline.
- **FR-005**: The page MUST NOT show the faint engineering grid. That grid is reserved for the
  Technical Services pages.
- **FR-006**: The page MUST keep its headline "Page not found", its explanation, and a link to the
  home page.
- **FR-007**: The page MUST keep the site header, the shared footer, the always-dark palette, and
  the title "Page not found | Andexor Network".
- **FR-008**: The page MUST remain a "not found" response for the unknown address, and MUST NOT
  become a redirect.
- **FR-009**: The page MUST have no horizontal scrolling at a 320px width.
- **FR-010**: The page MUST meet WCAG 2.1 AA, including a visible keyboard focus indicator.
- **FR-011**: The link MUST signal hover with a color change, not an underline.
- **FR-012**: The Web Development page and other content pages MUST look exactly as they do today.

### Key Entities

- **Not-found page**: The page shown for any address the site does not have. It has a headline, a
  short explanation, a link home, and a hero illustration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At `/nope`, the page shows the 404 illustration, the headline, and the link home in
  the hero layout at 320px, 768px, and 1280px widths, with no horizontal scrolling.
- **SC-002**: On the page, 0 cards, 0 labels above the headline, and 0 grid overlays are present.
- **SC-003**: The page passes the automated WCAG 2.1 AA check with 0 violations.
- **SC-004**: A visitor can get from the not-found page to the home page in one activation of the
  link, by mouse or keyboard.
- **SC-005**: The Web Development page renders identically before and after this change.

## Assumptions

- "Similar to the web-development page" means the hero layout (illustration beside text, dark band
  fading into the page background, same type sizes and colors). It does not include the cards.
- The current wording stays: headline "Page not found" and the sentence "We could not find that
  page. Go to the home page."
- The 404 illustration is `public/404.png`, already in the project. Its text description will
  describe a gold laptop showing 404 beside a magnifying glass with a question mark.
- The hero's extra bottom space, which exists on the Web Development page so cards can overlap it,
  is reduced here because no cards follow.
- The faint grid is optional per page, so the Web Development page keeps it.
- Content pages are still authored as Markdown, and this page stays a special page that is not
  linked from the home page or footer.
- This builds on `specs/002-content-pages-card-template/spec.md` (FR-006, FR-024), which requires
  the not-found page to use the site shell and always-dark tokens.
