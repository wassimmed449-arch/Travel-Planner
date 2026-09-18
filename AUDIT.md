# Travel Planner Annaba — Codebase Audit

Date: 2026-09-18
Scope: full repo as of commit `f8968c6` on `main`/`claude/peaceful-archimedes-lwy0pq`.
This document is factual findings only. No fixes are proposed here; see `PLAN.md` for remediation phases.

---

## 1. Architecture Map

`frontend/src/App.js` defines the router. It registers **20 routes** (not 22 — see note below), all under a single `<Layout />` shell:

| Path | Page Component | Data source | Premium-gated? |
|---|---|---|---|
| `/` | `HomePage` | `placesData.js` (local) | Partially (some CTAs check `PremiumManager`) |
| `/explore` | `ExplorePage` | `placesData.js` (local) | No |
| `/plans` | `PlansPage` | `placesData.js` (local, `itineraries`) | No |
| `/sos` | `SOSPage` | `placesData.js` (local, `emergencyContacts`) | No |
| `/place/:id` | `PlaceDetailPage` | `placesData.js` (local, `allPlaces`) | No |
| `/map` | `MapPage` | `placesData.js` + `v3EnhancedData.js` (local) | No |
| `/transport-calculator` | `TransportCalculatorPage` | `placesData.js` (local, `transportInfo`) | No |
| `/plan/:id` | `PlanDetailPage` | `placesData.js` (local) | No |
| `/about` | `AboutPage` | `placesData.js` (local, `wassimProfile`) | No |
| `/stories` | `StoriesPage` | LocalStorage only (user-generated mock feed) | No |
| `/shop` | `ShopPage` | `v3EnhancedData.js` (local) + `PremiumManager` (LocalStorage) | This *is* the paywall/purchase page |
| `/bot` | `DualBotPage` | `placesData.js` + `v3EnhancedData.js` (local); **no backend call** — "Wassim Super-Bot" responses are hardcoded JS keyword-matching, gated by `PremiumManager.isPremiumActive()` | Yes (client-side check only) |
| `/food-roulette` | `FoodRoulettePage` | `placesData.js` (local) | No |
| `/passport` | `BonePassportPage` | `placesData.js` (local) + LocalStorage check-ins | No |
| `/instagram` | `InstagramExplorerPage` | Hardcoded hashtag list, opens `instagram.com/explore/tags/...` | No |
| `/scan-and-go` | `ScanAndGoPage` | `v3CompleteData.js` (`scanAndGoLinks`, local) | No |
| `/services` | `ServicesPage` | `v3EnhancedData.js` (local, agencies/clubs) | No |
| `/history` | `HistoryPage` | `v3CompleteData.js` (`completeTexts.history`, local) | No |
| `/introduction` | `IntroductionPage` | `v3CompleteData.js` (`completeTexts.introduction`, local) | No |
| `/wassim-ai` | `WassimAIPage` | **Real backend call**: `POST {REACT_APP_BACKEND_URL}/api/wassim-chat` → FastAPI → `emergentintegrations` → Gemini | Yes (client-side check; full-screen paywall if `!isPremium`) |

**Note on route count**: the task brief says "all 22 routes"; `App.js` currently defines 20 (`<Route>` elements, index route included). There is no 21st/22nd route in the file as it stands.

**Backend surface** (`backend/server.py`) exposes exactly 3 endpoints under `/api`:
- `GET /api/` — health/hello.
- `POST /api/status`, `GET /api/status` — a generic status-check CRUD against MongoDB (`status_checks` collection), unused by any frontend page found by grep.
- `POST /api/wassim-chat` — the only endpoint actually consumed by the frontend (`WassimAIPage.js`).

