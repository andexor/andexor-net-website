# Feature Specification: Social Icon Box Size

**Feature Branch**: `23-use-fontawesome-icons`

**Created**: 2026-10-05

**Status**: Implemented

**Input**: User description: "For the social media icons, remove all height, width, margin, and padding settings on the
<svg>. There is a variable the page is attempting to use, but it's not defined. Define --fa-display as 32px and use this
variable for the height and width on the <a> surrounding the <svg> and set the margin to 4px." Follow-ups: "Ignore my
request about the variable name. I just want the 32x32px on the <a> and not on the <svg>. The variable name is not so
important, so you can create a new one if that works better." Then "Please change --an-social-size to 48px." Then, after
an attempt to replace FontAwesome's stylesheet with a custom copy was rolled back: "You should not have to create a
custom fontawesome.css. This would drift from the official one eventually and cause issues when the dependencies are
updated." Next: "For .an-footer__social-link, remove the margin. Set --an-social-size to 32px. That's enough to
make it decent again for now." Then, with the square icons in place: "I found another alternative to getting these icons
the size I want. Step 1: Set --an-social-size to 48px. Step 2: Create new rules in our CSS that override FontAwesome's
CSS. Create 3 new rules called svg-inline--fa.fa-square-linkedin, svg-inline--fa.fa-square-x-twitter, and
svg-inline--fa.fa-square-github. This is just taking the class list from the <svg> elements and replacing the space
with a dot. The rules for all 3 classes are just to set the height and width to inherit. Then mark this as a pattern we
can follow for other icons if we need to." Then, about the border: "I want these buttons to have the same 2px X and Y
translations like we did with the CTA and the buttons on the Contact Us popup. I want to have a 3D appearance and
behavior for all buttons. These social icons are links, not buttons, but I want the button behaviour when they are
clicked on or tapped on or triggered by a tap." And: "Don't change any existing buttons. Let's try option A and see
what happens. I'm sure I will want to tweak it a bit after I see it." (Option A was the Close button look.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The icon takes the size of its link (Priority: P1)

The site owner wants the footer's social media icons (the square LinkedIn, X, and GitHub logos from FontAwesome) sized
from the link around each one. The link box is 48px by 48px, set by one named variable, with no margin, and the icon
inside takes the same size.

**Why this priority**: This is the owner's direct request.

**Independent Test**: Open the footer in the browser's inspector. Each social link measures 48px by 48px and the icon
inside it also 48px by 48px, the link has no margin, and the size comes from `--an-social-size`.

**Acceptance Scenarios**:

1. **Given** the built site, **When** the owner inspects a social link, **Then** its height and width are both
   `var(--an-social-size)`, which is 48px, and it has no margin.
2. **Given** the built site, **When** the owner inspects the icon (`<svg>`) inside a social link, **Then** its height and
   width are inherited from the link, so it is 48px by 48px.
3. **Given** a social link, **When** a visitor hovers it or tabs to it, **Then** the color change and focus ring work as
   before, with no underline.
4. **Given** the footer on a phone, a tablet, and a wide screen, **When** it is shown, **Then** the three links sit in a
   row, do not overlap, and stay inside the footer.

---

### User Story 2 - The way of sizing an icon is a pattern to follow (Priority: P2)

The owner wants the method used here written down, so any other FontAwesome icon added later is sized the same way.

**Why this priority**: It keeps later icons consistent, but nothing visible depends on it.

**Independent Test**: Read the comment above the override rules in `src/styles/marketing.css` and the section in
`CLAUDE.md`. Add a new icon by following them and it takes its link's size.

**Acceptance Scenarios**:

1. **Given** the site's stylesheet, **When** a developer reads it, **Then** a comment above the override rules explains
   the pattern.
2. **Given** `CLAUDE.md`, **When** a developer or AI assistant reads it, **Then** it states the pattern and says to follow
   it for other icons.
3. **Given** a social icon, **When** its classes are read from the `<svg>`, **Then** a rule in the site's stylesheet has
   a selector made from those classes joined with dots (the test checks this for every social icon).

---

### User Story 3 - The social links look and press like the Close button (Priority: P2)

The footer's social links have the 3D look of the Close button in the Contact Us popup: a black gloss gradient, a thin
translucent white edge, an inset highlight and shade, and a drop shadow. When clicked, tapped, or triggered, a link
presses 2px right and 2px down and its shadow flattens, as the Close button and the call-to-action button do. They stay
links, not buttons, and no existing button changes.

**Why this priority**: The owner wants to see the look first and tweak it, so it is a first try.

**Independent Test**: Hover a social link (the color changes, no underline), press and hold it (it moves 2px right and
2px down), and tab to it (a solid gold ring appears).

**Acceptance Scenarios**:

1. **Given** a social link at rest, **When** it is shown, **Then** it has the Close button's gradient, edge, highlight,
   and shadow, and no border of its own.
2. **Given** a social link, **When** the pointer is over it, **Then** its color and gradient lighten and nothing is
   underlined.
