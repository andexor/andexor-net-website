// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "./Logo";

const SOCIAL_LINKS = [
  { key: "linkedin", label: "linkedin", href: "https://www.linkedin.com/in/ejenkins/", Icon: Linkedin },
  { key: "twitter", label: "twitter", href: "https://x.com/andexor", Icon: Twitter },
  { key: "github", label: "github", href: "https://github.com/andexor", Icon: Github },
];

const COLUMNS = [
  {
    heading: "TECHNICAL SERVICES",
    items: ["Web Development", "Web Hosting", "Technical SEO", "AI Systems"],
  },
  {
    heading: "BUSINESS SERVICES",
    items: ["Cost Reduction", "Lead Generation", "Growth Marketing", "Process Re-engineering"],
  },
  { heading: "COMPANY", items: ["About", "Contact"] },
];

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// FR-006: navigation grouped into technical/business/company categories,
// social media links, and a copyright line. All links (social, nav,
// Privacy/Terms) are placeholders per FR-017 — activating them is a no-op.
export function Footer() {
  return (
    <footer className="an-footer">
      <div className="an-footer__grid">
        <div>
          <Logo light />
          <p className="an-footer__tagline">
            Enterprise-grade services
            <br />
            at small business prices
          </p>
          <div className="an-footer__social-row">
            {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                aria-label={label}
                className="an-footer__social-link"
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <div className="an-footer__col-heading">{column.heading}</div>
            <ul className="an-footer__col-list">
              {column.items.map((item) => (
                <li key={item}>
                  <a href={`#${slugify(item)}`} className="an-footer__col-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="an-footer__bottom-bar">
        <div className="an-footer__bottom-inner">
          <span>© 2026 Andexor Network, Inc. All rights reserved.</span>
          <span className="an-footer__legal-links">
            <a href="#privacy" className="an-footer__legal-link">
              Privacy
            </a>
            <a href="#terms" className="an-footer__legal-link">
              Terms
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
