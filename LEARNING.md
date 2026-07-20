# LEARNING.md — concepts log

A human-facing log of concepts covered while building Mortgauge, in my own
words where possible. Appended to as we go; not read at session start.

---

## Slice 1 (2026-06-12)

- **Django project vs. app.** The *project* (`config/`) is the wiring:
  settings, root URLs. An *app* (`calculator/`) is a feature module with its
  own views/models/urls. Projects contain apps; apps are meant to be
  self-contained.
- **URL routing by include.** `config/urls.py` says "anything under `api/`
  goes to `calculator.urls`" — each app owns its own routes, the project
  just mounts them.
- **DRF `@api_view`.** Turns a plain function into an API endpoint that
  speaks JSON (and gives you the browsable API page for free in dev).
- **`useEffect` for fetch-on-load.** React renders first with a default
  state ('checking'), the effect fires the fetch, and `setState` re-renders
  with the result. The empty `[]` dependency array means "run once on mount."
- **Venvs aren't relocatable.** Moving the project folder broke `.venv`
  because its scripts hard-code absolute paths. The fix is to delete and
  recreate it — which is painless *because* requirements.txt pins what to
  reinstall. The venv is disposable; requirements.txt is the source of truth.

## Slice 2 (2026-06-12)

- **The amortization formula** (I wrote this one): convert the annual
  percent rate to a monthly decimal rate (÷100, ÷12), years to months
  (×12), then payment = P · r(1+r)^n / ((1+r)^n − 1). Zero interest needs
  its own branch — the formula divides by zero — and the answer is just
  principal ÷ months.
- **Indentation IS the syntax in Python.** Blocks are defined by indent
  level, nothing else. Mixed indent levels = IndentationError before a
  single line runs.
- **Method calls bind tighter than arithmetic.** `a / (b).quantize(...)`
  quantizes `b`, not the quotient. Compute first, then round the result.
- **`if __name__ == '__main__':`** = "only run this when the file is
  executed directly, not when it's imported."
- **DRF serializers** declare each field's type and allowed range; invalid
  input becomes a clean 400 automatically, and DecimalField hands the view
  real Decimals.
- **JSON has no decimal type.** Send money as a string across the API or
  it silently becomes a float again at the boundary.
- **A PR is a GitHub page, not a Git feature** — "please merge branch X
  into main" plus a diff and comments. It tracks the *branch*, so pushes
  keep flowing into it until merge. And merging happens on GitHub's copy:
  local main is stale until `git pull`.

## Slice 4 (2026-07-20)

- **The 28/36 rule.** Lenders cap housing payment (PITI) at 28% of gross
  monthly income (front-end ratio), and total debt payments — housing plus
  car loans, credit cards, etc. — at 36% (back-end ratio). Whichever cap
  is tighter wins: `max_piti = min(28% of income, 36% of income − existing
  debts)`.
- **Working backwards through a formula.** Slice 2's payment formula goes
  loan amount → monthly payment. Affordability needs the inverse: a target
  payment → the loan amount it supports. Same equation, algebraically
  solved for principal instead of payment. Max home price is then just
  that loan amount plus the down payment.
- **Two independent forms, one page.** The affordability form has its own
  `useState` pair (form + result), separate from the payment form's. No
  shared state needed since the calculations don't depend on each other.

- **Amortization: each month's interest is on the *current* balance**, not
  the original loan — so as the balance shrinks, less of the flat payment
  goes to interest and more goes to principal, even though the payment
  itself never changes.
- **Rounding drift over hundreds of months.** Rounding each month's
  interest to the cent means the last payment's math won't land on exactly
  $0.00 balance by coincidence — so the final month is a special case:
  pay off whatever balance is actually left, rather than trusting the
  formula's payment amount.

## Slice 6 (2026-07-20)

- **A model is a table.** Each field on the `Scenario` class becomes a
  column; `makemigrations` diffs the models against the last migration and
  writes the SQL to get there, `migrate` actually runs it. Nothing touches
  the database until `migrate` runs — `makemigrations` alone just writes a
  Python file describing the change.
- **`ModelSerializer` vs. plain `Serializer`.** The payment/affordability
  serializers declare every field's rules by hand because there's no model
  behind them. `ScenarioSerializer` instead points at the `Scenario` model
  and inherits its field types and constraints — one source of truth
  instead of two copies that can drift apart.
- **Generic views vs. `@api_view`.** Every other endpoint is a plain
  function with `@api_view` because each one does one bespoke calculation.
  `ScenarioListCreate(generics.ListCreateAPIView)` is pure list-and-create
  over a model with no custom logic, which is exactly what that generic
  class does — so there's no view body to write at all.
- **Why results aren't saved.** Only the scenario's *inputs* go in the
  database. Loading a scenario re-runs `finance.affordability()` on those
  inputs rather than reading stored numbers, so results can never drift
  out of sync with the formula that produces them.

## Slice 7 (2026-07-20) — MVP done

- **DRF error shapes, flattened.** A validation failure comes back as
  either `{detail: "..."}` (one message, e.g. a bad HTTP method) or
  `{field_name: ["message", ...]}` (one array per invalid field). One
  small function turns either shape into a flat list of "field: message"
  strings so the UI never has to special-case which one it got.
  `Object.entries(...).flatMap(...)` — `flatMap` because each field can
  have more than one error message, and the result should still be one
  flat list, not a list of lists.
- **`<ErrorList errors={...} />`.** The first small reusable component in
  the app — everywhere an error list needs to render is the same three
  lines, and it skips rendering an empty `<ul>` when there's nothing wrong.
- **`disabled` during a fetch.** Without it, clicking a slow submit button
  twice fires two overlapping requests. A `submitting` boolean set true
  right before the fetch and false right after (in both the success and
  error paths) closes that gap.
- **CSS Grid for form layout, not Flexbox.** `grid-template-columns:
  repeat(auto-fit, minmax(200px, 1fr))` lets fields wrap into as many
  columns as fit the container, no media query needed for the common
  case — Flexbox can wrap too, but grid keeps every row's columns
  aligned to the same widths.
