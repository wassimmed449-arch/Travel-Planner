# Travel Planner Annaba — Roadmap

Five phases, tracked here as a checklist. Update this file's checkboxes as work lands; keep
`AUDIT.md` as the audit record and `CLAUDE.md` as living project memory.

## Phase 0: Audit and Cleanup ✅ (this PR)
- [x] Read all key files (App.js, premiumManager.js, server.py, package.json, requirements.txt,
      manifest.json, .emergent/summary.txt, memory/PRD.md, .gitignore, both .env.example files).
- [x] Create `AUDIT.md` documenting current state (architecture, security issues, premium system
      state, Emergent dependencies, content/PWA status, dead code).
- [x] Create `CLAUDE.md` with project memory.
- [x] Move `EMERGENT_LLM_KEY` to an environment variable (`backend/server.py`, no fallback, fails
      fast at startup if missing).
- [x] Move `VALID_PREMIUM_KEYS` and `MAGIC_LINK_CODE` to environment variables
      (`frontend/src/utils/premiumManager.js` → `REACT_APP_VALID_PREMIUM_KEYS`,
      `REACT_APP_MAGIC_LINK_CODE`). **Read `AUDIT.md` §2 before treating this as a security fix —
      it is a source-hygiene change only; these values are still fully public in the built
      frontend bundle. Real confidentiality requires Phase 2.**
