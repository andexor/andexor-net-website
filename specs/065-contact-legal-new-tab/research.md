# Research: Contact Legal Links In New Tab

## Where the links are

- **Finding**: `ContactPopup.tsx` (about line 210) renders the note as `<p className="an-contact-form__note">` with
  `<span className="an-contact-form__legal">` holding two ordinary `<a>` elements ("/privacy", "/terms") joined by
  `{" | "}`, with ESLint disable comments for `no-html-link-for-pages`. `.an-contact-form__legal` is `white-space:
  nowrap` and its links are white, weight 600, no underline, `--blue-200` on hover (`marketing.css`, about line 658).
- **Decision**: Edit these two anchors in place. Keep them ordinary anchors.
- **Alternatives considered**: Next's `Link` (the file deliberately uses ordinary links); a shared helper with the
  footer (the footer's external-link logic is keyed on `href.startsWith("http")` and its links have no icon, so sharing
  would change the footer).

## New tab and the names

- **Finding**: The footer's social links use `target="_blank"` and `rel="noopener noreferrer"` and a name ending ", opens
  in new tab" (specs 044, 061).
- **Decision**: Same pattern: `target="_blank"`, `rel="noopener noreferrer"` (no opener access), and `aria-label` on the
  `<a>` of exactly "Privacy, opens in new tab" and "Terms, opens in new tab". Here the label goes on the link, because
  the link has visible text and the icon is hidden (the social icons had no text, so theirs went on the icon).
- **Alternatives considered**: Visually hidden text inside the link (the owner asked for `aria-label`); `title` (tooltip,
  inconsistent).

## The icon

- **Finding**: `faArrowUpRightFromSquare` exists in `@awesome.me/kit-0a6c11d394/icons/duotone/solid` (checked in the
  kit's `solid.d.ts`). The popup already imports `faSquareCheck` and `faSquareX` from that module. `FontAwesomeIcon`
  renders `<svg class="svg-inline--fa fa-arrow-up-right-from-square" aria-hidden="true">` when no `aria-label` or title
  is given.
- **Decision**: Add `<FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />` inside each `<a>`, after the
  text, so it shares the link color, hover, and click target. Put a small space before it with a CSS margin, not a text
  node, because the formatter rejects stray whitespace in text. Because it is inside the nowrap span and the anchor, it
  cannot start a line alone.
- **Alternatives considered**: An icon outside the anchor (would not follow hover color); an `<img>` (the owner wants the
  Font Awesome icon).

## Size and transparency

- **Finding**: Font Awesome gives every icon `height: 1em; width: 1.25em` through `.svg-inline--fa`. The note is 12px,
  so the icon is about 12px by 15px, which fits within the line without growing it, but the extra width and the pattern
  in `marketing.css` (spec 043) call for an explicit rule. An svg has no background, so it is transparent already; the
  duotone secondary layer draws at reduced opacity by default.
- **Decision**: Add `.svg-inline--fa.fa-arrow-up-right-from-square` with `height: 0.85em`, `width: 0.85em`,
  `margin-left: 0.25em`, and `vertical-align: baseline`-style alignment (final values set in implementation and checked
  by the test against the line height). No `background`, no `fill` box. Two classes outrank Font Awesome's one, so no
  `!important`.
- **Alternatives considered**: `height: inherit` (the link's height is the line's, so a 1em-high icon could add to the
  line box); editing Font Awesome's stylesheet (forbidden).

## Tests

- **Finding**: `contact-popup-links.spec.ts` clicks each link and expects the same tab to navigate, which will now be
  wrong. `contact-popup-a11y.spec.ts` and `keyboard-navigation.spec.ts` find the links with `getByRole("link", { name:
  "Privacy" })` without `exact`, so "Privacy, opens in new tab" still matches. `footer-links.spec.ts` is scoped to the
  footer.
- **Decision**: Update `contact-popup-links.spec.ts` to wait for the popup event from the click, check the new page's
  address and heading, and check the original page still has the open dialog with the typed text. New
  `contact-legal-new-tab.spec.ts` checks the two exact names, `target`/`rel`, the icon (class, `aria-hidden="true"`, no
  `alt`, no `aria-label`, transparent background, height no greater than the line), and that the footer's two links have
  no `target`, no `aria-label`, and no svg. Nothing is counted.
