// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Per data-model.md's "Primary Need option list" and FR-009.
export interface PrimaryNeedGroup {
  label: string;
  options: string[];
}

export const PRIMARY_NEED_GROUPS: PrimaryNeedGroup[] = [
  {
    label: "Technical services",
    options: ["Web Development", "Web Hosting", "Technical SEO", "AI Systems"],
  },
  {
    label: "Business services",
    options: ["Cost Reduction", "Lead Generation", "Growth Marketing", "Process Re-engineering"],
  },
];

export const PRIMARY_NEED_OTHER = "Something else";
