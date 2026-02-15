import { TrendingUp, Check, Clock } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";

const missions = [
  { label: "Posture Drill — 10 min", done: true },
  { label: "Skincare Routine", done: true },
  { label: "Hydration Target", done: false },
  { label: "Grooming Check", done: false },
  { label: "Shoulder Mobility — 8 min", done: false },
];

const Dashboard = () => {
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
            <span className="relative text-7xl font-bold tracking-metric text-foreground">72.4</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <TrendingUp className="w-3.5 h-3.5 text-positive" />
            <span className="text-sm font-medium text-positive">+1.2 this week</span>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">Phase 1 — Foundation</p>
            <p className="text-xs text-muted-foreground">Week 2 of 4</p>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-system" style={{ width: '50%' }} />
          </div>
        </div>

        {/* Today's Missions */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Today's Missions
          </p>
          <div className="space-y-2">
            {missions.map((m) => (
              <div key={m.label} className="flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3 shadow-card transition-system hover:border-primary/20">
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                  m.done
                    ? 'bg-primary border-primary'
                    : 'border-border'
                }`}>
                  {m.done && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className={`text-sm ${m.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Checkpoint */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Next checkpoint in 8 days</p>
            <p className="text-xs text-muted-foreground">Day 14 — Structural review</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
