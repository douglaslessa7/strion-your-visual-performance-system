import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronRight } from "lucide-react";

interface Question {
  key: string;
  label: string;
  type: "number" | "select" | "slider" | "boolean";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

const QUESTIONS: Question[] = [
  { key: "height", label: "What is your height?", type: "number", placeholder: "Height in cm", unit: "cm" },
  { key: "weight", label: "What is your weight?", type: "number", placeholder: "Weight in kg", unit: "kg" },
  { key: "training_frequency", label: "How often do you train per week?", type: "select", options: ["0 days", "1–2 days", "3–4 days", "5–6 days", "Daily"] },
  { key: "skin_concerns", label: "Any skin concerns?", type: "select", options: ["None", "Acne", "Dryness", "Hyperpigmentation", "Redness", "Multiple"] },
  { key: "beard", label: "Do you have facial hair?", type: "boolean" },
  { key: "self_perception", label: "Rate your current appearance.", type: "slider", min: 1, max: 10, step: 1 },
  { key: "primary_goal", label: "What is your primary goal?", type: "select", options: ["Overall improvement", "Facial structure", "Body composition", "Grooming & style", "Posture correction"] },
  { key: "sleep_hours", label: "Average hours of sleep per night?", type: "select", options: ["Less than 5", "5–6 hours", "7–8 hours", "More than 8"] },
  { key: "water_intake", label: "Daily water intake?", type: "select", options: ["Less than 1L", "1–2L", "2–3L", "More than 3L"] },
  { key: "grooming_frequency", label: "How often do you groom?", type: "select", options: ["Rarely", "Weekly", "Every few days", "Daily"] },
  { key: "hair_concerns", label: "Any hair concerns?", type: "select", options: ["None", "Thinning", "Receding", "Dandruff", "Texture issues"] },
  { key: "body_fat_estimate", label: "Estimated body fat percentage?", type: "select", options: ["Under 10%", "10–15%", "15–20%", "20–25%", "Over 25%", "Unsure"] },
];

interface QuestionnaireProps {
  onComplete: (responses: Record<string, string | number | boolean>) => void;
}

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number | boolean>>({});

  const question = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const currentValue = responses[question.key];
  const hasAnswer = currentValue !== undefined && currentValue !== "";

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete(responses);
    }
  };

  const setValue = (val: string | number | boolean) => {
    setResponses((prev) => ({ ...prev, [question.key]: val }));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step 2 of 3</span>
          <span>{currentIndex + 1}/{QUESTIONS.length}</span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="min-h-[200px] flex flex-col justify-center space-y-6">
        <h2 className="text-lg font-semibold text-foreground text-center">
          {question.label}
        </h2>

        {question.type === "number" && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={question.placeholder}
              value={(currentValue as string) ?? ""}
              onChange={(e) => setValue(e.target.value)}
              className="text-center text-lg"
              autoFocus
            />
            {question.unit && (
              <span className="text-sm text-muted-foreground">{question.unit}</span>
            )}
          </div>
        )}

        {question.type === "select" && (
          <div className="grid gap-2">
            {question.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setValue(opt);
                  // Auto-advance after short delay
                  setTimeout(() => {
                    if (currentIndex < QUESTIONS.length - 1) {
                      setCurrentIndex((i) => i + 1);
                    } else {
                      onComplete({ ...responses, [question.key]: opt });
                    }
                  }, 200);
                }}
                className={`w-full px-4 py-3 rounded-lg border text-sm text-left transition-system ${
                  currentValue === opt
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {question.type === "boolean" && (
          <div className="flex gap-3">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const val = opt === "Yes";
                  setValue(val);
                  setTimeout(() => {
                    if (currentIndex < QUESTIONS.length - 1) {
                      setCurrentIndex((i) => i + 1);
                    } else {
                      onComplete({ ...responses, [question.key]: val });
                    }
                  }, 200);
                }}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm transition-system ${
                  currentValue === (opt === "Yes")
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {question.type === "slider" && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold tracking-metric text-foreground">
                {(currentValue as number) ?? question.min ?? 1}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/ {question.max}</span>
            </div>
            <Slider
              value={[(currentValue as number) ?? question.min ?? 1]}
              onValueChange={([v]) => setValue(v)}
              min={question.min}
              max={question.max}
              step={question.step}
            />
          </div>
        )}
      </div>

      {/* Navigation (for non-auto-advance types) */}
      {(question.type === "number" || question.type === "slider") && (
        <Button
          onClick={handleNext}
          disabled={!hasAnswer}
          className="w-full"
        >
          {currentIndex === QUESTIONS.length - 1 ? "Complete" : "Continue"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default Questionnaire;
