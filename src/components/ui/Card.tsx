// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import type { ElementType, HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  pad?: boolean;
  hover?: boolean;
  ink?: boolean;
  as?: ElementType;
  href?: string;
  children?: ReactNode;
}

export function Card({
  pad = true,
  hover = false,
  ink = false,
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: CardProps) {
  const cls = ["an-card", pad && "an-card--pad", hover && "an-card--hover", ink && "an-card--ink", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
