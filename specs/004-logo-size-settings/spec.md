# Feature Specification: Separate Logo Mark and Wordmark Sizes

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: As-built (retrospective)

**Input**: User description: "Separate size settings for the logo mark and the wordmark. The header and footer logo mark stays at 38px and the "Andexor Network" wordmark text is 26px, each controlled by its own setting so either can be changed without affecting the other. The owner's earlier request that the text be "the same size as the logo" meant the visible pixels of the image, not its box, because the logo image has transparent padding around the visible shape, so matching the boxes made the text look too big. The home page hero keeps the design system's larger sizes."

> **Retrospective note**: This change was built and verified before this spec was written. It amends
> the size requirement (FR-003, SC-003, User Story 2) in `specs/003-logo-wordmark/spec.md`, which
> was updated to match. Where the two differ, this spec is the detailed record of the size rules.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A balanced logo in every header and footer (Priority: P1)

A visitor sees the logo mark at 38px beside the "Andexor Network" wordmark at 26px in the header and
footer of every page. The wordmark is visibly smaller than the mark, so the two read as one balanced
lockup rather than text that outweighs the icon.

**Why this priority**: This is the visible result of the change. The first attempt made the text as
tall as the mark's box, which looked too large next to the visible shape.

**Independent Test**: Open `/web-development` and the home page footer. Measure the mark and the
wordmark: the mark is 38px and the wordmark text is 26px, on one line, at desktop and 320px widths.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they look at the header or footer logo, **Then** the
   mark is 38px and the wordmark text is 26px.
2. **Given** a 320px-wide screen, **When** the header or footer logo is shown, **Then** it stays on
   one line and causes no horizontal scrolling.

---

### User Story 2 - Tune the mark and the text separately (Priority: P1)

The site owner can change the mark's size without changing the wordmark's size, and the other way
round, by editing one setting for each.

**Why this priority**: The earlier single setting tied the two together, which is what produced the
oversized text. Separate settings let the owner tune each by eye.

**Independent Test**: Change the mark's setting and confirm only the mark changes in the header,
footer, and content pages. Change the wordmark's setting and confirm only the text changes.

**Acceptance Scenarios**:

1. **Given** the mark's size setting is changed, **When** the site is viewed, **Then** the mark
   changes size everywhere the shared logo appears and the wordmark does not.
2. **Given** the wordmark's size setting is changed, **When** the site is viewed, **Then** the text
   changes size everywhere the shared logo appears and the mark does not.

---

### User Story 3 - The home page hero keeps its larger sizes (Priority: P2)

The large brand row at the top of the home page keeps the design system's sizes for both the mark and
the wordmark. The 38px and 26px sizes do not apply there.

**Why this priority**: The hero is a display treatment specified by the design system, and shrinking
it would change the home page's look for no reason.

**Independent Test**: At a 1280px-wide screen, the home page hero's mark is far larger than 38px and
its text far larger than 26px, and both match the design system's hero sizes.

**Acceptance Scenarios**:

1. **Given** the home page at desktop width, **When** the hero is viewed, **Then** the mark and
   wordmark use the design system's hero sizes, not 38px and 26px.
2. **Given** a change to the header/footer sizes, **When** the hero is viewed, **Then** it is
   unchanged.

---

### Edge Cases

- The logo image has transparent padding around its visible shape, so its box is larger than what a
  visitor sees. Sizes are chosen by how the lockup looks, not by matching boxes.
- At 320px the lockup (about 256px wide) still fits in the available width without shrinking.
- The wordmark is white on the darker footer and the heading color on the header; the size change
  does not affect colors.
- Changing one setting must not force a change to the other, including in the hero.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The logo mark size and the wordmark text size MUST each have their own setting, defined
  in one place.
- **FR-002**: In the header and footer logos, the mark MUST be 38px and the wordmark text MUST be
  26px.
- **FR-003**: Changing one setting MUST NOT change the other's rendered size.
- **FR-004**: The home page hero MUST keep the design system's hero sizes for the mark and the
  wordmark.
- **FR-005**: The lockup MUST stay on one line with no horizontal page scrolling at a 320px width.
- **FR-006**: The wordmark text and the mark MUST both come from the shared logo lockup, so a size
  change applies to every header and footer at once.

### Key Entities

- **Logo lockup sizes**: Two independent values, one for the mark and one for the wordmark text,
  with a separate pair for the home page hero.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages checked (home, Web Development, "Page not found"), the header and
  footer logos show a 38px mark and 26px wordmark text.
- **SC-002**: Changing either size setting changes only that element, on 100% of pages.
- **SC-003**: The home page hero's mark and text stay at the design system's hero sizes, with no
  change from before.
- **SC-004**: No page scrolls horizontally at a 320px-wide screen because of the logo.

## Assumptions

- The 38px and 26px values were chosen by the owner by eye, after seeing that matching the mark's
  box made the text look too large.
- "Same size as the logo," from the earlier request, meant the visible pixels of the image, not its
  transparent padding.
- The home page hero's sizes come from `design/README.md` and are outside this change.
- This spec records an already built and verified change (see `specs/003-logo-wordmark/`), so it has
  no separate plan or task list.
