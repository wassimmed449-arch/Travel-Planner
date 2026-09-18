# Travel Planner Annaba — Project Memory

## What this is
A trilingual (Arabic/French/English) travel-guide PWA for Annaba, Algeria, adapted from a
guidebook written by Benfernane Mohamed Ouassim ("Wassim"). Originally built on the Emergent
AI platform and exported to this repo. Long-term goal: cut ties with Emergent, make the paid
premium tier actually secure, finish porting the guidebook content, and ship to Google Play as
a Trusted Web Activity (TWA).

Full findings from the initial audit are in `AUDIT.md`. It's updated in place while Phase 0 is
still open; once that PR merges, treat it as a snapshot of that state and re-audit for anything
from later phases rather than hand-editing old findings. The active roadmap is `PLAN.md`.

## Key decisions made
- **LLM provider**: Google Gemini API, chosen for cost, quota headroom, and having a fallback
  response system already built (`backend/server.py`'s `FALLBACK_RESPONSES`/
  `get_fallback_response` kick in on quota/budget errors). Direct SDK integration
  (`google-generativeai`/`google-genai`) replaces `emergentintegrations` in Phase 1.
- **Hosting**: Vercel (frontend static build) + Render (backend FastAPI) + MongoDB Atlas.
  Free-tier limits to plan around: Gemini ~1M tokens/day, MongoDB Atlas 512MB, Vercel 100GB
  bandwidth/month.
- **Premium model**: per-device activation keys, validated server-side (Phase 2), one key per
  purchase. No payment gateway integration yet — purchases stay manual (BaridiMob transfer +
  WhatsApp receipt + Wassim manually issuing a key) until Stripe is added, also in Phase 2.
- **Language support**: Arabic (Annaba Darja dialect specifically, not generic MSA/Algerian),
  French, English — see the "Naming / code conventions" section below for how this is encoded in
  data.

## Security constraints (apply from Phase 0 onward)
- No new hardcoded keys/tokens in source, client or server side.
- All secrets in environment variables, documented in `backend/.env.example` /
  `frontend/.env.example`, never committed as real `.env` files.
- `.gitignore` must keep blocking `.env`, `.env.local`, `.env.*.local` at every directory depth
  (verified working as of Phase 0 — see `AUDIT.md` §2).
- **Frontend caveat that matters for every future secret decision**: this is a Create React App
  project. Any `REACT_APP_*` env var is compiled into the public JS bundle at `yarn build` time —
  it is not a runtime secret, it's a text substitution. Moving a value out of hardcoded source and
  into a `REACT_APP_*` env var is a source-hygiene improvement (not committed to git, rotatable by
  redeploying), never a confidentiality fix. Anything that must actually stay secret from the end
  user (real API keys, anything granting write access, etc.) has to live server-side and be
  fetched through an authenticated backend call — never shipped to the frontend at all, under any
  variable name. The premium keys and the payment RIP are `REACT_APP_*` env vars today for exactly
  this reason-limited benefit; see `AUDIT.md` §2 for the full explanation before assuming that
  move "fixed" anything security-wise.

## Known limitations
- Gemini free tier: ~1M tokens/day — the existing `FALLBACK_RESPONSES` keyword-matched replies in
  `backend/server.py` exist specifically to degrade gracefully when this is hit, keep them working
  through the Phase 1 SDK swap.
- MongoDB Atlas free tier: 512MB storage cap — relevant once Phase 2 starts writing one document
  per premium key purchase.
- Vercel free tier: 100GB bandwidth/month.
- Google Play: closed testing requires 12 testers for a minimum 14 days before a production
  release can be submitted — factor this timeline into any Phase 4 launch planning.
- No payment gateway integration exists yet; all premium purchases are manual until Stripe lands
  in Phase 2.

## Stack
- **Frontend**: React 19 + CRA, built/served via `craco` (see `frontend/craco.config.js`).
  Tailwind CSS, Radix UI primitives, `framer-motion`, `react-router-dom` v7, Leaflet/react-leaflet
  for maps, `sonner` for toasts.
- **Backend**: FastAPI + Motor (async MongoDB driver). Currently one real feature endpoint
  (`POST /api/wassim-chat`, an LLM chat proxy) plus CRA/FastAPI-template boilerplate
  (`/api/status`). LLM calls go through `emergentintegrations` (Emergent's proprietary wrapper) —
  this is slated for removal in Phase 1.
- **No frontend build-time secrets**: everything shipped to the browser is public, including
  every `REACT_APP_*` env var (see "Security constraints" below). Premium entitlement is
  currently `localStorage`-based and client-side only (insecure — see Phase 2).

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
- `backend/.env`: `MONGO_URL`, `DB_NAME`, `EMERGENT_LLM_KEY` (renamed to a direct
  `GEMINI_API_KEY` post-Phase-1), `CORS_ORIGINS` (comma-separated, no wildcard in prod).
- `frontend/.env`: `REACT_APP_BACKEND_URL`, `REACT_APP_MAGIC_LINK_CODE`,
  `REACT_APP_VALID_PREMIUM_KEYS` (comma-separated), `REACT_APP_PAYMENT_RIP`. Remember: these last
  three are still fully public in the built bundle (see "Security constraints" above) — without
  them set, `PremiumManager` just warns and rejects every activation attempt; the rest of the app
  still works.

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
