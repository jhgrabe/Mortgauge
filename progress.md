# progress.md — living project state (Mortgauge)

## Where we are
Slice 1 (hello, full stack) done and verified. Next up: slice 2.

## Done
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
- Slice 2: monthly P&I payment — React form (loan amount, rate, term) →
  POST endpoint computes payment. **Learner attempts the formula first**
  (hints before answers).

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
