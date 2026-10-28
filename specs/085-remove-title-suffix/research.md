# Research: Remove the Title Suffix

No unknowns. Decisions:

- **Decision**: Remove the suffix at its three sources (layout default, Markdown route, not-found page) instead of
  using a Next.js title template. **Rationale**: a template would be needed only to add a suffix; with none, plain
  strings are simpler. **Alternatives considered**: `title.template: "%s"`, which adds indirection for nothing.
- **Decision**: Keep the title-follows-H1 e2e check without the suffix. **Rationale**: it covers behavior (the title
  follows the headline, so a new page needs no extra work) and not wording. **Alternatives considered**: deleting it;
  it still guards SC-002.
- **Decision**: Leave specs 028, 029, and 030 unedited. **Rationale**: they record what was built then; spec 085
  supersedes the suffix.
