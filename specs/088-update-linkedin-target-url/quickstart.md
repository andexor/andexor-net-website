# Quickstart: Point the Footer LinkedIn Icon at the Company Page

## Check

1. `bun run build`
2. In `out/index.html`, find the footer's LinkedIn link: its `href` is `https://www.linkedin.com/company/andexor/`.
3. `grep -r "linkedin.com/in/ejenkins" out/` finds nothing in the footer (the About Us page text still has the founder's
   link).
4. `bun run test:e2e` (port 3000 must be free): the footer checks pass.
5. Optional, by hand: click the footer's LinkedIn icon and confirm the company page opens in a new tab.
