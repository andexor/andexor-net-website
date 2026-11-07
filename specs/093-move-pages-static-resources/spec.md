# Feature Specification: Move Pages and Static Resources

**Feature Branch**: `118-move-pages-and-static-resources`

**Created**: 2026-11-07

**Status**: Implemented (2026-11-07). Two decisions the plan made beyond the issue: the section placeholders
`/services` and `/company` redirect with a 302, not a 301, so a browser does not keep a cached redirect once a landing
page exists; and no rule is written for trailing-slash variants of old addresses.

**Input**: User description: "Implement issue #118."

**Issue**: [#118 Move pages and static resources](https://github.com/andexor/andexor-net-website/issues/118)

## Summary

Today every content page sits directly under the site root (`/web-development`, `/about-us`, `/privacy-policy`), and
the fonts, images, and logos sit in three root folders of their own (`/fonts/`, `/images/`, `/logo/`). In analytics
dashboards and reports there is no way to tell a page from a resource, or a service page from a company page, without
hand-written lists. This feature gives the site a small, fixed set of address prefixes so that pages and resources
can be separated by prefix alone:

| Prefix          | Holds                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `/`             | Home page and the root crawler files only: robots.txt, sitemap.xml, favicons, manifest, browserconfig |
| `/services/`    | Service pages                                                                                         |
| `/company/`     | About Us and the policies                                                                             |
| `/api/`         | The contact service, in its own repository                                                            |
| `/.well-known/` | security.txt and anything RFC 8615 asks for                                                           |
| `/_next/`       | Framework output                                                                                      |
| `/static/`      | Static files like fonts, logos, images, etc.                                                          |

Every address that moves keeps a permanent redirect in production so that bookmarks, search results, and inbound
links keep working, and the namespaces are reserved in writing (constitution, authoring guide, assistant guidance) so
that the next page lands under the right prefix.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pages live under their section prefix (Priority: P1)

A visitor who follows a link from the home page, the footer, the Contact Us popup, or another content page reaches
the service page at `/services/<page>` or the company page at `/company/<page>`. Every image, logo, and font the
page uses loads from `/static/...`. Nothing the visitor sees or does changes: the same pages, the same images, the
same text.

**Why this priority**: This is the move itself. Without it, no analytics separation is possible and nothing else in
this feature has a purpose.

**Independent Test**: Build the site, open every service and company page at its new address, and confirm each
renders fully with its hero image, the logo, and the brand fonts, and that no image, font, or logo request on any
page fails. Confirm every link on the home page, in the footer, in the Contact Us popup, and in page bodies points
at a new address.

**Acceptance Scenarios**:

1. **Given** the built site, **When** a visitor opens `/services/web-development` (and each of the other seven
   service pages), **Then** the page renders completely, with its hero image and fonts loaded.
2. **Given** the built site, **When** a visitor opens `/company/about-us`, `/company/privacy-policy`,
   `/company/security-policy`, or `/company/terms-of-service`, **Then** the page renders completely, with its hero
   image and fonts loaded.
3. **Given** the home page, **When** a visitor clicks a service card or a footer link, **Then** they arrive at the
   page's new address with no intermediate hop.
4. **Given** the Contact Us popup, **When** a visitor clicks Privacy or Terms, **Then** the policy opens at its
   `/company/` address, in a new tab as today.
5. **Given** any page, **When** its images, logos, and fonts are requested, **Then** each is served from `/static/`
   and none is requested from `/fonts/`, `/images/`, or `/logo/`.
6. **Given** the unknown-address page, **When** it is shown, **Then** its illustration loads from `/static/`.

---

### User Story 2 - Old addresses redirect permanently in production (Priority: P1)

A visitor with an old bookmark, a search engine holding an old result, or a third-party site linking to an old page
or image address is sent to the new address with a permanent redirect, so links keep working and search engines move
their ranking to the new address instead of losing it.

**Why this priority**: The pages are indexed and linked. A move without redirects breaks every existing inbound link
and discards the search standing the pages have built. It ships with the move, not after it.

**Independent Test**: Inspect the redirect list in the build output: it contains exactly one entry for every moved
page and every moved resource, each pointing at the new address with a permanent status. In production, request an
old page address and an old image address and confirm a 301 to the new address.

**Acceptance Scenarios**:

1. **Given** production, **When** a visitor requests `/web-development` (or any other moved page), **Then** the
   answer is a 301 to `/services/web-development` (the matching new address), and the new address renders the page.
2. **Given** production, **When** a visitor requests `/about-us`, `/privacy-policy`, `/security-policy`, or
   `/terms-of-service`, **Then** the answer is a 301 to the same page under `/company/`.
3. **Given** production, **When** anything under `/fonts/`, `/images/`, or `/logo/` is requested, **Then** the
   answer is a 301 to the same file under `/static/fonts/`, `/static/images/`, or `/static/logo/`.
4. **Given** production, **When** a visitor requests `/services` or `/company`, **Then** the answer is a redirect to
   `/`, because those sections have no landing page yet.
5. **Given** the build output, **When** the redirect rules are read, **Then** every moved page and every moved
   resource folder has a rule, and no rule points at an address that does not exist.
6. **Given** the local preview or the local static server, **When** an old address is requested, **Then** the answer
   MAY be the 404 page; redirects are only required in production.

---

### User Story 3 - Crawlers see only the new addresses (Priority: P2)

A search engine reading the sitemap, the security.txt file, or the structured data on the home page finds only new
addresses. It never reads an old address that would answer with a redirect, so nothing is reported as a redirecting
or duplicate URL.

**Why this priority**: Redirects keep old links working, but a sitemap or schema that still names old addresses
sends crawlers through redirects on every visit and reports them as problems in search consoles. This is the SEO
half of the move.

**Independent Test**: Read the built sitemap, security.txt, and the home page's structured data and confirm no
address matches an old page path or an old resource folder; confirm every address they contain answers 200.

**Acceptance Scenarios**:

1. **Given** the built sitemap, **When** it is read, **Then** it lists the home page and every content page at its
   `/services/` or `/company/` address, and no old root address.
2. **Given** the built security.txt, **When** it is read, **Then** its policy, contact, and acknowledgments
   addresses point at `/company/security-policy`.
3. **Given** the home page's structured data, **When** it is read, **Then** every page address and logo address in it
   is a new address.
4. **Given** the built site, **When** `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` are requested, **Then** each
   still answers 200 at the root.

---

### User Story 4 - Caching rules follow the resources (Priority: P2)

A returning visitor's browser caches fonts, images, and logos at their new addresses with the same lifetimes as
before, so page loads stay as fast as they are today.

**Why this priority**: Resources at a new address without a caching rule would be re-fetched on every visit, a
performance regression for every returning visitor.

**Independent Test**: Read the caching rules in the build output and confirm there is a rule for every new resource
prefix, none for the old prefixes, and the root crawler files keep their rules.

**Acceptance Scenarios**:

1. **Given** the caching rules, **When** they are read, **Then** `/static/fonts/*`, `/static/images/*`, and
   `/static/logo/*` each have a rule with the same lifetime the old prefix had.
2. **Given** the caching rules, **When** they are read, **Then** no rule names `/fonts/`, `/images/`, or `/logo/`.
3. **Given** the caching rules, **When** they are read, **Then** the framework output and root icon, manifest, and
   browserconfig rules are unchanged.

---

### User Story 5 - The namespaces are reserved in writing (Priority: P3)

The owner, a contributor, or an assistant adding a new page finds the prefix table and the placement rule in the
constitution, the content authoring guide, and the assistant guidance, and puts the page under an existing prefix
rather than at the root.

**Why this priority**: Without a written rule the next page lands at the root again and the analytics separation
erodes. This is documentation and can follow the move, but the feature is not done without it.

**Independent Test**: Read the three documents and confirm each states where pages go, what stays at the root, and
that a moved address keeps a permanent redirect.

**Acceptance Scenarios**:

1. **Given** the constitution, **When** Principle VIII is read, **Then** it holds a short "URL structure" paragraph
   with the prefix table and the one-sentence rule (a new page goes under an existing prefix, a new prefix needs a
   spec, a moved URL keeps a permanent redirect), and the constitution version is bumped.
2. **Given** the content authoring guide, **When** its Routes section is read, **Then** it says pages live in
   `content/services/` or `content/company/`, nothing sits at the root of `content/` except the README and the
   crawler files, and a folder's `index.md` becomes that section's landing page.
3. **Given** the assistant guidance file, **When** its Markdown content pages paragraph is read, **Then** it says
   the same, so an assistant does not drop a new page at the root.

---

### Edge Cases

- An old address with a trailing slash (`/web-development/`): no support is added for trailing-slash variants of
  pages. Whatever the host does with it today, it continues to do.
- `/services` and `/company` themselves: redirected to `/` for now. When a section gets an `index.md` landing page,
  that redirect is removed, in its own change.
- A page body link to an old address written by hand in Markdown: the test suite must catch it. Every internal link
  in every content page is updated, and the built-output check fails on an old address in any built page.
- Root crawler files: `robots.txt`, `sitemap.xml`, every favicon, the manifest, browserconfig, and `/.well-known/`
  do not move and must still answer 200 where they are.
- A font requested through the page's preload hint from an old address would waste a request and then load the
  font a second time; every preload names the new address.
- The contact service at `/api/contact` is in another repository and is not touched; its prefix is only recorded in
  the table.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The eight service pages (Web Development, Web Hosting, Technical SEO, Agentic Systems, Cost Reduction,
  Lead Generation, Growth Marketing, Process Re-engineering) MUST be served under `/services/`, keeping their current
  page names.
- **FR-002**: The four company pages (About Us, Privacy Policy, Security Policy, Terms of Service) MUST be served
  under `/company/`, keeping their current page names.
- **FR-003**: Fonts MUST be served from `/static/fonts/`, images from `/static/images/`, and logos from
  `/static/logo/`, keeping their current file names.
- **FR-004**: The home page, every favicon, `robots.txt`, `sitemap.xml`, the web manifest, browserconfig, and
  everything under `/.well-known/` MUST stay at their current addresses and MUST still answer 200.
- **FR-005**: Every link the site itself emits to a moved page or resource MUST point at the new address: footer
  links, home page service cards, Contact Us popup Privacy and Terms links, links in page bodies, hero image
  references in page frontmatter, logo references, the unknown-address page's illustration, font preloads, font and
  image addresses in stylesheets, and page and logo addresses in structured data. The manifest and browserconfig
  icon paths name root favicons, which do not move, and stay as they are.
- **FR-006**: In production, every moved page address MUST answer with a 301 permanent redirect to its new address.
- **FR-007**: In production, every address under `/fonts/`, `/images/`, and `/logo/` MUST answer with a 301
  permanent redirect to the same path under `/static/fonts/`, `/static/images/`, and `/static/logo/`.
- **FR-008**: In production, `/services` and `/company` MUST redirect to `/` until a section landing page exists. The
  redirect is temporary (302), because the address will serve a page later.
- **FR-009**: Redirects are required in production only. The local preview and the local static server MAY answer
  an old address with the 404 page; no test may require a redirect from them.
- **FR-010**: No support MUST be added for trailing-slash variants of page addresses.
- **FR-011**: The sitemap MUST list only new addresses and MUST NOT list any address that has moved.
- **FR-012**: The security.txt file MUST point at `/company/security-policy` wherever it named the old address.
- **FR-013**: The caching rules MUST have a rule for each of `/static/fonts/*`, `/static/images/*`, and
  `/static/logo/*`, with the same lifetime as the prefix it replaces, and MUST NOT keep rules for `/fonts/*`,
  `/images/*`, or `/logo/*`.
- **FR-014**: The constitution's Principle VIII MUST gain a short "URL structure" paragraph holding the prefix table
  and the one-sentence rule, and the constitution version MUST be bumped.
- **FR-015**: The content authoring guide's Routes section MUST say that pages live in `content/services/` or
  `content/company/`, that nothing sits at the root of `content/` except the README and the crawler files, and how a
  folder's `index.md` becomes that section's landing page.
- **FR-016**: The assistant guidance's Markdown content pages paragraph MUST say the same.
- **FR-017**: All unit and end-to-end tests MUST pass, with their addresses updated to the new ones. No test may be
  weakened or deleted to make this so, except a test that only names an old address.

### Key Entities

- **Address map**: the list of old address to new address pairs, one per moved page and one per moved resource
  folder, plus the two section redirects to `/`. It drives the redirect rules and is the thing the tests check.

  | Old                       | New                                 |
  | ------------------------- | ----------------------------------- |
  | `/web-development`        | `/services/web-development`         |
  | `/web-hosting`            | `/services/web-hosting`             |
  | `/technical-seo`          | `/services/technical-seo`           |
  | `/agentic-systems`        | `/services/agentic-systems`         |
  | `/cost-reduction`         | `/services/cost-reduction`          |
  | `/lead-generation`        | `/services/lead-generation`         |
  | `/growth-marketing`       | `/services/growth-marketing`        |
  | `/process-re-engineering` | `/services/process-re-engineering`  |
  | `/about-us`               | `/company/about-us`                 |
  | `/privacy-policy`         | `/company/privacy-policy`           |
  | `/security-policy`        | `/company/security-policy`          |
  | `/terms-of-service`       | `/company/terms-of-service`         |
  | `/fonts/*`                | `/static/fonts/*`                   |
  | `/images/*`               | `/static/images/*`                  |
  | `/logo/*`                 | `/static/logo/*`                    |
  | `/services`               | `/` (302)                           |
  | `/company`                | `/` (302)                           |

- **Prefix table**: the seven reserved prefixes and their owners, as in the Summary. Recorded in the constitution,
  the authoring guide, and the assistant guidance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every service and company page answers 200 at its new address and renders with its hero image, logo,
  and fonts; zero failed image, font, or logo requests across all pages.
- **SC-002**: Zero links or resource references emitted by the site point at an old page address or an old resource
  folder.
- **SC-003**: In production, 100% of old page addresses and old resource addresses answer with a 301 to the matching
  new address, and `/services` and `/company` redirect to `/`.
- **SC-004**: The sitemap, security.txt, and home page structured data contain zero old addresses, and every address
  they contain answers 200.
- **SC-005**: `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` answer 200 at the root, unchanged.
- **SC-006**: Every new resource prefix has a caching rule with the lifetime its old prefix had; no old prefix has
  one.
- **SC-007**: After the move, an analytics report can separate home, service pages, company pages, and static
  resources by address prefix alone, with no hand-written list.
- **SC-008**: The full unit and end-to-end suites pass.

## Assumptions

- The service pages are the eight linked from the footer's services columns; the company pages are About Us and the
  three policies linked from the footer's company column. No other content pages exist today.
- Page names do not change, only their prefix. `/web-development` becomes `/services/web-development`, not a new
  name.
- Resource file names do not change, only their folder. Caching lifetimes stay what they are per prefix.
- Permanent redirects are a production hosting feature and are delivered as a redirect rule file in the build
  output. The local preview and the local static server are not required to honor it.
- `/services` and `/company` redirect to `/` rather than showing a 404 because a visitor who trims the address to the
  section is better served by the home page. When a section landing page is written, that redirect goes away.
- The contact service under `/api/` lives in another repository and is unaffected; it appears in the prefix table
  only so the namespace is reserved.
- The trailing-slash behavior of the host is unchanged and out of scope.
- Source files move to match the addresses (content pages into `content/services/` and `content/company/`, resources
  into a `static/` folder) so that the address is still readable from the path, as the authoring guide promises.
