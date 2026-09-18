# Travel Planner Annaba — Phase 0 Audit

Date: 2026-09-18. Scope: full repo, branch `claude/peaceful-archimedes-lwy0pq`.
This document is factual findings only, verified against the actual source (file:line
references throughout) — nothing here is inferred from the project's own marketing copy
(`memory/PRD.md`, `.emergent/summary.txt`) without independently checking the code.

This file is updated in place while Phase 0 is still open (the PR that introduces it). Once
Phase 0 merges, treat it as a snapshot of that state — re-audit rather than hand-editing it for
findings from later phases.

---

## 1. Architecture Overview

**Tech stack**: React 19 (CRA + `craco`) frontend, FastAPI + Motor (async MongoDB) backend,
MongoDB. No SSR, no separate API gateway — the FastAPI app is the entire backend surface.

**Routes**: `frontend/src/App.js` defines **20 routes** (including the index route). Every route
maps to one page component in `frontend/src/pages/`, which reads from one of 4 local JS "data"
modules in `frontend/src/data/` (`placesData.js`, `v3EnhancedData.js`, `v3CompleteData.js`, and
the dead `completeData.js`) or, in exactly one case, from the backend:

| Path | Page | Data source | Premium-gated? |
|---|---|---|---|
| `/` | `HomePage` | local (`placesData.js`) | Partial (some CTAs check premium) |
| `/explore` | `ExplorePage` | local | No |
| `/plans` | `PlansPage` | local | No |
| `/sos` | `SOSPage` | local | No |
| `/place/:id` | `PlaceDetailPage` | local | No |
| `/map` | `MapPage` | local | No |
| `/transport-calculator` | `TransportCalculatorPage` | local | No |
| `/plan/:id` | `PlanDetailPage` | local | No |
| `/about` | `AboutPage` | local | No |
| `/stories` | `StoriesPage` | LocalStorage (user-generated mock feed) | No |
| `/shop` | `ShopPage` | local + `PremiumManager` (LocalStorage) | This *is* the paywall page |
| `/bot` | `DualBotPage` | local, **no backend call** — hardcoded keyword-matched responses | Yes (client-side check) |
| `/food-roulette` | `FoodRoulettePage` | local | No |
| `/passport` | `BonePassportPage` | local + LocalStorage check-ins | No |
| `/instagram` | `InstagramExplorerPage` | hardcoded hashtag list | No |
| `/scan-and-go` | `ScanAndGoPage` | local (`v3CompleteData.js`) | No |
| `/services` | `ServicesPage` | local | No |
| `/history` | `HistoryPage` | local (`v3CompleteData.js`) | No |
| `/introduction` | `IntroductionPage` | local (`v3CompleteData.js`) | No |
| `/wassim-ai` | `WassimAIPage` | **Real backend call**: `POST {REACT_APP_BACKEND_URL}/api/wassim-chat` | Yes (full-screen paywall) |

Note: the brief's file-reading list mentions 22 routes; the router as it currently exists in
`App.js` defines 20. No 21st/22nd route exists in the file.

**Deployment, current state**: the app runs inside Emergent's platform today —
`frontend/public/index.html:25` loads `https://assets.emergent.sh/scripts/emergent-main.js`
unconditionally, and `memory/PRD.md:150-152` records the live preview URL as
`https://visit-annaba.preview.emergentagent.com`. There is no independent hosting configured yet
(no Vercel/Render config files, no Dockerfile, no CI deploy workflow found anywhere in the repo).
Target hosting for Phase 1 is Vercel (frontend) + Render (backend) + MongoDB Atlas — see
`CLAUDE.md` "Key Decisions".

**PWA readiness**: `manifest.json` has the TWA-critical fields (icons, `display: standalone`,
`start_url`, theme colors) but several gaps that will block a clean Play Store submission —
see §5.

---

## 2. Security Issues Found

### Hardcoded secrets (fixed in this PR)

