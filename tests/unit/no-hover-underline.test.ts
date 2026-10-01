// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Spec 002 FR-026 / SC-004, constitution Principle VI: no rule with a :hover
// selector may add an underline, in site or design-system stylesheets.
// Spec 007 FR-001 / SC-005: no rule that targets a link may underline it at
// all, at rest included.
const ROOTS = ["src/styles", "design/tokens", "design/components", "design/styles.css"];

function cssFiles(target: string): string[] {
  const full = path.join(process.cwd(), target);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return full.endsWith(".css") ? [full] : [];
  return fs.readdirSync(full).flatMap((name) => cssFiles(path.join(target, name)));
}

// Innermost "selector { declarations }" blocks, comments removed. Rules inside
// @media are still matched because only the deepest braces are captured.
function hoverUnderlineRules(css: string): string[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const offenders: string[] = [];
  for (const [, selector, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (/:hover/.test(selector) && /text-decoration(-line)?\s*:[^;]*underline/.test(body)) {
      offenders.push(selector.trim());
    }
  }
  return offenders;
}

// A rule "targets a link" when its selector has the type selector `a`
// (`a`, `.x a`, `a:hover`, `.x > a:focus-visible`), not `.an-a` or `abbr`.
const LINK_SELECTOR = /(^|[\s,>+~])a(?![\w-])/;

function linkUnderlineRules(css: string): string[] {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const offenders: string[] = [];
  for (const [, selector, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (LINK_SELECTOR.test(selector.trim()) && /text-decoration(-line)?\s*:[^;]*underline/.test(body)) {
      offenders.push(selector.trim());
    }
  }
  return offenders;
}

describe("no underline on links", () => {
  const files = ROOTS.flatMap(cssFiles);

  it("detects an underlined link rule (guards the checker itself)", () => {
    expect(linkUnderlineRules(".x a { text-decoration: underline; }")).toEqual([".x a"]);
    expect(linkUnderlineRules("a:hover { text-decoration: underline; }")).toEqual(["a:hover"]);
    expect(linkUnderlineRules(".x a { color: red; }")).toEqual([]);
    expect(linkUnderlineRules(".an-a { text-decoration: underline; }")).toEqual([]);
  });

  for (const file of files) {
    it(`${path.relative(process.cwd(), file)} does not underline links`, () => {
      expect(linkUnderlineRules(fs.readFileSync(file, "utf8"))).toEqual([]);
    });
  }
});

describe("no underline on hover", () => {
  const files = ROOTS.flatMap(cssFiles);

  it("detects a hover underline rule (guards the checker itself)", () => {
    expect(hoverUnderlineRules("a:hover { text-decoration: underline; }")).toEqual(["a:hover"]);
    expect(hoverUnderlineRules("@media (x) { a:hover { color: red; } }")).toEqual([]);
  });

  for (const file of files) {
    it(`${path.relative(process.cwd(), file)} has no hover underline`, () => {
      expect(hoverUnderlineRules(fs.readFileSync(file, "utf8"))).toEqual([]);
    });
  }
});
