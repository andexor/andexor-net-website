# Data Model: Combine Page Scripts

No stored data. The page's script elements move through two states.

| Stage | End of a built page |
|---|---|
| Today | 13 inline scripts: one that starts the queue, twelve that push data |
| After step 1 | One inline script holding all 13 bodies, joined in order |
| After step 2 | One script element with an address, `/_next/static/data/<hash>.js`; a preload hint for it in the head |

| Thing | Rule |
|---|---|
| Data file name | the first 16 hexadecimal digits of the SHA-256 of the file's text; identical text gives the same name |
| Data file content | the bodies of the 13 scripts, in order, formatted with Prettier (JavaScript, 4 spaces) |
| Data check | running the original scripts and the new script or file in a sandbox leaves the same data queue |
| Left alone | the head's inline scripts (whitespace script, font loader), every script with an address, the `.txt` files |
| Pages without a trailing run of data scripts | left as they are, and the build says so |
