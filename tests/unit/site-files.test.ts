// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { fileGroup, isMinified } from "../../scripts/site-files";

describe("fileGroup", () => {
    it("puts the site chunk in the built site JS group", () => {
        expect(fileGroup("out/_next/static/chunks/site-57bcab7eabaf323b.js")).toBe("built-site-js");
    });

    it("puts framework and vendor chunks in the third-party group", () => {
        expect(fileGroup("out/_next/static/chunks/framework-72fe324a346d0516.js")).toBe("built-third-party-js");
        expect(fileGroup("out/_next/static/chunks/app/page-325d2c66caa3ea6a.js")).toBe("built-third-party-js");
        expect(fileGroup("out/_next/static/h25UUHoPqxaBXNHVnQ0Q_/_buildManifest.js")).toBe("built-third-party-js");
    });

    it("puts built pages and the site stylesheet in their own groups", () => {
        expect(fileGroup("out/index.html")).toBe("built-html");
        expect(fileGroup("out/_next/static/css/2ca6833a067aec74.css")).toBe("built-site-css");
    });

    it("treats source files as site source", () => {
        expect(fileGroup("src/styles/cards.css")).toBe("site-source");
        expect(fileGroup("tests/unit/logo.test.tsx")).toBe("site-source");
        expect(fileGroup("scripts/site-files.ts")).toBe("site-source");
        expect(fileGroup("server.ts")).toBe("site-source");
    });

    it("leaves the design system, content, specs, and Markdown out of scope", () => {
        expect(fileGroup("design/tokens/colors.css")).toBe("out-of-scope");
        expect(fileGroup("content/about-us.md")).toBe("out-of-scope");
        expect(fileGroup("specs/038-readable-generated-code/spec.md")).toBe("out-of-scope");
        expect(fileGroup("README.md")).toBe("out-of-scope");
        expect(fileGroup("next-env.d.ts")).toBe("out-of-scope");
    });
});

describe("isMinified", () => {
    it("flags a single very long unindented line", () => {
        expect(isMinified(`a{color:red}${"b{color:blue}".repeat(200)}`)).toBe(true);
    });

    it("accepts formatted code", () => {
        expect(isMinified("a {\n    color: red;\n}\n")).toBe(false);
    });

    it("accepts a long line inside indented code", () => {
        expect(isMinified(`function f() {\n    return "${"x".repeat(1200)}";\n}\n`)).toBe(false);
    });
});
