# Feature Specification: "Technical Services" Capitalization

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Change all occurrences of "Technical services" to "Technical Services"."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The group label reads "Technical Services" in the Contact Us form (Priority: P1)

A visitor opens the Contact Us popup and the "Primary need" list. The first group is headed
"Technical Services", capitalized like the footer column "TECHNICAL SERVICES" and the eyebrow on
the service pages, which already read "Technical Services".

**Why this priority**: This is the only place a visitor still sees the old wording. The content pages
already use the new form, so the site reads inconsistently until this changes.

**Independent Test**: Open the Contact Us popup and open the "Primary need" list. The first group
heading is exactly "Technical Services". Its options (Web Development, Web Hosting, Technical SEO,
Agentic Systems) are unchanged.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup, **When** the "Primary need" list is opened, **Then** the first
   group is headed "Technical Services".
2. **Given** the same list, **When** it is read, **Then** the options and their order are as
   before, and the "Business Services" group is as before.

---

### User Story 2 - No "Technical services" is left anywhere in the project (Priority: P2)

The owner searches the project for "Technical services" (lowercase s) and finds nothing: not in the
site's code, the Markdown authoring guide, the design-system copy, or the specs, plans, and tasks
that describe the wording.

**Why this priority**: The owner asked for all occurrences. Leaving the old form in guides and specs
means the next page author copies it back in.

**Independent Test**: A case-sensitive search for `Technical services` across the project, excluding
dependencies, build output, and the specs that quote the old wording (012 and 013), returns no
matches.

**Acceptance Scenarios**:

1. **Given** the project, **When** "Technical services" is searched for case-sensitively, **Then**
   there are no matches outside dependencies, build output, and the specs that quote the old
   wording (012 and 013).
2. **Given** the Markdown authoring guide's example page, **When** it is read, **Then** its
   `eyebrow` example is "Technical Services".

---

### Edge Cases

- Only the exact phrase "Technical services" changes. "Business Services", the all-caps footer
  headings, and the lowercase phrase in running sentences ("technical services group", "technical
  services, business services, company") are not "Technical services" and are left alone.
- Text that quotes the old wording as history is still changed, so the search in User Story 2 comes
  back empty.
- This spec and spec 013 quote the old wording to describe the change, so the search in User Story 2
  skips those two folders.
- The change must not alter any option label, order, or the values the Contact form submits.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The first group in the Contact Us "Primary need" list MUST be headed "Technical
  Services".
- **FR-002**: The option values, labels, and order in that list, and the "Business Services" group,
  MUST be unchanged.
- **FR-003**: Every other occurrence of the exact phrase "Technical services" in the project MUST
  become "Technical Services": the Markdown authoring guide, the design-system copy, and the specs,
  plans, tasks, and contracts. Dependencies and build output are excluded.
- **FR-004**: An automated check MUST fail if the Contact Us group label or a service page's
  eyebrow is written "Technical services" again.
- **FR-005**: Existing tests that assert the old wording MUST be updated to the new wording.

### Key Entities

- **Primary need group**: A heading in the Contact Us form that groups service options.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A case-sensitive search for "Technical services" finds 0 matches in the project outside
  dependencies, build output, and the specs that quote the old wording (012 and 013).
- **SC-002**: The Contact Us "Primary need" list shows "Technical Services" as its first group
  heading, and all 8 options are unchanged.
- **SC-003**: All existing automated tests pass after the change.

## Assumptions

- Only the phrase named in the request changes. "Business Services" is capitalized the same way by
  spec 013 (`specs/013-business-services-caps/spec.md`), so both group headings in the Contact Us
  list end up as "Technical Services" and "Business Services".
- "All occurrences" includes the design-system copy under `design/` and historical specs and tasks,
  so one search finds nothing. If `design/` is re-copied from the design tool, it may need the same
  edit again.
- The service page eyebrows and the footer already use the new form, so they need no change.
- This is a small wording change, so it does not amend earlier specs beyond the wording itself.
