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
title: About Andexor
description: One sentence used for the meta description.
draft: true
---
```

- `title`: browser tab title. Defaults to the first `# Heading`, then to the file name.
- `description`: meta description. Optional.
- `draft: true`: skips the page entirely until you remove the line.

## Writing rules

Follow the brand and copy rules in `design/README.md`: no italics, no emoji, Oxford comma,
no dashes in copy, "and" instead of "&", sentence case headlines with no trailing period.

- Start the body with a single `# Heading`; it is the page headline.
- GitHub-flavored Markdown works (tables, task lists, strikethrough, autolinks).
- Raw HTML is not rendered.
- Images go in `public/` and are referenced by absolute path, for example `![Team](/images/team.jpg)`.
- Links to other pages use the route, for example `[About](/about)`. Links starting with `http`
  open in a new tab.

## Publishing

Rebuild with `./build.sh`. Pages are not linked from the home page or footer automatically;
add links when a page is ready to be used.
