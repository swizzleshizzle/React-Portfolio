# Portfolio — Full Code Review (Multi-Agent + Direct)

**Date:** 2026-07-07
**Branch:** `main`
**Stack:** React 19 + Vite 6, Three.js 0.174 / R3F / drei, Tailwind 4, framer-motion, EmailJS
**Scope:** Whole application — correctness, performance, accessibility, tooling/build, security, architecture.

> Companion to [`2026-05-13-portfolio-upgrade-review.md`](./2026-05-13-portfolio-upgrade-review.md). Where a finding overlaps that earlier doc it is marked **(also in 05-13)**. This pass adds a deep **security** section and independently re-verified every performance/a11y/tooling item.

---

## Methodology

- Six review dimensions were fanned out to parallel subagents; **every finding was then adversarially re-verified** by a second agent that read the actual files (severities were corrected during verification).
- **Correctness, performance, accessibility, tooling** ran cleanly: **39 findings confirmed**, 3 rejected.
- The **architecture** and **security** agents misfired (returned stub output twice), so those two dimensions were **reviewed directly against the source** instead — every claim below was checked in-file.

### What was checked and found clean
- **No secrets committed.** `src/config/emailjs.js` has only ever used `import.meta.env.*` in git history; `.env*` is gitignored. EmailJS public key / service / template IDs *do* ship in the bundle — that is by design and safe for EmailJS.
- **No XSS sinks.** Zero `dangerouslySetInnerHTML` / `eval` on user data. The only `innerHTML` is a static config string in the (unrendered) `TVEmbed`.
- **External links are clean.** Every `target="_blank"` carries `rel="noopener noreferrer"`.

---

## Priority summary

| Priority | Theme | Items |
|----------|-------|-------|
| **P0 — quick, high-impact** | Perf & prod hygiene | Favicon (1.26 MB), react-scan CDN script, hero DPR cap, dead deps/files |
| **P1 — correctness & a11y** | Real user-facing defects | Mobile nav broken, no `<h1>`, modal a11y, EmailJS env mismatch, no error boundaries |
| **P2 — hardening** | Security & robustness | CSP weaknesses, HTTPS/HSTS, form abuse protection, frame-ancestors |
| **P3 — cleanup** | Maintainability | Dead code, CI hygiene, ESLint gaps, SEO placeholders |

---

## 🔒 Security

Baseline is solid for a static client-side portfolio (see "clean" list above). Substantive items:

