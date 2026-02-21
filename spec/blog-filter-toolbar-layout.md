# Blog Filter Toolbar Layout — UI Proposal

## Current State

The Blog page toolbar currently stacks **category filter** (All | Tech | Career | Life) **above** the **sort bar** (Newest | Oldest | Popular) in a vertical layout:

```
┌──────────────────────────────────────────────────┐
│  [All] [Career] [Life] [Tech]                    │   ← filter-bar (row 1)
│  [Newest] [Oldest] [Popular]                     │   ← sort-bar  (row 2)
├──────────────────────────────────────────────────┤
│  Post cards ...                                  │
```

## Proposal: Single-Row Inline Layout

Place **sort buttons on the left** and **category filter on the right**, on the same row. This creates a cleaner, more compact toolbar that mirrors common UI patterns (primary action left, secondary filter right).

```
┌──────────────────────────────────────────────────┐
│  [Newest] [Oldest] [Popular]   [All] [Career]…  │   ← one row
├──────────────────────────────────────────────────┤
│  Post cards ...                                  │
```

### Design Rationale

1. **Spatial efficiency** — Collapses two rows into one, giving more vertical space to content.
2. **Semantic grouping** — Sort controls (how to order) and filter controls (what to show) are visually separated by whitespace, making it intuitive to distinguish their purposes.
3. **Consistent with existing patterns** — Many content listing UIs (GitHub Issues, Medium, blog platforms) place sort and filter on the same row with `justify-content: space-between`.
4. **Mobile fallback** — On narrow screens (≤ 600px), the toolbar falls back to the current stacked layout via a media query, so usability is preserved on mobile.

### Visual distinction

To further differentiate filter buttons from sort buttons and make the active category more prominent:

- **Filter buttons** keep the existing pill style but use a **filled accent color** when active (same as current).
- **A subtle label** ("Filter:" or an icon) is optional but not necessary — the spatial separation already communicates the grouping clearly.

## Implementation Plan

### CSS Changes (`assets/style.css`)

Change `.feed-toolbar` from `flex-direction: column` to `flex-direction: row` with `justify-content: space-between` and `align-items: center`. Add a media query for mobile (≤ 600px) to revert to column layout.

```css
.feed-toolbar {
  display: flex;
  flex-direction: row;              /* ← changed from column */
  justify-content: space-between;   /* ← sort left, filter right */
  align-items: center;
  gap: .5rem;
  flex-wrap: wrap;
  padding-bottom: .75rem;
  border-bottom: 1px solid var(--border);
}

@media (max-width: 600px) {
  .feed-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

### JS Changes (`assets/feed-loader.js`)

Swap the DOM append order in `renderToolbar()` so **sort-bar is appended first** (left) and **filter-bar second** (right). Alternatively, use CSS `order` property, but changing the append order is simpler and more readable.

### Scope

- CSS-only change for layout + one minor JS reorder
- No changes to filter/sort logic
- No changes to post cards or badge rendering

## Decision

**Recommendation: Implement in this branch** — the change is small (CSS layout tweak + JS reorder), self-contained, and directly improves the current implementation. No reason to defer.
