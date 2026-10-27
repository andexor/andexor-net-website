# Research: Do Not Sell Opens the Cookie Banner

## 1. How do the HTML comments get into the pages?

- **Decision**: add them to each built page in the post-build pass (the function lives in `scripts/format-html.ts` so a unit test can import it, and
  `scripts/format-site.ts` calls it), on the raw page before it is formatted.
- **Rationale**: React has no way to write an HTML comment (a JSX comment is removed at compile time, and a text node
  cannot hold `<!--`). The post-build pass already edits the pages in the same way (it removes the framework's duplicate
  `noindex` tag from the 404 page, spec 030), and doing it before `formatHtml` means the formatter's check that the
  formatted page has the same DOM as the original compares pages that both have the comments. The owner asked for HTML
  comments in the page source, which is where this puts them.
- **Alternatives considered**:
  - Wrap each link in an element that sets its inner HTML to include the comment (`dangerouslySetInnerHTML`): adds a
    wrapper element, changes the footer's DOM and the Company list's structure, and puts hand-written HTML in a component.
  - Add the comments after formatting: the formatter's DOM check would then run without them, and the pretty-printed
    page makes the patterns harder to match.
  - A JSX comment (`{/* For GDPR */}`): never reaches the built page, so it fails the spec.

## 2. Does React hydration tolerate the added comments?

- **Decision**: yes, no workaround needed; confirm in the quickstart.
- **Rationale**: when React matches server HTML to its tree it skips comment nodes that are not its own markers (the
  Suspense markers such as `<!--$-->`). The built pages already contain such comments. If a hydration error ever
  appears, it would show as error #418 on first load, and the quickstart's first-visit check would catch it.

## 3. Reusing `PrivacySettingsLink` for Do Not Sell

- **Decision**: one component, two uses, with the text passed as `children`.
- **Rationale**: the spec says the two links behave exactly alike. Sharing the component makes that true by construction
  and leaves one place to change if Cookiebot's call ever changes.
- **Alternatives considered**: a second component with the same body (duplicated behavior that could drift); an `href`
  to a page that opens the banner on load (a page change, which the spec rules out).
