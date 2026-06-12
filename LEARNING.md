# LEARNING.md — concepts log

A human-facing log of concepts covered while building Homeward, in my own
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
