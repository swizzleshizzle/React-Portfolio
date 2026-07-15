# Handoff — Phase 0 (code-review fixes) for the Version Archive project

**Written:** 2026-07-08 (end of session)
**For:** Michael + the next agent
**Read first:** `docs/superpowers/specs/2026-07-07-portfolio-version-archive-design.md` (incl. the four ⚠️ REDLINE blocks) and `docs/2026-07-07-full-code-review.md`.

## Where things stand

Branch structure: work happens on `phaseN/*` branches cut from `feature/portfolio-version-archive`, merged back via PR (per-phase). `dev`/`main` untouched by this effort so far.

| Batch | Status | Where |
|---|---|---|
| **P0** (perf/hygiene: favicon, react-scan, DPR cap, dead code/deps) | ✅ Merged — PR #43 | in `feature/portfolio-version-archive` |
| **P1** (mobile nav, sr-only h1, modal a11y, EmailJS env, error boundaries, a11y batch) | ✅ Merged — PR #44 | in `feature/portfolio-version-archive` |
| **P2** (hardening) | ✅ Code done (2026-07-08) — awaiting live-host verification + PR | branch `phase0/p2-hardening`, 4 commits (`4629034`, `1f48092`, `6ef1bbd`, `96c8ec9`) |
| **P3** (tooling: CI lint gate, Node 20, ESLint plugins, SEO meta) | Not started | per design spec, does NOT gate the v1 freeze — can trail |

P1 was executed with subagent-driven development: plan at `docs/superpowers/plans/2026-07-07-phase0-p1-defects.md`, ledger at `.superpowers/sdd/progress.md` (gitignored, local only). Every task passed spec+quality review; final whole-branch review: ready-to-merge, no Critical/Important findings.

## Michael's tasks (human-only, do before/alongside P2)

1. **EmailJS dashboard** (review item S1): enable **domain allowlisting** (swizzleshizzle.com) and **reCAPTCHA** on the contact form template. Cannot be done in code.
2. **Verify EmailJS template routing**: code now sends `recipientEmail` from `VITE_EMAILJS_EMAIL` (renamed from `VITE_APP_EMAILJS_EMAIL` in P1). Confirm the GitHub secret `EMAILJS_EMAIL` exists and the template's "To" field is set the way you expect.
3. **Projects-section refresh** (the design spec's ⏸ Manual gate before Phase 1): first addition is scoped and prepped — see `docs/superpowers/specs/2026-07-08-projects-refresh-prep.md` (Agentic Meal Planner: screenshot checklist for Michael, drafted entry + copy, implementation steps; no live demo — the app is full-stack and intentionally unauthenticated, so GitHub Pages is not an option). Michael: capture screenshots, review the drafted copy, and answer the doc's two open questions.
4. Optional sanity pass: run `npm install && npm run dev` and click through — mobile hamburger, project modal (Tab/Escape/focus), contact form, pinch-zoom on a phone.

## P2 batch — ✅ DONE (branch `phase0/p2-hardening`)

All 7 items executed 2026-07-08. `npm run build` green (exit 0); working tree clean. Four focused commits (CSP isolated first, per the caution below):

1. ✅ `4629034` — CSP: dropped `'unsafe-inline'` from `script-src`, added `frame-ancestors 'self'`. **Kept `'unsafe-eval'`** (couldn't exercise `.htaccess` locally; Three.js/Vanta may need it) — see Michael verification #6.
2. ✅ `1f48092` — `www→apex` redirect now targets `https://`; added general HTTP→HTTPS force + `Strict-Transport-Security` (1yr, no `includeSubDomains`/`preload` yet). Redirects moved ahead of the SPA fallback (they were previously `[L]`-stopped and never ran). (S4)
3. ✅ `1f48092` — removed global `Access-Control-Allow-Origin "*"` (S5).
4. ✅ `1f48092` — Redline: `RewriteRule ^archive/?$ index.html [L]` ahead of the fallback.
5. ✅ `1f48092` — Redline: `Cache-Control: no-cache` + `Header unset Expires` carve-out for `versions.json`.
6. ✅ `6ef1bbd` — deleted the "Debug environment variables" step in `deploy.yml` (S7).
7. ✅ `96c8ec9` — `src/index.css` selector `#background` → `#backgroundViz`.

**Caution (still applies):** `.htaccess` changes are NOT exercised by `npm run build` — they only take effect on the live cPanel host. CSP is committed in isolation (`4629034`) so it can be reverted server-side quickly.

### Michael's P2 verification (do on the live/staging host — these can't be checked in code)

5. **Confirm HTTPS + valid cert works** on `swizzleshizzle.com` BEFORE this reaches `main` — the new HSTS header (1yr) will make browsers refuse HTTP, so a broken cert would lock visitors out. (cPanel AutoSSL usually covers this; just verify.)
6. **Smoke-test the tightened CSP on the deployed site** — load the page and confirm the Three.js hero + word cloud still render and the contact form still sends. If the console shows CSP violations from `unsafe-eval`, that's the one lever left; if it works *without* eval, drop `'unsafe-eval'` too for a stronger CSP.
7. **(Later, once Phase 1 exists)** verify `/archive` serves the SPA and `versions.json` isn't stale-cached — the rules are in place but only exercisable once `public/archive/` and the manifest exist.

Next: PR `phase0/p2-hardening` → `feature/portfolio-version-archive`, same ritual as #43/#44.

## After P2 (per the design spec's sequencing)

- ⏸ Manual gate: Michael's projects refresh (task 3 above).
- Phase 1: `versions.json` + `VersionSwitcher` + snapshot script (remember the redlines: script strips nested `archive/` AND nested `.htaccess`; `deploy.yml`'s "Create .env file" step must also write `VITE_VERSION_ID`; switcher must tolerate missing manifest, unset `VITE_VERSION_ID`, missing thumbnails).
- Phase 2: freeze v1. Phase 3: `/archive` page.

## Known non-blocking notes (carry list)

- ~54 pre-existing ESLint errors (mostly `react-hooks/purity` Math.random-in-render in HeroThree) — P3 territory.
- 13 npm audit vulnerabilities pre-existing on the branch; 19 flagged by GitHub on default branch.
- `handleEscKey` in ProjectModal also handles Tab-trapping (misnamed); hamburger sr-only label always "Open main menu"; reduced-motion CSS can't affect WebGL animation; ContactForm has `dark:` classes with no dark-mode toggle.
- P1 error boundaries were never runtime-smoke-tested (no test infra) — a 30-second dev check (throw inside WordCloud) would close that.
