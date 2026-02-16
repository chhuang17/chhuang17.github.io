# docs(about): update About page content based on resume

## Summary

Rewrites the About page with accurate content sourced from the latest resume. Replaces AI-generated placeholder text (fake KPIs, generic intro) with genuine professional history, honest technical impact descriptors, and a refined personal narrative. Also fixes a mobile layout regression and adds the resume PDF to the repo for reference.

**Branch:** `docs/update-about-section` → `main`

**Scope:** 6 files changed — `+479 −38`

## Motivation

The original About page contained several placeholder elements that didn't reflect reality:

- **"Selected Highlights"** section displayed fabricated metrics (e.g., `10+ Models`, `12% WAPE`) that were never validated against actual work.
- **Quote and intro text** were generic AI-generated copy with no personal voice.
- **Experience section** lacked detail; Education section was missing entirely.

This PR corrects all of the above to present an honest, professional profile aligned with the user's stated goal: *「樸實且專業的，不是花言巧語過度包裝的工程師」*.

## Changes

### Content Updates (`about/index.html`)

| Section | Before | After |
|---|---|---|
| **Quote** | "I see machine learning as..." (generic) | "Good models answer questions. Great systems turn those answers into action." |
| **Intro heading** | Generic title | "From Traffic Flows to Data Pipelines" — narrative connecting civil engineering background to current data science work |
| **Experience** | Minimal bullet points | Detailed timeline with 3 roles: Garmin BI Engineer, Gastom Data Scientist, CECI Transportation Engineer |
| **Education** | ❌ Missing | ✅ Added — NTU M.S. (DDPG + VISSIM thesis) and TKU B.S., using the same timeline component as Experience |
| **Technical Impact** | Fake KPIs (`10+`, `12%`, etc.) | Honest capability labels: Production / End-to-End Pipelines, Lifecycle / Automated Retraining, Optimization / Constraint-Based Routing, Monitoring / Data Drift Detection |
| **Work Focus** | N/A | 3 feature cards: RMA Return Forecasting, MLOps & Monitoring, Logistics Optimization |

### Mobile Layout Fix (`assets/style.css`)

**Problem:** On viewports ≤ 920px (e.g., iPhone 15 at 393px), the profile photo overlapped the intro text due to `position: sticky` on `.about-aside`.

**Fix:**
- Removed `position: sticky` on `.about-aside` for screens ≤ 920px
- Added `max-width: 360px` and `max-height: 400px` constraints to the photo card
- Centered the photo with `margin-inline: auto`
- Ensured proper single-column stacking order: photo → quote → intro

### New Files

| File | Purpose |
|---|---|
| `assets/will_huang_resume.pdf` | Latest resume PDF for reference |
| `spec/about-page-update-plan.md` | Analysis document: section-by-section recommendations and decisions |
| `spec/refactoring-plan.md` | Technical refactoring notes |

## Commits

| # | Hash | Message |
|---|---|---|
| 1 | `c1327d0` | `docs(about): update content based on resume and refine copy` |
| 2 | `443f380` | `fix(about): prevent photo overlapping text on mobile` |
| 3 | `8bd474a` | `docs(assets): add latest resume PDF for reference` |

## Testing

- [x] Verified desktop layout at 1512px (MacBook 14 Pro) — no visual regression
- [x] Verified mobile layout at 393px (iPhone 15) — photo no longer overlaps text
- [x] Confirmed responsive breakpoint at 920px triggers single-column correctly
- [x] Timeline component renders consistently for both Experience and Education
- [x] All existing sections (Skills tabs, Contact cards) remain unaffected
- [x] Theme toggle (dark/light) works correctly with updated content

## Screenshots

> *Attach before/after screenshots of desktop and mobile views when creating the PR on GitHub.*

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Content tone mismatch | Low | All copy reviewed and approved during iterative editing sessions |
| Education CSS classes unused | None | `.education-grid` styles remain in CSS but are inert; can be cleaned up in a follow-up |
| Work Focus card links are `#` | Low | Placeholder hrefs — will link to real project pages when available |
