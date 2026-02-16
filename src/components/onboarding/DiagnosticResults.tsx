import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

interface DiagnosticResultsProps {
  indexValue: number;
  projectedMin: number;
  projectedMax: number;
  opportunities: string[];
  onBeginProtocol: () => void;
  loading?: boolean;
}

const DiagnosticResults = ({
  indexValue,
  projectedMin,
  projectedMax,
  opportunities,
  onBeginProtocol,
  loading,
}: DiagnosticResultsProps) => {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            Computing Strion Index
          </p>
          <p className="text-xs text-muted-foreground">
            Analyzing structural data and photo diagnostics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-1">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Diagnostic Complete
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          Your Strion Index
        </h2>
      </div>

      {/* Index display */}
      <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4 shadow-glow">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Current Index
        </p>
        <p className="text-6xl font-bold tracking-metric text-foreground">
          {indexValue.toFixed(1)}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-positive" />
          <span>
            Projected 90-day range:{" "}
            <span className="text-foreground font-medium">
              {projectedMin.toFixed(1)} – {projectedMax.toFixed(1)}
            </span>
          </span>
        </div>
      </div>

      {/* Structural opportunities */}
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Structural Opportunities
        </p>
        <div className="space-y-2">
          {opportunities.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-card border border-border rounded-lg px-4 py-3"
            >
              <span className="text-xs font-bold text-primary mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button onClick={onBeginProtocol} className="w-full">
        Begin Foundation Phase
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default DiagnosticResults;
