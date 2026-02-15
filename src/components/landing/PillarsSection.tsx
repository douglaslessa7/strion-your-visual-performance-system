import { Scan, Target, BarChart3 } from "lucide-react";

const pillars = [
  { icon: Scan, title: "Diagnose", description: "AI-powered photo analysis identifies structural opportunities and calibrates your baseline." },
  { icon: Target, title: "Execute", description: "Daily structured missions aligned to your diagnostic profile. No guesswork." },
  { icon: BarChart3, title: "Optimize", description: "Checkpoint-based recalibration adjusts your protocol as you progress." },
];

const PillarsSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary mb-3">
          Control Through Structure
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-16">
          A system, not guesswork.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div key={p.title} className="bg-card rounded-xl border border-border p-8 shadow-card transition-system hover:border-primary/20">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
