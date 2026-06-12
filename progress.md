# progress.md — living project state (Mortgauge)

## Where we are
Slice 2 (monthly P&I) done and verified; merging via PR #1. Next up: slice 3.

## Done
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
- Slice 3: PITI — add taxes, insurance, optional HOA inputs for the full
  monthly payment. Mostly addition on top of slice 2.

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
