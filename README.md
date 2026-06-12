# Homeward

A web app that answers: **what home can I actually afford?**

Enter your income, monthly debts, down payment, interest rate, and estimated
taxes/insurance — get back your max home price, full monthly payment (PITI),
debt-to-income ratio, and an amortization schedule. Later phases add a deal
analyzer for comparing candidate properties and saved scenarios behind a
login.

Built as a learning project: Django + Django REST Framework backend,
Vite + React frontend, SQLite locally (Postgres-ready for deployment).
No external listing data or third-party APIs.

## Running locally

Backend (http://localhost:8000):

```bash
cd backend
source .venv/bin/activate   # first time: python3 -m venv .venv && pip install -r requirements.txt
python manage.py runserver
```

Frontend (http://localhost:5173 — proxies `/api` to the backend):

```bash
cd frontend
npm install
npm run dev
```
