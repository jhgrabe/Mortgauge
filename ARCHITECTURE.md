# ARCHITECTURE — Mortgauge

## Layout

```
mortgauge/                   # repo root (folder currently named homeward/)
├── backend/
│   ├── .venv/              # virtualenv (gitignored)
│   ├── config/             # Django project: settings, root urls, wsgi/asgi
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # Vite + React (plain JS)
│   ├── src/
│   └── vite.config.js      # proxies /api → Django :8000 in dev
├── CLAUDE.md  ROADMAP.md  ARCHITECTURE.md  progress.md  LEARNING.md  README.md
├── .gitignore  .env.example
```

**Why two top-level folders:** frontend and backend are separate processes
with separate dependency managers (npm / pip). Side-by-side in one repo keeps
the project simple while making the boundary obvious.

**Why the Django project is named `config`:** it holds settings and URL
routing, nothing else. The name (a common convention) keeps it from being
confused with an app containing actual logic.

**Planned app (slice 1):** a single Django app `calculator` for the MVP.
Apps are Django's unit of reuse; one focused app beats premature splitting.

**Why a dev proxy instead of CORS:** the browser only talks to Vite (:5173),
which forwards `/api/*` to Django (:8000). One less dependency
(django-cors-headers) and no CORS concepts needed until deploy.

## API shape (MVP)

All endpoints under `/api/`. Calculator endpoints are **POST** and stateless
— inputs in, computed results out, nothing stored — until slice 6.

| Endpoint              | Method   | Purpose                                  |
| --------------------- | -------- | ---------------------------------------- |
| `/api/health/`        | GET      | proves the stack works (slice 1)         |
| `/api/payment/`       | POST     | PITI breakdown for a given loan (slices 2–3) |
| `/api/affordability/` | POST     | max home price, max loan, DTI via 28/36 rule (slice 4); amortization schedule joins in slice 5 |
| `/api/scenarios/`     | GET/POST | saved scenarios (slice 6)                |

**Why POST for a calculation:** the input set is too big for query strings,
and DRF serializers validate the request body for free.

## Data model (nothing persisted until slice 6)

```
Scenario
├── name              CharField
├── created_at        DateTimeField (auto)
├── annual_income     DecimalField
├── monthly_debts     DecimalField
├── down_payment      DecimalField
├── interest_rate     DecimalField   # annual %, e.g. 6.500
├── term_years        IntegerField
├── monthly_taxes     DecimalField
└── monthly_insurance DecimalField
```

**Why DecimalField, not FloatField:** money. Floats accumulate rounding
errors; Decimal is exact. The Python math will use `decimal.Decimal` too.

**Why results aren't stored:** they're derivable from inputs. Storing them
invites stale data if a formula improves.

**Phase 3 readiness:** Scenario gets a nullable `user` ForeignKey later —
one migration, no rewrite. Phase 2 adds a `Property` model for comparisons.

## Database

SQLite in dev (zero setup). Settings read `SECRET_KEY` / `DEBUG` from the
environment with dev fallbacks; Phase 4 swaps in Postgres via `DATABASE_URL`,
keeping the move a config change.
