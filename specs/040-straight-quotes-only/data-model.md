# Data Model: Straight Quotes Only

No stored data. The rule works on two small sets.

| Set | Members |
|---|---|
| Banned characters | code points U+2018, U+2019, U+201A, U+201B, U+201C, U+201D, U+201E, U+201F |
| Banned references | HTML character references to the same eight: named (left and right single, low-9 single, left and right double, low-9 double) and numeric in decimal and hex, any letter case |
| Allowed | the straight apostrophe `'` and double quote `"`, written plainly; the escapes `&amp;`, `&lt;`, `&gt;`; a double-quote escape inside a double-quoted attribute |
| Not checked | `CODE_OF_CONDUCT.md`, `CODE_OF_CONDUCT.adoc`, `node_modules`, `.next`, `.git`, `out` vendor chunks, binary files |

Formatter rule for built pages: in text and attribute values, `&#x27;` and `&#39;` become `'`; in text only, `&quot;`
becomes `"`; scripts, styles, and `noscript` content are not touched.