**Premium gating is entirely client-side.** `PremiumManager` (`frontend/src/utils/premiumManager.js`) reads/writes `localStorage['annaba_premium_v3_access']`. No backend call ever validates a key or a device. Any user can open devtools and run `localStorage.setItem('annaba_premium_v3_access', JSON.stringify({lifetime:true}))` to unlock everything for free, including the AI chat backend call (the backend endpoint itself has no auth/entitlement check either — `wassim_chat` in `server.py` accepts any `ChatRequest` from anyone).

---

## 2. Emergent Platform Coupling

| File / Item | Coupling | What removal requires |
|---|---|---|
| `backend/requirements.txt:27` — `emergentintegrations==0.1.0` | Backend LLM client wrapper is Emergent's proprietary package, not a standard provider SDK. | Replace `LlmChat`/`UserMessage` usage in `server.py:12,180-198` with the official `google-generativeai`/`google-genai` SDK (already also listed as deps, `requirements.txt:28-29`) or another provider SDK, using a customer-owned API key. |
| `backend/server.py:19` — `EMERGENT_LLM_KEY = "sk-emergent-54eA94c54C05e8e7fD"` | Hardcoded key issued by Emergent's LLM gateway (their quota-managed proxy), not a direct Google key. | Must be replaced by a real Gemini API key once `emergentintegrations` is dropped (Phase 1). |
| `frontend/public/index.html:25` — `<script src="https://assets.emergent.sh/scripts/emergent-main.js">` | Loads an Emergent-hosted script unconditionally in every page load (`<head>`, outside any dev-only guard). | Remove the `<script>` tag; confirm nothing in the app relies on globals it injects (none found via grep). |
| `frontend/public/index.html:29-40` — debug-monitor / Tailwind CDN loader, gated by `window.self !== window.top` (iframe detection) | Emergent's "Visual Edits" live-preview harness: injects `debug-monitor.js` and the Tailwind CDN build when the app is iframed (i.e., inside the Emergent editor preview). | Safe to delete once the project is no longer edited inside Emergent's UI; currently harmless outside an iframe context but is dead weight in every shipped build. |
| `frontend/craco.config.js:16-33` + `frontend/plugins/visual-edits/*`, `frontend/plugins/health-check/*` | Custom Craco/webpack plugins built for the Emergent editor: `dev-server-setup.js`, `babel-metadata-plugin.js` (tags JSX with metadata for the visual editor), `webpack-health-plugin.js` + `health-endpoints.js` (health check endpoint consumed by Emergent's orchestrator). Gated by env vars `ENABLE_HEALTH_CHECK` / dev-server-only, so they do not run in a `craco build` production bundle. | Delete `frontend/plugins/` and the conditional wiring in `craco.config.js` once Emergent-hosted preview/edit is no longer used. Low risk — already opt-in via env vars. |
| `.emergent/` directory (`emergent.yml`, `summary.txt`, `markers/.restore-complete`) | Emergent job metadata / agent session state, not consumed by the app at runtime. | Pure documentation/history; safe to delete any time (not deleted per Task 3 instructions). |
| `memory/PRD.md`, `test_result.md`, `test_reports/*.json` | Emergent's own agent-memory and testing-protocol scaffolding (`test_result.md` contains a YAML protocol block for Emergent's "testing_agent"). Not imported by any app code. | Same as above — historical artifacts only. |
| `REACT_APP_BACKEND_URL` (`frontend/src/pages/WassimAIPage.js:49`) | Not Emergent-specific by itself (a normal CRA env var), but Emergent's platform convention is to auto-inject this pointing at their preview proxy domain (`*.preview.emergentagent.com`, see `memory/PRD.md:150-152`). | Needs to be set explicitly to the project's own backend URL once hosted independently; no code change required, only deployment config. |
| `frontend/public/index.html:75-140` — PostHog snippet, hardcoded project key `phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs`, `session_recording` enabled | Not Emergent's own script, but was added as part of the Emergent-built app; records user sessions (session replay) with no visible consent banner anywhere in the app. Project API keys for PostHog are designed to be public/client-side, so this is not a "secret" in the credential sense, but it is an undisclosed analytics/session-recording integration. | Decide whether to keep, and if kept, disclose it (privacy policy) — out of scope for Phase 0. |
| `backend/requirements.txt:3,4` — `boto3`, `requests-oauthlib` | Unused-looking dependencies (no AWS or OAuth code found anywhere in `backend/server.py`) that appear to be leftovers from Emergent's generic FastAPI/Mongo base image template rather than this project's own needs. | Verify unused, then drop from `requirements.txt` (not done in Phase 0 per "no dependency changes" constraint). |

