import { Shield, TrendingDown, RotateCcw } from "lucide-react";

const points = [
  {
    icon: Shield,
    title: "Index stability",
    description: "The Strion Index does not drop from short-term inconsistency. Your baseline is protected.",
  },
  {
    icon: TrendingDown,
    title: "Variance detection",
    description: "Trend indicators detect execution variance and flag projected deltas without altering your score.",
  },
  {
    icon: RotateCcw,
    title: "Structured recalibration",
    description: "Full recalibration happens at structured checkpoints — 30, 60, and 90 days. Not daily.",
  },
];

const CorrectionSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Optimization, not punishment.
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl leading-relaxed">
            Strion is a correction system, not a streak system. Your progress is protected by design.
          </p>

          <div className="space-y-6">
            {points.map((p) => (
              <div key={p.title} className="flex gap-5 items-start bg-card rounded-xl border border-border p-6 shadow-card">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <p.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorrectionSection;
