import { ChevronRight } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";

const phases = [
  {
    name: "Phase 1 — Foundation",
    weeks: "Weeks 1–4",
    active: true,
    tasks: [
      "Cervical posture alignment drills",
      "Basic skincare protocol",
      "Hydration baseline",
      "Grooming standardization",
      "Shoulder mobility foundation",
    ],
  },
  {
    name: "Phase 2 — Structure",
    weeks: "Weeks 5–8",
    active: false,
    tasks: [
      "Posture load progression",
      "Skincare optimization",
      "Facial structure exercises",
      "Wardrobe audit",
      "Body composition targets",
    ],
  },
  {
    name: "Phase 3 — Refinement",
    weeks: "Weeks 9–12",
    active: false,
    tasks: [
      "Visual consistency audit",
      "Advanced grooming",
      "Structural maintenance",
      "Presentation optimization",
      "Final calibration prep",
    ],
  },
];

const Protocol = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        <h1 className="text-base font-bold tracking-tight text-foreground mb-1">STRION</h1>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
          90-Day Protocol
        </p>

        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.name} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{phase.name}</p>
                  <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                </div>
                {phase.active && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                    Active
                  </span>
                )}
              </div>
              {phase.active && (
                <div className="border-t border-border px-5 py-3 space-y-2">
                  {phase.tasks.map((task) => (
                    <div key={task} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-secondary-foreground">{task}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Protocol;
