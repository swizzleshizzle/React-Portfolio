# Portfolio Upgrade — Review & Direction Options

**Date:** 2026-05-13
**Branch:** `portfolio-upgrade`
**Goal:** Upgrade portfolio to a more attractive and professional state
**Status:** Review complete. Awaiting direction selection before scoping/implementation.

---

## Project snapshot

- **Stack:** React 19 + Vite 6, Three.js 0.174 + R3F + drei, Tailwind 4, framer-motion, EmailJS
- **Structure:** Single-page app, no routing in use (`BrowserRouter` is wrapped around content but no `<Routes>`)
- **Sections (in order):** Hero (3D) → About → Skills (3D word cloud) → Services → Projects → Experience → Contact → (empty TVEmbed section)
- **Deploy target:** Static build, rsync via GitHub Actions to a server (Apache `.htaccess` + sample `nginx.conf` included)

---

# Part 1 — Build Quality Review

## 🔴 Bugs / broken code

| # | Issue | File / line | Impact |
|---|-------|-------------|--------|
| 1 | `Tech.jsx` imports `./canvas/Ball` (doesn't exist) and 13 tech icons (most missing). Nothing imports `Tech.jsx`, so it compiles. | `src/components/Tech.jsx` | Dead file, would crash if ever re-enabled |
| 2 | Header mobile menu non-functional — uses Flowbite's `data-collapse-toggle` attribute but Flowbite JS isn't loaded | `src/components/Header.jsx:14` | Mobile users cannot open nav menu |
| 3 | `react-scan` loaded from CDN unconditionally in production | `index.html:49` | Blocks first paint in prod; `main.jsx` already gates it for dev — pick one |
| 4 | OG meta tags have placeholder URLs (`your-domain.com`, `linkedin.com/in/yourprofile`) | `index.html:21-46` | Social shares display broken metadata |
| 5 | Spaceship GLTF reuse is unsafe — `<primitive object={gltf.scene} />` shares scene reference across all ships of the same type | `HeroThree.jsx:460` | 15 ships / 5 types means ships of same type fight over one scene node; needs `useGLTF` + `clone()` from drei/SkeletonUtils |
| 6 | `mousedown` listener leak — added to `window` but never removed in cleanup | `HeroThree.jsx:758` | Memory leak if HeroThree ever unmounts |
| 7 | TypewriterText effect thrashes — depends on `currentLetterIndex`, fires every letter (~25×/sec) | `HeroThree.jsx:115-165` | Wasteful re-renders + setTimeout churn; also `react-simple-typewriter` is imported but never used |
| 8 | `TiltCard` runs a constant 60fps `requestAnimationFrame` loop per card to detect inactivity | `TiltCard.jsx:78-105` | 9 always-running rAF loops (6 service + 3 project cards); should be a debounced `setTimeout` |
| 9 | `Footer.jsx:18` — `bg-gray-800/94` is an invalid Tailwind opacity (valid: `/90`, `/95`) | `Footer.jsx:18` | Class silently dropped |
| 10 | OG image referenced as `https://your-domain.com/preview.jpg` but actual file is `public/hero-preview.png` | `index.html:24` | Social shares have no image |

## 🟡 Dead code / unused dependencies

**Dependencies installed but never imported:**
- `react-helmet`
- `vanta`
- `react-tilt` (custom `TiltCard` exists instead)
- `react-vertical-timeline-component` (custom `ExperienceTimeline` exists instead)
- `maath`
- `@babel/cli`, `@babel/core`, `@babel/preset-env`
- `glob` (only used by the unused `fix-three-build.js`)

**Partially used:**
- `react-router-dom` — only `<BrowserRouter>` is rendered, no `<Routes>` defined

**Dead source files:**
- `src/components/Tech.jsx` — broken imports, not referenced anywhere
- `src/components/Loader.jsx` — `CanvasLoader` defined but never imported
- `fix-three-build.js` — 130-line post-build script, never invoked from `package.json`
- `src/components/StarField.jsx` — duplicate of an inline `StarField` defined inside `HeroThree.jsx`

**Dead code paths:**
- `App.jsx` `showDebug` state — never toggled
- `MainContent.jsx` `<ScrollSection id="tvembed">` — empty div, `TradingViewWidget` imported but never rendered

## 🟠 Architecture / structure

- **`HeroThree.jsx` is 780 lines** containing 7 components (GradientText, TypewriterText, Spaceship, StarField, LoadingFallback, HeroScene, CanvasWrapper, HeroThree). Should split into separate files.
- **Mobile/desktop branches in `HeroScene` are 95% duplicated** (`HeroThree.jsx:609-703`) — only `OrbitControls` polar angles differ.
- **`window.triggerWordExplosion` global** (`WordCloud.jsx:37`) bridges the React tree via window. Should be context or a zustand store.
- **GLTFLoader uses deprecated path** `three/examples/jsm/loaders/GLTFLoader` — modern Three uses `three/addons/loaders/GLTFLoader.js`.
- **No code splitting below the fold.** Three.js, R3F, drei, framer-motion all in the initial bundle. `WordCloud` (heavy) could be `React.lazy`-loaded.
- **No error boundaries** — a runtime error in `HeroThree` crashes the entire page.
- **No tests, no CI test job, no lint-on-commit hook.**

## 🟢 Accessibility / SEO

- **3D word cloud has zero keyboard alternative** — keyboard-only users can't engage with skills.
- **No `prefers-reduced-motion` respect** for heavy 3D scenes (only the React logo spin honors it).
- **Modal lacks focus trap** — ESC closes it, but Tab escapes.
- **Service cards have no semantics** — `<div>` with `cursor-pointer` but no `role`/`aria-label`.
- **Favicon is `.jpg`** (`swizzlogo.jpg`) — no transparency, large. No `apple-touch-icon`, no `manifest.webmanifest`.
- **No `Content-Security-Policy`, `Strict-Transport-Security`, or `Permissions-Policy`** in `.htaccess` / `nginx.conf`.

## ⚙ Build / performance

- `vite.config.js` sets `assetsInlineLimit: 0` — every tiny asset becomes its own HTTP request.
- No image optimization (no webp/avif for project screenshots, no `loading="lazy"` on `<img>`).
- No bundle analyzer / Lighthouse budget in CI.

---

# Part 2 — Visual & UX Review

## Hero
- Name **tilts at an awkward angle** because `OrbitControls` starts slightly rotated. The two text lines use inconsistent letter shapes — the headline uses drei's default `Text` font (not the body's `system-ui`).
- **No CTA** ("View work" / "Contact"), no scroll cue beyond the implicit drag/wheel handler.
- Spaceships are fun but tonally arcade — they undercut a "senior engineer" read.

