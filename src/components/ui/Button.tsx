// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    block?: boolean;
    onInk?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    as?: ElementType;
    href?: string;
    children?: ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    block = false,
    onInk = false,
    leftIcon,
    rightIcon,
    as: Tag = "button",
    className = "",
    children,
    ...rest
}: ButtonProps) {
    const cls = [
        "an-btn",
        `an-btn--${variant}`,
        size === "sm" && "an-btn--sm",
        size === "lg" && "an-btn--lg",
        block && "an-btn--block",
        onInk && "an-btn--on-ink",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Tag className={cls} {...rest}>
            {leftIcon}
            {children}
            {rightIcon}
        </Tag>
    );
}
