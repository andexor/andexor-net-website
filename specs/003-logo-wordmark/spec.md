# Feature Specification: Single-Line "Andexor Network" Logo Wordmark

**Feature Branch**: `13-update-the-style-of-the-404-page`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Let's update the logo wordmark. Remove the second line that says "Network, Inc." Change the first line from "Andexor" to "Andexor Network" and make it the same size as the logo. Do this in a common component so it is used across the site in the header and footer on all pages."

## Amendments

### 2026-09-30 (see `specs/016-popup-gold-logo/spec.md`)

- The gold logo mark is referenced in two places: the shared lockup (`Logo.tsx`) and, alone without
  the wordmark, the Contact Us popup header (`ContactPopup.tsx`), which replaced its boxed logo.
  `tests/unit/logo.test.tsx` now pins exactly those two files.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See one consistent brand name everywhere (Priority: P1)

A visitor sees the logo mark followed by the single-line wordmark "Andexor Network" in the header
and footer of every page, including the home page, content pages, and the "Page not found" page.
The old two-line wordmark ("Andexor" over "Network, Inc.") no longer appears anywhere.

**Why this priority**: This is the whole change. The brand name should read the same on every
page, and the second line ("Network, Inc.") is being dropped.

**Independent Test**: Open the home page, the Web Development page, and a URL that does not exist.
On each, find the logo in the header and in the footer. Each shows the mark and the single line
"Andexor Network", and no "Network, Inc." wordmark text.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they look at the header logo, **Then** it shows the
   logo mark followed by the text "Andexor Network" on a single line.
2. **Given** a visitor on any page, **When** they look at the footer logo, **Then** it shows the
   same mark and single-line "Andexor Network" text.
3. **Given** a visitor on any page, **When** they look at the logo, **Then** no "Network, Inc."
   line appears beneath or beside the wordmark.
4. **Given** a visitor on a page other than the home page, **When** they activate the header logo,
   **Then** they go to the home page.

---

### User Story 2 - Logo mark and wordmark have their own sizes (Priority: P1)

The logo mark and the wordmark text each have their own size setting, so each can be tuned on its
own. The mark stays at 38px and the wordmark text is 26px. The mark's image has transparent
padding around the visible shape, so its box is larger than what a visitor sees; the two sizes
are set by how they look, not by matching boxes.

**Why this priority**: The size change is part of the request and drives how the lockup looks.

**Independent Test**: View the header logo at a desktop and a phone width. The mark is 38px, the
wordmark text is 26px, the two look balanced, and the lockup does not wrap or overflow.

**Acceptance Scenarios**:

1. **Given** the logo in the header or footer, **When** it is measured, **Then** the mark is 38px
   and the wordmark text is 26px.
2. **Given** the site's styles, **When** either size is changed, **Then** the other does not
   change, because each has its own setting.
3. **Given** a phone-width screen, **When** the header or footer logo is shown, **Then** the
   lockup stays on one line and does not cause horizontal scrolling.

---

### User Story 3 - Change the logo in one place (Priority: P2)

The site owner can change the logo lockup in one shared place and have every header and footer
pick up the change, instead of editing several copies.

**Why this priority**: It keeps the logo from drifting out of sync, but visitors do not see it
directly.

**Independent Test**: Every place the site shows the logo lockup (header and footer, on the home
page, content pages, and the "Page not found" page) draws it from one shared definition. No page
carries its own hand-written copy of the wordmark text.

**Acceptance Scenarios**:

1. **Given** the site's pages, **When** the logo lockup is searched for, **Then** there is exactly
   one definition of the mark-plus-wordmark lockup, and every header and footer uses it.
2. **Given** the home page's brand area at the top, **When** it is compared with the header logo on
   other pages, **Then** it shows the same "Andexor Network" wordmark from the shared definition.

---

### Edge Cases

- The logo appears on a dark footer background and on the page header background; the wordmark
  text must stay legible on both.
- The home page has no separate header bar today; its top brand area stands in for the header and
  must show the same wordmark.
- A compact form of the logo (mark only, no text) is used nowhere on the site today, so it is
  removed.
- Screen reader users hear the brand name once per logo, not twice (mark image and text).
- The "Page not found" page and other content pages must show the updated logo, not a stale copy.
- "Andexor Network, Inc." appears only in the footer copyright line. Page titles and the page body
  say "Andexor Network".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The logo wordmark MUST read "Andexor Network" on a single line.
- **FR-002**: The logo MUST NOT show the "Network, Inc." line anywhere on the site.
- **FR-003**: In the header and footer logos, the logo mark MUST be 38px and the wordmark text
  26px, set by two separate settings so either can change alone. The larger logo at the top of
  the home page follows the design system's sizes instead.
- **FR-004**: The logo lockup (mark plus wordmark) MUST come from one shared definition that every
  header and footer uses.
- **FR-005**: The updated logo MUST appear in the header and footer of every page: the home page,
  content pages, and the "Page not found" page.
- **FR-006**: On pages other than the home page, activating the header logo MUST go to the home
  page.
- **FR-007**: The wordmark MUST stay on one line and cause no horizontal scrolling at phone widths.
- **FR-008**: The wordmark MUST be legible on both the header and footer backgrounds, following the
  site's always-dark palette and design rules.
- **FR-009**: Assistive technology MUST announce the brand name once per logo.
- **FR-010**: Page titles MUST use "Andexor Network" without ", Inc." (for example "Web
  Development | Andexor Network"). "Andexor Network, Inc." MUST appear only in the footer
  copyright line.

### Key Entities

- **Logo lockup**: The logo mark plus the wordmark text "Andexor Network". Shown in headers and
  footers, with a variant for the darker footer background and a link target (home).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages checked (home, Web Development, "Page not found"), both the header
  and footer logos read "Andexor Network" on one line.
- **SC-002**: The text "Network, Inc." appears in 0 logo lockups on the site.
- **SC-003**: Every header and footer logo shows a 38px mark and 26px wordmark, at both desktop
  and phone widths. The home page's top brand area is exempt (FR-003).
- **SC-004**: Changing the wordmark wording in one place changes it on 100% of pages.
- **SC-005**: No page has horizontal scrolling at a 320px-wide screen because of the logo.

## Assumptions

- "Same size as the logo" was first read as matching boxes. It actually meant the visible pixels
  of the image, not its transparent padding, so the owner set the sizes by eye: mark 38px,
  wordmark 26px, as two separate settings.
- The home page's top brand area (mark plus "Andexor Network" text) counts as its header, and
  will use the shared logo lockup.
- The mark-only compact variant of the logo is unused today and is removed.
- The home page's large top brand area keeps the design system's sizes (`design/README.md`), so
  the 38px and 26px sizes apply to the header and footer logos.
- The header and footer already share a logo component on content pages and the home footer; this
  change extends that to the home page's top brand area.
- Apple, Google, and Microsoft do not put ", Inc." in page titles or the page body; it appears
  only in the footer. This site follows that: titles drop it, and the copyright line keeps it.
- Per the project's spec policy, this is a small visual change to a live site, so
  `specs/001-homepage-contact-us/spec.md` and `specs/002-content-pages-card-template/spec.md` are
  amended only where they describe the old two-line wordmark.
