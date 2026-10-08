# Research: Legal Icon Outside Link

## Current markup

- **Finding**: `ContactPopup.tsx` renders each legal link as `<a ...>Privacy<FontAwesomeIcon .../></a>` inside
  `<span className="an-contact-form__legal">`, with `{" | "}` between the two links. Links are white (`#ffffff`, weight
  600) and `--blue-200` on hover; the note's own text is `--blue-100`. The icon's size rule
  (`.svg-inline--fa.fa-arrow-up-right-from-square`: 0.85em square, `margin-left: 0.25em`, `vertical-align: -0.1em`) is in
  `marketing.css`.
- **Decision**: Move each `FontAwesomeIcon` to directly after its `</a>`, as the next sibling, with no text or `{" "}`
  between them. The first icon therefore comes before `{" | "}`, and the second at the end of the span.
- **Alternatives considered**: Wrapping link and icon in another element (adds a node the spec does not ask for);
  putting the icon after the separator (the owner said "just after the links").

## Color

- **Finding**: Outside the `<a>`, the icon inherits the note's `--blue-100`, not the link's white, and it would look
  detached from the link.
- **Decision**: Set `color: #ffffff` on the icon through the existing `.an-contact-form__legal` area of `marketing.css`
  (a rule for `.an-contact-form__legal .svg-inline--fa`), the same white as the links at rest. It has no hover rule, because
  it is not part of the link (spec 066, Assumptions).
- **Alternatives considered**: Leaving it `--blue-100` (a visible change from spec 065 that the owner did not ask for);
  a hover rule on the span (the icon would change color while the link text did not, if the pointer was on the icon).

## Layout

- **Finding**: `.an-contact-form__legal` is `white-space: nowrap`, so the link, its icon, and the separator cannot wrap
  apart. The icon keeps its `margin-left: 0.25em` as the gap after the link text.
- **Decision**: No layout change. The icon is not focusable and is not clickable, because it is outside the `<a>`. The
  focus ring wraps only the text.

## Tests

- **Finding**: `contact-legal-new-tab.spec.ts` finds the icon with `link.locator("svg")` and measures it against the link's
  text range. Those lookups now fail.
- **Decision**: Find the icon as the link's next sibling (`link.evaluate((el) => el.nextElementSibling)`; and check
  `el.nextSibling === el.nextElementSibling` so no text node sits between). Keep the checks for the class, `aria-hidden`,
  no `aria-label`, no `alt`, transparent background, height no greater than the line, and same line. Add: the link itself holds no `svg` (check that
  `link.evaluate((el) => el.querySelector("svg"))` is null, which counts nothing). Compute "after the text" against the link's right edge. The
  popup-link, a11y, keyboard, note-text, and footer specs do not depend on the icon's place and stay as they are.
