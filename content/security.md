---
title: Security Policy
description: Security Policy
layout: cards
section: company
eyebrow: Company
image: /security.png
image_alt: Security Policy document with a shield
---

<!--

Here is the prompt I used to create public/security.png using recraft.ai:

Please create a modern 3D isometric icon illustration that represents a Security Policy document with a shield.

-->

# Security Policy

This document explains how to report a security problem with this website or a service we host, and what you can expect from us when you do.
It covers the company's online services.
Problems with the source code of this website are also welcome through the
[security policy in its GitHub repository](https://github.com/andexor/andexor-net-website/security/policy).

## Document History

| Name               | Date             |
| :----------------- | :--------------- |
| **Author**         | Ed Jenkins       |
| **Last Reviewed**  | October 10, 2026 |
| **Last Updated**   | October 10, 2026 |
| **Effective Date** | October 10, 2026 |

## 1. Our Commitment

Andexor Network, Inc. ("Andexor," "we," "us," or "our") takes the security of its website, its hosted services, and the information entrusted to it seriously. We value the work of security researchers and welcome reports made in good faith. If you follow this policy, we will work with you to understand and resolve the issue, and we will not take legal action against you for your research.

## 2. Scope

This policy applies to:

- the website at andexor.net and every page under that address
- the machine-readable files we publish, such as /.well-known/security.txt
- email addresses at andexor.net
- websites, applications, and other systems that Andexor hosts or operates for its clients, where Andexor controls the infrastructure

If you are not sure whether a system is in scope, ask us first at the address in Section 10.

## 3. Out of Scope

The following are not covered by this policy. Please do not test them, and do not report findings about them to us:

- third-party services we use or link to, including GitHub, LinkedIn, X, Google, our domain registrar, our DNS and email providers, and our hosting provider's own infrastructure. Report problems with those services to their owners;
- a client's website or application where the client, not Andexor, controls the infrastructure. Report problems with those to the client;
- denial of service, resource exhaustion, and brute-force attacks of any kind, including automated scanning at a rate that degrades service;
- social engineering, phishing, or any attack directed at Andexor's staff, contractors, or clients;
- physical attacks on offices, equipment, or data centers;
- reports from automated tools without a demonstrated, specific impact;
- missing security headers, missing best practices, or configuration observations that do not lead to a demonstrated vulnerability;
- the presence or content of publicly published information, such as the names of staff or the software we use; and
- clickjacking, self-XSS, and other issues that require a victim to take an unlikely action against their own interests.

## 4. How to Report

Send your report by email to security@andexor.net.

Do not report security issues through the Contact Us form, through social media, or through a public GitHub issue, discussion, or pull request. Those channels are not private.

Please report in English.

## 5. What to Include

To help us triage and respond quickly, please include:

- a description of the vulnerability and where you found it (the URL, host, or service);
- steps to reproduce it, with any request and response data, scripts, or screenshots that help;
- the potential impact, and what an attacker could do with it;
- the date and time of your testing, and the IP address you tested from, so we can match it to our logs; and
- how you would like to be credited, if at all, and whether we may contact you with questions.

A suggested fix is welcome but not required.

## 6. What You Can Expect from Us

When you report a security issue by following this policy, we will:

- acknowledge your report within 5 business days;
- tell you within 10 business days whether we have confirmed the issue, and how severe we consider it;
- keep you informed about our progress at least every 30 days until the issue is resolved;
- aim to fix a confirmed issue within 90 days of your report, and sooner for severe issues;
- tell you when the fix is deployed; and
- credit you on this page, if you want to be credited, once the issue is resolved.

We do not currently pay bounties or other rewards for security reports. We will say so plainly if that changes.

## 7. Coordinated Disclosure

We ask that you give us 90 days from the date of your report before you discuss the issue publicly, so that we can fix it and tell anyone affected. If we need more time, we will tell you why and agree on a new date with you. If we fix the issue sooner, you may publish once we have told you the fix is deployed. We will not ask you to withhold a report indefinitely.

If we do not respond to your report within the times in Section 6 and you cannot reach us after a reasonable second attempt, you may disclose the issue after the 90 days have passed. Please tell us first.

## 8. Rules for Researchers

To stay within this policy, you must:

- act in good faith, with the goal of helping us protect our systems and the people who use them;
- test only systems in scope, and stop as soon as you have enough evidence to demonstrate the issue;
- not access, modify, delete, or save data that does not belong to you. If you encounter personal information, client data, or credentials, stop, do not copy or keep them, and tell us in your report;
- not disrupt or degrade our services, and not use denial of service, spam, or attacks on availability;
- not use a vulnerability to gain further access, move to other systems, or install anything persistent;
- not extort, threaten, or demand payment from us or our clients in exchange for a report or for not publishing;
- not test from infrastructure you are not authorized to use; and
- give us the time in Section 7 before publishing.

## 9. Safe Harbor

If you conduct research and report it according to this policy, we consider your research authorized, lawful, and conducted in good faith. We will not initiate or support legal action against you under the Computer Fraud and Abuse Act, the Digital Millennium Copyright Act, state computer crime laws, or our [Terms of Service](/terms) for research that stays within this policy, and we will not report you to law enforcement for it. Where we agree that your research followed this policy, we will state that publicly on request.

This safe harbor is a limited waiver of the Acceptable Use restrictions in our Terms of Service and controls over them for research covered by this policy. It does not bind third parties, and it does not apply to actions outside the scope or rules of this policy. If a third party starts legal action against you for research that followed this policy, we will make it known that your actions were authorized by us.

If you are unsure whether something you plan to do is covered, ask us before you do it.

## 10. Contact

Email: security@andexor.net

Phone: 855-ANDEXOR

For questions about this policy that are not themselves security reports, you may also use legal@andexor.net.

| Mailing Address         |
| :---------------------- |
| Andexor Network, Inc.   |
| ATTN: Ed Jenkins        |
| 860 Johnson Ferry RD NE |
| #140-386                |
| Atlanta, GA 30342       |

## 11. Changes to This Policy

We may revise this policy at any time by posting a revised version on this page and updating the dates in the Document History section above. A report is governed by the version in effect when we received it.

## 12. Acknowledgements

We thank the researchers who have reported security issues to us. There are no acknowledgements yet.

<!--

If there is ever a need to publish acknowledgements, follow these guidelines.

What an entry usually carries:

- Credit as the researcher asked for it. Their name or handle, exactly as they wrote it, with at most one link they chose (personal site, GitHub, LinkedIn, or X). Ask in the report thread, and never add a link they did not give you.
- A date. Month and year of the fix, not of the report. Reverse chronological order, newest first, or grouped by year once the list is long.
- A short, general description of the issue class. For example "reflected cross-site scripting in the Contact Us form" or "path traversal in the static file server". No reproduction steps and no detail that would help someone attack an unpatched copy.
- A CVE identifier if one was assigned. Most small-site issues never get one.

What to leave out, by convention:

- Nothing is published until the fix is deployed and the researcher has agreed to the wording.
- No severity labels, rankings, or amounts unless you run a bounty. Without one, a flat list reads better and avoids implying a tier the researcher did not earn.
- No reports about out-of-scope items or duplicates. The acknowledgement is for findings you fixed.
- Anonymous researchers are listed as "Anonymous" with the date and issue, so the record is still complete.

For this site, a table matches the Document History block already on the page. Replacing the placeholder in Section 12 would look like this:

We thank the researchers who have reported security issues to us.

| Date         | Researcher                                    | Issue                                     |
| :----------- | :-------------------------------------------- | :---------------------------------------- |
| October 2026 | [Jane Doe](https://github.com/janedoe)        | Path traversal in the static file server  |
| October 2026 | Anonymous                                     | Open redirect in the footer social links  |

-->
