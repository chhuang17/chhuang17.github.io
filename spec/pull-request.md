# Modularize codebase and fix responsive layout

## Summary

This PR refactors the entire site codebase to eliminate heavy code duplication, fix existing bugs, and add a comprehensive responsive layout system. The result is a significantly leaner, more maintainable project with consistent behavior across screen sizes from MacBook 14 Pro (~1512px) down to iPhone 15 (393px).

**Key metrics:**
- **12 files** changed: `+632 −479` (net −847 lines of duplicated code removed, replaced by 3 shared modules)
- **3 new JS modules** created to replace copy-pasted inline scripts
- **4-tier responsive breakpoints** added for graceful degradation across devices

## Changes

### Bug Fixes

- **`posts/rl-intro/index.html`** was fetching `/posts/shp-intro/content.md` instead of its own — a copy-paste bug that caused the wrong article to render
- **`<title>` tags** in `rl-intro` and `highway-traffic-forecast` both incorrectly read "Shortest Hamiltonian Path" — now corrected to their actual article titles
- **`posts/rl-intro/`** directory added to version control (was previously untracked)

### Code Modularization

| Module | Purpose | Duplication Removed |
|---|---|---|
| `assets/components.js` | Shared header (nav + theme toggle) and footer renderer via `data-page` attribute | ~70 lines across 7 pages |
| `assets/feed-loader.js` | Generic `loadFeed()` for blog/project listing pages (front-matter parsing, card DOM, navigation) | ~140 lines across 2 pages |
| `assets/article-renderer.js` | Shared `renderArticle()` handling marked config, image-to-figure wrapping, front-matter stripping, and MathJax typesetting | ~300 lines across 3 pages |

**Page size reductions:**

| Page | Before | After | Reduction |
|---|---|---|---|
| `blog/index.html` | ~110 lines | 32 lines | 70% |
| `projects/index.html` | ~110 lines | 32 lines | 70% |
| `posts/shp-intro/index.html` | 155 lines | 48 lines | 69% |
| `posts/rl-intro/index.html` | 155 lines | 48 lines | 69% |
| `project/highway-traffic-forecast/index.html` | 155 lines | 48 lines | 69% |

### Asset Path Normalization

All HTML files now use absolute paths (`/assets/style.css`, `/assets/main.js`) for consistency. Previously, `index.html` used relative paths and `about/index.html` mixed absolute and relative references.

### CSS Consolidation & Responsive Layout

- **Fixed nested CSS** — Moved `.brand`, `.nav`, `.btn`, `.markdown-body` rules out of the `body {}` block (CSS Nesting compatibility)
- **Unified `--wrap`** — Set to `1280px` (single value, no conflicting media query overrides). This matches the effective content width the original layout used on MacBook 14 Pro
- **Removed redundant media queries** — Deleted conflicting `min-width: 1920px`, `min-width: 957px`, `min-width: 1440px`, and `min-width: 1400px` container overrides
- **Added 4-tier responsive breakpoints:**

| Breakpoint | Behavior |
|---|---|
| ≤ 1100px | Hero switches to single-column; photo card centered and resized |
| ≤ 840px | Post cards switch to single-column layout |
| ≤ 640px | Header wraps to two lines; font sizes scale down |
| ≤ 480px | Tighter padding for mobile viewports (iPhone 15) |

## Commits

1. `fix: correct rl-intro fetch path and page titles`
2. `refactor: normalize asset paths to use absolute URLs`
3. `refactor: extract shared header and footer into components.js`
4. `refactor: extract feed loader into shared module`
5. `refactor: extract article renderer into shared module`
6. `refactor: consolidate CSS and fix responsive layout`

## Testing

- Verified layout on MacBook 14 Pro (1512px viewport) — matches original design
- Verified responsive behavior at all 4 breakpoints via browser DevTools
- Confirmed all article pages render correct content (rl-intro bug fix validated)
- Theme toggle (dark/light) works correctly with dynamically injected header
- MathJax rendering verified on article pages

## Risk Assessment

| Risk | Mitigation |
|---|---|
| JS-injected header/footer may cause FOUC | `components.js` loads synchronously before DOM paint; CSS already defines header/footer dimensions |
| Breaking existing bookmark URLs | No URL changes — all paths remain identical |
| MathJax loading order | `article-renderer.js` preserves the original MathJax config + script tag ordering |
| CSS nesting removal may cause visual regression | Each nested rule extracted to top-level scope with identical selectors |