## Brand & color
- **No unified palette.** Five different "primaries":
  - Header → `bg-blue-700`
  - Hero gradient → violet / green / sky
  - Project buttons → `purple-600`
  - Contact → `indigo-600`
  - Footer links → `blue-600`
- Custom `--color-violet-500` is overridden to teal (`App.css:5`), used only for `::selection`.
- The mousedown easter-egg highlight cycle includes `#000596` — deep navy on a `#242424` background ≈ invisible.

## Typography
- **No webfont loaded.** Body falls back to `system-ui`; drei `Text` falls back to its default. The Inter `.woff` files exist in `/public/fonts/` but are never `@font-face`-d.
- **No type scale.** Heading sizes drift between `text-3xl`, `text-2xl`, `text-xl` across sections.
- **Magic hex repeated 8×:** `style={{ color: '#cfdbe8' }}` scattered across `MainContent.jsx` and `ExperienceTimeline.jsx` — should be a theme color.

## Skills word cloud
- 60+ skills crammed in a small sphere, all white, all same weight → labels overlap, reads as visual noise.
- Listing "HTML / CSS / Git / npm" alongside "Quantum Computing / AI/ML" flattens signal.
- Click-counter/timer/explosion gamification is clever but the goal (click all 60) is unclear — feels like a hidden mini-game.

