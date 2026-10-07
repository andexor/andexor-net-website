# Research: Remove Card Badges

## Where badges are used

- **Finding**: `Badge` is rendered in one place, `Services.tsx`, once per card. No other page, component, or test uses
  `.an-badge`. The home page has no other badges.
- **Decision**: Remove that one element and the import.

## Keep or delete the Badge component

- **Decision**: Keep `src/components/ui/Badge.tsx` and the `.an-badge*` rules in `src/styles/components.css`.
- **Rationale**: They are shared design-system parts (constitution Principle IV: reuse shared components), and the owner
  asked only to remove the badges from the cards.
- **Alternatives**: delete the component and styles as dead code (YAGNI, but removes a design-system part the owner did
  not name; easy to do later if asked).

## Data fields

- **Decision**: Delete `tag` and `badgeTone` from `ServiceOffering` and from all eight entries.
- **Rationale**: Nothing reads them after the change; unused data would mislead the next editor.

## Layout

- **Decision**: No CSS change. `.an-services__card-top` is a flex row with `justify-content: space-between`; with one
  child, the icon tile sits at the left. The row's height is the 44px icon tile, which was taller than the badge, so
  card heights are unchanged.
- **Check**: the new test records each card's height before and after, or compares with a stored expected value taken
  from the first run; the owner also looks at the page.

## Tests

- **Decision**: One e2e test: the home page has no element with class `an-badge`, and no card's text includes the old tag
  words. The tag words are not counted. A unit test is not needed beyond the existing ones, since the TypeScript
  compiler fails if a removed field is still read.
