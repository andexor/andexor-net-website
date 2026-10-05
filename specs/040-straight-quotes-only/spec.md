# Feature Specification: Straight Quotes Only

**Feature Branch**: `21-make-generated-content-readable`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "I see some HTML-escaped fancy quote characters in the HTML. I never authorized that. Get rid of all fancy single quote and double quote characters and never use them ever again. Add this to CLAUDE.md and DESIGN.md so they will never be used again. Add it to ~/.CLAUD[E.md]" Follow-ups: "Add it to ~/.CLAUDE.md too." Then: "Use ~/.claude/CLAUDE.md and not ~/.CLAUDE.md. Do not change the CODE_OF_CONDUCT files. Those came from a third-party site and should not be altered. Yes, I was referring to We&#x27;ll. Can those just be We'll in the HTML outputs?" Then: "Yes, this should go into the constitution. Please add it there too."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Only straight quotes appear anywhere (Priority: P1)

The site owner opens any page, its source, any Markdown file, or any document in the repository and finds only
straight quote characters: the apostrophe `'` and the double quote `"`. There is no curly or "smart" quote of any kind,
whether typed directly or written as an HTML reference.

**Why this priority**: This is the owner's direct request. The owner never authorized curly quotes, and wants them
gone everywhere.

**Independent Test**: Search every built page and every file in the repository for the curly quote characters and their
HTML references. None is found.

**Acceptance Scenarios**:

1. **Given** the built site, **When** the owner searches all pages for curly single or double quotes, in any form,
   **Then** none is found in text, titles, descriptions, attributes, or inline data.
2. **Given** the repository, **When** the owner searches every source, content, documentation, and specification file
   for the same characters, **Then** none is found, except in the third-party Code of Conduct files, which are left
   exactly as they came.
3. **Given** a Markdown page where the author types a straight quote or apostrophe, **When** the site is built, **Then**
   the page shows the same straight character; the site never turns it into a curly one.
4. **Given** a Markdown page where the author types an HTML reference for a curly quote (for example the named or
   numeric reference for a right single quote), **When** the check runs, **Then** it reports the file and line.

---

### User Story 2 - Apostrophes in the page source are plain characters (Priority: P1)

The owner views the source of a page and sees an apostrophe as `'`, as in "We'll", not as a numeric escape that looks
like a curly quote reference. The same goes for a double quote in page text. Nothing about how the page looks changes.

**Why this priority**: The owner's complaint came from reading `&#x27;` in the source. Even though it is a straight
apostrophe, it looks like a reference to a fancy quote, so it should not be there.

**Independent Test**: View the source of the home page. Words with apostrophes, such as "We'll" and "Let's", read as
typed, and no `&#x27;` appears in the text.

**Acceptance Scenarios**:

1. **Given** page text with an apostrophe, **When** the built page source is read, **Then** the apostrophe is the plain
   character.
2. **Given** page text with a double quote, **When** the built page source is read, **Then** the double quote is the
   plain character, except where HTML requires an escape (inside an attribute value written with double quotes).
3. **Given** the formatted page, **When** a visitor views it, **Then** it looks and behaves exactly as before.

---

### User Story 3 - It never comes back (Priority: P1)

The rule is written down where every author, and every AI assistant working on the project, will read it, and an
automated check fails when a curly quote is added.

**Why this priority**: The owner said the characters must never be used again. A rule that no one reads or checks would
not last.

**Independent Test**: Add a right single quote to a Markdown page or a source file and run the project's checks. They
fail and name the file and line. Open the three rule files and find the rule in each.

**Acceptance Scenarios**:

1. **Given** the project's `CLAUDE.md`, `design/DESIGN.md`, the project constitution, and the owner's global
   `~/.claude/CLAUDE.md`, **When** the owner reads them, **Then** each states that curly quotes are never used.
2. **Given** a file with a curly quote, **When** the automated checks run, **Then** they fail and name the file and
   line.
3. **Given** a correctly written site, **When** the checks run, **Then** they pass.

---

### Edge Cases

- Third-party text kept in the repository, the Code of Conduct files (`CODE_OF_CONDUCT.md` and
  `CODE_OF_CONDUCT.adoc`), came from another site and MUST NOT be changed. They contain curly apostrophes, are excluded
  from the rule and the check, and stay as they are.
