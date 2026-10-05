# Feature Specification: Readable Generated Code

**Feature Branch**: `21-make-generated-content-readable`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "Please keep the following instructions in mind during the build process. This applies
to all generated files, including the home page, not just the pages in the content folder. As a Product Manager, I want
all generated source code to be formatted so that it is easily readable. All HTML, CSS, and JavaScript shall be
formatted with a pretty printer. Lines that need to be indented shall be indented with 4 spaces. As much as possible,
try to keep the line length below 120 characters. Third-party CSS and JavaScript files may be combined and minified,
but all custom-generated code made specifically for this site shall remain separated and not minified."

## Clarifications

### Session 2026-10-05

- Q: Should the build split the site's own code into separate, unminified script files, even if that changes how the
  site is built and loaded? → A: Yes. The site's own code goes in separate, readable, unminified files; React,
  Next.js, and other libraries stay in their own combined and minified files.
- Q: Should the 4-space indent and 120-character rules also apply to the TypeScript and TSX source files? → A: Yes.
  All TypeScript and TSX source, tests, and config files in the repository follow the same rules.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every page's HTML reads cleanly (Priority: P1)

A product manager (or anyone else) opens "view source" on any page of the built site, the home page, a content page,
or the not-found page, and reads well-formed, indented HTML. Nesting is visible at a glance, and each level is indented
by 4 spaces. The pages built from Markdown in the content folder look the same as the home page.

**Why this priority**: The HTML is what a reviewer opens first, and it is the part that comes out of the build as one
long unbroken line today. This alone makes the site reviewable.

**Independent Test**: Build the site, open the HTML of the home page and one content page, and check that tags are
broken across lines, each nesting level is indented by 4 spaces, and ordinary lines are under 120 characters.

**Acceptance Scenarios**:

1. **Given** a freshly built site, **When** a reviewer opens the HTML of the home page, **Then** it is split into
   lines, indented by 4 spaces per nesting level, with no tabs.
2. **Given** a freshly built site, **When** a reviewer opens the HTML of a content page built from Markdown, **Then** it
   has the same formatting as the home page.
3. **Given** a freshly built site, **When** a reviewer opens the not-found page, **Then** it has the same formatting
   as the other pages.
4. **Given** a page with a long paragraph of text, **When** a reviewer reads its HTML, **Then** lines stay under 120
   characters wherever the content allows it.

---

### User Story 2 - Site-specific CSS and JavaScript stay readable (Priority: P1)

A reviewer opens the stylesheets and scripts that were written for this site and finds them formatted and unminified:
one rule or statement per line, 4-space indentation, and lines under 120 characters where possible. Custom code is kept
in its own files and is never merged into a third-party bundle.

**Why this priority**: Equal to the HTML: this is the code the company owns and maintains, and the request says it must
stay separated and unminified.

**Independent Test**: Build the site, find the CSS and JavaScript files that hold the site's own code, and check that
they are separate from any third-party file, are not minified, and follow the indent and line-length rules.

**Acceptance Scenarios**:

1. **Given** a freshly built site, **When** a reviewer opens a custom stylesheet, **Then** each rule and declaration
   is on its own line, indented by 4 spaces, with no minification.
2. **Given** a freshly built site, **When** a reviewer opens a custom script, **Then** its statements are on separate
   lines, indented by 4 spaces, with readable names and no minification.
3. **Given** a freshly built site, **When** a reviewer lists the CSS and JavaScript files, **Then** the files holding
   site-specific code are separate from the files holding third-party code.
4. **Given** a custom file in the source of the site, **When** it is read, **Then** it follows the same formatting
   rules.

---

### User Story 3 - Third-party code may be compact (Priority: P2)

Third-party CSS and JavaScript (framework and library code the site depends on) may be combined and minified so that
pages stay fast. The reviewer is not expected to read these files, and they never contain the site's own code.

**Why this priority**: This is an allowance, not a demand. It keeps page weight down while the owner's code stays
readable.

**Independent Test**: Build the site and confirm that any combined or minified file contains only third-party code.

**Acceptance Scenarios**:

1. **Given** a freshly built site, **When** a reviewer opens a combined or minified file, **Then** it contains only
   third-party code.
2. **Given** a site-specific change, **When** the site is rebuilt, **Then** the change appears only in a custom file,
   and the third-party files are unchanged.

---

### User Story 4 - Formatting stays enforced (Priority: P2)

When a contributor adds or edits a page, component, stylesheet, or script, the formatting rules are applied or checked
automatically, so a later change cannot quietly bring back unreadable output.

**Why this priority**: Without a check, the rules last only until the next change.

**Independent Test**: Add a deliberately badly formatted custom stylesheet (or a 2-space-indented one), run the
project's checks, and see them fail with a message naming the file.

**Acceptance Scenarios**:

1. **Given** a custom file that is not formatted per the rules, **When** the project's automated checks run, **Then**
   they fail and name the file.
2. **Given** a correctly formatted site, **When** the automated checks run, **Then** they pass.

