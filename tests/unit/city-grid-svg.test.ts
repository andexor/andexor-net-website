// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The Business Services hero backdrop is an SVG loaded as a CSS background
// image. A browser silently draws nothing if the file is not valid XML (for
// example, a double hyphen inside the header comment), so check that it parses.
describe("public/city-grid.svg", () => {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "city-grid.svg"), "utf8");

  it("is valid XML with an svg root", () => {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(doc.documentElement.tagName).toBe("svg");
  });

  it("has no double hyphen inside its comments", () => {
    const comments = svg.match(/<!--([\s\S]*?)-->/g) ?? [];
    for (const c of comments) expect(c.slice(4, -3)).not.toContain("--");
  });
});
