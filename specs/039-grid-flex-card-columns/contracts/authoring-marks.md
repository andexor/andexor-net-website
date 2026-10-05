# Contract: Authoring the Card Grid

What an author writes in a card page's Markdown, and what the visitor sees.

## Marks

| You write | It means | Looks like |
|---|---|---|
| `||` on its own line | Column break | Cards before it go in the left column; cards after it in the right |
| `---` on its own line | Row break | Cards after it start a new row below the earlier one |
| (neither) | A row with no column break | Each card spans both columns, one row each |

Put a blank line before and after each mark.

## Example

```markdown
## Card A

## Card B

||

## Card C

---

## Techno Bits

- one
- two
```

Desktop: A and B stack on the left, C on the right, and Techno Bits sits below both, full width, with its list in two
columns. Phone: one column in written order, A, B, C, Techno Bits.

## Rules

1. Cards always appear in the order written. Nothing is moved.
2. At most one `||` per row; a second one stops the build and names the file.
3. A leading `---` (before the first card) or a trailing one creates no empty row. A page that opens with `---` shows
   all its cards full width.
4. A `||` with text directly above or below it, without a blank line, stops the build and names the file.
5. An empty side is allowed: `||` with nothing after it leaves the right half empty.
6. Marks never appear on the page.
