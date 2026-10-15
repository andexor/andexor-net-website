// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { describe, expect, it } from "vitest";
import { EXAMPLE_NAMES } from "@/components/contact/example-names";

// Spec 072 FR-001, FR-006, FR-007: first and last name only, plain English letters, no repeats.
describe("example names", () => {
    it("are each a first and last name of plain letters, with no middle name or initial", () => {
        for (const name of EXAMPLE_NAMES) {
            expect(name, name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
        }
    });

    it("have no repeated entry", () => {
        expect(new Set(EXAMPLE_NAMES).size).toBe(EXAMPLE_NAMES.length);
    });

    it("do not include the old fixed example", () => {
        expect(EXAMPLE_NAMES).not.toContain("Jordan Reyes");
    });
});
