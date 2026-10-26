# Feature Specification: Link Color

**Feature Branch**: `87-implement-cookiebot`

**Created**: 2026-10-25

**Status**: Draft. The owner chose Option B on 2026-10-25 and asked that the Contact Us popup's links be included.

**Input**: User description: "The color for --text-link is var(--blue-400). I think it's too dark. It does not contrast
enough with the background color. Let's change that to var(--blue-300) and make sure the accessibility tests pass. Then
change .an-footer__copyright and .an-footer__col-link to also use --text-link. Look for any other links that are not
using --text-link. We should make them all use --text-link so they look consistent."

Follows spec 007 (no link underlines), spec 078 (the footer's Do Not Sell or Share link), and spec 079 (footer text
size).

## What the code does today

- The site-wide `--text-link` in `src/styles/tokens/colors.css` is already `--blue-300` (#8fb6e2). The `--blue-400`
  (#4a8bd0) the owner sees is a local override of `--text-link` in two places: `.an-prose` (content pages,
  `src/styles/content.css`) and `.an-tile` (card text, `src/styles/cards.css`). The not-found page's intro links use
  `--blue-400` directly.
- Those overrides exist because links have no underline (spec 007), so a link in running text must differ from the text
  around it by 3:1 (WCAG 2.1 success criterion 1.4.1, checked by axe's `link-in-text-block` rule in the accessibility
  tests). Body text there is `--slate-50` (#f8fafc). `--blue-400` is 3.4:1 from it; `--blue-300` is 2.02:1, which fails.
- Contrast with the page background (#0a1322) and the card background (#111f33) is not the problem: `--blue-400` is
  5.22:1 and 4.65:1, and `--blue-300` is 8.82:1 and 7.86:1. Both pass the 4.5:1 minimum. Blue-300 reads brighter, but it
  is too close to the text color to count as different from it.
- Links that do not use `--text-link` today: the footer copyright line (`--blue-400`, not a link), the footer column
  links (`--blue-200`), the footer Do Not Sell or Share link (`--blue-200`), the popup's Privacy and Terms links (white,
  `--blue-200` on hover), the social links (`--blue-200` on hover), the header and logo links, and the hover colors in
  `.an-prose`, `.an-tile`, and the not-found page (`--blue-300`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Links are easier to see (Priority: P1)

A visitor sees links in the brighter link blue, with more contrast against the dark background.

**Independent Test**: Run `bun run build`, serve `out/`, open a content page, the home page, and the footer, and
compare the link color with the background.

**Acceptance Scenarios**:

1. **Given** a link in a content page or a card, **When** it is read, **Then** its color is `--blue-300`.
2. **Given** every page, **When** the accessibility tests run, **Then** they pass.
3. **Given** a link inside running text, **When** it is read, **Then** it is heavier than the text around it.

---

### User Story 2 - All links share one color (Priority: P1)

Every link on the site gets its color from `--text-link`, so links look the same everywhere.

**Independent Test**: Search `src/styles/` for link rules that set a color other than `--text-link`.

**Acceptance Scenarios**:

1. **Given** the footer, **When** the column links are read, **Then** they use `--text-link`
   (and so does the Do Not Sell or Share link). The copyright line is not a link and sets no color of its own.
2. **Given** the style sheets, **When** link rules are searched, **Then** none sets a resting link color except through
   `--text-link`, apart from the exceptions in Assumptions.
3. **Given** the Contact Us popup, **When** its Privacy and Terms links are read, **Then** they are unchanged: white,
   with the `--blue-200` hover (reverted by the owner after review, because blue-300 looked too low in contrast there).
4. **Given** a link, **When** the pointer is over it, **Then** the color changes to the shared hover blue (hover signals by color, never
   by underline), and keyboard focus still shows the ring.

## Decision

The owner chose **Option B**: every link uses `--blue-300` through `--text-link`, and links inside running text also get
`font-weight: 600`. Moving content links to `--blue-300` alone breaks the 3:1 link-versus-text check (no body text color
can sit 3:1 away from `--blue-300` on this background), and the heavier weight is the cue that is not color. This was
tried on the built site: axe (WCAG 2.1 A and AA) found no violations on the home, Privacy, Terms, Security, Cookies,
Web Development, About Us, and not-found pages with the weight, and `link-in-text-block` violations on every page with
inline links without it.

The Contact Us popup's links are included, so they look like the site's other links and not like a special case.

Not chosen: Option A (keep the darker `--blue-400` in running text) and lowering the body text color.

## Requirements *(mandatory)*

- **FR-001**: `--text-link` MUST be `--blue-300` everywhere. The local `--blue-400` overrides in content pages and
  cards, and the `--blue-400` color on the not-found page's intro links, are removed.
- **FR-002**: The footer's column links and Do Not Sell or Share link MUST use `--text-link` for their
  resting color.
- **FR-003**: The Contact Us popup's links (Privacy and Terms in the form's note line) MUST stay as they were before
  this spec: white, weight 600, `--blue-200` hover, with the new-tab icon white (spec 066). Reverted by the owner after
  review.
- **FR-004**: Links inside running text (content pages, cards, the not-found intro, and the popup's note line) MUST have
  `font-weight: 600`, so they stand apart from the text around them without an underline. Footer links, which are not
  inside running text, keep their current weight.
- **FR-005**: Hover MUST still change the color, and never add an underline. Because the resting color is now
  `--blue-300`, a hover color of `--blue-300` would show no change, so every link's hover color MUST be one shared
  brighter blue, `--blue-200`, in place of the mix of `--blue-300` and white used today. Keyboard focus MUST still show a
  visible ring.
- **FR-006**: The accessibility tests (axe, WCAG 2.1 A and AA) MUST pass on the home page, the content pages, and the
  contact popup.
- **FR-007**: No new test is written for colors (project rule). The existing accessibility tests are the check.

## Success Criteria *(mandatory)*

- **SC-001**: Every link on every page gets its resting color from `--text-link`, except the documented exceptions.
- **SC-002**: The accessibility tests pass with no rule turned off.
- **SC-003**: Footer links are visibly brighter than before against the dark background.

## Assumptions

- "Links" means text links. The social icon links and the logo links are icons and stay as they are (they have no text
  color of their own to unify).
- The popup's links are white to stand out on the form. The owner first included them, then reverted them because blue-300 looked too low in contrast there.
- The shared hover color, `--blue-200`, is the one the popup's links already use on hover. It is an assumption; the
  owner can pick another.
- The footer copyright line is not a link. The owner first asked for it to use `--text-link`, then removed its color
  after review, so it inherits the footer's text color.
