# Feature Specification: Home Page Subhead Wording

**Feature Branch**: `17-apply-consistent-background-images`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "On the home page, change the hero subhead text to "We create and manage solutions to help your business grow.""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The home page subhead says "create and manage" (Priority: P1)

A visitor opens the home page. Under the headline "Enterprise-grade services at small business
prices" the supporting line reads "We create and manage solutions to help your business grow." It
keeps the "we" to "you" voice introduced in spec 022 and drops "design" and "build" in favor of the
single verb "create", so the line promises two things (create, manage) instead of three.

**Why this priority**: This is the copy change the owner asked for, and it is what visitors read
first after the headline.

**Independent Test**: Open the home page. The line under the headline is exactly "We create and
manage solutions to help your business grow." and neither the earlier wording ("We design, build,
and manage ...") nor the original wording ("Andexor Network designs, builds, and manages ...")
appears anywhere on the page.

**Acceptance Scenarios**:

1. **Given** the home page, **When** it loads, **Then** the supporting line under the headline
   reads "We create and manage solutions to help your business grow."
2. **Given** the home page, **When** its text is searched for "design, build", **Then** there is no
   match in the hero.
3. **Given** the home page at 768 pixels wide and wider, **When** it loads, **Then** the line is
   one line tall, as before, and at phone widths it wraps between words without horizontal
   scrolling.

---

### Edge Cases

- Only the subhead's text changes. Its width limit (spec 022), the headline, the Contact Us button,
  the logo, colors, font size, and spacing are unchanged.
- The footer tagline and the card pages' taglines are not part of this change.
- The design-system documents and sample code that quote the previous sentence are updated to
  match, so they do not bring the older wording back.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page hero's supporting line MUST read exactly "We create and manage
  solutions to help your business grow."
- **FR-002**: The line MUST follow the copy rules in `design/README.md`: "we" to "you", Oxford comma
  where a list needs one, no dashes, no "&".
- **FR-003**: No other home page text or style MUST change.
- **FR-004**: Every other place in the project that quotes the previous sentence for this line (the
  design-system README, sample component, and bundle, and the first feature's task list) MUST be
  updated to the new one.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A case-sensitive search for "We design, build, and manage solutions" finds 0 matches
  in the project outside dependencies, build output, and the specs that quote it as history (022
  and this spec).
- **SC-002**: The supporting line is 1 line tall at 1920, 1280, and 768 pixels wide, with no
  horizontal scrolling at 320, 375, 768, and 1920.
- **SC-003**: All existing automated tests pass after the change.

## Assumptions

- This supersedes the wording in spec 022 (`specs/022-home-subhead-copy-width/`). That spec's width
  change (40em) stands; only its sentence changes here. Spec 022 is left as written, with a note
  pointing to this one.
- "Create" covers what "design" and "build" said, so the line is shorter, not narrower in meaning.
  No new claims are added.
- The design-system files are kept in step with the site, as in specs 013 and 022. If `design/` is
  re-copied from the design tool, it may need the same edit again.
