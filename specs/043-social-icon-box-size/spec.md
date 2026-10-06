# Feature Specification: Social Icon Box Size

**Feature Branch**: `23-use-fontawesome-icons`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "For the social media icons, remove all height, width, margin, and padding settings on the
<svg>. There is a variable the page is attempting to use, but it's not defined. Define --fa-display as 32px and use this
variable for the height and width on the <a> surrounding the <svg> and set the margin to 4px." Follow-ups: "Ignore my
request about the variable name. I just want the 32x32px on the <a> and not on the <svg>. The variable name is not so
important, so you can create a new one if that works better." Then "Please change --an-social-size to 48px." Then, after
an attempt to replace FontAwesome's stylesheet with a custom copy was rolled back: "You should not have to create a
custom fontawesome.css. This would drift from the official one eventually and cause issues when the dependencies are
updated." Finally: "For .an-footer__social-link, remove the margin. Set --an-social-size to 32px. That's enough to
make it decent again for now."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The icon box is sized by one variable (Priority: P1)

The site owner wants the footer's social media icons sized from the link around each icon. The link box is 32px by 32px,
set by one named variable, with no margin. The site's own CSS sets no height, width, margin, or padding on the icon
inside.

**Why this priority**: This is the owner's direct request, and it is the only change.

**Independent Test**: Open the footer in the browser's inspector. Each social link is 32px wide and 32px high with no
margin, both sizes come from `--an-social-size`, and no rule in the site's own stylesheet targets the icon.

**Acceptance Scenarios**:

1. **Given** the built site, **When** the owner inspects a social link, **Then** its height and width are both
   `var(--an-social-size)`, which is 32px, and it has no margin.
2. **Given** the built site, **When** the owner reads the site's own stylesheet, **Then** no rule sets a height, width,
   margin, or padding on the social icon `<svg>`.
3. **Given** a social link, **When** a visitor hovers it or tabs to it, **Then** the color change and focus ring work as
   before, with no underline.
4. **Given** the footer on a phone, a tablet, and a wide screen, **When** it is shown, **Then** the three links sit in a
   row, do not overlap, and stay inside the footer.

---

### Edge Cases

- The link keeps its border, rounded corners, and centered icon. Only its size changes, from 34px to 32px.
- The spacing between links, which comes from the row's gap (10px), is not part of this request and stays.
- `--fa-display` is not defined or touched, so FontAwesome keeps its own `display` for the icon.
- FontAwesome's stylesheet is used exactly as the package ships it (spec 042). It sets the icon's own size, 1em high and
  1.25em wide, and the site does not copy, patch, or replace it, so package updates apply cleanly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site's own CSS MUST NOT set height, width, margin, or padding on the social icons' `<svg>` elements.
  The rule `.an-footer__social-icon` (added in spec 042) and its class on the icon are removed.
- **FR-002**: `--an-social-size` MUST be defined in the site's stylesheet with the value `32px`.
- **FR-003**: The link around each social icon (`.an-footer__social-link`) MUST have its height and width set to
  `var(--an-social-size)`, and it MUST NOT have a margin.
- **FR-004**: The site MUST keep using FontAwesome's own stylesheet from the package, unmodified. No copy, patch, or
  replacement of it is added.
- **FR-005**: The links' URLs, labels, `target` and `rel`, border, radius, colors, hover and focus styles, and
  FontAwesome icons MUST NOT change.
- **FR-006**: The change MUST NOT break the build, the formatter, or any existing test. A test MUST check FR-001 to
  FR-003 in the built page.

### Key Entities

- **`--an-social-size`**: the CSS variable that holds the social link's box size, 32px.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each social link measures 32px by 32px with no margin, in the built page, on a phone, a tablet, and a
  wide screen.
- **SC-002**: The site's CSS has no height, width, margin, or padding rule that targets the social icon `<svg>`.
- **SC-003**: `--an-social-size` resolves to `32px` on the page.
- **SC-004**: All existing tests pass.

## Assumptions

- The owner first named `--fa-display`, which FontAwesome's stylesheet reads as a display value
  (`display: var(--fa-display, inline-block)`), not a size. Defining it as `32px` would make the browser drop the icon's
  `display` to `inline`. The owner then said the name does not matter, so the site defines its own variable and leaves
  `--fa-display` alone.
- The owner also asked to remove FontAwesome's own height and width from the icon. That would need a custom copy of
  FontAwesome's stylesheet, which the owner rejected (it would drift from the package), so the icon keeps FontAwesome's
  size. Other options, such as FontAwesome's own size variables, are open for a later spec.
- The owner first asked for a 4px margin and then dropped it, so the link has no margin. The box was 48px for a while and
  is now 32px, a size that looks decent with FontAwesome's default icon size.
- Without a site rule on the `<svg>` the icon (16px high, 20px wide at the default font size) sits centered in the
  link box. Tuning its size is not part of this request.
- This is a small change on top of spec 042, on the same branch, with no new branch.
