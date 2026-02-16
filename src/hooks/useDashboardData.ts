import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { differenceInDays, format } from "date-fns";

interface Task {
  label: string;
  category: string;
  duration?: string;
}

export interface DashboardData {
  currentIndex: number | null;
  maxPotential: number | null;
  weeklyTrend: number | null;
  trendDirection: "positive" | "negative" | "neutral";
  currentPhase: string;
  currentWeek: number;
  phaseLabel: string;
  phaseProgress: number;
  todayMissions: (Task & { done: boolean })[];
  nextCheckpointDays: number;
  nextCheckpointDay: number;
  nextCheckpointLabel: string;
  protocolDay: number;
  loading: boolean;
}

const CHECKPOINTS = [14, 21, 30, 60, 90];

const PHASE_LABELS: Record<string, string> = {
  foundation: "Phase 1 — Foundation",
  structure: "Phase 2 — Structure",
  refinement: "Phase 3 — Refinement",
};

function computePhaseWeek(protocolDay: number): { phase: string; week: number; phaseProgress: number } {
  if (protocolDay <= 28) {
    const week = Math.min(Math.ceil(protocolDay / 7), 4);
    return { phase: "foundation", week, phaseProgress: (protocolDay / 28) * 100 };
  } else if (protocolDay <= 56) {
    const week = Math.min(Math.ceil((protocolDay - 28) / 7) + 4, 8);
    return { phase: "structure", week, phaseProgress: ((protocolDay - 28) / 28) * 100 };
  } else {
    const week = Math.min(Math.ceil((protocolDay - 56) / 7) + 8, 12);
    return { phase: "refinement", week, phaseProgress: ((protocolDay - 56) / 28) * 100 };
  }
}

function getNextCheckpoint(protocolDay: number): { days: number; checkpointDay: number } {
  for (const cp of CHECKPOINTS) {
    if (protocolDay < cp) return { days: cp - protocolDay, checkpointDay: cp };
  }
  return { days: 0, checkpointDay: 90 };
}

export function useDashboardData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const [profileRes, indexHistoryRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("index_history").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(14),
      ]);

      const profile = profileRes.data;
      if (!profile) throw new Error("Profile not found");

      const protocolStartDate = profile.protocol_start_date;
      const protocolDay = protocolStartDate
        ? differenceInDays(new Date(), new Date(protocolStartDate)) + 1
        : 1;

      const { phase, week, phaseProgress } = computePhaseWeek(protocolDay);
      const { days: nextCheckpointDays, checkpointDay } = getNextCheckpoint(protocolDay);

      // Compute weekly trend from index_history
      const history = indexHistoryRes.data || [];
      let weeklyTrend: number | null = null;
      if (history.length >= 2) {
        const latest = history[0].index_value;
        // Find entry from ~7 days ago
        const weekAgo = history.find((_, i) => i >= 1) || history[history.length - 1];
        weeklyTrend = parseFloat((latest - weekAgo.index_value).toFixed(1));
      }

      // Fetch today's protocol tasks
      const { data: assignments } = await supabase
        .from("protocol_assignments")
        .select("tasks")
        .eq("user_id", user.id)
        .eq("phase", phase)
        .eq("week", week)
        .single();

      // Fetch today's execution
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: execution } = await supabase
        .from("daily_execution")
        .select("completed_tasks")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      const completedLabels: string[] = Array.isArray(execution?.completed_tasks)
        ? (execution.completed_tasks as string[])
        : [];

      const tasks: Task[] = Array.isArray(assignments?.tasks)
        ? (assignments.tasks as unknown as Task[])
        : [];

      const todayMissions = tasks.map((t) => ({
        ...t,
        done: completedLabels.includes(t.label),
      }));

      return {
        currentIndex: profile.current_index,
        maxPotential: profile.max_potential,
        weeklyTrend,
        trendDirection: (weeklyTrend === null || weeklyTrend === 0 ? "neutral" : weeklyTrend > 0 ? "positive" : "negative") as "positive" | "negative" | "neutral",
        currentPhase: phase,
        currentWeek: week,
        phaseLabel: PHASE_LABELS[phase] || phase,
        phaseProgress: Math.min(phaseProgress, 100),
        todayMissions,
        nextCheckpointDays,
        nextCheckpointDay: checkpointDay,
        nextCheckpointLabel: `Day ${checkpointDay} — ${checkpointDay <= 14 ? "Initial review" : checkpointDay <= 30 ? "Structural review" : "Full recalibration"}`,
        protocolDay,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const toggleMission = useMutation({
    mutationFn: async ({ label, currentlyDone }: { label: string; currentlyDone: boolean }) => {
      if (!user || !data) throw new Error("Not ready");

      const today = format(new Date(), "yyyy-MM-dd");
      const currentCompleted = data.todayMissions.filter((m) => m.done).map((m) => m.label);

      const newCompleted = currentlyDone
        ? currentCompleted.filter((l) => l !== label)
        : [...currentCompleted, label];

      const executionScore = data.todayMissions.length > 0
        ? parseFloat(((newCompleted.length / data.todayMissions.length) * 100).toFixed(1))
        : 0;

      // Upsert daily_execution
      const { error } = await supabase
        .from("daily_execution")
        .upsert(
          { user_id: user.id, date: today, completed_tasks: newCompleted as unknown as import("@/integrations/supabase/types").Json, execution_score: executionScore },
          { onConflict: "user_id,date" }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", user?.id] });
    },
  });

  return {
    data: data ?? null,
    loading: isLoading,
    toggleMission,
  };
}

export function useGenerateProtocol() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("generate-protocol", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
