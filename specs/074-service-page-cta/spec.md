# Feature Specification: Service Page Call to Action

**Feature Branch**: `75-service-page-cta`

**Created**: 2026-10-17

**Status**: Draft

**Input**: User description: "Extend the call to action and its Contact Us popup from the home page to the bottom of
all of the service pages, like the home page. Each page can have its own heading text, set in the page's Markdown
frontmatter. Populate the field on every service page with a starting heading about as long as the home page's, tuned
to that page."

Follows spec 001 (the home page call to action band and the Contact Us popup), spec 002 (Markdown content pages with
the card layout), spec 014 (one popup rendered once in the root layout, opened through `useContact()`), and spec 071
(the hidden `sourcePath` field the popup fills in from the page it opened on).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A reader can reach out at the end of a service page (Priority: P1)

A visitor reads a service page, such as Web Hosting, to the bottom. Between the last card and the footer there is the
same band as on the home page: a heading written for that service and a Contact Us button. Pressing the button opens
the Contact Us popup.

**Why this priority**: This is the owner's whole request. A reader who has just learned what Andexor does for them is
at the best moment to ask for a conversation.

**Independent Test**: Open `/web-hosting`, scroll to the bottom, press Contact Us, and see the popup open.

**Acceptance Scenarios**:

1. **Given** a service page with `cta_heading` in its frontmatter, **When** the page loads, **Then** the band shows
   that text as its heading, after the cards and before the footer.
2. **Given** the band, **When** Contact Us is pressed, **Then** the same popup as on the home page opens, with the same
   focus handling (focus moves in, Tab stays inside, the background is inert, focus returns to the button on close).
3. **Given** the popup opened from `/web-hosting` and the form sent, **When** the request is read, **Then** its
   `sourcePath` is "/web-hosting", with no new code in the popup (spec 071 FR-002).
4. **Given** a page with no `cta_heading` (About Us, Privacy, Terms, the not-found page), **When** it loads, **Then** no
   band appears.

---

### User Story 2 - The owner writes a different heading for each service (Priority: P1)

The owner edits one line of a page's frontmatter to change the heading of that page's band. No code change is needed.

**Why this priority**: The owner wants to fine-tune the invitation per service, and keeps authoring pages in Markdown.

**Independent Test**: Change `cta_heading` in one `.md` file, rebuild, and see the new text on that page only.

**Acceptance Scenarios**:

1. **Given** `cta_heading: <text>` in a page's frontmatter, **When** the site is built, **Then** that text is the
   band's heading on that page and on no other page.
2. **Given** a heading with an apostrophe, **When** the page is built, **Then** the HTML has the plain apostrophe.
3. **Given** `cta_heading` is empty or not text, **When** the site is built, **Then** the band is left off that page.

---

### User Story 3 - Each service page starts with a heading written for it (Priority: P2)

Each of the eight service pages ships with a starting heading, about as long as the home page's, that speaks to that
service. The owner will reword them later.

**Why this priority**: It gives the owner something real to review and edit, instead of eight blanks.

**Independent Test**: Open each service page and read its band heading.

**Acceptance Scenarios**:

1. **Given** the Technical Services pages (Web Development, Web Hosting, Agentic Systems, Technical SEO) and the
   Business Services pages (Process Re-engineering, Lead Generation, Growth Marketing, Cost Reduction), **When** each
   file is read, **Then** it has a `cta_heading` of one sentence in the style of the home page's, and the headings
   differ from each other.

---

### Edge Cases

- The popup lives in the root layout and stays mounted across navigations, so nothing about the band needs to know the
  page; the popup reads the path each time it opens (spec 071).
- `ContentPage` is a server component. The button needs the popup's open function, which exists only in the browser, so
  the band goes in a small client component. The rest of the page stays server rendered.
- Frontmatter is plain text and is rendered as text, never as HTML.
- The build formatter forbids a newline in React-rendered text; a one-line heading satisfies it.
- A page that has `layout: cards` but is not a service page (About Us, Privacy, Terms) leaves out `cta_heading` and gets
  no band. The key, not the page's `section`, decides.
- The band's spacing next to the card grid and the footer on a content page may differ from the home page's; it is
  checked in the browser and adjusted in CSS if needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Card-layout pages MUST accept an optional `cta_heading` string in their frontmatter. A non-empty string
  turns the band on for that page, with the string as its heading. Any other value leaves the band off.
- **FR-002**: `content/README.md` MUST document `cta_heading`, including that the band appears only on pages that have
  it.
- **FR-003**: `ContentPage` MUST render the band after the cards and before the footer, inside `<main>`, when the page
  has a CTA heading.
- **FR-004**: `CTABand` MUST take an optional `heading` prop. With none, it shows its current text, so the home page
  does not change.
- **FR-005**: The band on a content page MUST call `useContact().openContact()` with no argument, through a small
  client component, so `ContentPage` stays a server component and the popup code is not changed.
- **FR-006**: The popup's visible content, Tab order, focus handling, and the `sourcePath` behavior of spec 071 MUST NOT
  change. On a service page `sourcePath` is that page's pathname.
- **FR-007**: Each of `content/web-development.md`, `web-hosting.md`, `agentic-systems.md`, `technical-seo.md`,
  `process-re-engineering.md`, `lead-generation.md`, `growth-marketing.md`, and `cost-reduction.md` MUST have a
  `cta_heading` of one sentence, about as long as the home page's heading, written for that service. The owner may
  reword them.
- **FR-008**: The band MUST follow the design system and the project rules: dark palette, no link underlines, straight
  quotes, the license header on any new source file, and Prettier formatting.
- **FR-009**: Tests MUST check behavior: that Contact Us on a service page opens the popup and that the request's
  `sourcePath` is that page's path, that a page with `cta_heading` shows the band, and that a page without it does not.
  Tests MUST NOT check heading wording and MUST NOT count anything.
- **FR-010**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Card page frontmatter**: gains `cta_heading` (optional string).
- **CTA band**: a heading and a Contact Us button; its heading comes from the page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can open the Contact Us popup from the bottom of every service page.
- **SC-002**: Changing a service page's band heading takes one frontmatter edit and a rebuild, with no code change.
- **SC-003**: Every request sent from a service page carries that page's path.
- **SC-004**: The home page looks and behaves exactly as before.

## Assumptions

- "Service pages" are the eight pages whose `section` is `technical` or `business`. The company pages (About Us,
  Privacy, Terms, Security) are not services and get no band.
- Opt-in by key is preferred to a default heading. A default for pages with no `cta_heading` can be added later if the
  owner wants one.
- The starting headings follow the home page's pattern ("Let's talk about ..., then plan ...") and are a first draft
  for the owner to edit.
- A trigger that overrides `sourcePath` is still out of scope (spec 071).
