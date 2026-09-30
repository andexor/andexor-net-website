# Research: "Business Services" Capitalization

## Decision 1: Change the string in `primary-need-options.ts`

- **Decision**: Set `label: "Business Services"` on the second group.
- **Rationale**: `ContactPopup.tsx` renders `<optgroup label={group.label}>` from
  `PRIMARY_NEED_GROUPS`, so this is the single source of the heading a visitor sees.
- **Alternatives considered**: CSS `text-transform: capitalize` on the group. Rejected: browsers do
  not style `<optgroup>` labels reliably, and it would change the text only visually.

## Decision 2: Add a literal-text unit test

- **Decision**: In `tests/unit/primary-need-select.test.tsx`, add a test that the rendered
  `optgroup` labels are exactly `["Technical Services", "Business Services"]`.
- **Rationale**: The existing test builds its expectations from `PRIMARY_NEED_GROUPS`, so it passes
  whatever the label says. It would not have failed on the old wording, and it would not catch a
  revert. FR-004 needs a check that does.
- **Alternatives considered**: An e2e assertion on the group label. Rejected: a unit test
  can read the `label` attribute directly without a full browser run. A project-wide scan test. Rejected as a permanent check over history and
  spec text that describes the old wording.

## Decision 3: Update the design copy and specs in the same change

- **Decision**: Replace the phrase in `design/README.md`, `ContactUs.jsx.txt`, `_ds_bundle.js`, spec
  001's four documents, and spec 012's out-of-scope mentions. Update 012's Assumptions to say
  spec 013 did the follow-up.
- **Rationale**: FR-003 and SC-001 ask for every occurrence. These files are copies or records; they
  are not built into the site, so changing them cannot affect behavior.
- **Alternatives considered**: Leave history alone. Rejected: the owner said "all occurrences", and
  a stale example is copied back in the next time a page is written.

## Findings from the code

- 15 occurrences of "Business services" today: 1 in `src/`, 1 test comment, 3 in `design/`, 4 in
  spec 001's documents (5 lines), and 5 lines in spec 012.
- No e2e test asserts the group label. `contact-flow.spec.ts` checks option text only.
- The 4 business page eyebrows, the footer, and spec 010's documents already read "Business
  Services" or "BUSINESS SERVICES".
- The all-caps `BUSINESS SERVICES` in `design/README.md` and `design/_ds_bundle.js` is a different
  string and is left alone.

No open questions.