- Code, preformatted text, and inline data are covered like any other text.
- A quote inside an attribute value written in double quotes may be written as an HTML escape, because the HTML
  requires it; that escape is for a straight quote, so it is allowed.
- Vendor files that ship with the framework (React, Next.js) are not part of the site's own files and are not checked.
- Em dashes, en dashes, ellipses, and other punctuation are not part of this feature.
- The names of the characters themselves, when a document has to talk about them, are written in words, not with the
  characters.
- Specs and plans in the repository follow the rule too.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: No file in the repository (source, content, documentation, specifications, tests, scripts) other than the
  third-party Code of Conduct files (`CODE_OF_CONDUCT.md`, `CODE_OF_CONDUCT.adoc`), which MUST NOT be altered, MAY contain a
  curly or typographic quote character: the left and right single quotes, the single low-9 and single high-reversed-9
  quotes, the left and right double quotes, and the double low-9 and double high-reversed-9 quotes. Existing
  occurrences in other files MUST be replaced with the straight apostrophe or double quote.
- **FR-002**: No built page MAY contain any of those characters, or an HTML reference to one (named or numeric), in
  text, titles, descriptions, attributes, or inline data.
- **FR-003**: The Markdown rendering MUST NOT convert straight quotes to curly ones, or otherwise apply smart
  typography. A straight quote typed by an author MUST appear as a straight quote.
- **FR-004**: In built page source, an apostrophe or double quote MUST appear as the plain character rather than as a
  numeric or named escape, so `We'll` is written `We'll`, not `We&#x27;ll`. This applies to page text, and to attribute
  values wherever the plain character is valid there. An escape is allowed only where HTML needs one (a double quote
  inside a double-quoted attribute value, or an apostrophe inside a single-quoted one).
- **FR-005**: The built page MUST look and behave exactly as before (the formatting rules and the DOM check from spec 038
  still hold).
- **FR-006**: The rule "never use curly or typographic quotes; use only the straight apostrophe and double quote" MUST
  be written in the project's `CLAUDE.md`, in `design/DESIGN.md`, in the project constitution
  (`.specify/memory/constitution.md`, as a new rule with a version bump), and in the owner's global
  `~/.claude/CLAUDE.md`.
- **FR-007**: The project's automated checks MUST fail when a curly quote or an HTML reference to one appears in a
  repository file or in a built page, naming the file and the line. The Code of Conduct files are not checked.
- **FR-008**: The checks MUST NOT flag the vendor files that ship with the framework.

### Key Entities

- **Curly quote**: any of the eight typographic quote characters listed in FR-001, or an HTML reference to one.
- **Straight quote**: the apostrophe `'` and the double quote `"` on the keyboard.
- **Rule files**: the four documents that carry the rule (FR-006).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Searching every built page for the curly quote characters and their HTML references finds nothing.
- **SC-002**: Searching every file in the repository, apart from the third-party Code of Conduct files, for the same
  finds nothing, and the Code of Conduct files are byte for byte what they were.
- **SC-003**: On the home page, no apostrophe in text is written as `&#x27;`.
- **SC-004**: Adding a curly quote to any repository file makes the project's checks fail, and the failure names that
  file and line.
- **SC-005**: The rule appears in all four rule files.
- **SC-006**: All existing automated tests pass, and every page looks the same before and after.

## Assumptions

- The owner's message was cut off at "~/.CLAUD". The owner then said the global file is `~/.claude/CLAUDE.md` (the one
  Claude Code reads), not `~/.CLAUDE.md`, so only `~/.claude/CLAUDE.md` is edited.
- The characters the owner saw in the page source were `&#x27;`, the framework's escape for a straight apostrophe, as
  in `We&#x27;ll`. The owner confirmed this and asked for the plain `We'll` in the HTML output. No curly quote is in the
  built pages today. The only curly quotes in the repository are two apostrophes in the third-party Code of Conduct
  files, which stay as they are.
- "Fancy quotes" means the eight characters in FR-001; other typographic punctuation is out of scope.
- The owner asked for the constitution to carry the rule too, as it does for the rules about `#top` links and link
  underlines; that is a new minor version of the constitution.
- The global file is outside the repository, so it is edited by hand during implementation and is not covered by the
  project's automated checks.
- This is a rule change with a small build step, so it gets a spec, a plan, and tasks.