## Sections
- **About** — 4 paragraphs of prose (~190 words), no headshot, no quick-facts strip.
- **What I Do** — 6 service cards with mixed-style stock icons (`ai.png`, `stocks2.png`, etc.), not visually unified.
- **Projects** — image `object-contain h-48` leaves empty letterboxing. No GitHub link on the card itself (buried in modal). Tech pills are plain gray rounded.
- **Experience timeline** — 4 entries, no company logos, no bullets, no quantified outcomes ("Reduced X by Y").
- **Contact** — Pittsburgh location styled like a contact action but isn't clickable/relevant.
- **Footer** — attributions are *great* (developer-honest), but they dominate; copyright/nav is tiny.

## Missing
- No live demos / video previews of projects
- No testimonials, no metrics, no certifications
- No résumé download button
- No blog or writing samples
- No real Open Graph image (the referenced `preview.jpg` doesn't exist)
- No `404` route
- No analytics

## Mobile
- Hero shrinks to `80vh` but word cloud stays at fixed `h-[600px]`.
- Header hamburger is **broken** (Flowbite JS missing — see Bug #2).
- Service cards stack 1-col correctly.

---

# Part 3 — Direction Options

Not mutually exclusive — order and intensity matter.

## Option A — "Polish what's there" *(recommended starting point)*

Keep the spaceships + 3D vibe but tighten everything. Estimated 1–2 days of focused work; addresses ~80% of professional-feel issues.

**Build quality:**
- Fix the broken Header mobile menu
- Strip dead deps + dead files (7 unused deps, 4 dead files)
- Remove the CDN `react-scan` from `index.html`
- Fix the GLTF cloning bug + add error boundaries
- Replace the per-card rAF loops in `TiltCard` with a single debounced timeout
- Decompose `HeroThree.jsx` (split 7 components into separate files)
- Fix OG meta tags + add real preview image
- Load Inter via `@font-face` (the files are already in `/public/fonts/`)

**Visual:**
- Define a single primary/accent color (e.g. violet or indigo) and replace the five different "primaries" with it
- Establish a type scale (e.g. `text-5xl` hero / `text-3xl` section / `text-xl` subhead / `text-base` body)
- Replace `style={{ color: '#cfdbe8' }}` magic hex with a theme variable
- Add a hero CTA pair ("View work" + "Contact")
- Prune skills word cloud to ~20 standout skills with category grouping
- Replace stock service-card icons with consistent monoline iconography (e.g. lucide-react)
- Bigger project images with consistent crop; surface GitHub link on the card itself
- Add company logos + quantified bullets to experience timeline

**Pros:** Highest visible impact per hour. Preserves the existing personality.
**Cons:** Still constrained by the underlying architecture (no SSR, no MDX, no image opt).

## Option B — "Tone shift toward senior"

Lean less on novelty 3D, more on craft. Reposition for staff/senior roles where flashy reads as junior.

**Hero:**
- Replace the spaceship hero with a quieter, animated gradient/grain backdrop (or keep ships but dial way back — fewer, slower, more subtle)
- Strong single-statement headline + dual CTA ("View work" / "Email me")
- No typewriter — one confident line

**Sections:**
- Convert the 3D word cloud into a curated "Stack" grid with explicit categories: Languages / Frameworks / Cloud / Practices
- Promote a "Selected work" treatment for projects: larger images, problem→approach→result captions, inline GitHub + Live links, optional embedded demo loops
- Experience timeline gets logos, role bullets, quantified outcomes
- Add a "Writing" or "Building in public" surface if applicable (links to articles, talks, OSS PRs)

**Pros:** Reads as more confident and craft-driven. Better fit for senior recruiters scanning quickly.
**Cons:** Loses some of the playful identity. Includes most of Option A's work as a prerequisite.

## Option C — "Rebuild on a modern stack"

Move to Next.js (or Astro + React islands) for:
- Partial hydration / RSC
- MDX-driven project case studies (write projects as long-form posts)
- Built-in image optimization (`next/image` or Astro `<Image>`)
- View Transitions API
- Better SEO out of the box (real `<Head>` per page, sitemap, RSS)

**Pros:** Architecturally a step above 90% of "React + Vite" portfolios. Lets you write project deep-dives as MDX, which is itself a portfolio signal.
**Cons:** Bigger commitment — likely 1–2 weeks. Only worth it if you're also treating the portfolio as a Next.js/Astro learning project.

## Recommendation

**A first**, then **B** as a follow-up if you want to reposition tone. **C** only if Next.js / Astro itself is something you want to learn through this project.

---

# Reference — Inventory of relevant files

```
src/
  App.jsx                          — Root, has unused `showDebug` branch
  App.css                          — Tailwind import, gradient animation, broken @media light-mode
  index.css                        — Base styles, social link float anim, iOS fixes
  main.jsx                         — Root render, react-scan gate, contextmenu disable
  styles.js                        — Tailwind class string constants (unused outside hoc/)
  react-scan.jsx                   — Duplicate of main.jsx (different content)
  components/
    Header.jsx                     — Broken mobile menu
    Footer.jsx                     — Bg-gray-800/94 typo; attributions accordion
    MainContent.jsx                — Section orchestrator; empty TVEmbed section
    HeroThree.jsx                  — 780-line monolith, 7 components
    WordCloud.jsx                  — Skills word cloud, global trigger, timer/counter
    ScrollSection.jsx              — IntersectionObserver wrapper
    ProjectCard.jsx                — TiltCard wrapper for project preview
    ProjectModal.jsx               — Carousel modal, no focus trap
    SocialLinks.jsx                — Floating bottom-right links
    ExperienceTimeline.jsx         — Simple <ol> timeline
    ContactForm.jsx                — EmailJS form
    TiltCard.jsx                   — Constant rAF loop per card
    StarField.jsx                  — Duplicate of inline StarField in HeroThree
    ParticleExplosion.jsx          — Word-cloud click explosion
    TVEmbed.jsx                    — TradingView widget (rendered to empty div)
    Tech.jsx                       — BROKEN, dead
    Loader.jsx                     — DEAD
  constants/index.js               — All content: skills, services, projects, experience, social, attributions, taglines
  config/emailjs.js                — Env-driven EmailJS config
  hoc/SectionWrapper.jsx           — Framer-motion HOC (unused outside Tech.jsx which is dead)
  utils/motion.js                  — Framer-motion variants (unused outside hoc/SectionWrapper)
  assets/                          — Tech PNGs, project screenshots, 5 spaceship GLBs

public/
  hero-preview.png                 — Actual preview (referenced as preview.jpg in OG tags)
  Inter-Bold.woff / Inter-Regular.woff
  fonts/inter-bold.woff / inter_regular.json
  swizzlogo.jpg                    — Used as favicon

Root:
  index.html                       — react-scan CDN script, placeholder OG URLs
  vite.config.js                   — Manual chunks, terser, assetsInlineLimit:0
  eslint.config.js                 — Minimal flat config
  fix-three-build.js               — DEAD post-build script
  .htaccess                        — Apache config, basic security headers
  nginx.conf                       — Sample nginx config with placeholder server_name
  package.json                     — 7+ unused deps
```

---

# Open questions for direction-setting

1. Which direction — A, B, C, or a hybrid (e.g. A + selected pieces of B)?
2. Is there a deadline or job-search trigger that should shape scope?
3. Are the spaceships emotionally load-bearing, or open to being toned down / replaced?
4. Any sections you'd want to *cut* entirely (e.g. the TradingView embed, the social-link float animation, the click-the-word mini-game)?
5. Any sections you'd want to *add* (writing, talks, a `now` page, a contact-availability indicator)?
6. Should `swizzleshizzle` branding stay, or do you want a more name-first identity (Michael Greene)?
