# CLAUDE.md — Mortgauge

This file is the project rulebook. Read it in full at the start of every session, then read `progress.md` before doing anything else.

## What we're building

A single-user web app that helps someone figure out what home they can actually afford, and later compare candidate properties for value.

- **MVP (the goal that matters first):** a mortgage **affordability calculator**. The user enters income, monthly debts, down payment, interest rate, and estimated taxes/insurance. The app returns: max home price, monthly payment (PITI), debt-to-income ratio, and an amortization schedule. All inputs come from the user — **no external listing data, no third-party APIs** in the MVP.
- **Phase 2 — Deal analyzer:** let the user add candidate properties (typed in manually, or from a sample dataset we generate) and rank them by ROI, price-per-square-foot, and monthly cost vs. what they can afford.
- **Phase 3 — Accounts:** add authentication/authorization so a user can log in and save their scenarios across visits. (We build single-user first, but design so this drops in without a rewrite.)
- **Phase 4 — Deploy:** make it publicly hostable.

Do not pull live real-estate listing data. Major sites have no beginner-friendly API and scraping violates their terms.

## Stack

- **Frontend:** Vite + React (plain JavaScript, not TypeScript, to keep it readable).
- **Backend:** Django + Django REST Framework (DRF).
- **Database:** SQLite for local development (Django's default, zero setup). Structure everything so switching to **Postgres** for deployment is a config change, not a rewrite. Use the ORM normally; we'll also write some raw SQL on purpose so I learn it.
- Keep dependencies minimal and beginner-readable. If you want to add a library, explain why first.

## How we work together (the working agreement)

You do the building, including all code — as of 2026-07-20 I'm no longer typing code myself. I read, understand, and learn. Specifically:

1. **Explain before you code.** In plain language, say what we're about to do and *why*, before writing it.
2. **Walk me through after.** After writing code, briefly explain what each part does and why — including the financial formulas, the data model, and the API design, since that's still the learning even though I'm not typing it.
3. **One task at a time.** Do one slice, then stop and wait for me. Don't run ahead.
4. **No walls of text.** Short, direct responses. Don't paste whole files back at me unless I ask.
5. **Readable code is non-negotiable.** Clear names, conventional structure, comments only where something isn't obvious. I have to be able to read everything you write.
6. **Correct with hints, not lectures.** If I got something wrong or want a different approach, nudge me toward the fix rather than a lecture.

## The documents (what each file is for)

- **CLAUDE.md** (this file): rules + high-level project state. Changes rarely. If I tell you a new standing preference, propose adding it here.
- **progress.md**: the living state of the project — what's done, what's in progress, what's next, key decisions, and any blockers. Lean and factual; this is *for you* to resume cleanly. Update it at the end of every session.
- **ROADMAP.md**: the phased, vertical-slice build order.
- **ARCHITECTURE.md**: project layout, data model, API endpoints, and the *why* behind structural decisions.
- **LEARNING.md**: a human-facing log of concepts you've taught me, in my words where possible. Append to it when you teach me something worth keeping. This is *not* a state file and is *not* read at session start.
- **README.md**: the public-facing project description (what it does, how to run it) for anyone who views the repo.

## Session rituals

- **Start of session:** read CLAUDE.md and progress.md, then tell me in a few lines where we are and what the next slice is. Wait for my OK before coding.
- **End of session (or when I say "wrap up", or when context is getting full):** update progress.md (and ARCHITECTURE.md / LEARNING.md if relevant), commit the work, and tell me the clean stopping point so the next session resumes easily.

## Build philosophy

- **Vertical slices.** Build one small feature end-to-end (React UI → DRF endpoint → DB) and get it working before starting the next. Each slice should be shippable in roughly one session. The app should always run.
- **Security is part of "done," not a later bolt-on.** Validate and sanitize inputs from the first slice. Even while single-user, structure the code so an authenticated user model can be added cleanly. We'll cover auth properly in Phase 3.

## Git

- Commit after each working slice with a clear message.
- Use a feature branch per slice. Merge via a GitHub pull request, not a
  local merge. (This reinforces the Git workflow I'm learning in bootcamp —
  walk me through the PR steps; this area is still new to me.)
- Remote: `origin` → github.com/jhgrabe/Mortgauge.

## Token discipline (I have a ~200K/day limit)

- Keep each session scoped to one slice.
- Don't re-output entire files — make small, targeted edits.
- Don't re-read large files unless needed.
- Update progress.md *before* we run low, so we never lose our place.
- Stay concise.