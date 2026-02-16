import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PhotoCapture from "@/components/onboarding/PhotoCapture";
import Questionnaire from "@/components/onboarding/Questionnaire";
import DiagnosticResults from "@/components/onboarding/DiagnosticResults";
import { toast } from "sonner";

type Step = "photos" | "questionnaire" | "computing" | "results";

const Onboarding = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("photos");
  const [photoSetId, setPhotoSetId] = useState<string>("");
  const [diagnostic, setDiagnostic] = useState<{
    index_value: number;
    projected_min: number;
    projected_max: number;
    opportunities: string[];
  } | null>(null);

  const handlePhotosComplete = (id: string) => {
    setPhotoSetId(id);
    setStep("questionnaire");
  };

  const handleQuestionnaireComplete = async (
    responses: Record<string, string | number | boolean>
  ) => {
    if (!user) return;
    setStep("computing");

    try {
      // Store questionnaire responses
      await supabase.from("questionnaire_responses").insert({
        user_id: user.id,
        checkpoint_day: 0,
        responses,
      });

      // Call diagnostic edge function
      const { data, error } = await supabase.functions.invoke(
        "compute-diagnostic",
        {
          body: { photoSetId, responses },
        }
      );

      if (error) throw error;

      setDiagnostic({
        index_value: data.index_value,
        projected_min: data.projected_min,
        projected_max: data.projected_max,
        opportunities: data.opportunities,
      });
      setStep("results");
    } catch (err: any) {
      console.error("Diagnostic error:", err);
      toast.error("Diagnostic computation failed. Please try again.");
      setStep("questionnaire");
    }
  };

  const handleBeginProtocol = () => {
    // Force reload to pick up onboarding_completed = true
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            STRION
          </h1>
        </div>

        {step === "photos" && (
          <PhotoCapture onComplete={handlePhotosComplete} />
        )}

        {step === "questionnaire" && (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        )}

        {step === "computing" && (
          <DiagnosticResults
            loading
            indexValue={0}
            projectedMin={0}
            projectedMax={0}
            opportunities={[]}
            onBeginProtocol={() => {}}
          />
        )}

        {step === "results" && diagnostic && (
          <DiagnosticResults
            indexValue={diagnostic.index_value}
            projectedMin={diagnostic.projected_min}
            projectedMax={diagnostic.projected_max}
            opportunities={diagnostic.opportunities}
            onBeginProtocol={handleBeginProtocol}
          />
        )}

        <div className="mt-8 text-center">
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
