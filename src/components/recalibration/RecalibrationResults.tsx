import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RecalibrationResultsProps {
  newIndex: number;
  previousIndex: number;
  indexDelta: number;
  observations: string[];
  checkpointDay: number;
  onContinue: () => void;
}

const RecalibrationResults = ({
  newIndex,
  previousIndex,
  indexDelta,
  observations,
  checkpointDay,
  onContinue,
}: RecalibrationResultsProps) => {
  const TrendIcon = indexDelta > 0 ? TrendingUp : indexDelta < 0 ? TrendingDown : Minus;
  const trendColor = indexDelta > 0 ? "text-positive" : indexDelta < 0 ? "text-warning-muted" : "text-muted-foreground";
  const deltaSign = indexDelta > 0 ? "+" : "";

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="text-center space-y-1">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Day {checkpointDay} — Recalibration Complete
        </p>
        <h2 className="text-lg font-semibold text-foreground">Updated Strion Index</h2>
      </div>

      {/* Index display */}
      <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4 shadow-glow">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Recalibrated Index
        </p>
        <p className="text-6xl font-bold tracking-metric text-foreground">
          {newIndex.toFixed(1)}
        </p>
        <div className="flex items-center justify-center gap-2">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {deltaSign}{indexDelta.toFixed(1)} from {previousIndex.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Observations */}
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Structural Observations
        </p>
        <div className="space-y-2">
          {observations.map((item, i) => (
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
      <Button onClick={onContinue} className="w-full">
        Return to Dashboard
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default RecalibrationResults;