---

## 3. Secrets & Security Findings

### Confirmed (as flagged by the task):

**a. `backend/server.py:19`**
```python
EMERGENT_LLM_KEY = "sk-emergent-54eA94c54C05e8e7fD"
```
Hardcoded LLM gateway key, committed to git history, used directly in `LlmChat(api_key=EMERGENT_LLM_KEY, ...)` at `server.py:181`. Confirmed live in the current file.

**b. `frontend/src/utils/premiumManager.js:10,13-20`**
```js
const MAGIC_LINK_CODE = 'ANNABA-VIP-23-W';
const VALID_PREMIUM_KEYS = [
  'ANNABA2025ULTIMATE', 'WASSIM500KEY', 'BONETRAVEL2025',
  'WSPR0SH0P', 'ANNABA6MONTHS', 'ANNABA-VIP-23-W',
];
```
All six valid activation keys — including every key ever sold — ship in the public JS bundle. Anyone can read them from the built `main.[hash].js` or from this source file and unlock premium for free without paying, without a key from Wassim, and without the backend even being aware. Confirmed live.

**c. `frontend/src/utils/premiumManager.js:275`**
```js
rip: '00799999002810927704',
```
Real BaridiMob bank account number (RIP), hardcoded in client code and also duplicated in `frontend/src/data/v3CompleteData.js:143` and `frontend/src/data/completeData.js:216` (the latter file is dead code — see §6 — but still shipped in the repo and would ship in the bundle if it were ever imported). Confirmed live.

### Additional findings from this audit:

