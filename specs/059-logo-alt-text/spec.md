# Feature Specification: Logo Alt Text

**Feature Branch**: `27-add-more-cards-to-the-home-page`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Set the alt text on the logo to be "Andexor Network logo" everywhere where the logo appears."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logo image named "Andexor Network logo" (Priority: P1)

Today the gold logo mark has empty alt text everywhere it appears, so a screen reader skips it and a visitor whose
images fail to load sees nothing in its place. After this change the logo mark's alt text is "Andexor Network logo" on
the home page hero, the footer, the header of the content pages (where it links home), the not-found page, and the
Contact Us popup header. Nothing looks different on screen.

**Why this priority**: This is the owner's whole request.

**Independent Test**: Open each page and the Contact Us popup, find every gold logo mark image, and read its alt text:
each one is "Andexor Network logo".

**Acceptance Scenarios**:

1. **Given** the home page, **When** the logo mark images in the hero and the footer are read, **Then** each has the alt
   text "Andexor Network logo".
2. **Given** a content page (for example Web Development) and the not-found page, **When** the header logo mark and the
   footer logo mark are read, **Then** each has the alt text "Andexor Network logo".
3. **Given** the Contact Us popup, **When** the logo mark in its header is read, **Then** it has the alt text
   "Andexor Network logo", on both the form screen and the Request received screen.
4. **Given** any page, **When** it is viewed, **Then** the logo, its wordmark, spacing, colors, and links look and behave
   exactly as before, and the header logo still links to `/`.
5. **Given** any page, **When** every `img` whose source is the logo file is listed, **Then** none has empty or missing
   alt text, and none has any other text.

---

### Edge Cases

- The wordmark "Andexor Network" is real text next to the mark. A screen reader will now say "Andexor Network logo" and
  then "Andexor Network". The owner asked for this alt text everywhere, so that repetition is accepted.
- The header logo on content pages is a link. Its accessible name becomes "Andexor Network logo Andexor Network" (image
  alt text plus the wordmark). It must still be a single link to `/` and still pass the accessibility checks.
- If the image fails to load, the alt text "Andexor Network logo" shows in its place beside the wordmark.
- The content pages' hero illustrations and card images are not the logo, and keep their own alt text.
- The favicon and the page metadata are not the logo image on a page, and are not changed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every logo mark image on the site MUST have the alt text "Andexor Network logo", exactly, with a capital A
  and a capital N and no other characters.
- **FR-002**: This MUST hold in every place the logo appears: the home page hero, the footer, the content page header,
  and the Contact Us popup header, including the Request received screen.
- **FR-003**: The alt text MUST come from one place for the shared logo lockup, so a page added later gets it without extra
  work. The popup header's own logo image MUST use the same text.
- **FR-004**: The look, size, spacing, links, and behavior of every logo MUST NOT change, and the header logo MUST still
  link to `/` and never to `#top`.
- **FR-005**: The existing tests that expect empty logo alt text (the Logo unit test and the popup logo test) MUST be updated
  to expect "Andexor Network logo", and a test MUST fail if any logo image on the built pages has a different alt text.
  Tests MUST NOT count anything.
- **FR-006**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Logo mark**: the gold gate-symbol image, drawn from the one logo file, shown next to the "Andexor Network" wordmark in
  the lockup and alone in the popup header.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every page and in the popup, 100% of logo mark images have the alt text "Andexor Network logo".
- **SC-002**: No logo image on the site has empty alt text.
- **SC-003**: The logos look identical before and after, and the header logo still leads to the home page in one click.
- **SC-004**: All existing tests pass (with the two alt text expectations updated), and no new accessibility violations appear.

## Assumptions

- "The logo" is the gold mark image (`/logo/logo-gold.svg`). The "Andexor Network" wordmark next to it is text, not an
  image, and stays as it is.
- The alt text is set on all logo marks, including those beside the wordmark, as the owner asked "everywhere". The
  repeated announcement for screen readers is accepted.
- Alt text is not a heading, link, or visible label, so it does not appear on screen unless the image fails to load.
- This is a small change on the current branch, with no new branch. The owner reviews UI changes before committing, so it
  is left uncommitted when built.
