# Travel Planner Annaba — Roadmap

Five phases, tracked here as a checklist. Update this file's checkboxes as work lands; keep
`AUDIT.md` as the immutable snapshot of the Phase-0 findings and `CLAUDE.md` as living project
memory.

## Phase 0 — Secret cleanup and repo hygiene (this PR)
- [x] Remove the hardcoded `EMERGENT_LLM_KEY` from `backend/server.py`; read it from the
      environment with no fallback, fail fast at startup if missing.
- [x] Add `backend/.env.example` and `frontend/.env.example` documenting every required variable.
- [x] Verify `.gitignore` excludes `.env` files at root and subfolder level; confirm no `.env` is
      tracked by git.
- [x] Write `AUDIT.md` (architecture map, Emergent coupling, secrets, content gaps, PWA
      readiness, dead code) and `CLAUDE.md` (project memory).
- [ ] Rotate the leaked LLM key on the provider side (Wassim to do manually — not done by this PR).
- Explicitly **not** touched in Phase 0 (by design — see PR description): `premiumManager.js`
  validation logic, `ShopPage.js`, `MagicLinkActivator.js`, the hardcoded premium keys, the RIP
  bank account number, git history.

## Phase 1 — Independence from Emergent
- [ ] Replace `emergentintegrations` (`backend/requirements.txt`, `backend/server.py`) with a
      direct call to the Google Generative AI SDK (`google-generativeai` / `google-genai`,
      already partially present in `backend/requirements_google.txt`).
- [ ] Issue a real Gemini API key (not an Emergent gateway key) and wire it through
      `GEMINI_API_KEY` in `backend/.env`.
- [ ] Remove the Emergent-hosted `<script>` tags from `frontend/public/index.html`
      (`assets.emergent.sh/scripts/emergent-main.js`, the iframe-gated debug-monitor/Tailwind-CDN
      loader).
- [ ] Remove `frontend/plugins/visual-edits/` and `frontend/plugins/health-check/` and their
      conditional wiring in `frontend/craco.config.js`, once no longer edited inside Emergent's UI.
- [ ] Deploy frontend (static build) and backend (FastAPI) on independently-owned hosting; stop
      relying on `*.preview.emergentagent.com`.
- [ ] Decide the fate of `.emergent/`, `memory/`, `test_reports/`, `test_result.md` (delete or
      archive) once nothing in the workflow depends on Emergent's agent conventions.

## Phase 2 — Server-side premium
- [ ] Design a MongoDB schema for premium keys: one document per purchase, fields for the key
      itself, buyer contact, device binding, issued/activated timestamps, revoked flag.
- [ ] Move key validation from `frontend/src/utils/premiumManager.js` (client-side array check)
      to a new backend endpoint (e.g. `POST /api/premium/activate`) that checks MongoDB and
      returns a signed token the frontend stores instead of a raw boolean.
- [ ] Make activation device-bound (e.g. hash of a stable client identifier) so a single sold key
      can't be shared/pasted publicly and reused indefinitely.
- [ ] Add a revocation path (mark a key `revoked: true`, have the frontend re-check periodically
      or on relevant actions).
- [ ] Retire `VALID_PREMIUM_KEYS` and `MAGIC_LINK_CODE` from client code entirely once the backend
      path is live; update `MagicLinkActivator.js` and `ShopPage.js` to call the new endpoint.
- [ ] Add auth/entitlement check to `POST /api/wassim-chat` so the real LLM backend can't be
      called by non-premium/non-activated clients directly (currently open to anyone, see
      `AUDIT.md` §1).

## Phase 3 — Content completion
- [ ] Port the full guidebook text into `frontend/src/data/v3CompleteData.js` /
      `v3EnhancedData.js` / `placesData.js`, replacing any remaining summarized sections.
- [ ] Resolve the `completeData.js` (dead) vs `v3CompleteData.js` (live) duplication — delete the
      former once confirmed nothing needs it, after diffing for any content only present there.
- [ ] Resolve the `wassimProfile.bio` (`placesData.js`, rendered on `/about`) vs
      `completeTexts.aboutWassim` / `wassimAuthor` (`v3CompleteData.js`, unrendered) duplication —
      pick one canonical source and wire `AboutPage.js` to it.
- [ ] Wire up or deliberately delete `completeTexts.finalWord` (currently dead content, never
      rendered anywhere).
- [ ] Re-audit for placeholder/fake links as new content is ported in (none were found as of the
      Phase 0 audit, but re-check after large content edits).

## Phase 4 — Google Play (TWA)
- [ ] Generate a TWA project via Bubblewrap from `frontend/public/manifest.json`.
- [ ] Fix manifest gaps noted in `AUDIT.md` §5 first: proper padded maskable icon, remove/fix the
      `/hotels` shortcut (route doesn't exist), validate the `id` field.
- [ ] Fix the service worker before shipping: add `offline.html`, precache the actual built
      JS/CSS app shell (not just 4 static files), consider de-duplicating the double SW
      registration (`index.html` inline script + `serviceWorkerRegistration.js`).
- [ ] Publish `assetlinks.json` under `frontend/public/.well-known/` for Digital Asset Links
      verification.
- [ ] Add a GitHub Actions workflow to build the signed AAB on release/tag.
- [ ] Submit to Google Play closed testing track with 12 testers for the mandatory 14-day period
      before production rollout.
