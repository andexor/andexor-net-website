# Feature Specification: Legal Icon Outside Link

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "The arrow-up-right-from-square icon should not be in the <a> links. It should follow just after the links."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The new-tab icons sit after the links, not inside them (Priority: P1)

Spec 065 put a small arrow-up-right-from-square icon inside each of the Contact Us popup's "Privacy" and "Terms" links.
After this change each icon is a separate element that follows its link directly: the link holds only its text, and the
icon comes right after the link. On screen it still reads "Privacy [icon] | Terms [icon]" and looks almost the same.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the Contact Us popup and inspect the note: each link contains only its text and no icon, and
the icon is the next element after each link, with nothing between them.

**Acceptance Scenarios**:

1. **Given** the open popup, **When** the "Privacy" and "Terms" links are inspected, **Then** neither contains an icon:
   each holds only its text.
2. **Given** the note, **When** it is viewed, **Then** one arrow-up-right-from-square icon (Font Awesome duotone) follows
   just after the "Privacy" link and another follows just after the "Terms" link, before the "|" separator for Privacy
   and at the end of the note for Terms.
3. **Given** the icons, **When** they are read by assistive technology, **Then** they are still hidden (no alt text, no
   `aria-label`), and each link is still announced once, as "Privacy, opens in new tab" and "Terms, opens in new tab".
4. **Given** the icons, **When** one is clicked, **Then** nothing happens: only the link text opens the page, and the
   icon is not focusable and does not take part in the link's hover or focus ring.
5. **Given** the popup, **When** the links are used, **Then** they still open `/privacy` and `/terms` in a new tab with
   the popup and form unchanged, and the footer's links are unchanged.
6. **Given** the note, **When** it is viewed at the popup's widths, **Then** each icon stays on the same line as its link
   text, is small enough not to make the line taller, and has a transparent background, as in spec 065.

---

### Edge Cases

- The note's plain text still reads "We never share your personal information. Privacy | Terms" (specs 064 and 065), because
  the icons contain no text.
- An icon never starts a line by itself: the link, its icon, and the separator stay together on one line, as the links did
  before.
- Because the icon is no longer part of the link, it does not change color when the link is hovered. It is drawn in the
  link's resting color so it still looks like it belongs to the link.
- The keyboard focus ring wraps only the link text now, not the icon. The Tab order is unchanged: the icons are not
  focusable.
- This replaces spec 065's requirement that the icon be inside the link (its FR-003 and its note that the icon shares the
  link's hover color). The rest of spec 065 (new tab, names, hidden icons, size, footer unchanged) still holds.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The popup's "Privacy" and "Terms" links MUST contain only their text. No icon MAY be inside either link.
- **FR-002**: Each link MUST be followed immediately by its own arrow-up-right-from-square icon (Font Awesome duotone), as
  the very next element, with no text or other element between the link and the icon.
- **FR-003**: Each icon MUST stay hidden from assistive technology, with no `alt` attribute and no `aria-label`, and MUST
  NOT be focusable or clickable as a link.
- **FR-004**: Each icon MUST keep spec 065's look: transparent background, small enough to sit on the text's line without
  making it taller, with a small gap after the link text, drawn in the link's resting color.
- **FR-005**: The links MUST keep spec 065's behavior and names: new tab, `rel` that denies opener access, and the labels
  "Privacy, opens in new tab" and "Terms, opens in new tab".
- **FR-006**: The note's text, its link order and separator, and the footer links MUST NOT change.
- **FR-007**: The tests from spec 065 that find each icon inside its link (`tests/e2e/contact-legal-new-tab.spec.ts`) MUST be
  updated to find it after the link, and MUST also check that the link itself contains no `svg`. Tests MUST NOT count
  anything.
- **FR-008**: Spec 065 MUST be marked as superseded for the icon's position, so the two specs do not contradict each other.
- **FR-009**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Popup legal link**: the "Privacy" or "Terms" link in the Contact Us note. It holds only text.
- **New-tab icon**: a hidden decorative icon that follows its link directly and signals that the link opens a new tab.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Neither popup legal link contains an icon, and each link is followed directly by exactly its own icon.
- **SC-002**: Assistive technology reads the links as "Privacy, opens in new tab" and "Terms, opens in new tab", each once,
  and does not announce the icons.
- **SC-003**: The note looks almost the same as before and stays on the same number of lines at the popup's widths, with
  each icon on its link's line.
- **SC-004**: All existing tests pass (with the spec 065 icon-position checks updated), and no new accessibility
  violations appear.

## Assumptions

- "Just after the links" means the icon is the next sibling of the link, right after it, before the " | " separator for
  Privacy.
- The icon is drawn in the link's resting color (white) and does not follow the link's hover color, because it is not part
  of the link. If the owner wants it to change color when the link is hovered, that needs a separate request.
- Everything else from spec 065 stays as built: size, gap, names, new tab, hidden icons, footer unchanged.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