**`backend/server.py:19`** — `EMERGENT_LLM_KEY = "sk-emergent-54eA94c54C05e8e7fD"`, committed in
plaintext, used directly at `server.py:181` (`LlmChat(api_key=EMERGENT_LLM_KEY, ...)`).
**Fix applied**: now read from `os.environ`, no fallback; the process raises `RuntimeError` and
refuses to start if unset. **This key still needs to be rotated on the provider side** — Phase 0
does not rewrite git history, so the old value is still visible in past commits.

**`frontend/src/utils/premiumManager.js`** — previously hardcoded:
```js
const MAGIC_LINK_CODE = 'ANNABA-VIP-23-W';                       // line 10 (before this PR)
const VALID_PREMIUM_KEYS = [ 'ANNABA2025ULTIMATE', 'WASSIM500KEY',
  'BONETRAVEL2025', 'WSPR0SH0P', 'ANNABA6MONTHS', 'ANNABA-VIP-23-W' ]; // lines 13-20
```
**Fix applied**: both now read from `REACT_APP_MAGIC_LINK_CODE` / `REACT_APP_VALID_PREMIUM_KEYS`
build-time env vars, with a `console.warn` if unset (activation then rejects every key rather
than crashing the app).

**⚠️ Read this before treating the above as "fixed" in the security sense.** This is a Create
React App project. Every `REACT_APP_*` variable is inlined into the static JS bundle at
`yarn build` time — it is not a runtime secret, it is a compile-time text substitution. Verified
directly: before this change, `grep` on the built bundle found `ANNABA2025ULTIMATE` and the RIP
in plaintext; after moving them to env vars (with none set in this sandbox), those specific
strings no longer appear — but if `REACT_APP_VALID_PREMIUM_KEYS` is set to real values at deploy
time (which it must be, for the feature to work at all), **the built bundle will contain them in
plaintext again**, exactly as before, just sourced from a `.env` file at build time instead of
from git. The only things this change actually buys: (1) the values are no longer in git source
history going forward, so rotating a key means changing a deploy-time env var and rebuilding,
not editing and re-reviewing code; (2) different environments (staging/prod) can use different
keys. **It does not stop a user from extracting the keys from the shipped app.** The only real
fix is server-side validation (Phase 2 — see `PLAN.md`). Do not describe this env-var move as
"the premium keys are now secure" to anyone; it is a source-hygiene change only.

**`frontend/src/utils/premiumManager.js` — `getPaymentInfo().rip`** — previously hardcoded
`'00799999002810927704'` (a real BaridiMob bank account number), also duplicated at
`frontend/src/data/v3CompleteData.js:143` and `frontend/src/data/completeData.js:216` (the
latter file is dead code, see §6, but still present in the repo). **Fix applied** in
`premiumManager.js` only: now reads `REACT_APP_PAYMENT_RIP`. **Not fixed** in
`v3CompleteData.js`/`completeData.js` — those two still have it hardcoded (out of scope for this
pass; `v3CompleteData.js`'s copy isn't imported by any premium/payment code path, and
`completeData.js` is unimported entirely). Same caveat as above applies even where fixed: the RIP
has to be displayed in the UI for buyers to pay it, so this was never a confidentiality problem —
moving it to an env var is purely so it isn't hardcoded in source.

### Other issues found

