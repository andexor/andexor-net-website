# Feature Specification: Escape Closes the Cookiebot Dialog

**Feature Branch**: `96-escape-from-cookiebot-dialog`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Allow users to hit Esc to close the Cookiebot dialog. As a user, I want to hit the Escape button on the keyboard so that I can dismiss the Cookiebot dialog and deny all cookies just like clicking the Close button. Acceptance Criteria: Users will be able to close the Cookiebot dialog by hitting Esc. Users are not required to click or tap when they have a keyboard."

Follows spec 076 (Cookiebot), spec 082 (Cookiebot automatic blocking), and spec 083 (Do Not Sell opens the banner). Spec 015 did the same for the Contact Us popup.

## What the site does today

- The Cookiebot consent dialog opens for a first-time visitor, and again when a visitor uses the footer's Privacy Settings or Do Not Sell or Share My Personal Information link.
- The dialog has a Close button. Using it closes the dialog and denies all cookies except the necessary ones.
- Pressing Escape does nothing. A visitor with a keyboard has to Tab to the Close button, or use a mouse or touch screen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escape closes the dialog (Priority: P1)

A visitor sees the Cookiebot dialog and presses Escape. The dialog closes and the visitor's answer is the same as if they had used the Close button: all cookies except the necessary ones are denied. They did not have to click, tap, or Tab to anything.

**Why this priority**: This is the whole change. Escape is the expected way to dismiss a dialog, and a visitor using only a keyboard should not need a pointer to answer it.

**Independent Test**: Open any page as a first-time visitor, wait for the dialog, press Escape once, and see the dialog close. Repeat from the footer's Privacy Settings link. Compare the saved choice with the one the Close button saves.

**Acceptance Scenarios**:

1. **Given** the Cookiebot dialog is open, **When** the visitor presses Escape, **Then** the dialog closes and the result is the same as using the Close button.
2. **Given** the dialog was opened from the footer's Privacy Settings or Do Not Sell or Share My Personal Information link, **When** the visitor presses Escape, **Then** it closes the same way.
3. **Given** the dialog is open and focus is anywhere on the page or in the dialog, **When** the visitor presses Escape, **Then** it closes.
4. **Given** the dialog has closed, **When** the visitor presses Escape again, **Then** nothing happens.

---

### User Story 2 - Escape does nothing when there is no dialog (Priority: P2)

A visitor presses Escape on a page where the Cookiebot dialog is not showing. Nothing happens, and no other feature of the page is disturbed, including the Contact Us popup, which still closes with Escape as before (spec 015).

**Why this priority**: The new behavior must not change anything for visitors who have no dialog open.

**Independent Test**: With a saved choice and no dialog showing, press Escape and see no change. Open Contact Us and press Escape: it closes as before.

**Acceptance Scenarios**:

1. **Given** no Cookiebot dialog is showing, **When** the visitor presses Escape, **Then** nothing about the page changes.
2. **Given** the Contact Us popup is open and no Cookiebot dialog is showing, **When** the visitor presses Escape, **Then** the popup closes as it does today.
3. **Given** the Cookiebot dialog has not loaded yet, or is blocked by the visitor's browser, **When** the visitor presses Escape, **Then** nothing happens and the page does not break.

### Edge Cases

- The visitor holds Escape down: the dialog closes once and the repeats do nothing.
- Another part of the page has already handled the Escape press: the dialog is left alone.
- The visitor is using an input method editor and Escape cancels a composition: the dialog is left alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: While the Cookiebot dialog is showing, pressing Escape MUST close it with exactly the same result as using its Close button, including the cookie choice that is saved.
- **FR-002**: It MUST work on every page of the site, however the dialog was opened (first visit, Privacy Settings, Do Not Sell or Share My Personal Information).
- **FR-003**: It MUST work wherever keyboard focus is, including inside the dialog.
- **FR-004**: When no Cookiebot dialog is showing, pressing Escape MUST do nothing new, and the Contact Us popup MUST keep closing with Escape (spec 015).
- **FR-005**: Escape MUST be watched for only while the Cookiebot dialog is showing, and not at other times.
- **FR-006**: The Close button MUST keep working with the mouse, touch, and keyboard as it does today.
- **FR-007**: The dialog's look, wording, and the rest of its behavior MUST NOT change.
- **FR-008**: The site's rules still apply: no link underline at rest, on hover, or on focus, straight quotes only, always dark, and no copy, wording, color, or spacing tests.

### Key Entities

- **Cookiebot dialog**: the consent dialog from Cookiebot (spec 076).
- **Close button**: the dialog's own button that closes it and denies all cookies except the necessary ones.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every page, a visitor can close the Cookiebot dialog with one press of Escape and no pointer.
- **SC-002**: The saved cookie choice after Escape is identical to the one saved after using the Close button.
- **SC-003**: With no Cookiebot dialog showing, Escape changes nothing on any page, and the Contact Us popup still closes with it.
- **SC-004**: Nothing else about the dialog or the page changes.

## Assumptions

- The Close button's result (deny all except necessary cookies) is what the owner means by "deny all cookies". Escape reuses that result and does not add a new choice.
- The Cookiebot dialog and the Contact Us popup are never open at the same time, so the spec does not define what happens if they were.
- The behavior applies to the Cookiebot dialog in its banner and popup forms alike, whichever one is showing.
- Escape returns focus the same way the Close button does; Cookiebot decides where focus goes.
- The owner's code from Claude.ai is a starting point. How and where it is added is for the plan.
- Browser tests use Cookiebot as it loads on the built site, or a stand-in with the same dialog and Close button, since Cookiebot may be blocked in test environments.
