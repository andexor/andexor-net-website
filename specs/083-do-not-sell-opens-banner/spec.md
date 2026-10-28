# Feature Specification: Do Not Sell Opens the Cookie Banner

**Feature Branch**: not created yet. The owner decides whether this shares a branch (see CLAUDE.md, Contributing and setup).

**Created**: 2026-10-27

**Status**: Implemented

**Input**: User description: "Update the link target for "Do Not Sell or Share My Personal Information" in the footer. Make it behave exactly like the Privacy Settings link. Add an HTML comment before the Privacy Settings link that says "For GDPR". Add another comment before the "Do Not Sell..." link that says "For CCPA"."

Follows spec 081 (Privacy Policy consolidation, which added Privacy Settings and pointed Do Not Sell at the Cookie Declaration), spec 076 (Cookiebot), and spec 082 (Cookiebot automatic blocking).

## What the site does today

- The footer has two links that deal with cookie choices. They are in different places and behave differently.
- **Privacy Settings** is the last link in the Company column. It does not leave the page: it opens the Cookiebot banner again, so a visitor can change their consent from any page (spec 081). It works with the mouse and the keyboard.
- **Do Not Sell or Share My Personal Information** is under the copyright line. It is an ordinary link to the Cookie Declaration section of the Privacy Policy, `/privacy-policy#25-cookie-declaration`. A visitor who uses it leaves the page they were on.
- Neither link has a note in the page source saying which privacy law it serves.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Do Not Sell opens the cookie banner (Priority: P1)

A visitor who wants to stop the sale or sharing of their personal information uses the footer's Do Not Sell or Share My
Personal Information link, from any page. The Cookiebot banner opens where they are, so they can make their choice
straight away, the same as with Privacy Settings. They are not taken to another page.

**Why this priority**: This is the change. The California Consumer Privacy Act (CCPA) wants an opt-out that is easy to
find and easy to use, and a banner they can answer at once is easier than a page they have to scroll through.

**Independent Test**: On any page, activate the Do Not Sell or Share My Personal Information link and see the Cookiebot
banner open, with the visitor still on the same page at the same scroll position. Repeat with the keyboard.

**Acceptance Scenarios**:

1. **Given** any page, **When** the visitor clicks Do Not Sell or Share My Personal Information, **Then** the Cookiebot
   banner opens, the address does not change, and the page does not scroll or reload.
2. **Given** the link has keyboard focus, **When** the visitor presses Enter, **Then** the same happens.
3. **Given** a visitor who has already answered the banner, **When** they use the link, **Then** the banner opens again
   so they can change their answer.
4. **Given** the Privacy Settings link, **When** the visitor uses it, **Then** it still behaves as before, and the two
   links open the banner the same way.

---

### User Story 2 - The page source says which law each link serves (Priority: P2)

The owner reads the source of any built page and finds an HTML comment, `<!-- For GDPR -->`, right before the Privacy
Settings link, and `<!-- For CCPA -->`, right before the Do Not Sell or Share My Personal Information link. The comments
are for the owner and for anyone maintaining the site. Visitors never see them.

**Why this priority**: It records why there are two links that do the same thing, so nobody removes one as a duplicate.

**Independent Test**: Build the site and read the footer in the source of any page. Each comment is directly before its
link and says exactly what is described here.

**Acceptance Scenarios**:

1. **Given** a built page, **When** the owner reads the footer's source, **Then** `<!-- For GDPR -->` is directly before
   the Privacy Settings link and `<!-- For CCPA -->` is directly before the Do Not Sell or Share My Personal Information
   link.
2. **Given** a visitor, **When** they view the page, **Then** the comments are not visible and nothing about the footer
   looks different.

### Edge Cases

- Cookiebot has not loaded yet, or is blocked by the visitor's browser: using either link does nothing visible and does
  not break the page. This is how Privacy Settings already behaves.
- The visitor is on `/privacy-policy`: the link opens the banner there too. The page's own Cookie Declaration section
  stays where it is and is no longer the target of this link.
- A visitor reaches the Cookie Declaration some other way (the Privacy Policy's own links to Section 25): that still
  works.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer's Do Not Sell or Share My Personal Information link MUST reopen the Cookiebot banner in the
  same way the Privacy Settings link does, without leaving the page, changing the address, scrolling, or reloading.
- **FR-002**: It MUST work from the keyboard as well as the mouse, as Privacy Settings does.
- **FR-003**: Its wording and look MUST stay as they are. Only what it does changes.
- **FR-004**: The footer's source MUST have the HTML comment `For GDPR` directly before the Privacy Settings link, and
  the HTML comment `For CCPA` directly before the Do Not Sell or Share My Personal Information link, on every page that
  has the footer.
- **FR-005**: The comments MUST NOT show on the page and MUST NOT change how the footer looks or is read by a screen
  reader.
- **FR-006**: The comments MUST be in the built pages the site serves, not only in the source files.
- **FR-007**: The Privacy Policy's own links to its Cookie Declaration section MUST keep working.
- **FR-008**: The site's rules still apply: no link underline at rest, on hover, or on focus, the shared link color and
  hover, straight quotes only, and no copy, wording, color, or spacing tests.

### Key Entities

- **Do Not Sell link**: the footer link under the copyright line, for the CCPA opt-out.
- **Privacy Settings link**: the footer link at the end of the Company column, for changing consent (GDPR).
- **Cookiebot banner**: the consent dialog from Cookiebot (spec 076).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every page, using the Do Not Sell or Share My Personal Information link opens the Cookiebot banner in one
  action, and the visitor is still on the same page afterward.
- **SC-002**: The two links open the banner identically, with the mouse and with the keyboard.
- **SC-003**: Every built page's footer has both comments, each directly before its link, and a visitor sees no change.
- **SC-004**: Nothing else in the footer changes.

## Assumptions

- The two links stay in their current places: Privacy Settings in the Company column, Do Not Sell under the copyright line.
- "Behave exactly like the Privacy Settings link" means the same action and the same keyboard behavior. It does not mean
  the same position or the same styling, which stay as they are.
- "A comment before the link" means the comment immediately precedes the link's element, with nothing between them.
- The Cookie Declaration section stays in the Privacy Policy, and the footer no longer links to it directly.
- The existing end-to-end checks for the old Do Not Sell target are replaced, not kept (the owner's rule: change the test
  when the behavior it describes changes).
