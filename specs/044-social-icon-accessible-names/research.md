# Research: Social Icon Accessible Names

## Decision 1: Name the icon with `aria-label` on the `<svg>`

- **Decision**: pass `aria-label="LinkedIn"` (and "X", "GitHub") to `FontAwesomeIcon`, and put no `aria-label` on the
  `<a>`.
- **Rationale**: the owner asked for `alt`, which is valid only on `<img>`, `<area>`, and `<input type="image">`; on an
  `<svg>` or `<a>` it is ignored and invalid. `aria-label` is the valid way to name an SVG image, and the owner chose it
  on the `<svg>` rather than on the `<a>`. FontAwesome's React component documents `aria-label` as the replacement for
  its `title` prop.
- **Alternatives considered**: `alt` (invalid, no effect); `aria-label` on the `<a>` (the current way; the owner chose
  against it); the `title` prop (adds a `<title>` and a hover tooltip, but FontAwesome recommends against it).

## Decision 2: What FontAwesome writes

- **Finding**: rendering `<FontAwesomeIcon icon={faSquareGithub} aria-label="GitHub" />` produces
  `<svg ... role="img" aria-hidden="false" aria-label="GitHub">`. Without a label it writes `aria-hidden="true"`.
- **Decision**: accept `aria-hidden="false"`. It hides nothing and cannot be removed without bypassing the component.
  The spec was updated to say "not hidden" (no `aria-hidden="true"`) instead of "no `aria-hidden` attribute".
- **Alternatives considered**: render the SVG ourselves to drop the attribute (rejected: the owner has moved away from
  custom replacements of FontAwesome); strip the attribute after render (rejected: hydration and formatter risk for no
  benefit).

## Decision 3: The link's name

- **Decision**: with no `aria-label` on the `<a>`, the link takes its name from its content, the icon's `aria-label`
  (`role="img"` content contributes its name). The link is announced once as "LinkedIn, link".
- **Rationale**: a link's own `aria-label` would override the content and could disagree with the icon.
- **Alternatives considered**: keep the link's label as well (rejected: two names, and the old ones are lowercase and
  say "twitter").

## Decision 4: Tests

- **Decision**: update `homepage-content.spec.ts` (it uses `getByLabel("linkedin")` and the other lowercase names) to the
  new names, and add `social-icon-names.spec.ts` for the attribute rules in the spec. The existing axe checks cover a
  named, visible `role="img"`.
- **Rationale**: the owner's rules about tests that prove nothing: the new test reads the real built attributes.
