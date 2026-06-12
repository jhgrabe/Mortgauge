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
