import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RecalibrationPhotoCapture from "@/components/recalibration/RecalibrationPhotoCapture";
import RecalibrationResults from "@/components/recalibration/RecalibrationResults";
import { Loader2 } from "lucide-react";
import BottomNav from "@/components/dashboard/BottomNav";

type Step = "photos" | "processing" | "results";

interface RecalibrationData {
  new_index: number;
  previous_index: number;
  index_delta: number;
  observations: string[];
  visual_component: number;
  structural_component: number;
  execution_component: number;
}

const Recalibration = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkpointDay = parseInt(searchParams.get("day") || "0", 10);

  const [step, setStep] = useState<Step>("photos");
  const [results, setResults] = useState<RecalibrationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotosComplete = async (photoSetId: string) => {
    if (!session) return;
    setStep("processing");
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("recalibrate", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { photoSetId, checkpointDay },
      });

      if (fnError) throw fnError;
      setResults(data);
      setStep("results");
    } catch (err: any) {
      console.error("Recalibration error:", err);
      setError(err.message || "Recalibration failed. Please try again.");
      setStep("photos");
    }
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-base font-bold tracking-tight text-foreground">STRION</h1>
          <p className="text-xs text-muted-foreground">Day {checkpointDay} Recalibration</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === "photos" && (
          <RecalibrationPhotoCapture
            checkpointDay={checkpointDay}
            onComplete={handlePhotosComplete}
          />
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Recalibrating Strion Index</p>
              <p className="text-xs text-muted-foreground">
                Comparing checkpoint photos and computing structural deltas...
              </p>
            </div>
          </div>
        )}

        {step === "results" && results && (
          <RecalibrationResults
            newIndex={results.new_index}
            previousIndex={results.previous_index}
            indexDelta={results.index_delta}
            observations={results.observations}
            checkpointDay={checkpointDay}
            onContinue={handleContinue}
          />
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Recalibration;
