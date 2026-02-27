I have the set up a basic application in react using vite, and tailwind.

Build a dark-mode, modern Splitwise-like web app using React (Vite) + Tailwind CSS.

Core features

Allow input of N users (dynamic count).

Each user can add multiple expenses.

On clicking Calculate, compute:

Net balance per user.

Minimum number of transactions needed to settle all balances.

Output as clear statements like:
X owes Y ₹Z.

Show total expense at the bottom.

Algorithm

Use a net balance + greedy settlement approach (or any optimal method) to minimize transactions.

Ensure correctness and clarity over cleverness.

UI / UX

Entirely dark mode.

Sharp, distinct colors per user.

Use:

Green for money to receive.

Red for money to pay.

Clean layout, modern look, high contrast, easy to scan.

Results section must be visually separate from inputs.

Optional

An “Explain the math” section:

Show intermediate steps: totals, per-user balance, settlement logic.

Human-readable, not academic.

Footer

At the bottom, add:

Made with ❤️ by Dhawal

“Dhawal” must be a hyperlink to:
https://dhawal-pandya.github.io

Constraints

Frontend only.

No auth, no backend, no persistence.

Keep code clean and readable.