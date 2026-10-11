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

How to report a security issue.

## Document History

| Name               | Date             |
| :----------------- | :--------------- |
| **Author**         | Ed Jenkins       |
| **Last Reviewed**  | October 11, 2026 |
| **Last Updated**   | October 11, 2026 |
| **Effective Date** | October 11, 2026 |

## 1. Our Commitment

Andexor Network, Inc. ("Andexor," "we," "us," or "our") takes the security of its website, its hosted services, and the information entrusted to it seriously. We value the work of security researchers and welcome reports made in good faith. If you follow this policy, we will work with you to understand and resolve the issue, and we will not take legal action against you for your research.

## 2. Scope

This document explains how to report a security problem with this website or a service we host, and what you can expect from us when you do.
It covers the company's online services.
Problems with the source code of this website are also welcome through the
[security policy in its GitHub repository](https://github.com/andexor/andexor-net-website/security/policy).

This policy applies to:

- the website at andexor.net and every page under that address
- the machine-readable files we publish, such as [security.txt](/.well-known/security.txt)
- email addresses at andexor.net
- websites, applications, and other systems that Andexor hosts or operates for its clients, where Andexor controls the infrastructure
- AI features in any of those systems, such as assistants, chat, and other model-backed features that we host or operate. Prompt injection, unsafe or unintended outputs, and leaks of data or instructions through such a feature are in scope

If you are not sure whether a system is in scope, ask us first at the address in Section 10.

## 3. Out of Scope

Before you report, ask whether the attack is realistic and what its security impact would be. The following are not covered by this policy. Please do not test them, and do not report findings about them to us. The one exception is a finding that uses an excluded item as a step toward a demonstrated impact, for example an open redirect that leaks a token: then the impact is the finding, and you may include the excluded item as a step. We will close a report that describes an excluded item on its own:

- third-party services we use or link to, including GitHub, LinkedIn, X, Google, our domain registrar, our DNS and email providers, and our hosting provider's own infrastructure. Report problems with those services to their owners;
- a client's website or application where the client, not Andexor, controls the infrastructure. Report problems with those to the client;
- denial of service, resource exhaustion, and brute-force attacks of any kind, including automated scanning at a rate that degrades service;
- social engineering, phishing, or any attack directed at Andexor's staff, contractors, or clients, including a support request or Contact Us message sent under a false pretense;
- physical attacks on offices, equipment, or data centers;
- attacks that need physical access to a visitor's device, or a man-in-the-middle position between a visitor and our servers;
- issues that affect only users of a browser or operating system that its maker no longer supports, such as a version past its end of life. This is about the maker's support, not about which browsers we choose to support;
- reports from automated tools without a demonstrated, specific impact;
- missing security headers, missing best practices, or configuration observations that do not lead to a demonstrated vulnerability;
- email configuration findings, such as SPF, DKIM, and DMARC records, without a working demonstration of a specific flaw;
- a cross-site request forgery (CSRF) on a form with no sensitive action, or a permissive cross-origin resource sharing (CORS) configuration, without a demonstrated impact;
- an open redirect, without a demonstrated further impact;
- rate limiting, or the lack of it, without a demonstrated impact beyond the extra requests;
- CSV injection, that is, a spreadsheet formula placed in data that a system exports;
- a dependency with a known vulnerability, without a working demonstration that this site is affected by it;
- credentials, cookies, or session data found in breach dumps, paste sites, stealer logs, or other third-party leaks. Do not try them against our systems;
- content spoofing or text injection that cannot change the HTML of the page;
- the presence or content of publicly published information, such as the names of staff or the software we use;
- software version or banner disclosure, descriptive error messages, stack traces, and server headers, without a demonstrated impact;
- broken link hijacking and tabnabbing, without a demonstrated impact. A link from our pages to an account or domain that has expired is a content problem; see the last item;
- clickjacking on a page with no sensitive action, self-XSS, self-DoS, and other issues that require a victim to take an unlikely action against their own interests; and
- content quality problems, such as broken links and spelling errors. We are glad to hear about those via an email sent to security@andexor.net.

## 4. How to Report

Send your report by email to security@andexor.net.

Do not report security issues through the Contact Us form, through social media, or through a public GitHub issue, discussion, or pull request. Those channels are not private.

Please report in English.

## 5. What to Include

To help us triage and respond quickly, please include:

- a description of the vulnerability and where you found it (the URL, host, or service);
- steps to reproduce it, with any request and response data, scripts, or screenshots that help;
- the potential impact, and what an attacker could do with it;
- what an attacker needs to exploit it, such as an account, a position on the network, or an action by a victim;
- whether the issue is already public, for example in a blog post, an advisory, or a CVE;
- the date and time of your testing, the IP address you tested from, and any accounts or usernames you used, so we can match your activity to our logs;
- if the issue exposes personal information, what kind and roughly how much you believe is exposed. Include as little of it as possible, and redact names, addresses, and other identifying details in any text, output, and screenshots;
- a confirmation that your testing did not touch a client, a third party, or anyone's data but your own; and
- how you would like to be credited, if at all, the names of any collaborators who should share the credit, and whether we may contact you with questions.

Please send one issue per report. If the same issue appears on several hosts or pages, combine them into one report rather than sending one for each.

A proof of concept should be short and readable: a request, a few commands, or a short script that a reviewer can follow in a few minutes. If it is minified, obfuscated, or longer than it needs to be, we will return it and ask for a clearer one. You may use AI tools to help with your research and writing, but you must have verified the finding yourself and be able to explain it. We will close a report that reads as unverified AI output, or whose author cannot answer questions about it.

A suggested fix is welcome, but not required.

## 6. What You Can Expect from Us

When you report a security issue by following this policy, we will:

- acknowledge your report within 5 business days;
- tell you within 10 business days whether we have confirmed the issue, and how severe we consider it;
- keep you informed about our progress at least every 30 days until the issue is resolved;
- aim to fix a confirmed issue within 90 days of your report, and sooner for severe issues;
- tell you when the fix is deployed, and welcome you to check it;
- tell you if the issue was already known to us, or was reported first by someone else. When two reports describe the same issue, we credit the first one we received; and
- credit you on this page, if you want to be credited, once the issue is resolved.

We do not currently pay bounties or other rewards for security reports. We will say so plainly if that changes.

## 7. Coordinated Disclosure

We ask that you give us 90 days from the date of your report before you discuss the issue publicly, so that we can fix it and tell anyone affected. If we need more time, we will tell you why and agree on a new date with you. If we fix the issue sooner, you may publish once we have told you the fix is deployed. We will not ask you to withhold a report indefinitely.

If we do not respond to your report within the times in Section 6 and you cannot reach us after a reasonable second attempt, you may disclose the issue after the 90 days have passed. Please tell us first.

If we decide that a report does not describe a vulnerability, or that we will not fix it, we still ask you to coordinate with us before publishing, so that we are prepared. What you publish, and when, is your decision once the time above has passed. We welcome a draft of a blog post, talk, or article before it goes out, and we may offer corrections or context.

## 8. Rules for Researchers

To stay within this policy, you must:

- act in good faith, with the goal of helping us protect our systems and the people who use them;
- test only systems in scope, and stop as soon as you have enough evidence to demonstrate the issue;
- not access, modify, delete, or save data that does not belong to you. If you encounter personal information, client data, or credentials, stop, do not copy or keep them, do not look for more, and tell us in your report;
- test only with your own information if a system appears to expose personal information, and limit what a query returns to the least that proves the issue, for example one row from a database rather than the table. We will assess how much is exposed; you do not need to;
- not disrupt or degrade our services, and not use denial of service, spam, or attacks on availability, or any attack that is noisy to visitors, clients, or administrators, such as flooding the Contact Us form or a notification channel;
- limit automated scanners to the hosts in scope, and run them at a rate that does not degrade service;
- not use a vulnerability to gain further access, move to other systems, or install anything persistent;
- not log in with, or otherwise use, any credential, key, or token of ours that you find. Tell us where you found it, and we will check it ourselves;
- not upload, send, or link to malware or any other code meant to cause harm;
- not impersonate Andexor, or claim to act for us, toward our clients, our staff, or anyone else;
- not extort, threaten, or demand payment from us or our clients in exchange for a report or for not publishing;
- not test from infrastructure you are not authorized to use;
- not reverse engineer, extract, train on, or copy a model, its instructions, or its data, whether to build a competing product or service or for any purpose beyond demonstrating the issue;
- use what you learn from your research only to report it to us and to improve the security of the system, and not to exploit it, sell it, or pass it to anyone who would;
- delete any data from our systems that you still hold, including local, stored, and cached copies, once your report is submitted, and tell us that you have done so. We may ask you to confirm in writing what you accessed and that you have deleted it; and
- give us the time in Section 7 before publishing.

By personal information we mean anything that identifies a person or could be used against them: a name; a username, email address, or phone number tied to a person; financial, health, or government identifiers, such as account, insurance, and social security numbers; and details of a person's politics, religion, race, ethnicity, sex, gender, or sexual orientation.

## 9. Safe Harbor

If you conduct research and report it according to this policy, we consider your research authorized, lawful, and conducted in good faith. By good faith research, we mean accessing a system in scope only to test, investigate, or correct a security flaw or unintended behavior, in a way designed to avoid harm to anyone, where what you learn is used only to improve the security of the system and the people who use it. We will not initiate or support legal action against you under the Computer Fraud and Abuse Act, the Digital Millennium Copyright Act, state computer crime laws, or our [Terms of Service](/terms) for research that stays within this policy, including for bypassing a technical measure that protects a system in scope when that is part of the research, and we will not report you to law enforcement for it. Where we agree that your research followed this policy, we will state that publicly on request.

This safe harbor is a limited waiver of the Acceptable Use restrictions in our Terms of Service and controls over them for research covered by this policy. It does not bind third parties, and it does not apply to actions outside the scope or rules of this policy. If a third party starts legal action against you for research that followed this policy, we will make it known that your actions were authorized by us, when you ask us to and to the extent we have the information to do so.

If you are unsure whether something you plan to do is covered, ask us before you do it.

## 10. Contact

Email: security@andexor.net

Phone: 855-ANDEXOR

For questions about this policy that are not themselves security reports, you may also use legal@andexor.net.

If you believe we have not kept to this policy, for example by missing the times in Section 6 or by dismissing a report without a reason, write to legal@andexor.net and say so. We will review the matter separately from the report itself and reply within 10 business days.

| Mailing Address             |
| :-------------------------- |
| Andexor Network, Inc.       |
| ATTN: Ed Jenkins, President |
| 860 Johnson Ferry RD NE     |
| #140-386                    |
| Atlanta, GA 30342           |

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