- [x] Move the BaridiMob RIP to an environment variable
      (`REACT_APP_PAYMENT_RIP`) in `premiumManager.js`. Same caveat as above, plus: it has to be
      publicly displayed in the UI for buyers to pay it, so this was never a confidentiality
      issue either way. `v3CompleteData.js`/`completeData.js`'s own hardcoded copies of the RIP
      were **not** touched (out of scope — not on the premium/payment code path; see `AUDIT.md` §2
      and §6 for `completeData.js`'s dead-code status).
- [x] Create `frontend/.env.example` (no real values).
- [x] Create `backend/.env.example` (no real values).
- [x] Verify `.gitignore` includes `.env` files at root and subfolder level (found and fixed a
      bug: the existing `.env.*` pattern also blocked `.env.example` from ever being tracked).
- [x] Push to branch `claude/peaceful-archimedes-lwy0pq` (this session's harness pins development
      to this exact branch name — see the PR description for why it isn't
      `chore/phase-0-audit-and-secrets`) and open the PR.
- [ ] Rotate the leaked `EMERGENT_LLM_KEY` on the provider side (manual step, provider console —
      not something this PR can do).

## Phase 1: Emergent Independence — code swap done, deploy still open
- [x] Replace `emergentintegrations` with the `google-genai` SDK directly. Note:
      `google-generativeai` (the *other* Google SDK, also in `requirements.txt` before this phase)
      turned out to be fully deprecated upstream as of this work ("all support has ended") — went
      with `google-genai` instead, which is the maintained one and was already a dependency.
- [x] Update `backend/server.py` to call Gemini directly via
      `genai.Client(api_key=GEMINI_API_KEY).aio.chats.create(...)` / `chat.send_message(...)`,
      keeping the existing `FALLBACK_RESPONSES`/`get_fallback_response` quota-fallback behavior,
      the `WASSIM_SYSTEM_PROMPT` persona, and per-session chat continuity intact.
- [x] Confirmed no frontend code imports anything Emergent-specific (only the `<script>` tags in
      `index.html` and the Craco plugins did — both removed below).
- [x] Removed the `assets.emergent.sh` script tags and the iframe-gated debug-monitor/Tailwind-CDN
      loader from `frontend/public/index.html`.
- [x] Removed `frontend/plugins/visual-edits/` and `frontend/plugins/health-check/` entirely, and
      simplified `frontend/craco.config.js` to drop their conditional wiring.
- [x] Removed `.emergent/` (job metadata only, nothing the app read at runtime). Left `memory/`,
      `test_reports/`, `test_result.md` alone — not asked for in this pass, and they're referenced
      as historical context, not runtime coupling.
- [x] Updated `backend/requirements.txt`: removed `emergentintegrations` and the deprecated
      `google-generativeai`, kept `google-genai`. Deleted `requirements_google.txt` (its packages
      were already redundant with `requirements.txt`, and now doubly so).
- [x] Added `GEMINI_MODEL` as an overridable env var (defaults to `gemini-3.6-flash`) instead of
      hardcoding the model name — Google retired `gemini-2.0-flash` (the model this project was
      using) mid-Phase-1, discovered while testing; this makes the next retirement a config change,
      not a code change.
- [x] Tested the chatbot end-to-end against Gemini directly, through the actual `server.py`
      endpoint (FastAPI `TestClient`, not just a standalone script) — real multi-turn response
      confirmed, correct persona/dialect constraints honored, real local-knowledge details from the
      system prompt surfaced correctly. Did not separately re-test the quota-exceeded/fallback path
      in this pass (would need to simulate a 429 from Gemini) — fallback logic itself is unchanged
      from before, so risk here is low, but it's still unverified against the new SDK's error shape.
- [ ] Deploy frontend to Vercel.
- [ ] Deploy backend to Render.
- [ ] Point `REACT_APP_BACKEND_URL` at the Render deployment; retire the
      `*.preview.emergentagent.com` URL.
- [ ] Set up MongoDB Atlas and point `MONGO_URL`/`DB_NAME` at it.
- [ ] **Rotate the `GEMINI_API_KEY` used to test this phase.** It was shared in plaintext in the
      task instructions for this phase, which means it now sits in this conversation's history
      outside of git (git itself never saw it — it was only ever exported as a shell env var for
      local testing, never written to a file). Same category of exposure as the leaked
      `EMERGENT_LLM_KEY` from Phase 0: treat any secret that's ever appeared in plaintext chat as
      burned and get a fresh one from https://aistudio.google.com/apikey before real deployment.

## Phase 2: Server-Side Premium Validation (NOT STARTED)
- [ ] Design the MongoDB schema: one document per sold key (key value, buyer contact, device
      binding identifier, issued/activated timestamps, `revoked` flag).
- [ ] Create `POST /api/validate-premium` (or similar) on the backend.
- [ ] Move key-validation logic out of `frontend/src/utils/premiumManager.js` and into that
      endpoint; the frontend calls it instead of checking a local array/env var.
- [ ] Implement device binding (UUID-based) so one sold key can't be reused by unlimited devices.
- [ ] Add a key revocation path (`revoked: true` in Mongo, checked on activation/periodic re-check).
- [ ] Require the resulting entitlement token on `POST /api/wassim-chat` — today it has **no**
      auth at all (see `AUDIT.md` §2, item 3); this is the actual security hole the premium system
      needs to close, not just the key list.
- [ ] Retire `REACT_APP_MAGIC_LINK_CODE`/`REACT_APP_VALID_PREMIUM_KEYS`/`REACT_APP_PAYMENT_RIP`
      as client-side validation inputs once the backend path is live (RIP can stay client-side
      for display purposes — it's not a secret — but validation must not).
- [ ] Add Stripe integration for direct in-app payment (replacing/supplementing the manual
      BaridiMob-transfer + WhatsApp-receipt flow).

## Phase 3: Guidebook Completion (NOT STARTED)
- [ ] Audit which guidebook sections are complete vs. placeholder against the actual source
      guidebook/Canva document (this repo has no source PDF checked in — get it from Wassim
      before starting; `AUDIT.md` §5 could only verify data-vs-rendered wiring, not
      data-vs-source-guidebook completeness).
- [ ] Port remaining guidebook text from Canva into the data files.
- [ ] Resolve `completeData.js` (dead) vs `v3CompleteData.js` (live) duplication — diff for any
      content only present in the dead file before deleting it.
- [ ] Resolve `wassimProfile.bio` (`placesData.js`, rendered on `/about`) vs
      `completeTexts.aboutWassim`/`wassimAuthor` (`v3CompleteData.js`, unrendered) duplication —
      pick one canonical source.
- [ ] Wire up or deliberately delete `completeTexts.finalWord` (currently dead content).
- [ ] Fix the stale `ANNABA2025ULTIMATE` placeholder text in `ShopPage.js`'s key-entry input (no
      longer a valid key as of Phase 0 — see `AUDIT.md` §2, item 6).
- [ ] Replace any Instagram/link placeholders found during the Phase 3 audit (none were found as
      of Phase 0 — all current links resolve to real content — but re-check as content is ported).
- [ ] Add page thumbnails/images where the source guidebook has them.
- [ ] Implement search across the guidebook content.

## Phase 4: Google Play Distribution (NOT STARTED)
- [ ] Fix the manifest/service-worker gaps from `AUDIT.md` §5 first: add a padded maskable icon,
      remove or fix the `/hotels` shortcut (route doesn't exist), add `offline.html` and precache
      the real built JS/CSS app shell, consolidate the double service-worker registration.
- [ ] Build the TWA wrapper using Bubblewrap.
- [ ] Create Digital Asset Links (`assetlinks.json`) under `frontend/public/.well-known/`.
- [ ] Set up GitHub Actions for AAB building (no `.github/workflows/` exists yet).
- [ ] Recruit and prepare 12 testers for closed testing (Google Play requires a minimum 14-day
      closed test before a production release can be submitted — start this early).
- [ ] Submit to Google Play Console.
- [ ] Monitor Play Store review/approval process.

## Safe fixes applied in Phase 0
1. Moved `EMERGENT_LLM_KEY` from a hardcoded string to an environment variable (backend, fails
   fast if missing).
2. Moved `VALID_PREMIUM_KEYS` to an environment variable (frontend — public-bundle caveat applies,
   see `AUDIT.md` §2).
3. Moved `MAGIC_LINK_CODE` to an environment variable (same caveat).
4. Moved the BaridiMob RIP to an environment variable in `premiumManager.js` only (same caveat;
   the two other hardcoded copies in data files were left alone — out of scope, see above).
5. Created `.env.example` files for both frontend and backend, no real values.
6. Verified and fixed `.gitignore` coverage for `.env`, `.env.local`, `.env.*.local` at every depth.

## Explicitly not done in Phase 0 (saved for later phases)
- Replacing `emergentintegrations` with the Gemini SDK — Phase 1.
- Moving premium *validation logic* (not just the key values) to the backend — Phase 2.
- Modifying frontend routing, `ShopPage.js`, `MagicLinkActivator.js`, or adding new features —
  Phase 3+ (or explicitly out of scope per the original Phase 0 brief).
- Building the TWA wrapper — Phase 4.
- Rewriting git history to purge the previously-committed `EMERGENT_LLM_KEY` value — rotate the
  key on the provider side instead; history rewrites weren't authorized for this PR.
