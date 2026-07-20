# ROADMAP — Mortgauge

Vertical slices: each one is end-to-end (React → DRF → result), shippable in
roughly one session. The app always runs.

## MVP — Affordability calculator

- [x] **Slice 0 — Skeleton & docs.** Repo hygiene, venv, Django + DRF, Vite +
  React, dev proxy, docs.
- [x] **Slice 1 — Hello, full stack.** A trivial DRF endpoint
  (`GET /api/health/`) and a React page that fetches and displays it. Proves
  the whole pipe works before any real logic.
- [x] **Slice 2 — Monthly payment (P&I).** Form with loan amount, interest
  rate, term → DRF endpoint computes the monthly principal & interest payment.
  *First financial formula — learner attempts it first.*
- [x] **Slice 3 — PITI.** Add taxes, insurance (and optional HOA) inputs to
  get the full monthly payment. Mostly addition; cements the vocabulary.
- [ ] **Slice 4 — Max affordable price.** Add income, monthly debts, down
  payment. Compute DTI and work *backwards* from the max allowed payment to
  the max home price.
- [ ] **Slice 5 — Amortization schedule.** Month-by-month breakdown of
  principal vs. interest vs. balance, displayed as a table.
- [ ] **Slice 6 — Save scenarios.** First real model: persist a named
  scenario (inputs + results) to SQLite; list and reload them. *First data
  model + migration.*
- [ ] **Slice 7 — Polish.** Input validation messages, sensible defaults,
  layout and UI design cleanup. MVP done.

## Later phases (placeholders — detail when we get there)

- **Phase 2 — Deal analyzer:** Property model, sample dataset, ranking by
  ROI / $-per-sqft / monthly cost vs. affordability.
- **Phase 3 — Accounts:** Django auth, scenarios owned by users, login UI.
- **Phase 4 — Deploy:** Postgres, env-based settings, static hosting.
