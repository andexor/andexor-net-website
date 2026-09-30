// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

"use client";

import { useContact } from "@/components/contact/ContactProvider";

// Spec 014: the footer's "Contact Us" opens the contact popup. It is a button,
// not a link, because it opens a dialog and goes nowhere. It passes itself as
// the opener so focus returns to it on close even in browsers that do not
// focus a button when it is clicked.
export function FooterContactButton({ label }: { label: string }) {
  const { openContact } = useContact();
  return (
    <button
      type="button"
      className="an-footer__col-link"
      aria-haspopup="dialog"
      onClick={(event) => openContact(event.currentTarget)}
    >
      {label}
    </button>
  );
}
