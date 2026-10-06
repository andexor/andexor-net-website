# Feature Specification: Social Link Colors

**Feature Branch**: `23-use-fontawesome-icons`

**Created**: 2026-10-06

**Status**: Implemented

**Input**: User description: "For .an-footer__social-link, set color to var(--blue-300). On :hover, use var(--blue-200).
On :active, use var(--blue-400)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The social icons change color as they are used (Priority: P1)

A visitor sees the footer's social icons in a soft blue at rest, a lighter blue when the pointer is over one, and a
deeper blue while one is pressed. The color change, with the 3D press from spec 043, tells the visitor the icon responds.

**Why this priority**: This is the owner's direct request, and it is the only change.

**Independent Test**: In the browser's inspector, read the computed `color` of a social link at rest, with the pointer
over it, and while it is pressed. They are blue-300, blue-200, and blue-400.

**Acceptance Scenarios**:

1. **Given** a social link at rest, **When** it is shown, **Then** its color is `var(--blue-300)`.
2. **Given** a social link, **When** the pointer is over it, **Then** its color is `var(--blue-200)`.
3. **Given** a social link, **When** it is pressed (mouse down, touch, or key press), **Then** its color is
   `var(--blue-400)` for as long as it is pressed, including while the pointer is still over it.
4. **Given** a social link, **When** it has keyboard focus and nothing else is happening, **Then** its color is the
   resting color (the gold focus ring is the focus signal, as before).
5. **Given** any of these states, **When** the link is shown, **Then** nothing is underlined, and the size, press
   movement, gradient, shadow, and names from specs 043 and 044 are unchanged.

---

### Edge Cases

- The hover rule and the press rule both apply while a link is pressed with the pointer over it. The press color wins,
  so the press rule comes after the hover rule.
- The icon is drawn in the link's text color, so changing the link's color changes the icon's color. No color is set on
  the icon itself.
- Spec 043 set the resting color to `var(--blue-200)` and the hover color to `var(--blue-100)`. This feature replaces
  those two values.
- A touch screen has no hover, so a tap shows only the resting and pressed colors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `.an-footer__social-link` MUST have `color: var(--blue-300)` at rest.
- **FR-002**: `.an-footer__social-link:hover` MUST have `color: var(--blue-200)`.
- **FR-003**: `.an-footer__social-link:active` MUST have `color: var(--blue-400)`, and it MUST win over the hover color when
  both apply.
- **FR-004**: Nothing else about the links changes: size, margin, gradient, shadow, press movement, focus ring, names, and
  no underline in any state (specs 043 and 044).
- **FR-005**: The colors MUST be the design tokens named, not literal color values.
- **FR-006**: The build and every existing test MUST still pass. A test MUST check the three computed colors.

### Key Entities

- **Social link states**: rest, hover, and pressed, each with its own icon color.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The computed color of a social link is blue-300 at rest, blue-200 on hover, and blue-400 while pressed.
- **SC-002**: With the pointer over a pressed link, the color is the pressed one.
- **SC-003**: All existing tests pass, and no underline appears in any state.

## Assumptions

- The three tokens are the site's existing blue tokens (`--blue-300`, `--blue-200`, `--blue-400`); no new token is added.
- A lighter hover than rest and a deeper press than rest is what the owner asked for, in that order, so it is built as
  written even though blue-400 is darker and bluer than the resting color.
- Keyboard focus keeps the resting color. The owner did not ask for a focus color, and the gold ring already shows focus.
- This is a small change on top of specs 043 and 044, on the same branch, with no new branch. As the owner reviews UI
  changes before committing, it is left uncommitted when built.
