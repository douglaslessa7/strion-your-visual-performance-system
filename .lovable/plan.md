

## Plan: Tap-to-Expand Task Instructions

### Overview
Add expandable instructions to task rows in both Dashboard and Protocol screens. Tapping a task row reveals its `instructions` field; only one task expanded at a time.

### Changes

**1. `src/hooks/useDashboardData.ts`**
- Add `instructions?: string` to the `Task` interface so it flows through to `todayMissions`

**2. `src/pages/Dashboard.tsx`**
- Add `expandedTask` state (`string | null`) tracking the currently expanded task label
- Split each mission row: checkbox area toggles done/not-done, but the row itself also handles expand/collapse
- Tapping the row expands/collapses instructions; tapping the checkbox toggles completion
- If `m.instructions` exists and is non-empty: show a `ChevronDown`/`ChevronRight` icon on the right; on expand, render instructions text below the label in `text-xs text-muted-foreground`
- If no instructions: no chevron, row not expandable
- Expanding a new task collapses the previous one

**3. `src/pages/Protocol.tsx`**
- Add `instructions?: string` to `TaskItem` interface
- Add `expandedTask` state (`string | null`)
- For each task row in the three sections: if `task.instructions` exists and is non-empty, show a chevron on the right and make the row tappable to expand/collapse
- On expand, show `task.instructions` below the label in `text-xs text-muted-foreground`
- Only one task expanded at a time across all sections/weeks

### Visual Spec
- Instructions text: `text-xs text-muted-foreground` below the task label, inside the same row container, with `mt-1 pl-2`
- Chevron: `ChevronRight` (collapsed) / `ChevronDown` (expanded), `w-3.5 h-3.5 text-muted-foreground`, right-aligned
- Transition: chevron rotation via `transition-transform duration-200`

### Interaction Detail (Dashboard)
- The checkbox area (left side) handles `toggleMission` on click with `e.stopPropagation()`
- The outer row `div` (not `button`) handles expand/collapse on click
- This separates "mark done" from "view instructions"

