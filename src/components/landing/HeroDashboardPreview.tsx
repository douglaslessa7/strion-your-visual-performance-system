import { TrendingUp, Check } from "lucide-react";

const HeroDashboardPreview = () => {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl" />
      
      <div className="relative bg-card rounded-xl shadow-card border border-border p-6 space-y-5 max-w-sm">
        {/* Strion Index */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Strion Index
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-metric text-foreground">72.4</span>
            <span className="flex items-center gap-1 text-sm font-medium text-positive">
              <TrendingUp className="w-3.5 h-3.5" />
              +1.2 this week
            </span>
          </div>
        </div>

        {/* Phase */}
        <div className="bg-surface-elevated rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Phase 1 — Foundation</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">Week 2 of 4</p>
          <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
          </div>
        </div>

        {/* Today's Missions */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Today's Missions
          </p>
          <div className="space-y-2">
            {[
              { label: "Posture Drill — 10 min", done: true },
              { label: "Skincare Routine", done: true },
              { label: "Hydration Target", done: false },
              { label: "Grooming Check", done: false },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                  m.done 
                    ? 'bg-primary border-primary' 
                    : 'border-border bg-transparent'
                }`}>
                  {m.done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <span className={`text-sm ${m.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next checkpoint */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Next checkpoint in <span className="text-foreground font-medium">8 days</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboardPreview;
