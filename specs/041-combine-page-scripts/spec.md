# Feature Specification: Combine Page Scripts

**Feature Branch**: `21-make-generated-content-readable`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "If it's not going to break anything, let's go ahead and add the build task to combine all of the script elements in the HTML files into a single script element. And if it's not going to break anything, let's move the script content of this new combined element into an external .js file."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One script element carries the page's data (Priority: P1)

The site owner views the source of any built page and finds one inline script element at the end of the page, in place
of the dozen or so small ones that are there today. Its content is the same data, in the same order, so the page loads
and behaves exactly as before.

**Why this priority**: This is the first thing the owner asked for, and it is the smaller, safer step. It makes the
page source tidier without moving anything out of the page.

**Independent Test**: Build the site and view the source of the home page and a content page. The end of each page has
one inline data script, and every page still loads with no errors.

**Acceptance Scenarios**:

1. **Given** a built page, **When** the owner reads its source, **Then** the framework's data appears in one script
   element, with its pieces in the order they had before.
2. **Given** that page, **When** a visitor loads it, **Then** it looks and behaves exactly as before, including the
   Contact Us popup.
3. **Given** the scripts in the page's head, **When** the owner reads the source, **Then** they are unchanged and still
   first: the whitespace script and the font loader stay inline in the head.

---

### User Story 2 - The combined script lives in an external file (Priority: P2)

The owner wants the combined script's content out of the page, in an external script file the page refers to. The page
source then has a single short reference at the end instead of the data, and the content sits in its own readable file.

**Why this priority**: This is the second thing the owner asked for. It is only worth doing if it breaks nothing and
does not slow the page, so it is optional on its own result.

**Independent Test**: Build the site and view a page's source. The end of the page has one script element that points to
a file; the file holds the data; the page loads and behaves as before at the same speed.

**Acceptance Scenarios**:

1. **Given** a built page, **When** the owner reads its source, **Then** the data is not in the page; one script element
   refers to an external script file that holds it, readable and formatted.
2. **Given** that page, **When** a visitor loads it, **Then** the page loads, becomes interactive, and behaves as
   before, with at most one extra file requested.
3. **Given** the external file, **When** the site is rebuilt without changes to a page, **Then** the file keeps the same
   name, and when the page's data changes the name changes, so a visitor never gets stale data.

---

### User Story 3 - Nothing breaks, and the owner is told if something would (Priority: P1)

Each step is accepted only if everything still works. If a step would break something, it is not shipped, and the owner
is told which step and why.

**Why this priority**: The owner asked for both steps only "if it's not going to break anything".

**Independent Test**: Run all automated checks after each step. If any fails because of the step, the step is not
kept.

**Acceptance Scenarios**:

1. **Given** step 1 (combine) passes every check, **When** step 2 (external file) fails any check, **Then** step 1
   stays and step 2 is dropped, with the reason reported.
2. **Given** step 1 fails a check, **When** it cannot be fixed, **Then** neither step ships and the reason is reported.
3. **Given** both steps pass, **When** the full automated checks and a browser check of every page type run, **Then**
   they pass with no console errors.

---

### Edge Cases

- Page types: the home page, content pages, and the not-found page each have data; all are covered.
- The scripts in the page head (the whitespace script, the font loader) and the framework's own script files (the files
  with a source address) are not combined or moved by this feature.
- Order matters: the pieces keep their order, and the data is available before the page needs it.
- A visitor with scripts turned off sees the same page content as before (the data is not needed to show content).
- Moving between pages keeps working. The site's links are ordinary links, so every click loads a page fully, with its own data file; the framework's client-side navigation is not used.
- Two pages with identical data share one file; two pages with different data never share a name.
- The external file is served as JavaScript, from the same folder as the other generated files, by the static server.
- The build check that compares the formatted page with the original page must know about this intended change and still
  fail on any other difference.
- If the data is empty or oddly shaped for some page, that page is left as it was and the build says so.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each built page MUST have its framework data in one inline script element instead of the many small ones,
  with every piece kept, in the order it had.
- **FR-002**: The scripts in the page head (the whitespace script and the font loader) MUST stay inline, unchanged, and
  in their current positions. The framework's script files that are referenced by address MUST NOT be merged or changed.
- **FR-003**: If it breaks nothing, the combined script's content MUST be moved into an external script file, and the
  page MUST have one script element that refers to it, placed so the data is available when the page needs it.
- **FR-004**: The external file MUST be readable (formatted like the site's other generated script code), named with a
  fingerprint of its content so it can be cached safely, shared by pages with identical data, and served as JavaScript
  by the static server.
- **FR-005**: Pages MUST look and behave exactly as before: no console errors on any page type, the Contact Us popup
  works, a page reached through a link works, and every existing automated test passes.
- **FR-006**: Each step MUST be kept only if all checks pass. Step 2 MAY be dropped without dropping step 1. If either
  step is dropped, the reason MUST be reported.
- **FR-007**: The page load MUST NOT get noticeably slower: at most one extra file is requested per page, and the
  existing timing checks for the Contact Us popup still pass.
- **FR-008**: The build's check that the formatted page has the same page structure as the original MUST be updated for
  this change and MUST still fail on any other difference.
- **FR-009**: The formatting, straight quotes, and no-curly-quote rules continue to apply to the combined script and the
  external file.
- **FR-010**: A data file's name MUST always match its content: identical content gives the same name, and different
  content never shares a name, so a visitor never gets stale data. (The framework puts a different build identifier in
  every build, so names change from build to build; byte-for-byte reproducible output was never the case and is not
  required.)

### Key Entities

- **Data script**: The framework's inline script elements at the end of a built page, which together carry the page's
  data for the browser.
- **Combined script**: The single script element that replaces them.
- **External data file**: The script file that holds the combined script's content, referenced by one script element.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After step 1, each built page has exactly one inline data script at the end of its body, down from about a
  dozen.
- **SC-002**: After step 2, each built page has no inline data script, and one script element at the end of its body that
  refers to a file.
- **SC-003**: Every automated test passes, and loading each page type several times logs no console errors.
- **SC-004**: The Contact Us popup opens within the same time limit as before (the existing timing check passes).
- **SC-005**: Pages look the same before and after at 360, 768, and 1280 pixels wide.
- **SC-006**: A page requests at most one more file than before, and on a slow connection (1.6 Mbps, 150 ms latency)
  the Contact button works about as soon as before (measured within about 30 ms) and within 5 seconds.
- **SC-007**: The built page's HTML is smaller by about the size of the data moved out.

## Assumptions

- "All of the script elements" means the framework's data scripts at the end of each page (about a dozen per page). The
  two scripts in the head must run first and early, and the framework's own script files are separate files already, so
  neither is part of this feature.
- "If it's not going to break anything" is a go or no-go test for each step (FR-006), checked by the existing and new
  tests, not a judgment call.
- Step 2 can be dropped on its own: step 1 is useful without it.
- Pages without scripts turned on do not need the data, so they are unaffected.
- This is a build change to the generated pages, so it gets a spec, a plan, and tasks.
