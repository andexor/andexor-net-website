# Feature Specification: Social Icon Accessible Names

**Feature Branch**: `23-use-fontawesome-icons`

**Created**: 2026-10-06

**Status**: Implemented

**Input**: User description: "For the social media icons, let's remove the aria-hidden attribute and set the alt attribute
to "LinkedIn", "X", and "GitHub"." Follow-up at planning: "Let's go with aria-label on the <svg> and not on the <a>."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The icons carry their own names (Priority: P1)

A visitor who uses a screen reader, or who hovers an icon to learn what it is, gets the name of each footer social
icon: "LinkedIn", "X", and "GitHub". Today the icons are hidden from assistive technology and the names ("linkedin",
"twitter", "github") sit on the link around them, in lowercase, with the old name for X.

**Why this priority**: This is the owner's direct request, and it is the only change.

**Independent Test**: Use a screen reader or the browser's accessibility inspector on the footer. Each social link is
announced as a link named "LinkedIn", "X", or "GitHub", once, with the right capitalization.

**Acceptance Scenarios**:

1. **Given** the built footer, **When** the accessibility tree is read, **Then** the three social links are named
   "LinkedIn", "X", and "GitHub", in that order, and each is announced once, not twice.
2. **Given** a social icon (`<svg>`), **When** its attributes are read, **Then** it is not hidden from assistive
   technology: it has no `aria-hidden="true"` (FontAwesome writes `aria-hidden="false"` when an icon has a name, which
   hides nothing).
3. **Given** a social icon, **When** its attributes are read, **Then** it carries its own name: "LinkedIn", "X", or
   "GitHub".
4. **Given** the automated accessibility check on the home page and a content page, **When** it runs, **Then** it
   reports no new violation.
5. **Given** the footer, **When** a visitor looks at it, **Then** it looks and behaves exactly as before.

---

### Edge Cases

- **`alt` is not valid here.** The `alt` attribute exists only on images (`<img>`, `<area>`, `<input type="image">`). On an
  `<svg>` or an `<a>` the browser ignores it and it is invalid HTML, so a screen reader would not read it. The owner's
  intent, a name on the icon that is not hidden from assistive technology, is met with `aria-label` on the `<svg>`
  instead (see Assumptions).
- An icon that is not hidden and has no name is reported by accessibility checks, so each icon must have its name.
- The link must not also keep the old lowercase `aria-label`, or the name would be given twice (the link's own label
  would replace the icon's, and the two would disagree).
- The names say "X" for the link to x.com, not "Twitter".
- Hovering an icon may or may not show a tooltip depending on how the name is attached; this is not required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The social icons' `<svg>` elements MUST NOT be hidden from assistive technology: no `aria-hidden="true"`,
  and the site's own code does not write `aria-hidden` for them. FontAwesome's component adds `aria-hidden="false"`
  by itself whenever an icon has an `aria-label`, and that is accepted.
- **FR-002**: Each social icon MUST carry the accessible name "LinkedIn", "X", or "GitHub" (exactly this capitalization)
  for the LinkedIn, X, and GitHub links respectively.
- **FR-003**: The name MUST be set with `aria-label` on the `<svg>` (the valid way to name an SVG image), and no `alt`
  attribute is written anywhere on the social links or icons.
- **FR-004**: The links (`<a>`) MUST NOT have an `aria-label`. The old lowercase labels ("linkedin", "twitter",
  "github") are removed, so each link takes its one name, "LinkedIn", "X", or "GitHub", from its icon.
- **FR-005**: The links' URLs, `target`, `rel`, size, look, and press, hover, and focus behavior (specs 042 and 043) MUST
  NOT change.
- **FR-006**: The build, the formatter, the accessibility tests, and every other existing test MUST still pass. The test
  that looks the links up by their old lowercase labels MUST be updated to the new names, and a test MUST check
  FR-001 to FR-004.

### Key Entities

- **Social link**: a footer link with a name ("LinkedIn", "X", "GitHub"), a URL, and an icon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The footer's three social links have the accessible names "LinkedIn", "X", and "GitHub".
- **SC-002**: No social icon `<svg>` has `aria-hidden="true"`, and none of the links or icons has an `alt` attribute.
- **SC-003**: The accessibility checks report no violation that they did not report before.
- **SC-004**: All existing tests pass, and the footer looks the same.

## Assumptions

- The owner asked for the `alt` attribute. It is only valid on images, so the spec uses `aria-label` on the `<svg>`,
  which is also what FontAwesome's own React component recommends in place of its `title` prop. The owner confirmed it at planning, on the
  `<svg>` and not on the `<a>`. A different mechanism can still be asked for (for example a `<title>` inside the SVG, which also gives a hover tooltip) at `/speckit-clarify`.
- "Remove the aria-hidden attribute" is taken to mean the icons become visible to assistive technology, with the name
  moving from the link to the icon so it is not announced twice.
- The names are the brand spellings: "LinkedIn", "X" (the site's link goes to x.com), and "GitHub".
- This is a small change on top of specs 042 and 043, on the same branch, with no new branch.
