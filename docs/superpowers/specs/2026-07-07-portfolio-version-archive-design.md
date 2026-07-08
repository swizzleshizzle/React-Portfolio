# Portfolio Version Archive & Hot-Swap — Design Spec

**Date:** 2026-07-07
**Author:** Michael Greene (with agent collaboration)
**Status:** Design approved — awaiting spec review before implementation planning.
**Related:** [`../../2026-07-07-full-code-review.md`](../../2026-07-07-full-code-review.md) (Phase 0 prerequisite fixes)

---

## Goal

Preserve every iteration of the portfolio as a permanent, browsable archive. When a new version ships, the old one is frozen exactly as it was — not maintained, not upgraded, never silently broken by future dependency changes. Visitors can switch between versions ("hot-swap"), and look back through the site's history directly.

This spec covers the **infrastructure** to freeze, list, and switch versions, plus **capturing today's portfolio as the first frozen version (v1)**. It does **not** cover the v2 redesign itself — that is separate work.

## Non-goals

- The v2 visual redesign (planned separately).
- Buttery in-app transitions between versions. Switching is a full page navigation into a self-contained frozen build — chosen deliberately for isolation and long-term fidelity over animation smoothness.
- Automated thumbnail generation, automated changelog, or a CMS. The manifest is hand-authored to keep the narrative in the author's voice.

---

## Key decision: frozen snapshots, not living code

Each version is captured as its **compiled build output** and committed to the repo. It is never rebuilt. This is the critical choice, driven by the Three.js-heavy stack: `three` / `@react-three/fiber` / `drei` break frequently across versions, and the 780-line R3F hero is exactly the kind of code a future upgrade would break. Freezing the *built artifact* (not the source) means old versions are immutable static files — zero ongoing maintenance, perfect fidelity.

> **⚠️ REDLINE (2026-07-07 review):** Accepted cost, stated explicitly: each snapshot commits a full build (~4–6 MB: Three.js vendor chunk + ~2.4 MB GLB/image assets + ~0.5 MB public) to git **permanently**. Fine at one version/year; irreversible without history rewriting. Landing the Phase 0 favicon fix first saves ~1.26 MB per snapshot.

