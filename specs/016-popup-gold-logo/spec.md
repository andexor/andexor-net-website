# Feature Specification: Gold Logo in the Contact Us Popup

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "On the Contact Us popup, replace the logo with logo-gold.svg. It will look better due to the transparent background."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The popup header shows the gold logo (Priority: P1)

A visitor opens the Contact Us popup. Beside the "Contact Us" title, the header shows the gold Andexor
mark on a transparent background, the same mark used in the site's headers and hero. It sits directly on
the dark header, with no blue box behind it, so it blends into the header instead of showing as a
separate tile.

**Why this priority**: This is the whole request. The popup currently shows the boxed blue-and-gold
version of the logo, which looks like a badge pasted onto the header. The gold-on-transparent version
matches the rest of the site.

**Independent Test**: Open the popup from any "Contact Us" button and look at the header. The logo is
the gold mark with no box behind it, the same mark the site header and hero use.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is open, **When** the header is viewed, **Then** it shows the gold
   logo on a transparent background, with no blue box or other tile behind it.
2. **Given** the popup opened from the hero, the call-to-action band, or the footer, on any page,
   **When** the header is viewed, **Then** it shows the same gold logo.
3. **Given** the popup showing the "Request received" confirmation, **When** the header is viewed,
   **Then** it still shows the gold logo.

---

### Edge Cases

- The logo stays decorative: it has no text alternative, because the "Contact Us" title beside it
  names the popup, and screen readers do not announce it.
- The logo keeps its current size and position, next to the title, so the header does not shift.
- The header's other parts (title, glow, close button) and the rest of the popup are unchanged.
- The popup's look on narrow screens is unchanged; the logo does not overflow or wrap.
- The image must actually load: a missing file must not leave a broken-image icon in the header.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Contact Us popup header MUST show the gold logo on a transparent background
  (`logo-gold.svg`) in place of the boxed blue-and-gold logo.
- **FR-002**: The logo MUST keep its current size and its position beside the "Contact Us" title, so
  the header layout does not change.
- **FR-003**: The logo MUST stay decorative: an empty text alternative, not exposed to assistive
  technology.
- **FR-004**: The gold logo MUST appear in both states of the popup, the form and the "Request
  received" confirmation, and whichever button or page opened it.
- **FR-005**: Nothing else in the popup, and no other logo on the site, MUST change.
- **FR-006**: An automated test MUST fail if the popup header goes back to the boxed logo or the image
  does not load.

### Key Entities

- **Popup header logo**: The small brand mark at the left of the popup's header.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of automated checks, the popup header shows the gold logo, with the image loaded
  (nonzero size) and no broken-image state.
- **SC-002**: The header's height and the title's position are the same as before the change.
- **SC-003**: The popup passes its existing accessibility checks with no violations, in both states.
- **SC-004**: The site's other logos (header, hero, footer) are unchanged.

## Assumptions

- The gold logo and the boxed logo are both 96 by 96 square marks, so the current 34 pixel size fits the
  gold one without other changes.
- The popup's dark header is the surface the gold mark is meant for (the design system describes it as
  "Old Gold on transparent, for dark surfaces").
- Spec 003 says the gold mark is referenced only inside the shared logo component, and a unit test
  enforces it for the hero, footer, and content page shell. This popup is a deliberate exception: it
  shows the mark alone, without the wordmark, so it does not use the lockup. Spec 003's rule and its
  test wording are updated to name the popup as the second place.
- The boxed logo file stays in the project; it is part of the brand assets (for example, email
  authentication uses it) and is simply no longer used by the popup.
- Rounded corners on the logo image, which only made sense for the box, are removed.
- This is a small visual change, so it does not amend earlier specs beyond the notes above.
