// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { combineDataScripts, dataQueue, externalizeDataScript } from "../../scripts/combine-scripts";

// Spec 041: the framework's data scripts at the end of a built page are found, combined, and moved to a file without
// changing the data they leave behind. These pages are shaped like the built output.
const START = "(self.__next_f = self.__next_f || []).push([0])";
const piece = (text: string) => `self.__next_f.push([1,${JSON.stringify(text)}])`;
const PIECES = [piece("one"), piece("two"), piece("three")];

const page = (scripts: string[], extra = "") =>
    `<!DOCTYPE html><html><head><script>var head = 1;</script><script src="/a.js" async=""></script></head>` +
    `<body><p>Hi</p><script src="/webpack.js" async=""></script>${extra}` +
    scripts.map((body) => `<script>${body}</script>`).join("\n") +
    `\n</body></html>`;

describe("externalizeDataScript", () => {
    // What Prettier makes of each original script when it formats them together as a file.
    const PIECES_FORMATTED = [
        "(self.__next_f = self.__next_f || []).push([0]);",
        'self.__next_f.push([1, "one"]);',
        'self.__next_f.push([1, "two"]);',
        'self.__next_f.push([1, "three"]);',
    ];
    const original = [START, ...PIECES];
    const combinedPage = () => combineDataScripts(page(original), "moved.html").html;

    it("writes a formatted file that leaves the same data behind as the original scripts", async () => {
        const { file } = await externalizeDataScript(combinedPage(), original, "moved.html");
        expect(file.content).not.toContain("\t");
        expect(file.content.trim().split("\n")).toEqual([...PIECES_FORMATTED]);
        expect(dataQueue([file.content])).toEqual(dataQueue(original));
    });
});
