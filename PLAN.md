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

## Phase 2: Server-Side Premium Validation — core validation done, payments/admin still open
- [x] Designed the MongoDB schema: `db.premium_keys`, one document per key
      (`_id`/`key`, `device_id` nullable, `revoked` bool, `activated_at` nullable,
      `created_at`, `source`). No buyer-contact field yet (not asked for; WhatsApp remains
      the actual buyer record via Wassim's own conversation history) — add one if/when a real
      admin flow is built.
- [x] Created `POST /api/validate-premium` (device_id in, `{"isPremium": bool}` out) and
      `POST /api/activate-premium` (key + device_id in, binds the key to that device on first use).
      The brief's own sketch only had a check endpoint with nothing to populate the collection it
      checked — added the activation endpoint because without it, validate-premium could never
      return true for anyone.
- [x] Moved key-validation logic out of `frontend/src/utils/premiumManager.js` entirely — it now
      calls the backend for both activation and periodic revalidation, and no longer holds a key
      list of any kind (not even from an env var).
- [x] Implemented device binding: `activate-premium` binds a key to the first `device_id` that
      redeems it; a different device presenting the same key gets `key_already_used`; the same
      device re-submitting the same key is idempotent (still succeeds, doesn't re-bind).
- [x] Added a key revocation path: `revoked: true` on a `premium_keys` doc (set directly in Mongo
      today, no admin UI yet) is checked on every `activate-premium` and `validate-premium` call,
      and `premiumManager.refreshPremiumStatus()` (called once per app load, see `App.js`) clears
      the local cache the moment it sees `isPremium: false` from the backend — verified this
      actually happens end-to-end in testing (see PR description).
- [x] Required entitlement on `POST /api/wassim-chat` — it now checks `device_is_premium(device_id)`
      before making any Gemini call, closing the hole from `AUDIT.md` §2 item 3 (previously
      callable by anyone). `WassimAIPage.js` now sends `device_id` with every chat request.
- [x] Retired `REACT_APP_MAGIC_LINK_CODE`/`REACT_APP_VALID_PREMIUM_KEYS` — removed from the
      frontend entirely (`frontend/.env.example`, `premiumManager.js`); the equivalent values now
      live backend-only as `VALID_PREMIUM_KEYS`/`MAGIC_LINK_CODE` in `backend/.env`, seeded into
      MongoDB at startup so existing sold keys keep working. `REACT_APP_PAYMENT_RIP` stays
      frontend-side as planned (display-only, was never a secret).
- [ ] Add Stripe integration for direct in-app payment (replacing/supplementing the manual
      BaridiMob-transfer + WhatsApp-receipt flow) — not started.
- [ ] Build an actual admin flow for issuing/revoking keys (currently: edit `VALID_PREMIUM_KEYS`
      and redeploy, or hand-edit a MongoDB document) — not started, fine for current sales volume
      but won't scale past a handful of manual sales.
- [x] Made key activation race-safe: `activate-premium` originally did a separate find-then-update
      (a check-then-act race - two simultaneous activations of the same key could both have won).
      Rewrote it as one atomic `find_one_and_update` filtered on "unclaimed or already claimed by
      this exact device", and added a concurrency test (5 simultaneous activation attempts for one
      key from different devices; exactly the first one keeps it, the rest get
      `key_already_used`) - passing against `mongomock-motor`.
- [ ] Re-verify the whole activate → validate → chat-gate flow against a **real** deployed
      MongoDB + backend. Everything above was verified with `mongomock-motor` (an in-memory Motor
      test double) via FastAPI's `TestClient`, run because no real MongoDB/Docker was reachable in
      the dev sandbox this was built in — the endpoint logic itself is fully exercised and correct
      against that double, including the atomic-claim race guard, but a real Mongo deployment
      (Atlas, connection pooling, actual concurrent connections, indexes) has never actually run
      this code. Add a unique index on `premium_keys.device_id` (sparse, since unactivated keys
      have `device_id: null`) before going live, as defense in depth alongside the atomic query.
- [ ] No automated test suite exists for this (or anything else) yet — the verification above was
      throwaway scripts, not `pytest` tests committed to the repo. Worth turning into real tests
      given how much this endpoint now guards (LLM spend, paid feature access).

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
