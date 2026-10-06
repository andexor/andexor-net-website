# Feature Specification: FontAwesome Social Icons

**Feature Branch**: `21-make-generated-content-readable` (no new branch, per the project's relaxed branch rule)

**Created**: 2026-10-05

**Status**: Implemented

**Input**: GitHub issue #23, "Use FontAwesome icons": "As a Product Manager, I want to replace the social media icons
from lucide-react with ones from FontAwesome. So that the icons will look more modern and realistic." Follow-up: "do the
social icons only at this point."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Footer social icons use FontAwesome brand logos (Priority: P1)

A visitor sees the LinkedIn, X, and GitHub icons in the footer drawn as the official brand logos from FontAwesome Brands,
in place of the generic Lucide line icons (which show the old Twitter bird).

**Why this priority**: This is the whole request.

**Independent Test**: Open the home page and a content page. The footer shows the LinkedIn, X, and GitHub logos. Each
links where it did before.

**Acceptance Scenarios**:

1. **Given** any page with the footer, **When** it loads, **Then** the three social links show the FontAwesome LinkedIn,
   X, and GitHub logos, at about the same size as before, centered in the same 34px bordered boxes.
2. **Given** a social link, **When** the visitor hovers or focuses it, **Then** the color change and focus ring work as
   before, with no underline.
3. **Given** a screen reader, **When** it reaches a social link, **Then** it announces the same label as before and
   ignores the icon.
4. **Given** the page loads, **When** it first paints, **Then** the icons are already the right size (no oversized
   flash).

---

### Edge Cases

- The other icons on the site (service cards, check marks, arrows, the close button) stay Lucide. Switching them is out
  of scope.
- The icons are inline SVG, so no icon font or extra network request is needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer's LinkedIn, X, and GitHub links MUST render FontAwesome Free Brands icons
  (`faLinkedinIn`, `faXTwitter`, `faGithub`), each imported by name so only those three icons ship.
- **FR-002**: The links' URLs, accessible labels, `target` and `rel` attributes, size, and hover and focus styles MUST NOT
  change. The icons MUST be hidden from assistive technology.
- **FR-003**: FontAwesome's stylesheet MUST be loaded from the build, with automatic CSS injection turned off, so the
  icons are never oversized before the CSS arrives.
- **FR-004**: The service, check, arrow, and close icons MUST stay on `lucide-react`.
- **FR-005**: The new packages MUST pass the license check (`./setup.sh`): the FontAwesome code is MIT and the free icons
  are CC BY 4.0, with no GPL, LGPL, or AGPL license. The CC BY 4.0 attribution MUST be kept (the license comment inside
  the icon files and an entry in `NOTICE`).
- **FR-006**: The build, the formatter and DOM check from spec 038, the script combining from spec 041, and all existing
  tests MUST still pass.

### Key Entities

- **Social link**: a footer link with a key, label, URL, and FontAwesome icon definition.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The built footer contains three FontAwesome SVGs (`data-icon` of `linkedin-in`, `x-twitter`, `github`) and
  no Lucide social icon.
- **SC-002**: `bun run build`, the unit tests, and the e2e tests pass.
- **SC-003**: `./setup.sh` passes with no copyleft license.

## Assumptions

- Only the three icons in the footer change. The owner said to do the social icons only at this point.
- The brand logos may differ in look from the line-style Lucide icons; that is the point of the change.
- This is a small change, but the owner asked for it to be in the spec, so it gets a spec only, with no plan or tasks.
