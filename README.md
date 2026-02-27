# Hisab

**Hisab** (हिसाब) is a simple tool to track and settle shared expenses
between people.\
It answers one blunt question:

> Who owes whom, and how much?

If you've used apps like Splitwise, the idea is similar --- but
**Hisab** is minimal, fast, and built for clarity over clutter.

------------------------------------------------------------------------

## What It Does

-   Track group expenses
-   Split costs evenly
-   Calculate net balances
-   Reduce transactions to the minimal set required for settlement
-   Show exactly who should pay whom

No noise. Just the math.

------------------------------------------------------------------------

## Why Hisab?

Most expense-sharing tools grow bloated.

Hisab focuses only on: - Clear input - Deterministic math - Transparent
output

It is built for: - Friends on trips - Flatmates - Small teams - Anyone
who wants clean numbers without friction

------------------------------------------------------------------------

## Core Concept

Each expense records: - **Who paid** - **Total amount** - **Who
participated** - **Split logic** (equal / custom ratio / exact amounts)

From that, Hisab computes:

-   Individual balances
-   Net owed amounts
-   Minimal settlement graph

Example:

If: - A paid ₹1000 for A, B, C - B paid ₹600 for B, C - C paid ₹300 for
A

Hisab outputs something like:

    B → A : ₹200
    C → A : ₹150

No redundant transfers.

------------------------------------------------------------------------

## Features

-   Deterministic balance engine
-   Floating-point safe arithmetic (configurable precision)
-   Minimal cash-flow simplification
-   Extensible data model
-   Simple JSON-based storage (or pluggable backend)

------------------------------------------------------------------------

## Contributing

1.  Fork
2.  Create feature branch
3.  Write tests
4.  Open PR

Keep it simple.\
If a feature adds complexity without improving clarity, it probably
doesn't belong.

------------------------------------------------------------------------

## License

MIT

------------------------------------------------------------------------

If this project helps you keep friendships intact, it has done its job.
