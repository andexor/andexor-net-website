# Research: Privacy and Terms Links

## Decision 1: Link with plain root-relative paths

`/privacy` and `/terms`, like the other footer entries (`/about-us`). The catch-all route renders `content/privacy.md`
and `content/terms.md` to `/privacy` and `/terms` already.

**Alternatives**: trailing slashes (not used by the other links); absolute URLs (no reason).

## Decision 2: Same tab, plain anchors in the popup

The popup links are ordinary `<a>` elements today; only `href` changes. Opening in the same tab matches the footer and
keeps the focus order and accessible names unchanged. Navigating away may lose the open form, which is accepted (spec
edge case). In practice the browser's back/forward cache usually restores it on Back (seen by the owner), but that is
browser-dependent and not relied on.

**Alternatives**: `target="_blank"` (would need "opens in new tab" in the names and changes behavior; not asked for);
closing the popup first (nothing to close, the page unloads).

## Decision 3: Test headings differ from link text

The pages' H1s are "Privacy Policy" and "Terms Of Service", not "Privacy" and "Terms". The footer test's existing
heading check (`name: label`) cannot be reused for these two, so they get their own test that checks the URL and the
page's H1.

## Decision 4: Amend spec 001 FR-017 in place

Its note lists Privacy and Terms among placeholders. A short "amended by 062" clause is added, as earlier specs did.
The popup's placeholder links were never listed there separately.