---

### Edge Cases

- Preformatted text and inline text where changing whitespace would change how the page looks: formatting MUST NOT
  change what a visitor sees, so these are left as they are, even if a line runs past 120 characters.
- Long unbreakable values (a URL, a long data string, an inline image) may exceed 120 characters; the limit is a goal,
  not a hard cap.
- Page content that the owner writes in Markdown is not rewritten by this feature; only the HTML, CSS, and JavaScript
  that come out of it are formatted.
- Small inline scripts and styles that the build places inside a page are formatted like the rest of the page, or
  moved to their own files, not left minified.
- Machine-generated data files (such as the license report or a lock file) are not HTML, CSS, or JavaScript and are out
  of scope.
- Visual appearance, behavior, page weight to a visitor, and the look of the Contact Us popup MUST NOT change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every HTML page the site produces (home page, content pages, not-found page) MUST be formatted by a
  pretty printer, with one nesting level per 4 spaces and no tab characters.
- **FR-002**: Every CSS file written for this site, in the source and in the built site, MUST be formatted by a pretty
  printer, with 4-space indentation and no minification.
- **FR-003**: Every JavaScript file written for this site, in the source and in the built site, MUST be formatted by a
  pretty printer, with 4-space indentation and no minification. The site's own component and page code that the build
  produces MUST be emitted as separate, unminified files, not merged into the framework's or libraries' bundles.
- **FR-004**: Lines SHOULD be kept under 120 characters wherever the content allows. A line over the limit is allowed
  only when breaking it would change the page's appearance or when it holds a single unbreakable value.
- **FR-005**: Site-specific CSS and JavaScript MUST be kept in separate files from third-party CSS and JavaScript, and
  MUST NOT be combined with them.
- **FR-006**: Third-party CSS and JavaScript MAY be combined and minified. They MUST contain no site-specific code.
- **FR-007**: Formatting MUST NOT change what a visitor sees or how any page behaves, including the Contact Us popup.
- **FR-008**: The formatting rules MUST apply to every page and component, including the home page, not just the pages
  built from the content folder.
- **FR-009**: The project's automated checks MUST fail when a custom HTML, CSS, or JavaScript file breaks the
  indentation or minification rules, and MUST name the file.
- **FR-010**: The rules MUST be recorded where contributors will find them, so new pages and components follow them.
- **FR-011**: Every TypeScript and TSX file in the repository (source, tests, and configuration) MUST follow the same
  formatting rules: 4-space indentation, no tabs, and lines under 120 characters where possible.
- **FR-012**: Every built page MAY contain one small inline script, first in `<head>`, that removes the extra whitespace
  the formatter adds before the page loads. It MUST NOT change what a visitor sees or how the page behaves (FR-007), and
  no other script is added.
- **FR-013**: No line of built HTML MAY start with `>`; a tag's closing `>` stays on the line of its last attribute.

### Key Entities

- **Custom code**: HTML, CSS, and JavaScript written or generated specifically for this site. Always readable and
  separate.
- **Third-party code**: Framework and library CSS and JavaScript the site depends on. May be combined and minified.
- **Formatting rules**: 4-space indent, no tabs, lines under 120 characters where possible, no minified custom code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a freshly built site, 100% of HTML pages open as indented, multi-line text, and no custom HTML,
  CSS, or JavaScript file is a single minified line.
- **SC-002**: 100% of indentation in custom HTML, CSS, and JavaScript is a multiple of 4 spaces, with zero tab
  characters.
- **SC-003**: At least 95% of lines in custom HTML, CSS, and JavaScript are under 120 characters, and every line over
  the limit is one the edge cases allow.
- **SC-004**: Zero third-party files contain custom code, and zero custom files contain third-party code.
- **SC-005**: Every page looks and behaves the same before and after the change: all existing automated tests pass,
  with no visual differences at 360, 768, and 1280 pixels wide.
- **SC-006**: A reviewer can open any page's source and follow its structure without a formatting tool.

## Assumptions

- The formatted HTML includes the whitespace script because the page framework rejects extra whitespace between
  elements; without it, pretty-printed pages fail to load correctly.
- "Generated" means the site as built and published, plus the source files in the repository. Both are covered.
- Pretty printing the built HTML is expected to add some whitespace; any page weight change is accepted as the cost
  of readability, as long as the site's performance standards still pass.
- Framework runtime code that ships with the site counts as third-party code, even though the build produces the file.
- Separating the site's own script code may require changing how the site is built and loaded; that cost is accepted.
- Where a rule conflicts with keeping the page looking the same (preformatted text, inline spacing), keeping the page
  looking the same wins.
- Reformatting the TypeScript and TSX files changes whitespace only; the existing license headers stay first in each file.
- The line-length target of 120 characters applies to formatted code, not to Markdown prose files.
- Markdown and other documentation files are out of scope. Source-code license headers stay as they are.
- This is a site-wide rule that affects the build, so it gets a new spec, a plan, and tasks.
