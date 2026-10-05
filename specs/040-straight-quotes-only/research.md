# Research: Straight Quotes Only

Findings come from searching the repository and the built site. Nothing was changed.

## 1. What is actually in the repository and the built pages

- No curly quote character and no HTML reference to one is in `src/`, `content/`, `design/`, `specs/`, `tests/`,
  `scripts/`, or the built pages (`out/*.html`), the site's own script chunk, or its stylesheet.
- The two curly apostrophes in the repository are in `CODE_OF_CONDUCT.md` and `CODE_OF_CONDUCT.adoc` (third-party text,
  to be left alone by the owner's decision).
- The only escapes of any kind in the built pages are 4 occurrences of the numeric reference for a straight apostrophe
  in `out/index.html` text, such as `We&#x27;ll`. React's server renderer writes that for every apostrophe in text it
  renders. The Markdown pages contain no escapes: the Markdown renderer writes apostrophes as plain characters.
- Where it comes from: the home page copy lives in `src/components/marketing/` and `services-data.ts`, and is rendered by
  React. Nothing in the source is wrong; the escape is added at render time.

## 2. Making the HTML say `We'll`

- **Decision**: do it in the post-build formatter (`scripts/format-html.ts`), before Prettier runs:
  - In text between tags (outside `script`, `style`, and `noscript`): replace the numeric apostrophe reference with `'` and the named double
    quote reference with `"`. Both are valid as plain characters in text.
  - In attribute values (React always double-quotes them): replace the numeric apostrophe reference with `'`. A double
    quote inside such a value must stay escaped, and Prettier already re-quotes an attribute when that gives fewer
    escapes.
  - Leave `&amp;`, `&lt;`, and `&gt;` alone; they are required.
- **Rationale**: the DOM is identical, so React hydration is unaffected. A text node's content is the same string either
  way, and the browser decodes both forms to the same character. It reuses the formatter already in place.
- **The DOM check** (spec 038) compares raw token text, so it must treat both forms as equal: decode the two quote
  references in text tokens on both sides before comparing. Without that change the check would report a difference.
- **Alternatives**: patching the renderer (not possible; the escape is inside React); a regex over every built file
  including inline scripts (the data inside scripts is JSON, where this reference does not occur and a blind replace
  could corrupt it); leaving it (the owner asked for it gone).

## 3. Stopping Markdown from converting quotes

- The Markdown pipeline in `src/lib/content.ts` is unified with remark-parse, remark-gfm, remark-rehype,
  rehype-slug, rehype-external-links, and rehype-stringify. None of these converts quotes; a smart-typography plugin
  (such as remark-smartypants) is not present.
- **Decision**: no code change. Add a unit test that renders Markdown with straight quotes and apostrophes and asserts
  the output has the same straight characters and no curly ones, so adding such a plugin later fails a test.

## 4. The automated check

- **Decision**: a unit test, `tests/unit/straight-quotes.test.ts`, in two parts:
  1. **Repository files**: walk the repository, skip `node_modules`, `.next`, `.git`, `out`, `playwright-report`,
     `test-results`, the two Code of Conduct files, and binary files, and look for the eight curly quote characters and
     for HTML character references to them (named and numeric, decimal and hex). Fail with `<file>:<line>` and the
     character found.
  2. **Built site**: when `out/` exists, apply the same search to every built page, the site's own script chunk, and
     the site stylesheet (not vendor chunks), and also assert that no built page contains the numeric apostrophe
     reference in text.
- **The check's own source must not contain the banned characters.** The test builds its patterns from numeric code
  points (the hexadecimal numbers 2018, 2019, and so on, passed to `String.fromCodePoint`), not from backslash escapes.
  This matters in practice: while writing this plan, a backslash escape typed into a document came out as the real
  character, so the plan itself broke the rule until it was found and fixed. After the test file is written it is
  searched for the characters to prove it is clean. The rule text in documents describes the characters in words and
  never writes them or their HTML reference names.
- **Rationale**: same shape as the existing `no-top-links.test.ts` and `no-hover-underline.test.ts`, which the owner
  already relies on.
- **Alternatives**: an ESLint rule (does not cover Markdown or the built output); a git hook (not versioned, easy to
  skip).

## 5. The rule files

- Project `CLAUDE.md`: new short section "Straight quotes only", next to "No underline on links".
- `.specify/memory/constitution.md`: a new bullet under Technology Constraints, like the formatting rule added in spec
  038 (a rule about how files are written, with the test that enforces it), and a Sync Impact Report entry. This is
  version 1.5.0 to 1.6.0 (MINOR: a new rule, no principle removed or redefined), with the Last Amended date set to the
  day it is written.
- `design/DESIGN.md`: a line in its typography or copy rules saying the same. The project `CLAUDE.md` already says to
  correct design documents that conflict with project rules, so no conflicting text is expected.
- `~/.claude/CLAUDE.md`: a new section, written for all projects, like the existing "No underline on hover" rule.
- Also saved to Claude's project memory as a feedback note, so a later session recalls it. (Memory is not one of the
  owner's three files; it is how the rule reaches a future conversation.)
- Wording avoids the characters and the reference names; it uses words ("curly or typographic quotes").

## 6. Out of scope

- Other typographic punctuation (em and en dashes, ellipsis) and prime marks.
- The Code of Conduct files and vendor chunks.
- Reworking the other constitution principles. Only the one new rule is added.
