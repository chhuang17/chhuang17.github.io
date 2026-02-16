# Refactoring Plan — chhuang17.github.io

**Date:** 2026-02-14  
**Branch:** `refactor/refactor-repo`  
**Author:** GitHub Copilot

---

## 1. Current State Analysis

### 1.1 Project Structure

```｀
index.html                          ← Home page
about/index.html                    ← About page (291 lines)
blog/index.html                     ← Blog listing page
projects/index.html                 ← Projects listing page
posts/shp-intro/index.html          ← Blog article page (155 lines)
posts/rl-intro/index.html           ← Blog article page (155 lines, has bug)
project/highway-traffic-forecast/   ← Project article page (155 lines)
assets/style.css                    ← Single CSS file (1163 lines)
assets/main.js                      ← Theme toggle + scroll reveal (100 lines)
```

### 1.2 Identified Issues

#### A. Code Duplication

| Duplicated Block | Files Affected | Lines Duplicated |
|---|---|---|
| Header + Nav bar HTML | All 7 HTML files | ~10 lines × 7 = 70 |
| Footer HTML | All 7 HTML files | ~3 lines × 7 = 21 |
| `<head>` boilerplate (fonts, stylesheets) | All 7 HTML files | ~8 lines × 7 = 56 |
| Feed loader script (front-matter parsing, card rendering) | `blog/index.html`, `projects/index.html` | ~70 lines × 2 = 140 |
| Article renderer script (marked config, image caption, MathJax, load function) | `posts/shp-intro/`, `posts/rl-intro/`, `project/highway-traffic-forecast/` | ~100 lines × 3 = 300 |
| MathJax configuration block | 3 article pages | ~15 lines × 3 = 45 |

#### B. Bugs

1. **`posts/rl-intro/index.html`** fetches `'/posts/shp-intro/content.md'` instead of `'/posts/rl-intro/content.md'` — wrong article is loaded.
2. **`posts/rl-intro/index.html`** has `<title>Shortest Hamiltonian Path</title>` — copied from shp-intro and never updated.
3. **`project/highway-traffic-forecast/index.html`** also has `<title>Shortest Hamiltonian Path</title>`.

#### C. CSS Issues

1. **Nested CSS inside `body {}` selector** — `.brand`, `.nav`, `.btn`, `.markdown-body` rules are nested inside the `body {}` block. This relies on CSS Nesting (still not universally supported in all browsers).
2. **Conflicting `--wrap` definitions** — `--wrap: 1440px` in `:root`, overridden to `1280px` at `@media (min-width: 1440px)` and again at `@media (min-width: 1400px)`. The result is the layout shrinks on larger screens instead of staying consistent.
3. **Redundant `.container` media queries** — Two separate blocks for `min-width: 1920px` and `min-width: 957px` both set `max-width: 1440px`.
4. **Home hero grid minimum widths** — `minmax(520px, 1fr) minmax(520px, 1fr)` requires ≥1040px before wrapping. On tablets or narrow windows, content overflows.
5. **Inconsistent asset paths** — Root `index.html` uses relative paths (`assets/style.css`, `assets/main.js`), `about/index.html` mixes (`/assets/style.css` + `../assets/main.js`). Should all use absolute paths for consistency.

#### D. Responsive Layout

**Target baseline:** MacBook 14 Pro → effective CSS viewport ~1512px wide (retina scaled)

- The layout must look consistent at this viewport width and remain stable on wider/narrower screens.
- The current `--wrap` toggling between 1440px and 1280px causes layout shift.
- Solution: Use a single `--wrap` value and let the centered container naturally cap the width.

---

## 2. Refactoring Scope

### In Scope

- **Code optimization**: Remove duplication, modularize shared components (header, footer, feed loader, article renderer)
- **Responsive layout**: Ensure consistent visual across all screen sizes, using MacBook 14 Pro as the baseline
- **Bug fixes**: Correct wrong fetch paths, wrong `<title>`, nested CSS compatibility
- **CSS cleanup**: Consolidate conflicting media queries, remove redundant rules

### Out of Scope

- UI design changes (colors, fonts, animations remain the same)
- Site directory structure (Home / About / Projects / Blog remain unchanged)

---

## 3. Refactoring Details

### 3.1 Extract Shared HTML Components → JS Modules

Create `assets/components.js` that dynamically injects the header, footer, and `<head>` meta tags. Each page will only need a minimal HTML skeleton plus a `data-*` attribute to indicate the current nav item.

**New file: `assets/components.js`**
- `renderHeader(currentPage)` — Injects the site header + nav with correct `aria-current`
- `renderFooter()` — Injects the site footer
- Each HTML page reduces from ~20 lines of boilerplate to ~2 lines

