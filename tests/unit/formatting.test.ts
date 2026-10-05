// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fileGroup, isMinified } from "../../scripts/site-files";

// Spec 038 FR-009, FR-011: code written for this site is formatted (4 spaces, no tabs, not minified), and a file
// that is not fails here by name. Source files are also checked against Prettier itself, which is what decides
// indentation and line breaks; the checks below catch the cases a reviewer would notice first.
const ROOT = path.resolve(__dirname, "../..");
const SKIPPED_DIRECTORIES = new Set(["node_modules", ".next", ".git", "out", "playwright-report", "test-results"]);

function walk(directory: string, found: string[] = []): string[] {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIPPED_DIRECTORIES.has(entry.name)) walk(path.join(directory, entry.name), found);
        } else {
            found.push(path.relative(ROOT, path.join(directory, entry.name)).split(path.sep).join("/"));
        }
    }
    return found;
}

function problemsIn(file: string, text: string): string[] {
    const problems: string[] = [];
    const tabLine = text.split("\n").findIndex((line) => line.includes("\t"));
    if (tabLine >= 0) problems.push(`${file}: tab character (line ${tabLine + 1})`);
    if (isMinified(text)) problems.push(`${file}: minified`);
    return problems;
}

describe("source files", () => {
    const sourceFiles = walk(ROOT).filter((file) => fileGroup(file) === "site-source");

    it("have no tabs and are not minified", () => {
        const problems = sourceFiles.flatMap((file) =>
            problemsIn(file, fs.readFileSync(path.join(ROOT, file), "utf8")),
        );
        expect(problems).toEqual([]);
    });

    it("match Prettier's output", { timeout: 60_000 }, () => {
        const result = spawnSync(
            "bun",
            [
                path.join(ROOT, "node_modules/prettier/bin/prettier.cjs"),
                "--list-different",
                "**/*.{ts,tsx,js,mjs,css,html}",
            ],
            { cwd: ROOT, encoding: "utf8" },
        );
        const unformatted = result.stdout.split("\n").filter(Boolean);
        expect(unformatted.map((file) => `${file}: not formatted (run bun run format)`)).toEqual([]);
    });
});

describe.skipIf(!fs.existsSync(path.join(ROOT, "out")))("built custom files", () => {
    const builtFiles = fs.existsSync(path.join(ROOT, "out"))
        ? walk(path.join(ROOT, "out")).map((file) => `out/${file.replace(/^out\//, "")}`)
        : [];
    const customFiles = builtFiles.filter((file) =>
        ["built-html", "built-site-css", "built-site-js"].includes(fileGroup(file)),
    );

    it("have no tabs and are not minified", () => {
        const problems = customFiles.flatMap((file) =>
            problemsIn(file, fs.readFileSync(path.join(ROOT, file), "utf8")),
        );
        expect(problems).toEqual([]);
    });

    it("indent HTML tags in multiples of 4 spaces", () => {
        const problems: string[] = [];
        for (const file of customFiles.filter((name) => fileGroup(name) === "built-html")) {
            fs.readFileSync(path.join(ROOT, file), "utf8")
                .split("\n")
                .forEach((line, index) => {
                    const indent = line.match(/^ */)![0].length;
                    if (/^ *<[a-zA-Z!/]/.test(line) && indent % 4 !== 0) {
                        problems.push(`${file}: indentation is not a multiple of 4 (line ${index + 1})`);
                    }
                });
        }
        expect(problems).toEqual([]);
    });
});
