

I'm using knowledge

## Plan: Filter Dashboard Missions and Separate Protocol Tasks by Type

### Changes Required

**1. `src/hooks/useDashboardData.ts`** — Add `task_type` to the Task interface and filter `todayMissions` to only include `daily_active` tasks.

- Update `Task` interface to include `task_type?: string`
- Filter: `todayMissions = tasks.filter(t => t.task_type === "daily_active").map(...)`
- Execution score calculation should also only count `daily_active` tasks

**2. `src/pages/Dashboard.tsx`** — No changes needed (filtering happens in the hook).

**3. `src/pages/Protocol.tsx`** — Add `task_type` to `TaskItem` interface and render three grouped sections per week:

- Group tasks into three arrays: `daily_active`, `one_time_setup`, `continuous_habit`
- Render each non-empty group under a section title:
  - **Daily Missions** → `task_type === "daily_active"`
  - **This Week Setup** → `task_type === "one_time_setup"`
  - **Ongoing Habits** → `task_type === "continuous_habit"`
- Section titles use the existing `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground` label style
- Empty sections are hidden entirely

### Scope

- No database changes
- No new components
- Only filtering logic and visual grouping within existing UI