| # | File:Line | Finding |
|---|---|---|
| 1 | `backend/server.py:230` | `CORSMiddleware` falls back to `allow_origins='*'` if `CORS_ORIGINS` is unset, combined with `allow_credentials=True`. Overly permissive default for a prod deployment. Not changed in Phase 0 (needs an explicit origin list at deploy time); tracked for Phase 1. |
| 2 | `backend/server.py:143-165` | `POST /api/status` / `GET /api/status` have no auth and write arbitrary `client_name` strings straight to MongoDB. Unauthenticated write endpoint, live today. Unused by the frontend (CRA/FastAPI template boilerplate) but still reachable. |
| 3 | `backend/server.py:168-222` | `POST /api/wassim-chat` (the real LLM endpoint) has no auth or entitlement check at all — any client can call it directly and consume LLM quota regardless of premium status. The frontend paywall on `/wassim-ai` is enforced only by the page not rendering the chat UI; the API itself doesn't care. This is the actual security-relevant gap the premium system has — tracked for Phase 2 (needs to be fixed alongside, not separately from, server-side key validation). |
| 4 | `frontend/public/index.html:113` | PostHog project key `phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs` with `session_recording` enabled — records real user sessions, no visible consent UI anywhere in the app. PostHog project keys are meant to be public, so this is not a leaked credential, but it is undisclosed session recording. |
| 5 | `frontend/src/pages/ShopPage.js:50`, `frontend/src/pages/HomePage.js:426` | The paid PDF's Google Drive link is a public share URL with no access control beyond Drive's own sharing settings, and it ships in the same JS bundle non-premium users load — visible to anyone who reads the bundle, not just to users who've unlocked premium in the UI. |
| 6 | `frontend/src/pages/ShopPage.js:380` | Stale UI placeholder text: `placeholder="ANNABA2025ULTIMATE"` on the key-entry input. That string is no longer a valid key after this PR's fix, but the placeholder still implies it is. Cosmetic, not a security issue post-fix; not changed here because the original brief excludes `ShopPage.js` edits from this PR. |

### Missing `.env` files for local development
Confirmed via `find . -name "*.env*"` (excluding `node_modules`): **no `.env` file exists
anywhere in the working tree**, and `git ls-files | grep -i '\.env'` confirms none is or ever was
tracked. This is correct (nothing to leak) but meant the project had no documented way to run
locally — `backend/.env.example` and `frontend/.env.example` (added in this PR) fix that.
`.gitignore` was verified with `git check-ignore -v` against `backend/.env`, `frontend/.env`,
`.env.local`, `.env.production.local` — all correctly ignored at every depth (root `.gitignore`
patterns `.env`, `.env.*`, `*.env` apply repo-wide regardless of directory). One bug found and
fixed: the `.env.*` pattern also blocked `.env.example` files from ever being committed; added
`!.env.example` / `!*.env.example` negations so the new example files can actually be tracked.

---

## 3. Premium System Current State

**How it currently works**: `PremiumManager` (`frontend/src/utils/premiumManager.js`) is a pure
client-side module. `activatePremiumKey(key)` upper-cases/trims the input and checks membership
in `VALID_PREMIUM_KEYS`; `activateMagicLink(code)` checks equality against `MAGIC_LINK_CODE`
(reachable via `/?activate=CODE`, handled by `MagicLinkActivator.js` on every route). Either path,
on success, writes `{ lifetime: true, ... }` to `localStorage['annaba_premium_v3_access']`. Every
premium-gated component (`ShopPage.js`, `DualBotPage.js`, `WassimAIPage.js`, parts of
`HomePage.js`) calls `PremiumManager.isPremiumActive()`, which just checks that localStorage key.
Payment itself is fully manual and out-of-band: the app displays a BaridiMob RIP, the buyer wires
money and sends a WhatsApp screenshot to Wassim personally, and Wassim manually replies with one
of the hardcoded keys once he's confirmed payment.

**Why it's broken**:
- Entitlement is a client-side boolean with no backend of record. Any user can open devtools and
  run `localStorage.setItem('annaba_premium_v3_access', JSON.stringify({lifetime:true}))` to
  unlock every premium feature for free — no key, no payment, no contact with Wassim required.
- The valid-key list ships in the public bundle by construction (§2) — even without the
  localStorage shortcut, the keys themselves are extractable.
- One key can be shared/resold/posted publicly and reused by unlimited people; there's no
  per-purchase uniqueness, no device binding, and no revocation mechanism.
