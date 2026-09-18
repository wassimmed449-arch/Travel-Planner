# Travel Planner Annaba — Project Memory

## What this is
A trilingual (Arabic/French/English) travel-guide PWA for Annaba, Algeria, adapted from a
guidebook written by Benfernane Mohamed Ouassim ("Wassim"). Originally built on the Emergent
AI platform and exported to this repo. Long-term goal: cut ties with Emergent, make the paid
premium tier actually secure, finish porting the guidebook content, and ship to Google Play as
a Trusted Web Activity (TWA).

Full findings from the initial audit are in `AUDIT.md` (read-only historical record — do not
edit it after the fact; it reflects the repo state as of the Phase 0 PR). The active roadmap is
`PLAN.md`.

## Stack
- **Frontend**: React 19 + CRA, built/served via `craco` (see `frontend/craco.config.js`).
  Tailwind CSS, Radix UI primitives, `framer-motion`, `react-router-dom` v7, Leaflet/react-leaflet
  for maps, `sonner` for toasts.
- **Backend**: FastAPI + Motor (async MongoDB driver). Currently one real feature endpoint
  (`POST /api/wassim-chat`, an LLM chat proxy) plus CRA/FastAPI-template boilerplate
  (`/api/status`). LLM calls go through `emergentintegrations` (Emergent's proprietary wrapper) —
  this is slated for removal in Phase 1.
- **No frontend build-time secrets**: everything shipped to the browser is public. Premium
  entitlement is currently `localStorage`-based and client-side only (insecure — see Phase 2).

## Directory layout
```
frontend/
  src/
    App.js              # router — single source of truth for all routes
    pages/               # one file per route; ~21 files, see AUDIT.md §1 for the route map
    data/                # local "database": placesData.js, v3EnhancedData.js, v3CompleteData.js
                          # (completeData.js is DEAD CODE — nothing imports it, do not add to it)
    components/          # shared UI: Layout, BottomNav, MagicLinkActivator, BrandingFooter, ui/*
    utils/premiumManager.js   # client-side premium key validation (insecure by design today)
    contexts/            # LanguageContext (ar/fr/en), ThemeContext
    hooks/, lib/          # small helpers
  public/
    manifest.json, service-worker.js   # PWA config — see AUDIT.md §5 for gaps
  craco.config.js        # wires optional Emergent-editor dev plugins (frontend/plugins/), off by default
backend/
  server.py              # FastAPI app, all routes currently live in this one file
  requirements.txt        # includes emergentintegrations + google-generativeai/google-genai (Phase 1 target)
.emergent/, memory/, test_reports/, test_result.md   # Emergent platform leftovers — documented, not deleted
```

## Running locally

### Frontend
```bash
cd frontend
yarn install
yarn start          # craco start, dev server on :3000
yarn build           # craco build, production bundle
```
Requires `frontend/.env` (see `frontend/.env.example`) with at minimum `REACT_APP_BACKEND_URL`
pointing at the backend (e.g. `http://localhost:8000`).

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```
Requires `backend/.env` (see `backend/.env.example`). The process now **fails fast at startup**
if a required var is missing — this is intentional (see Phase 0 changes below), not a bug.

## Required environment variables
See `backend/.env.example` and `frontend/.env.example` for the full list with inline comments.
Summary:
- `backend/.env`: `MONGO_URL`, `DB_NAME`, `GEMINI_API_KEY` (or whatever provider key replaces
  `EMERGENT_LLM_KEY` post-Phase-1), `CORS_ORIGINS` (comma-separated, no wildcard in prod).
- `frontend/.env`: `REACT_APP_BACKEND_URL`.

Never commit a real `.env` file. Both `frontend/.gitignore` and the root `.gitignore` exclude
`.env`/`.env.*`; verify with `git status` before committing if you ever hand-edit one.

## Naming / code conventions already in use
- Trilingual content is always an object `{ ar, fr, en }`; components read it via `t(obj)` from
  `LanguageContext` or by indexing `obj[language]` directly with an `ar` fallback. Keep new
  content in this shape — do not introduce a 4th shape or a translation-key system without
  discussion.
- Pages are function components named `<Thing>Page`, default-exported, living directly in
  `src/pages/` (no subfolders per feature).
- `data-testid` attributes are used throughout interactive elements (buttons, inputs, modals) —
  keep adding them on new interactive UI; they're relied on by whatever testing setup Emergent's
  `testing_agent` used historically (see `test_result.md`) and are cheap to keep.
- Tailwind utility classes inline, no CSS modules; shared design tokens come from
  `design_guidelines.json` at the repo root and `tailwind.config.js`.
- Premium/paid features check `PremiumManager.isPremiumActive()` at the top of the component and
  render a paywall/lock UI inline rather than redirecting — follow this pattern for any new
  premium feature until Phase 2 moves entitlement server-side.

## Current priorities
See `PLAN.md` for the full checklist. Five phases, roughly in this order:

1. **Phase 0 — Secret cleanup and repo hygiene** (this PR: remove the hardcoded LLM key,
   add `.env.example` files, verify `.gitignore`, document what's still insecure).
2. **Phase 1 — Independence from Emergent**: replace `emergentintegrations` with a direct
   Gemini SDK call; host frontend + backend ourselves instead of Emergent's preview infra.
3. **Phase 2 — Server-side premium**: move key validation to the backend, one key per purchase,
   stored in MongoDB, device-bound, revocable. (Do not attempt piecemeal client-side patches to
   `premiumManager.js` before this phase — it needs a backend model change, not a bigger key list.)
4. **Phase 3 — Content completion**: port the full guidebook text into the data files, remove
   any remaining placeholder links, resolve the `completeData.js` vs `v3CompleteData.js` /
   `wassimProfile` vs `wassimAuthor` duplication noted in `AUDIT.md` §4/§6.
5. **Phase 4 — Google Play**: TWA via Bubblewrap, `assetlinks.json`, AAB build in GitHub Actions,
   closed testing track with 12 testers for 14 days.

## Known duplication / traps for future sessions
- **Three chatbot implementations exist**: `BotPage.js` (dead, unrouted), `DualBotPage.js`
  (routed at `/bot`, entirely client-side canned responses despite the "Super-Bot" branding),
  `WassimAIPage.js` (routed at `/wassim-ai`, the only one that calls the real LLM backend). Don't
  assume "the chatbot" means one specific file — check which route you're actually changing.
- **Two content data files claim to be canonical**: `v3CompleteData.js` (live) and
  `completeData.js` (dead, unimported, do not resurrect without deduplicating first).
- **Author bio exists twice** with slightly different formatting: `wassimProfile.bio` in
  `placesData.js` (actually rendered on `/about`) and `completeTexts.aboutWassim` /
  `wassimAuthor` in `v3CompleteData.js` (not rendered anywhere).