3. **Given** a social link, **When** it is pressed (mouse down, touch, or key press), **Then** it moves 2px right and
   2px down and its shadow flattens, and it returns when released.
4. **Given** a social link, **When** it has keyboard focus, **Then** it shows a solid gold ring.

---

### Edge Cases

- The link keeps its rounded corners and centered icon, and its size changes from 34px to 48px. Its border becomes a
  box-shadow ring (User Story 3), so it takes no space.
- The spacing between links, which comes from the row's gap (10px), is not part of this request and stays.
- `--fa-display` is not defined or touched, so FontAwesome keeps its own `display` for the icon.
- FontAwesome's stylesheet is used exactly as the package ships it (spec 042). It is not copied, patched, or replaced;
  the site's rules override it by being more specific, so package updates apply cleanly.
- The link has no border, so the whole 48px is inside it and the icon fits without shrinking or overflowing. (With a 1px
  border the icon would have shrunk to 46px wide and spilled 1px over the border at the top and bottom.)
- If an icon is added or swapped in the footer and no rule is added for it, it keeps FontAwesome's own size
  (1em by 1.25em). The test fails in that case, which is the reminder.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST define one rule for each social icon, `.svg-inline--fa.fa-square-linkedin`,
  `.svg-inline--fa.fa-square-x-twitter`, and `.svg-inline--fa.fa-square-github`, each setting only `height: inherit` and
  `width: inherit`. Each selector is the `<svg>`'s class list with the spaces replaced by dots. The two classes outrank
  FontAwesome's one-class `.svg-inline--fa`, so no `!important` is used.
- **FR-002**: `--an-social-size` MUST be defined in the site's stylesheet with the value `48px`.
- **FR-003**: The link around each social icon (`.an-footer__social-link`) MUST have its height and width set to
  `var(--an-social-size)`, and it MUST NOT have a margin.
- **FR-004**: The site MUST keep using FontAwesome's own stylesheet from the package, unmodified. No copy, patch, or
  replacement of it is added.
- **FR-005**: The links' URLs, labels, `target` and `rel` MUST NOT change. No existing button (the call-to-action, Send,
  OK, Close) changes. The icons are `faSquareLinkedin`, `faSquareXTwitter`, and `faSquareGithub`.
- **FR-006**: The pattern MUST be written down in a comment above the rules in `src/styles/marketing.css` and in the
  project's `CLAUDE.md`: to size a FontAwesome icon from the element around it, add a rule named from the `<svg>`'s two
  classes joined with a dot, setting height and width to inherit, and add or change it when an icon is added or swapped.
- **FR-007**: The change MUST NOT break the build, the formatter, or any existing test. A test MUST check the sizes in
  FR-001 to FR-003 in the built page, and that each social icon has a rule named from its classes.

- **FR-008**: `.an-footer__social-link` MUST have no border, and MUST be drawn like the Close button: the same gradient,
  a 1px translucent white box-shadow ring for the edge, the same inset highlight and shade, drop shadow, and gloss
  highlight. Hover MUST change its color and lighten the gradient with no underline. While pressed (`:active`) it MUST
  move `translateX(2px) translateY(2px)` with the flattened shadow. Keyboard focus MUST show a solid 3px gold ring.

### Key Entities

- **`--an-social-size`**: the CSS variable that holds the social link's box size, 48px.
- **Icon override rule**: a rule whose selector is an icon's two `<svg>` classes joined with a dot.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each social link measures 48px by 48px (no margin) and the icon inside it 48px by 48px, in the built
  page, on a phone, a tablet, and a wide screen.
- **SC-002**: `--an-social-size` resolves to `48px` on the page.
- **SC-003**: Each of the three social icons has a matching override rule, and removing one makes the test fail.
- **SC-004**: All existing tests pass.

## Assumptions

- The owner first named `--fa-display`, which FontAwesome's stylesheet reads as a display value
  (`display: var(--fa-display, inline-block)`), not a size. The owner then said the name does not matter, so the site
  defines its own variable and leaves `--fa-display` alone.
- An earlier attempt to replace FontAwesome's stylesheet with a custom copy was rolled back because it would drift from
  the package. Overriding it with more specific rules, as here, does not copy any of it.
- Square icons were chosen by the owner in this same work (spec 042's round-corner glyphs were swapped for the square
  ones). The square glyph fills the whole 48px link, so it covers most of the gradient and gloss, which show mostly at the
  edges. The owner expects to tweak the look after seeing it.
- A tap on a link that opens a new tab may be too brief to see the press, and iOS Safari applies `:active` to links in
  limited cases. The Close and call-to-action buttons have the same limits, so this matches them and adds no JavaScript.
- Making every button 3D is a separate, later spec.
- The pattern is named for the icons now used. Other icons, such as ones in the service cards, are still Lucide and are
  not covered until they move to FontAwesome.
- This is a small change on top of spec 042, on the same branch, with no new branch.
