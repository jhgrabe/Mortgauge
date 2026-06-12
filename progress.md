# progress.md — living project state

## Where we are
Slice 0 (skeleton & docs) built, **awaiting user approval of roadmap +
architecture** before starting slice 1.

## Done
- 2026-06-12: Repo hygiene — .gitignore, git init (`main` branch) at
  homeward/ root, `.env.example`.
- 2026-06-12: backend/ — venv at `backend/.venv`, Django 6.0.6 + DRF 3.17.1,
  project `config`, `rest_framework` in INSTALLED_APPS, SECRET_KEY/DEBUG read
  from env with dev fallbacks, requirements.txt. `manage.py check` passes.
- 2026-06-12: frontend/ — Vite + React (plain JS) scaffold, deps installed,
  dev proxy `/api` → `localhost:8000` in vite.config.js.
- 2026-06-12: Docs written: ROADMAP.md, ARCHITECTURE.md, README.md, this file.

## Next
- Slice 1: `calculator` app, `GET /api/health/`, React fetches and displays
  it. (Pending user OK; user may adjust roadmap/architecture first.)

## Key decisions
- Dev proxy via Vite instead of django-cors-headers (fewer deps).
- Django project named `config`; single `calculator` app planned.
- Decimal everywhere for money.
- Calculations stateless (POST) until scenarios slice.

## Blockers / flags
- ⚠️ User's home dir `/home/bubadoo` is an accidental git repo with ~22.6k
  files staged incl. `.aws`/`.azure` creds (no commits yet). Recommended
  `rm -rf /home/bubadoo/.git`. User decision — not done by us. Does not
  affect homeward repo (nested repo takes precedence).

## How to run
- Backend: `cd backend && source .venv/bin/activate && python manage.py runserver`
- Frontend: `cd frontend && npm run dev` → http://localhost:5173
