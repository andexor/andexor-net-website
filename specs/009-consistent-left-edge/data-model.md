# Data Model: Left Edge

No stored data. The one entity is a layout measurement.

## Left edge

| Property | Definition |
|----------|------------|
| Measured at | The header logo (content pages) or hero brand area (home page), `getBoundingClientRect().left` |
| Depends on | Window width and the reserved scrollbar width; never on page length |
| Rule | Equal on the home page, the Web Development page, and the "Page not found" page at any given window width, with visible or hidden scrollbars |
| Not a rule | A fixed number of pixels, or a whole number (centering can give .5px) |