| # | File:Line | Finding |
|---|---|---|
| d | `frontend/src/utils/premiumManager.js:276` | WhatsApp phone number `213552664037` (Wassim's personal number) hardcoded; also duplicated at `frontend/src/pages/ShopPage.js:55`, `frontend/src/pages/ScanAndGoPage.js:110`, `frontend/src/data/v3CompleteData.js:142`, `frontend/src/data/completeData.js:215`. Not a "credential" per se (WhatsApp click-to-chat numbers are meant to be public-facing for a support line), but it is personal contact info duplicated in 5 places — a single source of truth would reduce risk of drift/typos, not a Phase-0 security fix.
| e | `frontend/public/index.html:113` | PostHog project key `phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs` with `session_recording` enabled (records real user sessions, no consent UI found anywhere in the app). PostHog project keys are designed to be public, so this is not a credential leak, but it is an undisclosed tracking integration worth flagging.
| f | `frontend/src/pages/ShopPage.js:50`, `frontend/src/pages/HomePage.js:426` | Public Google Drive share link to the paid PDF guidebook is hardcoded and reachable by anyone regardless of premium status (the link itself carries no access control — Drive's own sharing settings are the only gate, and the URL is visible in the bundle to non-premium users too since it's in the same JS chunk).
| g | `backend/server.py:230` | `CORSMiddleware` default: `allow_origins=os.environ.get('CORS_ORIGINS', '*').split(',')` combined with `allow_credentials=True`. Wildcard CORS + credentials is a browser-rejected combination in practice, but the `'*'` fallback when `CORS_ORIGINS` is unset is overly permissive for a prod deployment. Not fixed in Phase 0 (out of the three call-outs), noting for Phase 1/2.
| h | `backend/server.py:143-165` | `/api/status` endpoints have no auth and accept arbitrary `client_name` strings written straight to MongoDB — an open write endpoint. Appears to be CRA/FastAPI template boilerplate (unused by the frontend), but is live and unauthenticated in the deployed API.
| i | No `.env` file exists anywhere in the working tree, and `git ls-files` confirms none is tracked. `backend/server.py:22-24` reads `os.environ['MONGO_URL']` and `os.environ['DB_NAME']` with **no defaults**, so the process already fails fast if these are missing — this is the correct pattern and is the one applied to `EMERGENT_LLM_KEY` in Phase 0 (Task 3).

### Grep sweep performed (repo-wide, excluding `node_modules`):
`sk-`, `AIza` (Google API key prefix), phone-number patterns (`213[0-9]{8,9}`), bank-account/RIP patterns, `drive.google.com`, hardcoded email addresses, `your_account`/`placeholder`/`TODO`/`lorem ipsum`/`example.com`/`change_?me` patterns, `instagram.com`. No API keys, tokens, or credentials beyond items (a)–(i) above were found in `frontend/src/data/*` or elsewhere.

---

## 4. Content Completeness

Source of truth for "full text" content is `frontend/src/data/v3CompleteData.js` (`completeTexts`), which **is** live and imported (via `v3EnhancedData.js`) by `HistoryPage.js` and `IntroductionPage.js`, and directly by `ScanAndGoPage.js`.

| Section | Status | Notes |
|---|---|---|
| `completeTexts.introduction` (AR/FR/EN) | ✅ Present, full text | Rendered on `/introduction`. |
| `completeTexts.history` (AR/FR/EN) | ✅ Present, full text | Rendered on `/history`. |
| `completeTexts.aboutWassim` (AR/FR/EN) | ⚠️ Present in data (`v3CompleteData.js:76-94`) but **never rendered anywhere**. `AboutPage.js` (`/about`) instead renders `wassimProfile.bio` from `placesData.js:910-912`, which duplicates (near-verbatim, single-paragraph, no line breaks) the same author bio — i.e., two copies of similar-but-not-identical text, and the more complete/formatted one (`v3CompleteData.js`) is orphaned. |
| `completeTexts.finalWord` (AR/FR/EN) | ❌ Present in data (`v3CompleteData.js:96-119`) but **not imported or rendered by any page** (confirmed via grep — no reference to `finalWord` outside its own export). Dead content. |
| `wassimAuthor` object (`v3CompleteData.js:125-150`) | ⚠️ Exported but grep shows zero importers — fully dead export (duplicate of data already in `wassimProfile`, `placesData.js:907-925`). |
| `hotelsComplete`, `guestHouses`, `tourismAgencies`, `recreationalClubs` (`v3EnhancedData.js`) | ✅ Present, populated (8 hotels, 3 guest houses, 4 agencies, 4 clubs), each with trilingual name/description fields — no placeholder text found in a manual read of the file. |
| `placesData.js` (beaches, restaurants, cafes, hotels, historicalSites, museums, naturalSites, activities, emergencyContacts, itineraries, transportInfo) | ✅ Populated — 70 `id:` occurrences across all categories; spot-checked, no Lorem-ipsum or placeholder strings found via repo-wide grep. |
| `scanAndGoLinks` (`v3CompleteData.js:154-191`) | ✅ All 6 links point to real, specific URLs (Instagram posts, a live Google Form, a live Google My Maps map) — no placeholder domains found. |
| WhatsApp / Instagram / Drive links across the app | ✅ All resolve to real handles/numbers (`ws_pro_shop`, `+213552664037`, a real Drive file ID) — **no** `your_account`-style placeholder was found anywhere in the repo (the task brief's example placeholder does not currently exist in this codebase; may have already been fixed in a prior pass, per `memory/PRD.md:72` "LINK FIXED" notes). |

**Duplication / drift risk, not "missing" content:** `frontend/src/data/completeData.js` is a complete, older, parallel copy of `completeTexts`/`scanAndGoLinks`/`wassimAuthor` (see §6, confirmed dead/unimported) with a *different* WhatsApp URL format and a slightly different Instagram tracking-parameter-laden URL set (`completeData.js:170-188` carry `?utm_source=ig_web_copy_link&igsh=...` query strings that `v3CompleteData.js`'s equivalents do not) — this is stale, unused, and a source of confusion for future edits, not a live content gap.

---

## 5. PWA / Play Store (TWA) Readiness

`frontend/public/manifest.json`:
- ✅ `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`, `icons` (192/512, `any` + `maskable` purpose) are all present — these are the TWA-critical fields.
- ✅ `screenshots` present for both `narrow` and `wide` form factors (helps Play Store rich install UI).
- ⚠️ Icon `purpose: "maskable"` reuses the exact same non-padded PNG as `purpose: "any"` (`manifest.json:16-19`) — a true maskable icon needs safe-zone padding (icon content within the inner ~80% of the canvas); reusing the same asset risks the icon being cropped when Android applies its mask.
- ⚠️ `id: "?source=pwa"` is an unusual value for the manifest `id` field (normally a URL/path scope identifier); should be validated against Bubblewrap's expectations before AAB build.
- ❌ No `assetlinks.json` anywhere in `frontend/public/.well-known/` (directory doesn't exist) — required for Digital Asset Links verification so the TWA opens without the browser UI chrome. This is expected to be added in Phase 4 per the plan, flagging its current absence.
- `shortcuts` reference `/hotels` (`manifest.json:27`) — **this route does not exist** in `App.js` (no `/hotels` route defined); the shortcut would 404.

`frontend/public/service-worker.js`:
- ✅ Registered from `frontend/src/serviceWorkerRegistration.js` and `frontend/public/index.html:141-151` (double-registration path — see below).
- ⚠️ **Registered twice, independently**: `index.html:141-151` calls `navigator.serviceWorker.register('/service-worker.js')` directly on `window load`, while `serviceWorkerRegistration.js` (a standard CRA `serviceWorkerRegistration.js`) also handles SW registration and is presumably invoked from `index.js`. Two independent registration code paths for the same SW file is redundant and can cause double-registration log noise/edge-case bugs; not a functional PWA blocker but worth flagging.
- ❌ `OFFLINE_URL = '/offline.html'` (`service-worker.js:2`) is referenced as a fetch-failure fallback, but **no `offline.html` file exists** in `frontend/public/`. Offline fallback navigation will fail (return nothing useful) since `caches.match(OFFLINE_URL)` will never resolve to a cached response — this was also never pre-cached in the `install` handler's `cache.addAll([...])` list (`service-worker.js:8`, which only lists `/`, `/index.html`, `/manifest.json`, `/logo192.png`).
- ⚠️ The cached asset list on install (`service-worker.js:8`) does not include the built JS/CSS bundle (hashed filenames from CRA build), meaning the "offline-first" caching this app claims (per `memory/PRD.md:7`, `.emergent/summary.txt:5`) is not actually implemented — only 4 static files are precached; the app shell (JS/CSS) is not, so a fully offline first-load will not render.
- Push, Background Sync and Periodic Sync event listeners (`service-worker.js:28-50`) are present but explicitly commented "to satisfy PWABuilder scanners" (`service-worker.js:25`) — i.e., stub handlers with no real backend push/sync integration behind them. Cosmetic for PWABuilder's Lighthouse-style checks, not functional features.

Other TWA-relevant gaps:
- ❌ No Bubblewrap config (`twa-manifest.json`) or Android project scaffold anywhere in the repo — expected, since Phase 4 is where this is planned.
- ❌ No GitHub Actions workflow directory (`.github/workflows/`) exists at all — needed for the planned AAB CI build in Phase 4.

---

## 6. Dead Code

| File | Status | Evidence |
|---|---|---|
| `frontend/src/pages/BotPage.js` | **Dead — not routed.** | Not imported anywhere except its own file; `App.js` has no route pointing to it. It is the oldest ("V1"/"V2") generation of the chatbot: single free-form keyword bot, no premium concept at all. |
| `frontend/src/pages/DualBotPage.js` | **Live — routed at `/bot`.** | Imported and routed in `App.js:22,61`. This is the "second generation": a single component that renders either a "Free Bot" or the premium "Wassim Super-Bot" persona based on `PremiumManager.isPremiumActive()`, both entirely client-side keyword-matched responses (no backend call at all, despite the name "Super-Bot"). |
| `frontend/src/pages/WassimAIPage.js` | **Live — routed at `/wassim-ai`.** | Imported and routed in `App.js:30,69`. This is the "third generation": the only chatbot that actually calls the backend (`/api/wassim-chat`) which in turn calls a real LLM (Gemini via `emergentintegrations`). Has its own separate full-screen paywall UI (distinct from `DualBotPage`'s inline lock message). |
| **Conclusion on the three bot generations** | The app currently ships **two live, separately-routed chat experiences** (`/bot` and `/wassim-ai`) that both claim to be "Wassim" and both gate on the same premium flag, but only one of them (`/wassim-ai`) is backed by a real AI model; the other (`/bot`) is a hardcoded response table pretending to be the same bot. `BotPage.js` (a third, earlier implementation) is unreachable dead code. This is confusing/duplicated product surface, not just a code-hygiene issue. |
| `frontend/src/data/completeData.js` | **Dead — zero importers.** | `grep -rln "completeData"` across `frontend/src` finds no file importing it (confirmed by direct search). Superseded by `v3CompleteData.js`. Still contains the same RIP/phone-number secrets (§3c/3d) and a divergent set of Instagram URLs (§4), so it is not harmless to leave in the tree even though it never ships in the bundle (unused exports are typically tree-shaken, but should be verified, not assumed).
| `completeTexts.finalWord` / `wassimAuthor` exports in `v3CompleteData.js` | **Dead content, live file.** | The file itself is imported, but these two specific exports have no importers anywhere (§4). |
| `frontend/public/screenshot1.png`, `screenshot2.png` | **Likely unused duplicates.** | `manifest.json` screenshots reference `screenshot_mobile.png`/`screenshot_desktop.png`; `screenshot1.png`/`screenshot2.png` are not referenced by `manifest.json`, `index.html`, or any `.js` file found by grep — appear to be superseded assets left in `public/`. |
| `frontend/public/desktop-shot.png`, `mobile-shot.png` | **Likely unused.** | Not referenced by `manifest.json` or any source file found by grep; possibly README/marketing assets, not app assets. |
| `backend/requirements_google.txt` | **Redundant listing.** | Its packages (`google-generativeai`, `google-genai`, etc.) are already declared in `backend/requirements.txt:28-29` (a subset) — this second file is not referenced by any install command, CI config, or Dockerfile found in the repo; appears to be a leftover scratch file from adding Google SDK support directly (relevant for the Phase 1 Emergent-removal work, since it already contains most of the direct-SDK dependencies needed). |
| `/api/status` endpoints (`backend/server.py:143-165`) | **Unused by frontend, but live and unauthenticated (see §3h).** | CRA/FastAPI template boilerplate; no frontend page calls `/api/status`. |

---

## Summary of File Counts Read for This Audit
Routes: `App.js` (20 routes). Pages read in full or in relevant part: all 21 files under `frontend/src/pages/`. Data: all 4 files under `frontend/src/data/`. Config: `manifest.json`, `service-worker.js`, `package.json`, `craco.config.js`, `index.html`, both `.gitignore` files. Backend: `server.py`, `requirements.txt`, `requirements_google.txt`. Emergent leftovers: `.emergent/summary.txt`, `.emergent/emergent.yml`, `memory/PRD.md`, `test_result.md`.
