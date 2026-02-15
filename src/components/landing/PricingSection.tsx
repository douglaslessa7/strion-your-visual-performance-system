import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "AI photo diagnostic",
  "Personalized 90-day protocol",
  "Daily structured missions",
  "Checkpoint recalibration",
  "Strion Index tracking",
  "AI performance assistant",
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-12">
            One system. Full access.
          </h2>

          <div className="bg-card rounded-xl border border-border p-8 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">7-day free trial, then</p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-bold tracking-metric text-foreground">$14</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm bg-primary/10 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full h-11 text-sm font-semibold"
              onClick={() => navigate("/signup")}
            >
              Start Your Diagnostic
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Annual plan available at $9/month.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
