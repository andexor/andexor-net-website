# Data Model: Contact Legal Links In New Tab

No data changes. The two popup links in `src/components/contact/ContactPopup.tsx` become:

| text    | href     | target   | rel                  | aria-label                  | icon (hidden)                 |
|---------|----------|----------|----------------------|-----------------------------|-------------------------------|
| Privacy | /privacy | _blank   | noopener noreferrer  | Privacy, opens in new tab   | faArrowUpRightFromSquare      |
| Terms   | /terms   | _blank   | noopener noreferrer  | Terms, opens in new tab     | faArrowUpRightFromSquare      |

The icon is `FontAwesomeIcon` with `aria-hidden="true"`, no `aria-label`, and no `alt`. The footer's links are not
changed.
