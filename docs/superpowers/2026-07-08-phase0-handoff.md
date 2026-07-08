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
| **P2** (hardening) | ⏳ NOT STARTED | branch `phase0/p2-hardening` exists (local, cut from `ef7cf47`), zero commits on it |
| **P3** (tooling: CI lint gate, Node 20, ESLint plugins, SEO meta) | Not started | per design spec, does NOT gate the v1 freeze — can trail |

P1 was executed with subagent-driven development: plan at `docs/superpowers/plans/2026-07-07-phase0-p1-defects.md`, ledger at `.superpowers/sdd/progress.md` (gitignored, local only). Every task passed spec+quality review; final whole-branch review: ready-to-merge, no Critical/Important findings.

## Michael's tasks (human-only, do before/alongside P2)

1. **EmailJS dashboard** (review item S1): enable **domain allowlisting** (swizzleshizzle.com) and **reCAPTCHA** on the contact form template. Cannot be done in code.
2. **Verify EmailJS template routing**: code now sends `recipientEmail` from `VITE_EMAILJS_EMAIL` (renamed from `VITE_APP_EMAILJS_EMAIL` in P1). Confirm the GitHub secret `EMAILJS_EMAIL` exists and the template's "To" field is set the way you expect.
3. **Projects-section refresh** (the design spec's ⏸ Manual gate before Phase 1): first addition is scoped and prepped — see `docs/superpowers/specs/2026-07-08-projects-refresh-prep.md` (Agentic Meal Planner: screenshot checklist for Michael, drafted entry + copy, implementation steps; no live demo — the app is full-stack and intentionally unauthenticated, so GitHub Pages is not an option). Michael: capture screenshots, review the drafted copy, and answer the doc's two open questions.
4. Optional sanity pass: run `npm install && npm run dev` and click through — mobile hamburger, project modal (Tab/Escape/focus), contact form, pinch-zoom on a phone.

## Next agent: P2 batch (branch `phase0/p2-hardening`)

Scope from `docs/2026-07-07-full-code-review.md` (S2–S5, S7) **plus two design-spec redlines** (agreed: fold them in since P2 is already editing `.htaccess`):

1. `public/.htaccess` CSP: drop `'unsafe-inline'` from `script-src` (verify the site still works — test in `vite preview` with headers or on staging; Three.js may need `unsafe-eval`, keep that only if breakage proves it's required); add `frame-ancestors 'self'`.
2. `public/.htaccess`: fix the `www→apex` redirect to target `https://` and add a general HTTP→HTTPS redirect + `Strict-Transport-Security` header (S4).
3. `public/.htaccess`: remove the global `Access-Control-Allow-Origin "*"` (S5).
4. **Redline fix**: add `RewriteRule ^archive/?$ /index.html [L]` BEFORE the generic SPA fallback rule, so `/archive` still serves the SPA once `public/archive/` exists as a real directory.
5. **Redline fix**: `Cache-Control: no-cache` carve-out for `versions.json` (currently JSON is cached 1 week, which would break the live-manifest mechanism).
6. `.github/workflows/deploy.yml`: delete the "Debug environment variables" step (S7 — echoes host/user into Actions logs).
7. Tiny carried note from P1's final review: `src/index.css` user-select block references `#background` but the element is `#backgroundViz` — fix the selector while in CSS.

Then: PR to `feature/portfolio-version-archive`, merge, same ritual as #43/#44.

**Caution:** `.htaccess` changes only take effect on the live cPanel host — they are not exercised by `npm run build`. CSP tightening is the riskiest item; if uncertain, ship it as its own commit so it can be reverted server-side quickly.

## After P2 (per the design spec's sequencing)

- ⏸ Manual gate: Michael's projects refresh (task 3 above).
- Phase 1: `versions.json` + `VersionSwitcher` + snapshot script (remember the redlines: script strips nested `archive/` AND nested `.htaccess`; `deploy.yml`'s "Create .env file" step must also write `VITE_VERSION_ID`; switcher must tolerate missing manifest, unset `VITE_VERSION_ID`, missing thumbnails).
- Phase 2: freeze v1. Phase 3: `/archive` page.

## Known non-blocking notes (carry list)

- ~54 pre-existing ESLint errors (mostly `react-hooks/purity` Math.random-in-render in HeroThree) — P3 territory.
- 13 npm audit vulnerabilities pre-existing on the branch; 19 flagged by GitHub on default branch.
- `handleEscKey` in ProjectModal also handles Tab-trapping (misnamed); hamburger sr-only label always "Open main menu"; reduced-motion CSS can't affect WebGL animation; ContactForm has `dark:` classes with no dark-mode toggle.
- P1 error boundaries were never runtime-smoke-tested (no test infra) — a 30-second dev check (throw inside WordCloud) would close that.
