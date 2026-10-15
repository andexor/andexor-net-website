# UI Contracts: Required Fields First

Amends point 2 of the `ContactPopup` behavior contract (spec 001, as amended by spec 068):

2. Rendering with `open=true` and `sent=false` renders the form with fields, in order: full name (required), work
   email (required), primary need (required), phone number (optional), company website (optional). Tab order follows
   this order, then the Privacy and Terms links, then Send.

Everything else in the contract, including `ContactRequest` and the required mark on labels, is unchanged.

Spec 070 then removed primary need; see its contract.