### 3.2 Extract Feed Loader → `assets/feed-loader.js`

The blog listing and projects listing pages share 95% identical code for:
- Fetching `content.md`
- Parsing YAML front-matter
- Creating post-card DOM elements

**New file: `assets/feed-loader.js`**
- `loadFeed({ slugs, basePath, containerId })` — Generic function that takes configuration and renders feed cards

### 3.3 Extract Article Renderer → `assets/article-renderer.js`

All three article pages share identical code for:
- Configuring `marked` renderer
- `wrapImagesWithCaptions()`
- Loading markdown, stripping front-matter, rendering, and triggering MathJax

**New file: `assets/article-renderer.js`**
- `renderArticle({ contentPath })` — Takes a content.md path, renders the article

### 3.4 CSS Consolidation

1. **Fix nested CSS** — Move `.brand`, `.nav`, `.btn`, `.markdown-body` rules out of the `body {}` block
2. **Unify `--wrap`** — Set `--wrap: 1280px` (single value, no overrides). This is the effective content width the original site used on MacBook 14 Pro's ~1512px viewport (via conflicting media queries), providing ~116px of breathing room on each side — matching the original layout exactly
3. **Remove conflicting media queries** — Delete the redundant `min-width: 1920px`, `min-width: 957px`, `min-width: 1440px`, and `min-width: 1400px` container overrides
4. **Restore home-hero grid** — Keep `minmax(520px, 1fr)` two-column layout with `gap: clamp(3rem, 8vw, 6rem)` as the original. This requires `≥ ~1100px` viewport; switch to single-column below that
5. **Comprehensive responsive breakpoints** — four-tier breakpoint system:
   - `≤ 1100px`: Hero single-column, photo card centered & resized
   - `≤ 840px`: Post cards single-column
   - `≤ 640px`: Header wraps to two lines, font sizes scale down
   - `≤ 480px` (iPhone 15): Tighter padding, single-column everything, smaller nav

### 3.5 Normalize Asset Paths

All HTML files will use absolute paths (`/assets/style.css`, `/assets/main.js`, etc.) for consistency.

---

## 4. Git Commit Plan

Each commit is atomic, testable, and follows conventional commit style.

| # | Commit Message | Description |
|---|---|---|
| 1 | `docs: add refactoring plan` | Add `spec/refactoring-plan.md` |
| 2 | `fix: correct rl-intro fetch path and page titles` | Fix `rl-intro/index.html` fetching wrong content.md; fix incorrect `<title>` tags in rl-intro and highway-traffic-forecast |
| 3 | `refactor: normalize asset paths to use absolute URLs` | Change all HTML files to use `/assets/style.css`, `/assets/main.js` consistently |
| 4 | `refactor: extract shared header and footer into components.js` | Create `assets/components.js`; update all 7 HTML pages to use it; remove duplicated header/footer markup |
| 5 | `refactor: extract feed loader into shared module` | Create `assets/feed-loader.js`; refactor `blog/index.html` and `projects/index.html` to use it |
| 6 | `refactor: extract article renderer into shared module` | Create `assets/article-renderer.js`; refactor all 3 article pages to use it |
| 7 | `refactor: consolidate CSS and fix responsive layout` | Fix nested CSS, unify `--wrap`, remove conflicting media queries, fix home-hero grid breakpoints |

---

## 5. Post-Refactoring File Structure

```
index.html                          ← Simplified (boilerplate removed)
about/index.html                    ← Simplified
blog/index.html                     ← Simplified (inline script → feed-loader.js)
projects/index.html                 ← Simplified (inline script → feed-loader.js)
posts/shp-intro/index.html          ← Simplified (inline script → article-renderer.js)
posts/rl-intro/index.html           ← Simplified + bug fixed
project/highway-traffic-forecast/   ← Simplified (inline script → article-renderer.js)
assets/
  style.css                         ← Cleaned up, consistent responsive rules
  main.js                           ← Theme toggle + scroll reveal (unchanged logic)
  components.js                     ← NEW: shared header/footer renderer
  feed-loader.js                    ← NEW: shared blog/project feed loader
  article-renderer.js               ← NEW: shared article page renderer
spec/
  refactoring-plan.md               ← This document
```

---

## 6. Risk Assessment

| Risk | Mitigation |
|---|---|
| JS-injected header/footer may cause flash of unstyled content (FOUC) | Components.js loads synchronously before DOM paint; CSS already defines header/footer dimensions |
| Breaking existing bookmark URLs | No URL changes — all paths remain identical |
| MathJax loading order | article-renderer.js will inject MathJax config before the script tag, maintaining current behavior |
| CSS nesting removal may cause visual regression | Each nested rule will be extracted to top-level scope with identical selectors — no visual change expected |
