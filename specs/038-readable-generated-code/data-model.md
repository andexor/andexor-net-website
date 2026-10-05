# Data Model: Readable Generated Code

This feature stores no data. The only things with identity are the file groups the rules apply to.

| Group | Members | Rule |
|---|---|---|
| Site source | `src/**`, `tests/**`, `server.ts`, root `*.ts`/`*.mjs` config | Prettier-formatted: 4 spaces, no tabs, width 120 |
| Built HTML | `out/**/*.html` | Prettier-formatted, whitespace-stripping script in `<head>`, inline scripts formatted, DOM gate |
| Built site CSS | `out/_next/static/css/*.css` | Prettier-formatted, not minified |
| Built site JS | `out/_next/static/chunks/site-*.js` | Separate chunk, not minified, Prettier-formatted |
| Built third-party JS | every other `out/_next/static/chunks/**/*.js`, `polyfills`, `framework`, `main*`, `webpack` | May be minified; contains no site code |
| Out of scope | `design/`, `content/`, `specs/`, Markdown, lock files, `reports/` | Untouched |

A file belongs to exactly one group. The group is decided by path, so the formatting test and the post-build pass use the
same lookup (`scripts/format-site.ts` exports it).
