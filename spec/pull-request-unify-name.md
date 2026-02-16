# Pull Request: Unify Display Name to Will Huang

**Branch:** `refactor/unify-display-name` → `main`  
**Commits:** 1

---

## Summary

Standardize the display name across the entire site from "Chien-Hao Huang" to "Will Huang" for a consistent, recruiter-friendly identity. The article footer bylines already used "Will Huang" — this PR brings the remaining 17 occurrences into alignment.

## Motivation

- The article-end-footer component (merged in PR #28) introduced "Written by Will Huang" as the byline
- All other surfaces (navbar, hero, page titles, footer copyright) still displayed "Chien-Hao Huang", creating an inconsistency
- "Will Huang" is more memorable and approachable for international recruiters while the formal name remains visible on the resume PDF and LinkedIn profile

## Changes

### Replacements (17 occurrences → "Will Huang")

| Location | File(s) | Before | After |
|----------|---------|--------|-------|
| Page `<title>` | `index.html`, `about/`, `blog/`, `projects/` | `Chien-Hao Huang` | `Will Huang` |
| Hero `<h1>` | `index.html` | `Chien-Hao Huang` | `Will Huang` |
| About `<h1>` | `about/index.html` | `Chien-Hao Huang` | `Will Huang` |
| Navbar brand | `assets/components.js` | `Chien-Hao Huang` | `Will Huang` |
| Footer copyright | `assets/components.js` | `© 2025 Chien-Hao Huang` | `© 2025–2026 Will Huang` |
| Article title suffix | `assets/article-renderer.js` | `｜Chien-Hao Huang` | `｜Will Huang` |
| Image `alt` text | `index.html`, `about/`, 4 project pages, 2 blog posts | `Chien-Hao Huang` | `Will Huang` |

### Additional

- Updated copyright year from `2025` to `2025–2026`

## Files Changed (12)

```
 about/index.html                            | 6 +++---
 assets/article-renderer.js                  | 2 +-
 assets/components.js                        | 4 ++--
 blog/index.html                             | 2 +-
 index.html                                  | 6 +++---
 posts/rl-intro/index.html                   | 2 +-
 posts/shp-intro/index.html                  | 2 +-
 project/highway-traffic-forecast/index.html | 2 +-
 project/logistics-optimization/index.html   | 2 +-
 project/mlops-pipeline/index.html           | 2 +-
 project/rma-forecasting/index.html          | 2 +-
 projects/index.html                         | 2 +-
```

**+17 / −17** (pure rename, no structural changes)

## Testing

- [x] No remaining occurrences of "Chien-Hao Huang" in any `.html` or `.js` file
- [x] Navbar brand displays "Will Huang" on all pages
- [x] Page titles show "Will Huang" in browser tab
- [x] Hero section on homepage shows "Will Huang"
- [x] About page heading shows "Will Huang"
- [x] Site footer copyright updated to "© 2025–2026 Will Huang"
- [x] All image `alt` attributes updated for accessibility consistency