- The one backend endpoint premium is supposed to gate (`/api/wassim-chat`) doesn't itself check
  entitlement (§2, item 3) — so even a "fixed" frontend key system wouldn't stop unauthorized use
  of the LLM backend by someone who calls the API directly.

**What needs to change (Phase 2, not this PR)**: move validation server-side. A backend endpoint
(e.g. `POST /api/validate-premium`) checks a key against MongoDB, where each document represents
one sold key (buyer contact, issued/activated timestamps, a device-binding identifier, a
`revoked` flag). The frontend calls this endpoint instead of checking a local array, and stores
whatever token the backend returns instead of a raw boolean. `/api/wassim-chat` itself needs to
require that token. Full checklist in `PLAN.md` Phase 2.

---

## 4. Emergent Dependencies

**`emergentintegrations` imports** (all in `backend/server.py`):
- `server.py:12` — `from emergentintegrations.llm.chat import LlmChat, UserMessage`
- `server.py:180-184` — `LlmChat(api_key=EMERGENT_LLM_KEY, session_id=session_id, system_message=WASSIM_SYSTEM_PROMPT).with_model("gemini", "gemini-2.0-flash")`
- `server.py:197-198` — `UserMessage(text=message_text)`, `chat.send_message(user_message)`
- `backend/requirements.txt:27` — `emergentintegrations==0.1.0`

No frontend code imports `emergentintegrations` or any Emergent Python/JS SDK — the frontend's
only Emergent coupling is the script tags in `index.html` and the build-time Craco plugins
below, not a dependency import.

**`.emergent/` files**:
- `.emergent/emergent.yml` — job metadata (`env_image_name`, `job_id`, `created_at`); describes
  the container image Emergent built this project in. Not read by the app at runtime.
- `.emergent/summary.txt` — a natural-language summary of past Emergent agent sessions
  (what was built, what was pending). Historical context only.
- `.emergent/markers/.restore-complete` — an empty marker file Emergent's tooling uses internally.