| # | Severity | Issue | Location | Fix |
|---|----------|-------|----------|-----|
| S1 | **Medium** | **No contact-form abuse protection.** EmailJS keys are extractable from the bundle; no CAPTCHA, rate limit, or domain allowlist. Anyone can spam your EmailJS quota / send via your template. | `ContactForm.jsx`, EmailJS dashboard | Enable **domain allowlisting + reCAPTCHA** in the EmailJS dashboard (server-side; can't be done in client code). |
| S2 | **Medium** | **CSP weakened by `'unsafe-inline'` + `'unsafe-eval'`** in `script-src` — largely defeats the XSS protection a CSP should give. `unsafe-eval` may be needed by Three.js/Vanta; `unsafe-inline` is harder to justify. | `public/.htaccess:25` | Drop `unsafe-inline`; keep `unsafe-eval` only if a lib truly requires it. Consider nonces for the JSON-LD block. |
| S3 | **Medium** | **No clickjacking protection on the deployed config.** The shipped `public/.htaccess` sets a CSP but **no `frame-ancestors` and no `X-Frame-Options`**. The root `.htaccess` sets `X-Frame-Options` but is never deployed. | `public/.htaccess:25` | Add `frame-ancestors 'self'` to the CSP. |
| S4 | **Medium** | **No HTTPS enforcement / no HSTS.** nginx HTTPS block is commented out; the `www`→apex redirect targets **`http://`** (an explicit downgrade); no `Strict-Transport-Security` anywhere. | `public/.htaccess:11`, `nginx.conf:41-47` | Force HTTPS redirect and add an HSTS header. |
| S5 | **Low** | **`Access-Control-Allow-Origin: "*"`** set globally — unnecessarily broad for static files. | `public/.htaccess:30` | Remove unless a cross-origin reader needs it. |
| S6 | **Low** | **Unpinned third-party script** — `react-scan` from unpkg with no version pin or SRI. *Nuance: prod CSP doesn't list `unpkg.com`, so it's **blocked in production** and only runs in dev — but delete it regardless.* | `index.html:49` | Remove the `<script>` tag entirely (see T2). |
| S7 | **Low** | **CI logs echo deploy host/user** in a "Debug environment variables" step — minor info disclosure in Actions logs. | `deploy.yml:43-48` | Delete the debug step. |

**Blast-radius note (not a vuln):** deploy rsyncs into a **shared cPanel `public_html` co-tenanted with another app** (`Tools/`). The `--delete` excludes protect it, but the site shares a host.

---

## 🔴 Correctness / P1 defects

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| C1 | **High** | **Mobile nav is non-functional** — hamburger relies on Flowbite's `data-collapse-toggle`, but Flowbite JS is never loaded; `aria-expanded` is hard-coded. On small screens the primary nav can't open. **(also in 05-13)** | `Header.jsx:14` |
| C2 | **Medium** | **EmailJS recipient env-var mismatch** — CI writes `VITE_EMAILJS_EMAIL` but code reads `VITE_APP_EMAILJS_EMAIL`, so `recipientEmail` is `undefined` in prod. Impact depends on whether your EmailJS template routes via `{{to_email}}` (many configure recipient in the dashboard, making it harmless). | `deploy.yml:31` vs `emailjs.js:9` |
| C3 | **Low** | **`mousedown` window listener leak** — added alongside the scroll listener but cleanup only removes `scroll`; also anonymous so unremovable. Trivial impact (HeroThree ~never unmounts). **(also in 05-13)** | `HeroThree.jsx:758` |

> No unhandled WebGL-disposal leaks or crash-class bugs were confirmed beyond the above.

---

## ⚡ Performance

The core theme: **two always-mounted WebGL canvases + 9 perpetual rAF loops mean the GPU/CPU never idle**, even offscreen.

**P0 quick wins:**
- **P1 — 1.26 MB favicon.** `swizzlogo.jpg` is a 3336×3438px JPEG used as a 16–32px icon, fetched eagerly every load. *(Vite hashes & bundles it correctly — it does NOT 404 in prod; it's just wasteful.)* → ship a 32px `.ico`/`.png`. `index.html:6`
- **P2 — react-scan CDN profiler** ships render-instrumentation to every visitor via a render-blocking unpkg `<script>`. → delete it. `index.html:49` **(also in 05-13)**
- **P3 — hero uses uncapped `devicePixelRatio` + antialiasing** on a fullscreen canvas → 4–9× pixels on retina/mobile (main cause of device heat). `WordCloud` already caps to `[1,2]`; the hero doesn't. → `dpr={[1,2]}`. `HeroThree.jsx:711`

**High-value structural:**
- **Both canvases render at 60fps continuously, even scrolled offscreen** → gate `frameloop` on an IntersectionObserver (react-intersection-observer is already a dep). `HeroThree.jsx:709`, `WordCloud.jsx:463`
- **No runtime code-splitting** — Three.js bundle loads eagerly. `WordCloud` (below the fold) is a clean `React.lazy` win; the hero legitimately needs Three.js above the fold. `MainContent.jsx:6`
- **9 TiltCard rAF loops never idle** + un-throttled `setState` on every mousemove → run the loop only while tilted/hovered; mutate transform via ref. `TiltCard.jsx:78` **(also in 05-13)**
- **`scrollProgress` React state re-renders the whole R3F hero tree on scroll** → store in a ref, read in `useFrame`. `HeroThree.jsx:750`

**Medium/low:** 15 spaceships each wrapped in a drei `<Trail>` (not reduced on mobile, `HeroThree.jsx:453`); scene leaf components unmemoized; project/modal images lack `loading="lazy"` + are unoptimized PNGs (~1 MB); WordCloud Timer runs `setInterval` + `useFrame` together; per-ship debug traversal/logging in the hero load path.

---

## ♿ Accessibility

Real barriers, not polish — largely because the primary content lives inside WebGL.

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| A1 | **High** | **No `<h1>` on the page** — hero headline is WebGL `<Text>`, invisible to screen readers & crawlers; outline starts at `<h2>`. Add an `sr-only <h1>` + `aria-hidden`/`role="img"` on the canvas. | `HeroThree.jsx:633` |
| A2 | **High** | **ProjectModal** lacks `role="dialog"`, `aria-modal`, focus trap, and focus restoration; **close button has no accessible name**. | `ProjectModal.jsx:82-100` |
| A3 | **High** | **Pinch-zoom disabled** (`maximum-scale=1.0, user-scalable=no`) — WCAG 1.4.4 failure. | `index.html:7` |
| A4 | **High** | **No `prefers-reduced-motion` handling** for any of the heavy animation (only the leftover Vite logo-spin default). | `App.css:35`, global |
| A5 | **Medium** | Contact form doesn't announce errors/success (no `role="alert"`/`status`, no `aria-invalid`/`aria-describedby`). | `ContactForm.jsx:159` |
| A6 | **Medium** | Skills word-cloud is pointer-only, no keyboard/text fallback → add an `sr-only <ul>` of skills. | `WordCloud.jsx:256` |
| A7 | **Medium** | Low contrast (~2.7:1) on "Visit Project" (`text-purple-600`) and footer links (`text-blue-600`) on dark bg. | `ProjectCard.jsx:48`, `Footer.jsx:69` |
| A8 | **Low** | Heading skip h2→h5; non-semantic click `<div>`s; global mobile `user-select:none` blocks copying the contact email. | `TiltCard.jsx:195`, `index.css:139` |

---

## 🛠️ Tooling / build

- **T1 — `fix-three-build.js` is dead + broken.** 130-line post-build hack, never wired into any npm script, built on a false premise about how Vite emits assets. → delete it and the `glob` dep. `fix-three-build.js` **(also in 05-13)**
- **T2 — react-scan** ships to prod via the unpkg `<script>` and sits in `dependencies` (not `devDependencies`); duplicate dead entry `src/react-scan.jsx`. → remove the tag, delete the duplicate, move dep. **(also in 05-13)**
- **T3 — No tests, no typecheck, no lint gate in CI.** Deploy rsyncs straight to a live shared host. → add at least `npm run lint` as a CI gate + one render smoke test. `deploy.yml`
- **T4 — CI on EOL Node 18** + `npm install --legacy-peer-deps` (not `npm ci`); no `engines`/`.nvmrc`. → Node 20 LTS + `npm ci`. `deploy.yml:19-23`
- **T5 — Placeholder OG/Twitter/JSON-LD metadata** (`your-domain.com`, preview image 404s) + no robots.txt/sitemap. `index.html:21-45` **(also in 05-13)**
- **T6 — ESLint** has contradictory `ecmaVersion`, no `eslint-plugin-react`, no `jsx-a11y`. `eslint.config.js:11-32`
- **T7 — `nginx.conf` is stale/unused** (real deploy is Apache/cPanel) — delete or mark as example. `nginx.conf`
- **Dead deps:** `react-helmet`, `vanta`, `framer-motion` (via orphaned `Tech.jsx`), plus `StarField` import in WordCloud. **(also in 05-13)**

---

## 🏗️ Architecture

Sound bones — data centralized in `src/constants/index.js`, components map ~1:1 to sections, `MainContent` reads cleanly. Weaknesses are accumulated cruft + one resilience gap:

- **No error boundaries (highest-value add).** A throw in `HeroThree`/`WordCloud` blanks the entire page — no fallback. Wrap each canvas in an `<ErrorBoundary>`.
- **Dead/orphaned modules:** `Tech.jsx` (broken imports — would throw if imported), duplicate `src/react-scan.jsx`, empty `#tvembed` ScrollSection, `TVEmbed` imported twice but never rendered, `SectionWrapper` HOC used only by dead `Tech.jsx`.
- **Dead debug scaffolding:** `showDebug` branch (`App.jsx:22`), `console.log('MainContent mounted')`, per-ship hero logging.
- **Data-flow smell:** `scrollProgress` threaded through 3 R3F layers (see perf).
- **Inconsistent styling:** Tailwind mixed with repeated inline `style={{ color:'#cfdbe8' }}`.
- **Naming:** `hightlightColors` typo (HeroThree); `TVEmbed` exports `TradingViewWidget`.

---

## Suggested sequencing

1. **P0 batch (one small PR):** favicon, remove react-scan script + dep + duplicate, cap hero DPR, delete `fix-three-build.js` + dead deps/files. Big load/battery win, near-zero risk.
2. **P1 batch:** fix mobile nav, add `sr-only <h1>`, modal a11y (dialog + focus trap + close label), align EmailJS env var, add error boundaries.
3. **P2 batch:** CSP hardening (`frame-ancestors`, drop `unsafe-inline`), HTTPS/HSTS, EmailJS domain allowlist + reCAPTCHA, remaining a11y (reduced-motion, form announcements, contrast).
4. **P3:** CI lint gate + Node 20 + `npm ci`, SEO/meta, ESLint plugins, remaining cleanup.

> **Verification method note:** performance/a11y/tooling findings were double-verified by independent agents; security/architecture were verified directly in-file. The favicon "404s in prod" claim from an earlier agent was **rejected** after a real `vite build` showed Vite hashes and bundles it correctly.
