// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Logo } from "./Logo";

const SOCIAL_LINKS = [
    { key: "linkedin", label: "linkedin", href: "https://www.linkedin.com/in/ejenkins/", icon: faLinkedinIn },
    { key: "twitter", label: "twitter", href: "https://x.com/andexor", icon: faXTwitter },
    { key: "github", label: "github", href: "https://github.com/andexor", icon: faGithub },
];

const COLUMNS = [
    {
        heading: "TECHNICAL SERVICES",
        items: ["Web Development", "Web Hosting", "Technical SEO", "Agentic Systems"],
    },
    {
        heading: "BUSINESS SERVICES",
        items: ["Cost Reduction", "Lead Generation", "Growth Marketing", "Process Re-engineering"],
    },
    { heading: "COMPANY", items: ["About Us", "Privacy", "Terms"] },
];

const ITEM_HREFS: Record<string, string> = {
    "Web Development": "/web-development",
    "Web Hosting": "/web-hosting",
    "Technical SEO": "/technical-seo",
    "Agentic Systems": "/agentic-systems",
    "Cost Reduction": "/cost-reduction",
    "Lead Generation": "/lead-generation",
    "Growth Marketing": "/growth-marketing",
    "Process Re-engineering": "/process-re-engineering",
    "About Us": "/about-us",
    Privacy: "#privacy",
    Terms: "#terms",
};

// FR-006: navigation grouped into technical/business/company categories,
// social media links, and a copyright line under the logo. The service and About Us entries
// link to their pages (spec 010). Privacy and Terms remain placeholders per FR-017 — activating
// them is a no-op.
export function Footer() {
    return (
        <footer className="an-footer">
            <div className="an-footer__grid">
                <div>
                    <Logo light />
                    <p className="an-footer__copyright">© 2026 Andexor Network, Inc. All rights reserved.</p>
                    <div className="an-footer__social-row">
                        {SOCIAL_LINKS.map(({ key, label, href, icon }) => (
                            <a
                                key={key}
                                href={href}
                                aria-label={label}
                                className="an-footer__social-link"
                                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                                <FontAwesomeIcon icon={icon} className="an-footer__social-icon" aria-hidden="true" />
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
                                    <a href={ITEM_HREFS[item]} className="an-footer__col-link">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </footer>
    );
}
