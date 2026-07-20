# progress.md — living project state (Mortgauge)

## Where we are
Slice 5 (amortization schedule) done and verified; on branch
`slice-5-amortization`, ready for PR. Working agreement changed 2026-07-20:
Josh no longer writes code by hand — Claude does all implementation;
explanations still happen before/after.

## Done
- 2026-07-20: Slice 5 — `amortization_schedule()` in `finance.py` (per
  month: interest on current balance, principal = payment minus interest,
  balance carried forward; final month pays off the exact remaining
  balance to absorb rounding drift). Folded into `affordability()`'s
  response as a `schedule` list, scheduled against the max loan amount.
  React: collapsible table under the affordability result. Verified: 360
  rows for a 300000/6.5%/30yr loan, principal column sums to exactly
  300000.00, balance hits exactly 0.00 at month 360; zero-rate loan also
  checked (12 equal-principal months). Confirmed via curl against the live
  endpoint.
- 2026-07-20: Slice 4 — `max_loan_amount()` (inverse of the amortization
  formula) and `affordability()` in `finance.py` (28/36 rule: max PITI is
  the lesser of 28% of gross income or 36% minus existing debts; subtract
  taxes/insurance/HOA for max P&I, invert to max loan, add down payment for
  max home price). `AffordabilityInputSerializer`, `POST /api/affordability/`,
  second form + result block in React (separate state from the payment form).
  Verified: 96000/400/40000/6.5/30 + 4800/1200 → max price 315286.83, DTI 33%
  (front-end ratio binds); 50000 income/no debts/no down payment → DTI 28%
  (matches 28% cap exactly, back-end ratio not binding). Confirmed via curl
  against Django directly and through the Vite proxy. Browser screenshot
  verification wasn't possible — this container is missing Chromium's
  system libs (libnspr4 etc.) and has no root to install them.
- 2026-07-20: Doc cleanup — ROADMAP slice 3 checked off, this file corrected
  (slice 3 was already committed straight to main as e8b7efb, not via PR),
  stray blank-line diff in README.md reverted, CLAUDE.md working agreement
  updated for Josh no longer coding manually.
- 2026-06-15: Slice 3 — `piti()` in `finance.py` (taxes/12 + insurance/12 +
  HOA + P&I), three optional fields on serializer (default 0), view returns
  full breakdown as strings, React form updated with three new optional inputs.
  Verified: 300000/6.5/30 + 4800/1200/100 → 2496.20; P&I-only still works;
  zero-rate branch passes through piti(); validation errors unchanged.
- 2026-06-12: Renamed app Homeward → Mortgauge (titles/docs only; folder
  still `~/projects/homeward`). Remote added: github.com/jhgrabe/Mortgauge.
  Workflow change: slices now merge via GitHub PRs.
- 2026-06-12: Slice 2 — `finance.py` `monthly_payment()` (written by Josh:
  amortization formula, Decimal, zero-rate branch), PaymentInputSerializer,
  `POST /api/payment/`, React form. Money crosses the API as a string.
  Verified: 300000/6.5/30 → 1896.20; 1000/0/7 → 11.90.
- 2026-06-12: Slice 1 — `calculator` app, `GET /api/health/` (DRF
  `@api_view`), `config/urls.py` includes `calculator.urls` under `api/`.
  App.jsx replaced with minimal page that fetches `/api/health/` on load;
  Vite demo CSS/assets removed. Verified end-to-end through the dev proxy.
- 2026-06-12: Rebuilt `backend/.venv` (old one broke when repo moved —
  venvs aren't relocatable). `pip install -r requirements.txt` restored it.
- 2026-06-12: Repo hygiene — .gitignore, git init (`main` branch) at
  homeward/ root, `.env.example`.
- 2026-06-12: backend/ — venv at `backend/.venv`, Django 6.0.6 + DRF 3.17.1,
  project `config`, `rest_framework` in INSTALLED_APPS, SECRET_KEY/DEBUG read
  from env with dev fallbacks, requirements.txt. `manage.py check` passes.
- 2026-06-12: frontend/ — Vite + React (plain JS) scaffold, deps installed,
  dev proxy `/api` → `localhost:8000` in vite.config.js.
- 2026-06-12: Docs written: ROADMAP.md, ARCHITECTURE.md, README.md, this file.

## Next
- Slice 6: save scenarios — first real model (Scenario), persist inputs +
  results to SQLite, list and reload them.

## Key decisions
- Dev proxy via Vite instead of django-cors-headers (fewer deps).
- Django project named `config`; single `calculator` app planned.
- Decimal everywhere for money.
- Calculations stateless (POST) until scenarios slice.

## Blockers / flags
- None. (Repo lives at `/home/bubadoo/projects/homeward`.)

## How to run
- Backend: `cd backend && source .venv/bin/activate && python manage.py runserver`
- Frontend: `cd frontend && npm run dev` → http://localhost:5173
