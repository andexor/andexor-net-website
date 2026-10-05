# Content pages

Every `.md` file in this directory becomes a static page at build time. This file is
documentation and is not published.

## Routes

| File                        | URL             |
| --------------------------- | --------------- |
| `content/about.md`          | `/about`        |
| `content/services/web.md`   | `/services/web` |
| `content/services/index.md` | `/services`     |

A root `content/index.md` is ignored because `/` is the home page.

## Frontmatter

```markdown
---
title: About Us Andexor
description: One sentence used for the meta description.
draft: true
---
```

- `title`: browser tab title. Write the same text as the page's `# Heading`; the site adds
  " | Andexor Network" after it. Defaults to the first `# Heading`, then to the file name.
- `description`: meta description. For search results, write the same text as the page's `# Heading`.
  Optional.
- `draft: true`: skips the page entirely until you remove the line.

## Card layout

Add `layout: cards` to the frontmatter to render each `##` section as its own card under a
dark hero band. The `#` heading becomes the hero headline, and any text between it and the
first `##` becomes the hero lede.

```markdown
---
layout: cards
section: technical
eyebrow: Technical Services
image: /web-development.png
image_alt: Describe the illustration
---

# Page headline

## Card heading?

>> Card label

Card body.
```

- `section`: `technical`, `business`, or `company`. Picks the hero's backdrop pattern. Omit it for a plain hero.
- `eyebrow`: small label above the hero headline.
- `image`, `image_alt`: hero illustration from `public/`.
- `>> Label` on the line after a `##` heading is the card's small label. It is optional.
- Cards appear in the order you write them. Two marks, each on its own line with a blank line before and after,
  say how they are arranged:
    - `||` is a column break. The cards before it go in the left column and the cards after it go in the right
      column, each stacked in written order. Use at most one per row; a second one stops the build and names the file.
    - `---` is a row break. The cards after it start a new row below the earlier one.
- A row with no `||` shows each of its cards full width, one row each, and a bulleted list inside it flows in two
  columns (one column when narrow). A page that opens with `---` shows all its cards full width.
- A `||` with nothing after it leaves the right half empty. A `---` at the start or end, or two in a row, adds no
  empty row.
- On narrow screens everything is one column, in written order.

Example: A and B on the left, C on the right, then Techno Bits full width below them:

```markdown
## Card A

## Card B

||

## Card C

---

## Techno Bits

- one
- two
```

## Writing rules

Follow the brand and copy rules in `design/README.md`: no italics, no emoji, Oxford comma,
no dashes in copy, "and" instead of "&", sentence case headlines with no trailing period.

- Start the body with a single `# Heading`; it is the page headline.
- GitHub-flavored Markdown works (tables, task lists, strikethrough, autolinks).
- Raw HTML is not rendered.
- Images go in `public/` and are referenced by absolute path, for example `![Team](/images/team.jpg)`.
- Links to other pages use the route, for example `[About Us](/about)`. Links starting with `http`
  open in a new tab.

## Publishing

Rebuild with `./build.sh`. Pages are not linked from the home page or footer automatically;
add links when a page is ready to be used.
