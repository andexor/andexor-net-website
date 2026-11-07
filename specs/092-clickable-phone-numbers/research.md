# Research: Clickable Phone Numbers

No NEEDS CLARIFICATION markers were open in the Technical Context. The questions below were the ones that could
change the approach, and each was answered from the code.

## 1. Can the Markdown pipeline carry a tel: link?

**Decision**: Write each occurrence as `[+14043511440](tel:+14043511440)`.

**Rationale**: The user's example uses raw HTML. `src/lib/content.ts` drops raw HTML from Markdown (the constitution
and CLAUDE.md say so), so `<a href="tel:...">` would not reach the page. A Markdown link is an ordinary mdast link,
rendered to an `<a href>` with the same effect.

**Alternatives considered**:
- Raw `<a>` in the Markdown: dropped at build time. Rejected.
- A React component or a rehype plugin that turns the number into a link automatically: adds code and a rule that
  has to be kept in step with the content, for four occurrences. Rejected under Principle I (YAGNI).

## 2. Does the pipeline add target="_blank" to tel: links?

**Decision**: No. Nothing to do.

**Rationale**: `src/lib/content.ts` runs `rehype-external-links` with `target: "_blank"`. Its `protocols` option
defaults to `['http', 'https']` (checked in `node_modules/rehype-external-links/lib/index.js`, version 3.0.0), and
`tel` is not in that list, so tel: links are left alone and open in the same tab, as a phone link should.

## 3. How do the links look?

**Decision**: Use the existing styles; add none.

**Rationale**: The policy pages render inside `.an-prose` (`src/components/content/ContentPage.tsx`).
`src/styles/content.css` sets `.an-prose a` to the shared link color with `font-weight: 600`, plus the hover color
and the focus ring. Links inside body text need the weight because `--text-link` is only 2.02:1 from the body text
(CLAUDE.md, "No underline on links"). A new link gets all of this with no extra rule.

## 4. Structured data

**Decision**: Leave `src/lib/schema/ed.json` and `src/lib/schema/organization.json` unchanged.

**Rationale**: Clarified in the spec (session 2026-11-07): the JSON-LD (JavaScript Object Notation for Linked Data)
`telephone` values are not visible text and cannot hold a link.

## 5. Which test proves the behavior?

**Decision**: One Playwright spec, `tests/e2e/phone-links.spec.ts`, that loads each policy page from the built site
and checks that every text node holding the number has a `tel:+14043511440` link as an ancestor.

**Rationale**: Constitution Principle V allows tests for behavior and for rules the owner has written down, and
forbids copy and count assertions. "Every visible number is tap-to-call" is a link behavior. The check does not look
at wording or at how many occurrences there are.

**Alternatives considered**:
- Unit test on the Markdown source: would test the file text (copy). Rejected.
- Vitest unit test rendering the policy pages: the pages are built from Markdown at build time, so the built site is
  the honest target. Rejected.
