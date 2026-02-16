import { useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Check, Clock, Loader2 } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";
import { useDashboardData, useGenerateProtocol } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { data, loading, toggleMission } = useDashboardData();
  const generateProtocol = useGenerateProtocol();

  // Auto-generate protocol if none exists and missions are empty
  useEffect(() => {
    if (data && data.todayMissions.length === 0 && !generateProtocol.isPending && !generateProtocol.isSuccess) {
      generateProtocol.mutate();
    }
  }, [data?.todayMissions.length]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const TrendIcon = data.trendDirection === "positive" ? TrendingUp : data.trendDirection === "negative" ? TrendingDown : Minus;
  const trendColor = data.trendDirection === "positive" ? "text-positive" : data.trendDirection === "negative" ? "text-warning-muted" : "text-muted-foreground";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-base font-bold tracking-tight text-foreground">STRION</h1>
          <div className="w-8 h-8 rounded-full bg-card border border-border" />
        </div>

        {/* Strion Index */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Strion Index
          </p>
          <div className="relative inline-block">
            <div className="absolute -inset-8 bg-primary/5 rounded-full blur-2xl" />
            <span className="relative text-7xl font-bold tracking-metric text-foreground">
              {data.currentIndex?.toFixed(1) ?? "—"}
            </span>
          </div>
          {data.weeklyTrend !== null && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
              <span className={`text-sm font-medium ${trendColor}`}>
                {data.weeklyTrend > 0 ? "+" : ""}{data.weeklyTrend} this week
              </span>
            </div>
          )}
          {data.trendDirection === "negative" && (
            <p className="text-xs text-warning-muted mt-1">Execution variance detected</p>
          )}
        </div>

        {/* Phase Indicator */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">{data.phaseLabel}</p>
            <p className="text-xs text-muted-foreground">
              Week {data.currentWeek <= 4 ? data.currentWeek : data.currentWeek <= 8 ? data.currentWeek - 4 : data.currentWeek - 8} of 4
            </p>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-system" style={{ width: `${data.phaseProgress}%` }} />
          </div>
        </div>

        {/* Today's Missions */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Today's Missions
          </p>
          {generateProtocol.isPending ? (
            <div className="flex items-center gap-3 text-muted-foreground py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating protocol...</span>
            </div>
          ) : data.todayMissions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No missions assigned for this week.</p>
          ) : (
            <div className="space-y-2">
              {data.todayMissions.map((m) => (
                <button
                  key={m.label}
                  onClick={() => toggleMission.mutate({ label: m.label, currentlyDone: m.done })}
                  disabled={toggleMission.isPending}
                  className="w-full flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3 shadow-card transition-system hover:border-primary/20 active:scale-[0.98]"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                    m.done ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                    {m.done && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className={`text-sm text-left ${m.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {m.label}{m.duration ? ` — ${m.duration}` : ""}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Next Checkpoint */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {data.nextCheckpointDays > 0
                ? `Next checkpoint in ${data.nextCheckpointDays} day${data.nextCheckpointDays !== 1 ? "s" : ""}`
                : "Checkpoint reached"}
            </p>
            <p className="text-xs text-muted-foreground">{data.nextCheckpointLabel}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
