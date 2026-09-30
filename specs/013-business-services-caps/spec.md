# Feature Specification: "Business Services" Capitalization

**Feature Branch**: `15-create-stubs-of-all-other-pages-listed-in-the-footer`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Change all occurrences of "Business services" to "Business Services"."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The group label reads "Business Services" in the Contact Us form (Priority: P1)

A visitor opens the Contact Us popup and the "Primary need" list. The second group is headed
"Business Services", matching the first group ("Technical Services", spec 012), the footer column
"BUSINESS SERVICES", and the eyebrow on the four business service pages, which already read
"Business Services".

**Why this priority**: This is the only place a visitor still sees the old wording. Without it, the
two group headings in the same list are capitalized differently.

**Independent Test**: Open the Contact Us popup and open the "Primary need" list. The second group
heading is exactly "Business Services". Its options (Cost Reduction, Lead Generation, Growth
Marketing, Process Re-engineering) are unchanged.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup, **When** the "Primary need" list is opened, **Then** the second
   group is headed "Business Services".
2. **Given** the same list, **When** it is read, **Then** the options and their order are as
   before, and the "Technical Services" group and "Something else" are as before.

---

### User Story 2 - No "Business services" is left anywhere in the project (Priority: P2)

The owner searches the project for "Business services" (lowercase s) and finds nothing: not in the
site's code, the design-system copy, or the specs, plans, and tasks that describe the wording.

**Why this priority**: The owner asked for all occurrences. Leaving the old form in specs and design
files means it gets copied back in later.

**Independent Test**: A case-sensitive search for `Business services` across the project, excluding
dependencies, build output, and the two specs that quote the old wording (012 and 013), returns no
matches.

**Acceptance Scenarios**:

1. **Given** the project, **When** "Business services" is searched for case-sensitively, **Then**
   there are no matches outside dependencies, build output, and the specs that quote the old
   wording (012 and 013).

---

### Edge Cases

- Only the exact phrase "Business services" changes. The all-caps footer headings, "Business
  Services" where it is already capitalized, and the lowercase phrase in running sentences
  ("business services, company") are left alone.
- Text that quotes the old wording as history is still changed, so the search in User Story 2 comes
  back empty. That includes spec 012, which mentioned "Business services" as out of scope; its
  Assumptions now say this spec does the follow-up.
- This spec and spec 012 quote the old wording to describe the change, so the search in User Story 2
  skips those two folders.
- The change must not alter any option label, order, or the values the Contact form submits.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The second group in the Contact Us "Primary need" list MUST be headed "Business
  Services".
- **FR-002**: The option values, labels, and order in that list, and the "Technical Services" group,
  MUST be unchanged.
- **FR-003**: Every other occurrence of the exact phrase "Business services" in the project MUST
  become "Business Services": the design-system copy, and the specs, plans, tasks, and contracts.
  Dependencies and build output are excluded.
- **FR-004**: An automated check MUST fail if the Contact Us group label is written "Business
  services" again.
- **FR-005**: Existing tests that assert the old wording MUST be updated to the new wording.

### Key Entities

- **Primary need group**: A heading in the Contact Us form that groups service options.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A case-sensitive search for "Business services" finds 0 matches in the project outside
  dependencies, build output, and the specs that quote the old wording (012 and 013).
- **SC-002**: The Contact Us "Primary need" list shows "Business Services" as its second group
  heading, and all 8 options are unchanged.
- **SC-003**: Both group headings in that list are capitalized the same way ("Technical Services",
  "Business Services").
- **SC-004**: All existing automated tests pass after the change.

## Assumptions

- This completes spec 012 (`specs/012-technical-services-caps/`), which left "Business services"
  as a follow-up. The two specs can be built together on the same branch; both edit
  `src/components/contact/primary-need-options.ts`, so whichever runs second must keep the other's
  change.
- "All occurrences" includes the design-system copy under `design/` and historical specs and tasks,
  so one search finds nothing. If `design/` is re-copied from the design tool, it may need the same
  edit again.
- The service page eyebrows, the footer, and the spec 010 documents already use the new form.
- This is a small wording change, so it does not amend earlier specs beyond the wording itself.
