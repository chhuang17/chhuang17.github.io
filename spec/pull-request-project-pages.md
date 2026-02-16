# Pull Request: Add Project Pages & Article Footer

**Branch:** `docs/add-project-pages` → `main`  
**Commits:** 2

---

## Summary

This PR adds three new project detail pages (RMA Forecasting, MLOps Pipeline, Logistics Optimization) and introduces a unified `article-end-footer` component across all article pages (4 projects + 2 blog posts). It also cleans up outdated spec files from the previous PR cycle.

## Changes

### New Project Pages

| Project | Path | Description |
|---------|------|-------------|
| RMA Return Forecasting | `project/rma-forecasting/` | Multi-horizon RMA forecasting with iTransformer + XGBoost hybrid architecture |
| Scalable MLOps Architecture | `project/mlops-pipeline/` | Airflow + KubernetesPodOperator retraining pipeline with MLflow and Evidently AI |
| Logistics & Route Optimization | `project/logistics-optimization/` | Open VRP solver with custom spatio-temporal clustering and Google OR-Tools |

Each project page includes:
- `content.md` — detailed write-up with YAML frontmatter
- `index.html` — Medium-style renderer using `marked.js` + MathJax

### Article End Footer (`article-end-footer`)

A new reusable footer component applied to all 6 article pages, replacing the plain `← 回到 Projects` link:

- **Recommendation cards** (`rec-grid`) — contextual links to related articles
- **Author bar** (`author-bar`) — profile photo, name, bio, and social icon links
- **Back button** (`back-row`) — styled CTA linking to `/projects/` or `/blog/`

Design decisions:
- Icons use filled SVGs matching the homepage icon style (LinkedIn, Email)
- Circular icon buttons (36px) with `var(--muted)` color, `var(--brand)` on hover
- Footer width aligned with article content via shared `--read-content: 52rem`
- Responsive breakpoints at 840px (tablet) and 480px (mobile)
- 3rem bottom padding before site footer for visual separation

### Navigation Updates

- `about/index.html` — Work Focus cards now link to the 3 new project pages
- `projects/index.html` — `loadFeed()` slug list updated with 3 new project slugs

### Cleanup

Removed outdated spec files from the previous PR cycle:
- `spec/about-page-update-plan.md`
- `spec/pull-request.md`
- `spec/refactoring-plan.md`

## Files Changed (15)

```
 about/index.html                            |  12 +-
 assets/style.css                            | 204 ++++++++++++++++++++++-
 posts/rl-intro/index.html                   |  26 ++-
 posts/shp-intro/index.html                  |  26 ++-
 project/highway-traffic-forecast/index.html |  30 ++-
 project/logistics-optimization/content.md   |  49 ++++++  (new)
 project/logistics-optimization/index.html   |  76 +++++++++  (new)
 project/mlops-pipeline/content.md           |  47 ++++++  (new)
 project/mlops-pipeline/index.html           |  76 +++++++++  (new)
 project/rma-forecasting/content.md          |  52 +++++++  (new)
 project/rma-forecasting/index.html          |  76 +++++++++  (new)
 projects/index.html                         |   7 +-
 spec/about-page-update-plan.md              |  87 -----------  (deleted)
 spec/pull-request.md                        |  80 -----------  (deleted)
 spec/refactoring-plan.md                    | 172 -------------------  (deleted)
```

**+668 / −352**

## Testing

- [x] All 6 article pages render correctly with footer component
- [x] Recommendation cards link to correct sibling articles
- [x] Social icons display consistently with homepage style
- [x] Responsive layout verified at desktop, tablet (840px), and mobile (480px)
- [x] Dark/light theme transitions work for all new components
- [x] `loadFeed()` on `/projects/` lists all 4 projects correctly

## Follow-up

- [ ] Unify display name to "Will Huang" across header, hero, and all pages (separate branch)
- [ ] Update Work Focus card summaries on About page (currently placeholder text)
