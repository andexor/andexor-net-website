# Feature Specification: Contact Legal Links In New Tab

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Add the arrow-up-right-from-square icon from Font Awesome duotone to the Contact Us note. Give it no alt text or aria-label. Let it be aria-role=hidden. Add it just to the right of the Privacy link and again after the Terms link. Make the image transparent and small enough to fit on the line with the text. Configure these links in the popup to open in a new tab. Add an aria-label on the links to indicate that the links open in a new tab. Say it the way we did with the social media icons, using a comma instead of parentheses. Leave the same links in the footer as they are."

**Superseded in part**: the icon's position. Spec 066 (`specs/066-legal-icon-outside-link/spec.md`) moves each icon out of
its link to follow it directly, so FR-003 ("inside the link so it shares its color and hover") and the Edge Cases entry
that the icons change color with the link on hover no longer apply. The rest of this spec still holds.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Privacy and Terms open in a new tab, and say so (Priority: P1)

The note under the Contact Us form ends with "Privacy | Terms" (specs 062 and 064). Today each link opens its page in the
same tab, which takes a visitor away from a half-filled form. After this change each link opens in a new tab, shows a
small "opens in a new window" icon just after its text, and is named for assistive technology as "Privacy, opens in new
tab" and "Terms, opens in new tab". The form stays open and filled in the original tab.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open the Contact Us popup, fill in a field, click "Privacy", and confirm the Privacy page opens in a
new tab while the popup and the typed text stay as they were. Repeat for "Terms".

**Acceptance Scenarios**:

1. **Given** the open popup, **When** the visitor clicks "Privacy", **Then** the Privacy Policy page (`/privacy`) opens in
   a new tab and the popup stays open, with the form unchanged, in the original tab.
2. **Given** the open popup, **When** the visitor clicks "Terms", **Then** the Terms Of Service page (`/terms`) opens in
   a new tab and the popup stays open, with the form unchanged, in the original tab.
3. **Given** the popup, **When** the note is viewed, **Then** a small arrow-up-right-from-square icon (Font Awesome
   duotone) appears just to the right of the "Privacy" link text and again just to the right of the "Terms" link text.
4. **Given** the note, **When** it is viewed, **Then** each icon is small enough to sit on the same line as the text
   without making the line taller or moving the text, and has a transparent background (no box or fill behind it).
5. **Given** the popup, **When** the links are read by assistive technology, **Then** the Privacy link is named "Privacy,
   opens in new tab" and the Terms link is named "Terms, opens in new tab", and each icon is hidden from assistive
   technology (it has no alt text, no `aria-label`, and is not announced), so each link is announced once.
6. **Given** the footer, **When** its "Privacy" and "Terms" links are used, **Then** they behave and look exactly as
   before: same tab, no icon, no label.

---

### Edge Cases

- The note's plain text still reads "We never share your personal information. Privacy | Terms" (spec 064), because the
  icons contain no text.
- "aria-role=hidden" is not a real role. The owner's intent, hiding the icon from assistive technology, is met with
  `aria-hidden="true"`, the same way the site hides other decorative icons.
- The two links must not wrap apart from their icons: an icon never starts a line by itself. The existing rule that keeps
  "Privacy | Terms" together on one line still holds.
- The icons are drawn in the link's own color, so they change color with the link on hover, with no underline.
- The popup's focus handling does not change: the links keep their place in the Tab order (after the form fields, before
  Send), the icons are not focusable, and the focus trap is unaffected.
- The text "opens in new tab" must stay true. If a link stops opening a new tab, its label must change with it.
- Spec 062 said the popup links open in the same tab, and that the form is usually kept when the visitor comes back with
  Back. For the popup links that is replaced by this spec: the page opens in a new tab, so the visitor does not need Back.
  The footer links keep spec 062's behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The popup's "Privacy" and "Terms" links MUST open `/privacy` and `/terms` in a new tab, leaving the popup
  and its form as they were. The links MUST NOT give the new page access to the opener.
- **FR-002**: The "Privacy" link's name MUST be exactly "Privacy, opens in new tab", and the "Terms" link's name MUST be
  exactly "Terms, opens in new tab", each set as an `aria-label` on the link (comma, not parentheses, as in spec 061).
- **FR-003**: Just after the "Privacy" link text, and again just after the "Terms" link text, the popup MUST show the Font
  Awesome duotone arrow-up-right-from-square icon, inside the link so it shares its color and hover.
- **FR-004**: Each icon MUST be hidden from assistive technology (`aria-hidden="true"`), and MUST NOT have an `alt`
  attribute or an `aria-label`.
- **FR-005**: Each icon MUST have a transparent background and be small enough to fit on the text's line without making
  the line taller, and its size MUST be set the way the site sizes Font Awesome icons (an override rule in the site
  stylesheet; the Font Awesome stylesheet is not changed).
- **FR-006**: The links MUST keep the site's link rules: no underline at rest, on hover, or on focus; hover shown by a
  color change; keyboard focus shown by the ring.
- **FR-007**: The footer's "Privacy" and "Terms" links MUST NOT change in any way (same tab, no icon, no label).
- **FR-008**: The note's text, size, color, centering, and the order and separator of its links MUST NOT change.
- **FR-009**: Tests MUST cover the new tab (the page opened has the right address, the popup stays open and filled in),
  the two names, the hidden icons with no `alt` and no `aria-label`, the icon's size against the line, and that the footer
  links are unchanged. Spec 062's popup link tests that expect a same-tab navigation, and spec 064's note test if it
  matters, MUST be updated. Tests MUST NOT count anything.
- **FR-010**: Spec 062 MUST be marked as superseded for the popup links' same-tab behavior, so the two specs do not
  contradict each other.
- **FR-011**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Popup legal link**: the "Privacy" or "Terms" link in the Contact Us note. It opens its page in a new tab, shows a
  small external-link icon after its text, and is named for assistive technology as "<name>, opens in new tab".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking "Privacy" or "Terms" in the popup opens the matching page in a new tab 100% of the time, and the
  popup and its typed text are still there in the original tab.
- **SC-002**: Assistive technology reads the two links as "Privacy, opens in new tab" and "Terms, opens in new tab", each
  once, and does not announce the icons.
- **SC-003**: The note stays on its current number of lines at the popup's widths, with each icon on the same line as its
  link text and no taller than that text.
- **SC-004**: The footer's Privacy and Terms links are identical before and after.
- **SC-005**: All existing tests pass (with the superseded same-tab expectations updated), and no new accessibility
  violations appear.

## Assumptions

- "Make the image transparent" means a transparent background with no box or fill behind the icon, as the other small icons
  on the site are drawn, not a faded or see-through icon.
- The icon takes the link's color (white, light blue on hover), as the rest of the link does, and is sized to the note's
  12px text.
- The names are written as the owner asked, with a comma and no parentheses, the same way as the social icons
  ("..., opens in new tab").
- The footer is the only other place the same links appear, and it is left alone.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