**Rejected alternatives:**
- *Living in one codebase* (all versions as component trees sharing today's deps): smoother switching, but a future `three`/React upgrade could silently break frozen versions, and every version's code would ship forever in one growing bundle. Defeats the archival goal.
- *Rebuilt from git tags in CI*: keeps the repo clean, but rebuilding re-runs against the lockfile and can rot; partly defeats "frozen."
- *Server-side-only snapshots*: not version-controlled, and the deploy's `rsync --delete` would wipe them without careful excludes (the deploy already guards a co-tenant `Tools/` dir this way).

---

## Architecture

### URL model
- `/` → always the **live/latest** app (today: the current portfolio; later: the redesign).
- `/archive/v1/`, `/archive/v2/`, … → **immutable frozen snapshots**, each a complete self-contained built site.
- `/versions.json` → the live manifest (single source of truth).

### Naming
Stable **sequential paths** (`/archive/v1/`) with **rich labels in the manifest**. URLs stay clean and permanent; the UI shows a human name, date, and description.

### The frozen-but-not-stale mechanism
The `VersionSwitcher` is baked into every version, but it **fetches `/versions.json` at runtime** (absolute root path, so all versions read the same canonical manifest). A frozen v1 built today will automatically list v3 added years later — its code is frozen, its data is live.

**Accepted caveat:** the switcher's *own look* is frozen inside each old version. Redesigning the badge later leaves old versions with the old badge. This is acceptable — even authentic to an archive.

> **⚠️ REDLINE (2026-07-07 review):** The deployed `.htaccess` caches `application/json` for **1 week** (`ExpiresByType application/json "access plus 1 week"`), which undermines this live-manifest mechanism — after cutting a new version, visitors and frozen builds may see a stale manifest for up to a week. Add a `Cache-Control: no-cache` carve-out for `versions.json` (or cache-bust the fetch). Also: the snapshot script should strip the nested `.htaccess` copy from each snapshot along with the nested `archive/` dir.

### Manifest schema (`public/versions.json`)
```json
{
  "latest": "v1",
  "versions": [
    {
      "id": "v1",
      "label": "Original 3D Portfolio",
      "date": "2026-05",
      "path": "/archive/v1/",
      "thumbnail": "/archive/thumbs/v1.jpg",
      "note": "The first public portfolio — React 19 + Three.js hero, 3D word cloud, interactive ships."
    }
  ]
}
```
- `latest` = the `id` currently served at `/`.
- `versions` = newest-first list. Each entry: `id`, `label` (human name), `date`, `path`, `thumbnail`, `note` (author-written).
- Hand-edited when cutting a version.

### `.htaccess` interaction (no config changes needed)
The deployed `public/.htaccess` rewrites non-file/non-dir requests to `index.html`. Consequently:
- `/archive/v1/` is a **real directory** with a real `index.html` → serves the frozen build directly.
- `/archive` (no version) is **not** a real dir → rewrite serves the SPA → renders the archive page.

Clean separation with the existing rewrite rule.

> **⚠️ REDLINE (2026-07-07 review):** The claim above is **wrong once the archive exists**. Creating `public/archive/v1/` makes `dist/archive/` a *real directory* on the server, so the rewrite's `!-d` condition no longer matches `/archive` — Apache will serve the bare directory (403 or listing) instead of the SPA. **`.htaccess` changes ARE needed:** add an explicit rule such as `RewriteRule ^archive/?$ /index.html [L]` ahead of the generic fallback (or move the archive page to a URL that is never a real directory, e.g. `/versions`).

---

## Components

| Component | Responsibility | Location |
|---|---|---|
| **Manifest** | Single source of truth for which versions exist. Served at `/versions.json`. | `public/versions.json` |
| **`VersionSwitcher`** | Persistent corner badge. Fetches `/versions.json`, shows current version, expands to a list, navigates on click. Knows its own version via build-time `VITE_VERSION_ID`. | `src/components/VersionSwitcher.jsx` |
| **Snapshot script** | `node scripts/snapshot-version.mjs <id>` → builds with `base=/archive/<id>/`, stamps `VITE_VERSION_ID`, writes flat output into `public/archive/<id>/`. | `scripts/snapshot-version.mjs` + `snapshot` npm script |
| **Archive page** | `/archive` route (added to the currently-empty `BrowserRouter`) — gallery/timeline rendered from the manifest. Phase 3. | `src/pages/Archive.jsx` |
| **Thumbnails** | One committed preview image per version. Manual screenshot. | `public/archive/thumbs/<id>.jpg` |

### Version stamping
Each build is stamped with its version id so the badge knows where it sits:
- The live `/` app: `VITE_VERSION_ID` = the current `latest` id (e.g. from `.env` or default).
- A snapshot build: the snapshot script passes `VITE_VERSION_ID=<id>` for that build.

The badge reads `import.meta.env.VITE_VERSION_ID`, finds itself in the manifest, and renders "current" state accordingly.

> **⚠️ REDLINE (2026-07-07 review):** "from `.env` or default" has no production delivery mechanism — the prod `.env` is generated inside `deploy.yml` (Create .env file step), so that step **must also write `VITE_VERSION_ID`** or the live site's badge won't know its own version. The badge must also degrade gracefully when `VITE_VERSION_ID` is unset (local dev) and when a manifest entry's `thumbnail` is missing.

### `VersionSwitcher` behavior
- On mount: `fetch('/versions.json')`. On failure (e.g. offline/dev without manifest): render nothing or a static fallback — never block the page.
- Collapsed: shows current version label + date (e.g. "v1 · 2026").
- Expanded: lists all versions newest-first; current is marked; others are links to their `path`.
- Navigation: a normal anchor to `path` (full navigation into the target version's document).
- Accessible: keyboard-operable, labeled, focus-visible, respects `prefers-reduced-motion` for any expand animation. (Consistent with review a11y fixes.)

---

## Snapshot workflow (the repeatable ritual)

When a version is "done":
1. `npm run snapshot -- v1` — builds with `base=/archive/v1/` and `VITE_VERSION_ID=v1`, writes flat output to `public/archive/v1/`.
2. Add a thumbnail screenshot at `public/archive/thumbs/v1.jpg`.
3. Add the entry to `public/versions.json` (author writes `label` + `note`).
4. Commit. Deploy rides the normal `rsync` (`public/` → `dist/` → live).

**Implementation detail — flat snapshots:** a Vite build copies the entire `publicDir` (including `public/archive/`) into its own output, which would nest prior archives inside the new snapshot. The snapshot script MUST strip the nested `archive/` directory from the build output before moving it into `public/archive/<id>/`, keeping snapshots flat and preventing recursive growth. (Build to a temp dir → delete `<tmp>/archive/` → move to `public/archive/<id>/`.)

**"latest" pointer semantics:** when v(N+1) ships at `/`, the previous latest is frozen via this workflow, `versions.json.latest` is updated to the new id, and the previous version's `path` points at its `/archive/` location. v1 and `/` are the same content until the redesign replaces `/`.

---

## Sequencing

| Phase | Work | Owner |
|---|---|---|
| **Phase 0** | Land review fixes that affect the rendered artifact: **P0 (perf), P1 (correctness/a11y), P2 (hardening)** from the code-review doc. P3 tooling (CI gate, Node 20, ESLint) does not change the frozen output and can trail — it does **not** gate the freeze. | Agents + author |
| **⏸ Manual gate** | **Author refreshes the projects section** — expose recently public repos so the frozen v1 reflects current work. Scope/details TBD when reached. | Author |
| **Phase 1** | Switcher infrastructure: `versions.json`, `VersionSwitcher` badge, version stamping, snapshot script. Added to the live app. | Agents + author |
| **Phase 2** | Freeze the current portfolio as **v1** → `public/archive/v1/`, manifest entry, thumbnail. | Agents + author |
| **Phase 3** | Archive page at `/archive`. | Agents + author |
| **Future** | Redesign becomes **v2** at `/`; v1 stays frozen forever. | Later |

By the freeze (Phase 2), v1 = the current portfolio **+ review fixes + updated projects + the switcher badge** — a good, working legacy version, not a broken one.

---

## Testing / verification

- **Snapshot script:** running it produces a self-contained `public/archive/<id>/` whose `index.html` references `/archive/<id>/...` assets; the nested `archive/` is stripped; opening the built path renders the frozen site.
- **Manifest:** `versions.json` is valid JSON; the switcher renders every entry; the current version is correctly identified via `VITE_VERSION_ID`.
- **Switcher:** loads and lists versions from the root manifest on both the live app and inside a frozen snapshot; navigation lands on the correct version; keyboard-operable; hidden gracefully if the manifest fails to load.
- **Routing/`.htaccess`:** `/archive/v1/` serves the frozen build; `/archive` serves the SPA archive page; deep links to both survive a hard refresh (rewrite behavior).
- **End-to-end freeze:** freeze the current app as v1, deploy locally (`vite preview` or built `dist/`), confirm `/` and `/archive/v1/` both render and the switcher moves between them.

## Open items (deferred to their phase)

- Exact projects-section refresh scope — resolved at the manual gate.
- Visual design of the badge and archive page — will follow the v2 design language once it exists; MVP badge is functional and unobtrusive.
- Whether the archive page ships in Phase 3 or is folded into the v2 redesign — revisit after Phase 2.
