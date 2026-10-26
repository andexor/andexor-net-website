// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareGithub, faSquareLinkedin, faSquareXTwitter } from "@awesome.me/kit-0a6c11d394/icons/classic/brands";
import { Logo } from "./Logo";
import { PrivacySettingsLink } from "./PrivacySettingsLink";

const SOCIAL_LINKS = [
    {
        key: "linkedin",
        label: "LinkedIn logo, Andexor profile, opens in new tab",
        href: "https://www.linkedin.com/in/ejenkins/",
        icon: faSquareLinkedin,
    },
    {
        key: "twitter",
        label: "X logo, Andexor profile, opens in new tab",
        href: "https://x.com/andexor",
        icon: faSquareXTwitter,
    },
    {
        key: "github",
        label: "GitHub logo, Andexor organization, opens in new tab",
        href: "https://github.com/andexor",
        icon: faSquareGithub,
    },
];

const PRIVACY_SETTINGS = "Privacy Settings";

const COLUMNS = [
    {
        heading: "TECHNICAL SERVICES",
        items: ["Web Development", "Web Hosting", "Technical SEO", "Agentic Systems"],
    },
    {
        heading: "BUSINESS SERVICES",
        items: ["Cost Reduction", "Process Re-engineering", "Lead Generation", "Growth Marketing"],
    },
    {
        heading: "COMPANY",
        items: ["About Us", "Terms Of Service", "Security Policy", "Privacy Policy", PRIVACY_SETTINGS],
    },
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
    "Terms Of Service": "/terms-of-service",
    "Security Policy": "/security-policy",
    "Privacy Policy": "/privacy-policy",
};

// Spec 081: the Do Not Sell or Share link lands on the Cookie Declaration, Section 25 of the Privacy Policy, where the
// consent controls are. The fragment is the id rehype-slug gives that heading, so it changes if the section is renumbered;
// tests/e2e/footer-links.spec.ts checks that the fragment still names an element on the page.
const DO_NOT_SELL_HREF = "/privacy-policy#25-cookie-declaration";

// FR-006: navigation grouped into technical/business/company categories,
// social media links, and a copyright line under the logo. The service and About Us entries
// link to their pages (spec 010), and so do the Terms Of Service, Security Policy, and Privacy Policy entries (specs 062
// and 081). Privacy Settings is not a page: it reopens the cookie banner (spec 081). The Do Not Sell or Share My
// Personal Information link under the copyright line opens the Cookie Declaration section of the Privacy Policy (spec 081).
export function Footer() {
    return (
        <footer role="contentinfo" className="an-footer">
            <div className="an-footer__grid">
                <div>
                    <Logo light />
                    <p className="an-footer__copyright">© 2026 Andexor Network, Inc. All rights reserved.</p>
                    <a href={DO_NOT_SELL_HREF} className="an-footer__legal-link">
                        Do Not Sell or Share My Personal Information
                    </a>
                    <div className="an-footer__social-row">
                        {SOCIAL_LINKS.map(({ key, label, href, icon }) => (
                            <a
                                key={key}
                                href={href}
                                className="an-footer__social-link"
                                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                                <FontAwesomeIcon icon={icon} aria-label={label} />
                            </a>
                        ))}
                    </div>
                </div>
                {COLUMNS.map((column) => (
                    <nav key={column.heading} role="navigation" aria-label={column.heading}>
                        <div className="an-footer__col-heading">{column.heading}</div>
                        <ul className="an-footer__col-list">
                            {column.items.map((item) => (
                                <li key={item}>
                                    {item === PRIVACY_SETTINGS ? (
                                        <PrivacySettingsLink className="an-footer__col-link" />
                                    ) : (
                                        <a href={ITEM_HREFS[item]} className="an-footer__col-link">
                                            {item}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
        </footer>
    );
}
