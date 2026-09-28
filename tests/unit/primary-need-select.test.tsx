// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContactPopup } from "@/components/contact/ContactPopup";
import { PRIMARY_NEED_GROUPS, PRIMARY_NEED_OTHER } from "@/components/contact/primary-need-options";

// FR-009: primary need field groups options into "Technical services" and
// "Business services", plus "Something else", with a disabled placeholder.
describe("Primary need select", () => {
  it("renders a disabled placeholder option", () => {
    render(<ContactPopup open onClose={vi.fn()} />);
    const select = screen.getByLabelText("Primary need") as HTMLSelectElement;
    const placeholder = select.querySelector('option[value=""]') as HTMLOptionElement;
    expect(placeholder).toHaveTextContent("Select a service…");
    expect(placeholder.disabled).toBe(true);
  });

  it("renders every option from primary-need-options.ts, grouped exactly as defined", () => {
    render(<ContactPopup open onClose={vi.fn()} />);
    const select = screen.getByLabelText("Primary need") as HTMLSelectElement;
    const groups = select.querySelectorAll("optgroup");
    expect(groups).toHaveLength(PRIMARY_NEED_GROUPS.length);

    PRIMARY_NEED_GROUPS.forEach((group, index) => {
      const groupEl = groups[index];
      expect(groupEl).toHaveAttribute("label", group.label);
      const optionLabels = Array.from(groupEl.querySelectorAll("option")).map((o) => o.textContent);
      expect(optionLabels).toEqual(group.options);
    });

    // "Something else" is a trailing top-level option, not in either group.
    const otherOption = select.querySelector(`option[value="${PRIMARY_NEED_OTHER}"]`);
    expect(otherOption).not.toBeNull();
    expect(otherOption?.closest("optgroup")).toBeNull();
  });

  it("blocks submission while the placeholder is still selected (required)", () => {
    render(<ContactPopup open onClose={vi.fn()} />);
    expect(screen.getByLabelText("Primary need")).toBeRequired();
    expect(screen.getByLabelText("Primary need")).toHaveValue("");
  });
});
