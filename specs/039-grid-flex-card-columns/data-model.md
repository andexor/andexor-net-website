# Data Model: Grid and Flexbox Card Columns

No stored data. The page body is read into a small structure at build time.

| Entity | Fields | Rule |
|---|---|---|
| Card | heading, optional label, body, `--i` (written position, from 1) | One per `##` section; order never changes |
| Row | cards, optional column break position | Closed by a row break or the end of the page. A row with no cards is dropped |
| Column break | none | A paragraph that is exactly `\|\|`; at most one per row; removed from the output |
| Row break | none | A horizontal rule (`---`) |

## Output rules

- Row with a column break: left cards = cards before the break; right cards = cards after it. Both columns are emitted
  even if one is empty.
- Row without a column break: every card is a full-width card.
- A second column break in the same row is an error: `<file>: more than one column break in a row (after "<card>")`.
- A `||` that is not alone in its paragraph is an error: `<file>: put a blank line before and after "||"`.
