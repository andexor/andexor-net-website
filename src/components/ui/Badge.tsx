// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: "neutral" | "brand" | "accent" | "success" | "warning" | "danger" | "solid";
    dot?: boolean;
    children?: ReactNode;
}

export function Badge({ tone = "neutral", dot = false, className = "", children, ...rest }: BadgeProps) {
    const cls = ["an-badge", `an-badge--${tone}`, dot && "an-badge--dot", className].filter(Boolean).join(" ");
    return (
        <span className={cls} {...rest}>
            {children}
        </span>
    );
}
