# Data Model: Footer Links

No stored data. The one entity is the footer entry, defined by `COLUMNS` and `ITEM_HREFS` in
`Footer.tsx`.

## Footer entry

| Column | Label | Address | Page file | Change |
|--------|-------|---------|-----------|--------|
| Technical Services | Web Development | `/web-development` | `content/web-development.md` | unchanged |
| Technical Services | Web Hosting | `/web-hosting` | `content/web-hosting.md` | new |
| Technical Services | Technical SEO | `/technical-seo` | `content/technical-seo.md` | new |
| Technical Services | Agentic Systems | `/agentic-systems` | `content/agentic-systems.md` | new |
| Business Services | Cost Reduction | `/cost-reduction` | `content/cost-reduction.md` | new |
| Business Services | Lead Generation | `/lead-generation` | `content/lead-generation.md` | new |
| Business Services | Growth Marketing | `/growth-marketing` | `content/growth-marketing.md` | new |
| Business Services | Process Re-engineering | `/process-re-engineering` | `content/process-re-engineering.md` | new |
| Company | About Us | `/about-us` | `content/about-us.md` | new |
| Company | Contact | `#contact` (placeholder) | none | unchanged |

Also unchanged: Privacy `#privacy`, Terms `#terms`, and the three social links.

Rules: each new address is internal, starts with `/`, and matches a published (non-draft) file under
`content/`; none is `#top`.
