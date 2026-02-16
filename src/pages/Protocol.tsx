import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/dashboard/BottomNav";
import { cn } from "@/lib/utils";

interface TaskItem {
  id: string;
  name: string;
  category: string;
}

interface WeekData {
  week: number;
  tasks: TaskItem[];
}

interface PhaseData {
  phase: string;
  label: string;
  weeks: WeekData[];
}

const PHASE_META: Record<string, { label: string; weekRange: string }> = {
  foundation: { label: "Phase 1 — Foundation", weekRange: "Weeks 1–4" },
  structure: { label: "Phase 2 — Structure", weekRange: "Weeks 5–8" },
  refinement: { label: "Phase 3 — Refinement", weekRange: "Weeks 9–12" },
};

const PHASE_ORDER = ["foundation", "structure", "refinement"];

const Protocol = () => {
  const { user } = useAuth();
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const [profileRes, assignmentsRes] = await Promise.all([
        supabase.from("profiles").select("current_phase, current_week").eq("id", user.id).single(),
        supabase.from("protocol_assignments").select("phase, week, tasks").eq("user_id", user.id).order("week", { ascending: true }),
      ]);

      if (profileRes.data) {
        setCurrentPhase(profileRes.data.current_phase);
        setCurrentWeek(profileRes.data.current_week);
      }

      if (assignmentsRes.data) {
        const grouped: Record<string, WeekData[]> = {};

        for (const row of assignmentsRes.data) {
          if (!grouped[row.phase]) grouped[row.phase] = [];
          const tasks = Array.isArray(row.tasks) ? (row.tasks as unknown as TaskItem[]) : [];
          grouped[row.phase].push({ week: row.week, tasks });
        }

        const result: PhaseData[] = PHASE_ORDER
          .filter((p) => grouped[p])
          .map((p) => ({
            phase: p,
            label: PHASE_META[p]?.label ?? p,
            weeks: grouped[p].sort((a, b) => a.week - b.week),
          }));

        setPhases(result);

        // Auto-expand current week
        if (profileRes.data?.current_phase && profileRes.data?.current_week) {
          setExpandedWeeks(new Set([`${profileRes.data.current_phase}-${profileRes.data.current_week}`]));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const toggleWeek = (key: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isCurrentWeek = (phase: string, week: number) =>
    phase === currentPhase && week === currentWeek;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        <h1 className="text-base font-bold tracking-tight text-foreground mb-1">STRION</h1>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
          90-Day Protocol
        </p>

        {phases.length === 0 ? (
          <p className="text-sm text-muted-foreground">No protocol generated yet. Complete onboarding to begin.</p>
        ) : (
          <div className="space-y-4">
            {phases.map((phase) => {
              const isActive = phase.phase === currentPhase;

              return (
                <div key={phase.phase} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{phase.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {PHASE_META[phase.phase]?.weekRange}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="border-t border-border">
                    {phase.weeks.map((w) => {
                      const key = `${phase.phase}-${w.week}`;
                      const expanded = expandedWeeks.has(key);
                      const isCurrent = isCurrentWeek(phase.phase, w.week);

                      return (
                        <div key={key}>
                          <button
                            onClick={() => toggleWeek(key)}
                            className={cn(
                              "w-full flex items-center justify-between px-5 py-3 text-left transition-system",
                              isCurrent
                                ? "bg-primary/5"
                                : "hover:bg-muted/30"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-sm font-medium",
                                isCurrent ? "text-primary" : "text-foreground"
                              )}>
                                Week {w.week}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-primary">
                                  Current
                                </span>
                              )}
                            </div>
                            {expanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                          </button>

                          {expanded && (
                            <div className="px-5 pb-3 space-y-1.5">
                              {w.tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between py-1.5 pl-2"
                                >
                                  <div>
                                    <span className="text-sm text-secondary-foreground">{task.name}</span>
                                    <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                                      {task.category}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {w.tasks.length === 0 && (
                                <p className="text-xs text-muted-foreground pl-2">No tasks assigned.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Protocol;
