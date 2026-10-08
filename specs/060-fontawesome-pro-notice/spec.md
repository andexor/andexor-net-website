# Feature Specification: Font Awesome Pro License Notice

**Feature Branch**: `29-add-or-edit-alt-text-for-images`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Update NOTICE to state that the site uses Font Awesome Pro Duotone icons under a commercial annual subscription license held by Andexor Network, Inc. (not covered by the Apache License, license file not published, icons may not be reused outside this website without own license), keeping the existing Font Awesome Free brand icons paragraph. Update the FontAwesome section of setup.md to record the subscription term: purchased 08/25/2026, expires or must be renewed 08/25/2027, with the license file excluded from GitHub (.npmrc) and passed to the Docker builder stage as a BuildKit secret."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - NOTICE names the commercial icon license (Priority: P1)

The site uses Font Awesome Pro Duotone icons, which are commercially licensed and are not under the Apache License that
covers the rest of the project. A person who reads NOTICE (a fork author, a reviewer, a customer's legal team) learns
that these icons are used under a paid license held by Andexor Network, Inc., that the license file is not published,
and that they may not take the icons for other uses without a license of their own. The existing paragraph about the
Font Awesome Free brand icons stays.

**Why this priority**: Without it, the Apache-2.0 grant could be read as covering the Pro icons.

**Independent Test**: Read NOTICE. It has a Font Awesome Free paragraph (unchanged) and a Font Awesome Pro Duotone
paragraph that states the four points above.

**Acceptance Scenarios**:

1. **Given** NOTICE, **When** it is read, **Then** the Font Awesome Free brand icons paragraph is still there, word for
   word as before.
2. **Given** NOTICE, **When** it is read, **Then** a separate paragraph says the site uses Font Awesome Pro Duotone
   icons, that they are not covered by the Apache License, that they are used under a commercial Font Awesome Pro
   license held by Andexor Network, Inc., and that the license file is not published with the source code.
3. **Given** NOTICE, **When** it is read, **Then** the Pro paragraph says the icon files may not be copied,
   redistributed, or reused outside this website without a Font Awesome Pro license of the reader's own.
4. **Given** NOTICE, **When** it is read, **Then** it does not give the purchase date, the renewal date, a price, or any
   token or account detail.

---

### User Story 2 - setup.md records the subscription term (Priority: P1)

The owner needs to remember when the annual subscription ends. The FontAwesome section of setup.md records that the
subscription was purchased on 08/25/2026 and expires, or must be renewed, on 08/25/2027. It also records where the
license lives: it is the `.npmrc` file, excluded from GitHub by `.gitignore`, and it is passed to the Docker builder
stage as a BuildKit secret, so it is not stored in the image.

**Why this priority**: A lapsed subscription breaks the install of the icons, and so the build, without warning.

**Independent Test**: Read the FontAwesome section of setup.md. It gives both dates, says what to do at renewal, and
says where the license file is kept and how the build receives it.

**Acceptance Scenarios**:

1. **Given** setup.md, **When** the FontAwesome section is read, **Then** it states the purchase date 08/25/2026 and the
   expiry or renewal date 08/25/2027, and that the subscription is annual.
2. **Given** setup.md, **When** the FontAwesome section is read, **Then** it says the license file is `.npmrc`, that it is
   excluded from GitHub, and that the Docker build gets it as a BuildKit secret in the builder stage.
3. **Given** setup.md, **When** the FontAwesome section is read, **Then** it says what to do before the expiry date:
   renew the subscription and update the dates in that section.
4. **Given** setup.md, **When** it is read, **Then** the existing sentence that setup.sh adds the license file is kept or
   corrected to match what setup.sh does, and no token or account detail appears.

---

### Edge Cases

- The renewal date passes without renewal. The section tells the owner this breaks the build for new installs, and to
  renew before the date.
- A fork author builds the site without the license file. NOTICE says the file is not published, so the build for them
  fails at the icon install; that is expected and is not fixed here.
- The Free brand icons paragraph and the Pro paragraph both name Font Awesome. They stay separate so each license is clear.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: NOTICE MUST keep the existing Font Awesome Free brand icons paragraph unchanged.
- **FR-002**: NOTICE MUST add a paragraph stating that the site uses Font Awesome Pro Duotone icons, that they are not
  covered by the Apache License, that they are used under a commercial Font Awesome Pro license held by Andexor
  Network, Inc., that the license file is not published with the source code, and that the icon files may not be copied,
  redistributed, or reused outside this website without a Font Awesome Pro license of the reader's own.
- **FR-003**: NOTICE MUST NOT contain the purchase date, the renewal date, a price, or any token or account detail.
- **FR-004**: The FontAwesome section of setup.md MUST state the annual subscription, the purchase date 08/25/2026, and
  the expiry or renewal date 08/25/2027.
- **FR-005**: That section MUST state that the license file is `.npmrc`, that it is excluded from GitHub, and that the Docker
  build receives it as a BuildKit secret in the builder stage, so it is not stored in the image.
- **FR-006**: That section MUST say to renew before the expiry date and update the dates here.
- **FR-007**: No file in the change MUST contain a token, password, or the contents of `.npmrc`.
- **FR-008**: No other file's behavior changes: no source code, build script, or Dockerfile edit. The project's own
  rules for straight quotes and no License header on Markdown files still hold.

### Key Entities

- **Font Awesome Pro subscription**: an annual commercial license held by Andexor Network, Inc.; purchased 08/25/2026,
  expires or is renewed 08/25/2027.
- **License file**: `.npmrc`, kept out of GitHub and given to the Docker build as a secret.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader of NOTICE can tell, without reading anything else, that the Pro icons are commercially licensed
  and are not under the Apache License.
- **SC-002**: The owner can find the subscription's purchase and renewal dates in setup.md in under one minute.
- **SC-003**: No secret appears in the repository after the change.
- **SC-004**: The build and every existing test still pass, unchanged.

## Assumptions

- The dates are written in the owner's format, 08/25/2026 and 08/25/2027.
- The Pro license file is the `.npmrc` already ignored by `.gitignore` and passed by `build.sh` as the BuildKit secret
  `npmrc`; no build change is needed.
- The setup.md sentence "This is added by setup.sh." is checked against `setup.sh` while building, and corrected if it
  is wrong.
- Pro icons are shipped inside the built site, which the Pro license allows for a website. NOTICE does not need an
  attribution for them.
- This is a documentation change on the current branch, with no new branch. The owner reviews changes before committing,
  so it is left uncommitted when built.
