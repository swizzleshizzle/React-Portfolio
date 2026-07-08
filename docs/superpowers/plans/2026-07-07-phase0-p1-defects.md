# Phase 0 — P1 Defect Batch Implementation Plan

Source: `docs/2026-07-07-full-code-review.md` (P1 rows + a11y items that render into the frozen artifact).
Branch: `phase0/p1-defects` (base `4c9e9fa`), merges back to `feature/portfolio-version-archive`.

## Global Constraints

- **No test infrastructure exists and none should be added in this batch.** Verification = `npm run build` succeeds + `npx eslint <changed files>` introduces no NEW errors (54 pre-existing errors exist; only compare your files) + behavior described per task.
- Stack: React 19, Vite 6, Tailwind 4 (via `@tailwindcss/vite`), R3F/drei. No new dependencies unless the task says so.
- Match existing code style: function components, Tailwind classes, existing naming.
- Do not refactor beyond the task scope. Each task is one commit.
- The site is a single-page portfolio; `BrowserRouter` exists but has no routes.

### Task 1: Fix mobile navigation (Header.jsx)

The hamburger button in `src/components/Header.jsx` uses Flowbite's `data-collapse-toggle` attribute, but Flowbite JS is never loaded — the menu never opens on small screens, and `aria-expanded` is hard-coded to `false`.

Requirements:
- Replace the Flowbite data-attribute mechanism with React state (`useState` for `isOpen`).
- Button toggles the menu; `aria-expanded={isOpen}` reflects real state; keep `aria-controls`.
- Menu closes when a nav link is clicked (so anchor navigation on mobile doesn't leave it covering content).
- Preserve the existing Tailwind styling/classes and desktop appearance exactly (desktop `md:` layout must be unaffected).
- Keep the existing markup semantics (nav, ul/li, links). Remove `data-collapse-toggle`/other Flowbite data attributes.

### Task 2: Add sr-only h1 and hide hero canvas from AT (HeroThree / MainContent)

The page has no `<h1>` — the headline is WebGL `<Text>` inside the hero canvas, invisible to screen readers and crawlers (review A1).

Requirements:
- Add a visually-hidden `<h1>` (Tailwind `sr-only`) as the first element of the hero section, with text matching the visual headline rendered in the 3D hero (read `src/components/HeroThree.jsx` to find the actual headline strings; combine into one sensible h1, e.g. name + role).
- Add `aria-hidden="true"` and `role="presentation"` (or `role="img"` with `aria-label` — choose one, be consistent) to the hero canvas container so AT skips the WebGL content.
- Check heading levels in `src/components/MainContent.jsx`: section headings should be `<h2>`. If the "skip h2→h5" issue (review A8) is a trivial tag swap in TiltCard/MainContent, fix it; if it requires styling surgery, leave it and note it in your report.

### Task 3: ProjectModal accessibility (ProjectModal.jsx)

`src/components/ProjectModal.jsx` lacks dialog semantics, focus management, and an accessible close-button name (review A2).

Requirements:
- Container: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the modal title element's id.
- Close button: `aria-label="Close project details"`.
- Focus management: on open, move focus into the modal (the close button is fine); trap Tab/Shift+Tab within the modal while open; on close, restore focus to the element that was focused before opening.
- Escape key closes the modal (if not already implemented — check first).
- Implement with a small hook or inline effect — no new dependencies (no focus-trap libs).
- Backdrop click behavior must keep working as it does today.

### Task 4: EmailJS recipient env var fix (deploy.yml + emailjs.js)

CI writes `VITE_EMAILJS_EMAIL` but `src/config/emailjs.js:9` reads `VITE_APP_EMAILJS_EMAIL`, so `recipientEmail` is `undefined` in prod (review C2).

Requirements:
- Standardize on `VITE_EMAILJS_EMAIL` (matches the other three vars' naming): change `emailjs.js` to read `import.meta.env.VITE_EMAILJS_EMAIL`. Do NOT change deploy.yml's secret names.
- Grep for any other `VITE_APP_` reads and align them the same way.
- Also fix review C3 while in contact-adjacent code: `src/components/HeroThree.jsx:758`-area adds a `mousedown` window listener whose cleanup only removes `scroll` and uses an anonymous function. Name the handlers and remove BOTH listeners in cleanup.

### Task 5: Error boundaries around WebGL canvases

A throw inside HeroThree or WordCloud currently blanks the whole page (review: architecture, "highest-value add").

Requirements:
- Create `src/components/ErrorBoundary.jsx`: a class component (React error boundaries must be classes) with `getDerivedStateFromError` + `componentDidCatch` (log via `console.error`), rendering a `fallback` prop (default: a minimal dark-themed div that doesn't break page layout).
- Wrap the HeroThree usage and the WordCloud usage (find them in `src/components/MainContent.jsx` / `src/App.jsx`) so a crash in one canvas degrades that section only.
- Fallbacks: hero → a simple dark section with the same height so layout doesn't jump, containing the name/role as styled text; word cloud → a hidden/empty placeholder or simple skill list from `src/constants` `skills` export. Keep them small.

### Task 6: Remaining rendered-artifact a11y (viewport, reduced motion, form announcements, contrast)

Review items A3, A4, A5, A7, A8-partial. All are small, independent edits.

Requirements:
- `index.html:7`: remove `maximum-scale=1.0, user-scalable=no` from the viewport meta (keep `width=device-width, initial-scale=1.0, viewport-fit=cover`).
- `prefers-reduced-motion`: add a global CSS rule in `src/index.css` under `@media (prefers-reduced-motion: reduce)` that disables smooth scrolling (`scroll-behavior: auto`) and shortens animations/transitions (`animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` pattern). Remove the leftover Vite `logo-spin` animation block in `src/App.css` if it's unused.
- Contact form (`src/components/ContactForm.jsx`): status/error message container gets `role="status"` (success) / `role="alert"` (error); invalid fields get `aria-invalid` and `aria-describedby` pointing at their error text ids. Follow the existing validation structure — do not rewrite the form.
- Contrast: `src/components/ProjectCard.jsx` "Visit Project" `text-purple-600` → `text-purple-400`; `src/components/Footer.jsx` `text-blue-600` links → `text-blue-400`. (Both on dark backgrounds; the 400 shades clear WCAG AA 4.5:1.)
- `src/index.css` ~line 139: scope the mobile `user-select: none` so it does NOT apply to text content (at minimum, allow selection in the contact section / on links displaying the email). Simplest: apply `user-select: none` only to canvas/3D containers instead of globally.