**Related non-`.emergent/` Emergent leftovers**: `memory/PRD.md` (Emergent-session-authored
product doc, describes features and "V3.1.0" changelog), `test_result.md` (a YAML-protocol
scaffold for Emergent's own `testing_agent`, not a real test suite), `test_reports/*.json`
(output from that same tooling).

**Build process coupling**:
- `frontend/craco.config.js:16-33` conditionally requires `frontend/plugins/visual-edits/*`
  (only when `NODE_ENV !== 'production'`, i.e. never in `craco build`) and
  `frontend/plugins/health-check/*` (only when `ENABLE_HEALTH_CHECK=true`, opt-in). Neither runs
  in a normal production build today.
- `frontend/plugins/visual-edits/dev-server-setup.js` and `babel-metadata-plugin.js` — wire up
  Emergent's live in-browser visual editor (tags JSX with metadata, sets up a dev-server hook).
- `frontend/plugins/health-check/webpack-health-plugin.js` and `health-endpoints.js` — expose a
  health-check endpoint Emergent's orchestrator can poll.
- `frontend/public/index.html:25` — `<script src="https://assets.emergent.sh/scripts/emergent-main.js">`, loaded unconditionally on every page view, in every environment, including production.
- `frontend/public/index.html:29-40` — loads `debug-monitor.js` and the Tailwind CDN build, but
  only when `window.self !== window.top` (i.e. only when iframed inside Emergent's own editor
  preview) — harmless outside that context.

None of this is removed in Phase 0 per the brief's explicit scope (Phase 1 work); documented here
so Phase 1 has an exact removal list.

---

## 5. Content & PWA Status

**Guidebook completeness**: there is no source PDF or page-count reference file anywhere in this
repository, so a page-by-page count against "56 pages" cannot be verified from the codebase alone
— that figure isn't something this audit can confirm or deny without the source document. What
*can* be verified is which content sections exist as data and whether they're actually wired to a
page:

| Section | In data? | Rendered? |
|---|---|---|
| `completeTexts.introduction` (`v3CompleteData.js:9-54`) | ✅ full trilingual text | ✅ `/introduction` |
| `completeTexts.history` (`v3CompleteData.js:56-74`) | ✅ full trilingual text | ✅ `/history` |
| `completeTexts.aboutWassim` (`v3CompleteData.js:76-94`) | ✅ full trilingual text | ❌ not imported by any page — `AboutPage.js` instead renders a separately-maintained, near-duplicate `wassimProfile.bio` from `placesData.js:910-912` |
| `completeTexts.finalWord` (`v3CompleteData.js:96-119`) | ✅ full trilingual text | ❌ not imported anywhere — dead content |
| Hotels/guest houses/agencies/clubs (`v3EnhancedData.js`) | ✅ 8 hotels, 3 guest houses, 4 agencies, 4 clubs, trilingual | ✅ various pages |
| Beaches/restaurants/cafes/etc. (`placesData.js`) | ✅ 70 `id:` entries across all categories | ✅ various pages |

No Lorem-ipsum or `TODO`-style placeholder text was found in any data file via a repo-wide grep.

**Instagram links — current status**: all verified **real, not placeholder**. Author account
`https://www.instagram.com/ws_pro_shop` (`v3CompleteData.js:141`); four specific post links under
`scanAndGoLinks` (`v3CompleteData.js:154-190`, e.g. `instagram.com/p/DOVolVGiovv/`); the hashtag
explorer builds real URLs at runtime (`InstagramExplorerPage.js:89`,
`instagram.com/explore/tags/{hashtag}/`). A repo-wide grep for placeholder patterns
(`your_account`, `your-account`, `example.com`, `change_?me`, etc.) found **zero matches** in any
`.js` file — if a placeholder Instagram link ever existed in this codebase, it isn't there now.

**Service worker implementation** (`frontend/public/service-worker.js`):
- Registered twice, independently: `index.html:141-151` registers it directly on `window load`,
  and the standard CRA `serviceWorkerRegistration.js` also handles registration — redundant, not
  broken, but worth consolidating.
- `OFFLINE_URL = '/offline.html'` (`service-worker.js:2`) is referenced as the fetch-failure
  fallback, but **no `offline.html` file exists** in `frontend/public/` and it's not in the
  install-time precache list either — the offline fallback is currently non-functional.
- The install-time cache (`service-worker.js:8`) only precaches 4 static files (`/`,
  `/index.html`, `/manifest.json`, `/logo192.png`) — the actual built JS/CSS app shell is not
  precached, so a fully offline first load will not render despite the app's "offline-first"
  framing in `memory/PRD.md`.
- Push/Background Sync/Periodic Sync listeners (`service-worker.js:28-50`) are explicitly labeled
  in a comment as existing "to satisfy PWABuilder scanners" — stub handlers, no real
  push/sync backend behind them.

**Manifest completeness for Google Play** (`frontend/public/manifest.json`):
- ✅ Present: `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`,
  `background_color`, icons at 192/512 with both `any` and `maskable` purpose, `screenshots` for
  both form factors.
- ⚠️ The `maskable` icon entries reuse the exact same unpadded PNG as the `any` entries
  (`manifest.json:16-19`) — a true maskable icon needs safe-zone padding; Android will likely crop
  this one when applying its mask.
- ❌ `shortcuts` (`manifest.json:26-29`) references `/hotels`, which **does not exist** as a route
  in `App.js` — this shortcut will 404 if used.
- ❌ No `assetlinks.json` under `frontend/public/.well-known/` (directory doesn't exist) —
  required for TWA Digital Asset Links verification; expected to be added in Phase 4.
- No Bubblewrap config, Android project scaffold, or `.github/workflows/` directory exists yet —
  expected, since that's Phase 4 scope.

---

## 6. Dead Code & Technical Debt

**Three generations of the same chatbot exist:**
- `frontend/src/pages/BotPage.js` — **not routed anywhere**, confirmed by grep (no import outside
  its own file, no `<Route>` in `App.js`). Oldest generation: single free-form keyword bot, no
  premium concept.
- `frontend/src/pages/DualBotPage.js` — **live**, routed at `/bot` (`App.js:22,61`). Renders
  either a "Free Bot" or a "Wassim Super-Bot" persona based on
  `PremiumManager.isPremiumActive()`, but **both are entirely hardcoded keyword-matched
  responses** — no backend call despite the "Super-Bot" branding.
- `frontend/src/pages/WassimAIPage.js` — **live**, routed at `/wassim-ai` (`App.js:30,69`). The
  only one of the three that calls the real backend (`/api/wassim-chat`) which in turn calls
  Gemini. Has its own separate full-screen paywall UI.
- **Net effect**: two live, separately-routed chat surfaces both claim to be "Wassim" and both
  gate on the same premium flag, but only one is a real AI. This is confusing product surface on
  top of the dead file, not just a code-cleanliness issue.

**Dead data file**: `frontend/src/data/completeData.js` — zero importers anywhere in
`frontend/src` (confirmed by grep). A complete, older, parallel copy of `completeTexts` /
`scanAndGoLinks` / `wassimAuthor`, with a *different* WhatsApp URL format and Instagram URLs that
carry `utm_source` tracking params its live counterpart doesn't. Still contains the hardcoded RIP
and phone number (§2). Superseded by `v3CompleteData.js`; not deleted in this PR per the brief's
"don't touch content/routing" constraint, but flagged for Phase 3 cleanup.

**Dead exports in a live file**: `completeTexts.finalWord` and the `wassimAuthor` object in
`v3CompleteData.js` — the file itself is imported, but grep confirms these two specific exports
have no importers anywhere in the codebase.

**Likely-unused image assets**: `frontend/public/screenshot1.png`, `screenshot2.png` (manifest
references `screenshot_mobile.png`/`screenshot_desktop.png` instead), and
`frontend/public/desktop-shot.png`, `mobile-shot.png` (not referenced by `manifest.json`,
`index.html`, or any `.js` file found by grep) — possibly stale marketing assets.

**Redundant requirements file**: `backend/requirements_google.txt` duplicates a subset of what's
already declared in `backend/requirements.txt:28-29` (`google-generativeai`, `google-genai`,
etc.) and isn't referenced by any install command, CI config, or Dockerfile in the repo. Left
alone in Phase 0 (no dependency changes per constraints); likely becomes the actual dependency
list once `emergentintegrations` is dropped in Phase 1.

**Unauthenticated, unused backend endpoints**: `/api/status` (`server.py:143-165`) — CRA/FastAPI
template boilerplate, no auth, no frontend caller found.

**Test coverage**: none. `test_result.md` and `test_reports/*.json` are artifacts of Emergent's
own agent-driven manual/scripted testing protocol, not an automated test suite; no `pytest`/
`jest` test files exist anywhere in `frontend/src` or `backend/` despite both `pytest` (backend)
and CRA's default `jest` setup (frontend, via `craco test`) being available in the toolchain.

---

## Files read for this audit
`frontend/src/App.js`, all ~21 files in `frontend/src/pages/`, all 4 files in
`frontend/src/data/`, `frontend/src/utils/premiumManager.js`, `frontend/src/components/
MagicLinkActivator.js`, `frontend/public/manifest.json`, `frontend/public/service-worker.js`,
`frontend/public/index.html`, `frontend/package.json`, `frontend/craco.config.js`,
`frontend/plugins/**`, both `.gitignore` files, `backend/server.py`,
`backend/requirements.txt`, `backend/requirements_google.txt`, `.emergent/summary.txt`,
`.emergent/emergent.yml`, `memory/PRD.md`, `test_result.md`.
