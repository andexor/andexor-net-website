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

- `title`: browser tab title. Defaults to the first `# Heading`, then to the file name.
- `description`: meta description. Optional.
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
featured:
  - Need a web application?
---

# Page headline

## Card heading?

>> Card label

Card body.
```

- `section`: `technical`, `business`, or `company`. Picks the hero's backdrop pattern. Omit it for a plain hero.
- `eyebrow`: small label above the hero headline.
- `image`, `image_alt`: hero illustration from `public/`.
- `featured`: headings (exact text) that use the dark card.
- `>> Label` on the line after a `##` heading is the card's small label. It is optional.
- Cards alternate between two columns and stack in order on narrow screens.

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
