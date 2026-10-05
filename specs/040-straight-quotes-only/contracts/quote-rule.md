# Contract: The Straight Quotes Rule

## The rule (wording for the four rule files)

> Never use curly, smart, or typographic quotes, in any file, in any form: not the characters, and not HTML character
> references to them. Use only the straight apostrophe (') and the straight double quote ("). Third-party text that
> the owner has said not to alter, such as the Code of Conduct files, is the one exception.

Each file words it for its place:

| File | Where it goes |
|---|---|
| `CLAUDE.md` (project) | New section "Straight quotes only", with the exception for the Code of Conduct files and the pointer to `tests/unit/straight-quotes.test.ts` |
| `design/DESIGN.md` | A line in the copy or typography rules |
| `.specify/memory/constitution.md` | New bullet under Technology Constraints, with the Code of Conduct exception and the test named; version 1.5.0 to 1.6.0 and a Sync Impact Report entry |
| `~/.claude/CLAUDE.md` | New section for all projects (no exception for the Code of Conduct, which is specific to this project) |

## Behavior of the check

1. A repository file containing a banned character or reference fails the test with `<file>:<line>: <what was found>`.
2. A built page, the site script chunk, or the site stylesheet containing one fails the same way.
3. A built page containing the numeric apostrophe reference in text fails, naming the page and line.
4. The Code of Conduct files and vendor chunks never fail it.
5. The test file itself contains none of the banned characters or reference names (patterns come from numeric code points).

## Behavior of the built pages

- `We'll`, `Let's`, and every apostrophe in text appear as the plain `'`.
- A double quote in text appears as `"`; inside a double-quoted attribute it stays escaped.
- The page looks and behaves exactly as before.
