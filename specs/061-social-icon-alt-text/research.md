# Research: Social Icon Descriptions

## Where the names are set

- **Finding**: `src/components/marketing/Footer.tsx` holds `SOCIAL_LINKS` (key, label, href, icon). The label is passed
  as `aria-label` to the `FontAwesomeIcon`, which renders the `<svg role="img">`. The `<a>` has no label of its own, so
  its name comes from the icon. Spec 044 made it this way.
- **Decision**: Change the three `label` values to the spec's descriptions. No other source change.
- **Alternatives considered**: An `alt` attribute (invalid on SVG, and spec 044 forbids it); an `aria-label` on the
  link (the name would be written twice, and spec 044's tests expect none on the link); a `title` (shows as a tooltip
  and is read inconsistently).

## Tests that use the old names

- **Finding**: `tests/e2e/social-icon-names.spec.ts` finds each link with `exact: true` and checks the svg's
  `aria-label`. `tests/e2e/homepage-content.spec.ts` (lines 92-94) finds the three links with `exact: true` by the short
  names. No unit test or other e2e spec uses the names; the size and color specs select by class.
- **Decision**: Update both specs to the full descriptions. Keep `exact: true`, because the short "X" would otherwise
  match many names, and the full strings are unambiguous.
- **Alternatives considered**: Dropping `exact` (looser than needed).

## Effect on the footer links

- **Finding**: The links already open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), so "opens in new
  tab" is true today. The visible icons, sizes, and colors do not depend on the label.
- **Decision**: No change to the links. The spec notes the description must change if the behavior does.

## Superseded spec

- **Decision**: Add a short note at the top of spec 044 saying the names are replaced by spec 061, as spec 059 did for
  earlier text. FR-007.
