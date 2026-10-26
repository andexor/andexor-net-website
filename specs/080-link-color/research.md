# Research: Link Color

## Decision: remove the local overrides instead of changing their value

**Rationale**: the site-wide `--text-link` is already `--blue-300`. `.an-prose` and `.an-tile` redefine it as
`--blue-400`, and the not-found intro uses `--blue-400` directly. Deleting those lines makes every link follow the token,
which is what "all links use `--text-link`" asks for.

**Alternatives considered**: changing the overrides to `--blue-300` (leaves two redundant copies of the value).

## Decision: `font-weight: 600` on links in running text

**Rationale**: with no underline, a link inside text must differ from it by 3:1 or have another cue (WCAG 2.1
success criterion 1.4.1, axe rule `link-in-text-block`). `--blue-300` is 2.02:1 from the body text `--slate-50`, and no
text color can be 3:1 from `--blue-300` on this background. Tested on the built site with axe (WCAG 2.1 A and AA): with
the weight, `/`, `/privacy`, `/terms`, `/security`, `/cookies`, `/web-development`, `/about-us`, and `/nope` had no
violations; without it, every page with inline links failed `link-in-text-block` (22 nodes on `/privacy`).

**Alternatives considered**: keep `--blue-400` in running text (Option A, not chosen by the owner); dim the body text
(only works by making the text harder to read); relax the rule (the owner requires the tests to pass).

## Decision: one hover token, `--text-link-hover: var(--blue-200)`

**Rationale**: the resting color becomes `--blue-300`, so today's hover color on prose, cards, and the not-found intro
(`--blue-300`) would show no change. The popup's links already use `--blue-200` on hover. `--blue-200` is brighter, passes
contrast on every surface it lands on, and one token keeps hover the same everywhere. The footer links' white hover moves
to it too.

**Alternatives considered**: white on hover everywhere (a bigger jump from the resting blue, and white is the popup's
old resting color); leaving each area's hover as it was (breaks "look consistent" and leaves one dead hover).

## Decision: the popup's links keep weight 600 and lose the white color

**Rationale**: they already have weight 600. The popup note text is `--blue-100`, which is even closer to `--blue-300`
than the body text, so the weight is what keeps them distinct. The new-tab icon after each link follows the link's
resting color (spec 066), so its rule changes from `#ffffff` to `--text-link`.

**Alternatives considered**: leaving them white (the owner asked that they look like the site's other links).

## Decision: footer links get no weight

**Rationale**: they are not inside running text, so axe does not apply the link-in-text rule to them, and their
current weight matches the column headings' neighbors.

**Alternatives considered**: weight 600 on footer links (not asked for, and heavier than the other footer text).
