# Research: Contact Notice Text

## Where the text is

- **Finding**: `src/components/contact/ContactPopup.tsx` (line 210) holds the note in
  `<p className="an-contact-form__note">`: the text "No obligation. We never share your personal information." then
  `{" "}` and the Privacy and Terms links. No test, spec, or content file quotes the sentence. Three design copies do:
  `design/README.md` line 82, `design/ui_kits/marketing-site/ContactUs.jsx.txt` line 60, and the compiled
  `design/_ds_bundle.js` line 1256.
- **Decision**: Remove "No obligation. " from the source line, leaving "We never share your personal information." and
  the existing `{" "}` before the links. Make the same edit in the three design copies.
- **Alternatives considered**: Leaving the design copies as they are (they would disagree with the site, which the
  project's rules say to correct); regenerating `_ds_bundle.js` (it is a generated copy of the UI kit, and a one-sentence
  edit is simpler and keeps both in step).

## Leading whitespace

- **Finding**: In JSX, the text starts at the first non-space character after the tag's line break, so deleting the
  words leaves no leading space. The built HTML is formatted by `scripts/format-html.ts`, which fails the build on
  leading whitespace in a text node, so a stray space would be caught.
- **Decision**: Test the rendered text with `toHaveText` (which normalizes) and also check the `<p>`'s raw `textContent`
  does not start with whitespace.

## Tests

- **Decision**: A new spec opens the popup from the home page and checks that the note's text is "We never share your
  personal information. Privacy | Terms", that its `textContent` does not start with whitespace, and that the whole page
  text does not contain "No obligation". The Privacy and Terms links are covered by the spec 062 tests. Nothing is
  counted.
