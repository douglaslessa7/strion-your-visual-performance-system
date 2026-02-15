import BottomNav from "@/components/dashboard/BottomNav";

const checkpoints = [
  { day: 0, label: "Baseline", active: true },
  { day: 14, label: "Day 14", active: false },
  { day: 30, label: "Day 30", active: false },
  { day: 60, label: "Day 60", active: false },
  { day: 90, label: "Day 90", active: false },
];

const Progress = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        <h1 className="text-base font-bold tracking-tight text-foreground mb-1">STRION</h1>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Progress Timeline
        </p>

        {/* Timeline */}
        <div className="flex items-center justify-between mb-12">
          {checkpoints.map((cp, i) => (
            <div key={cp.day} className="flex flex-col items-center relative">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                cp.active 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card'
              }`}>
                <span className={`text-xs font-semibold ${cp.active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {cp.day}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-2">{cp.label}</span>
              {i < checkpoints.length - 1 && (
                <div className="absolute top-5 left-full w-[calc(100%-2.5rem)] h-px bg-border -translate-y-1/2" 
                  style={{ width: '60px', marginLeft: '4px' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Index Evolution Placeholder */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Index Evolution
          </p>
          {/* Simplified chart representation */}
          <div className="h-40 flex items-end gap-1">
            {[63, 64, 65, 65, 66, 67, 68, 69, 70, 70, 71, 71, 72, 72].map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/20 rounded-t transition-system hover:bg-primary/40"
                style={{ height: `${((v - 60) / 30) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Day 1</span>
            <span className="text-[10px] text-muted-foreground">Today</span>
          </div>
        </div>

        {/* Comparison Tool Placeholder */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Side-by-Side Comparison
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-surface-elevated rounded-lg border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Day 0</span>
            </div>
            <div className="aspect-[3/4] bg-surface-elevated rounded-lg border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Current</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Progress;
