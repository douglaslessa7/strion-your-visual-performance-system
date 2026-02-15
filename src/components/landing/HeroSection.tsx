import { Button } from "@/components/ui/button";
import HeroDashboardPreview from "./HeroDashboardPreview";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[90vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-foreground">
                Take control of<br />your appearance.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                A structured system that analyzes, organizes, and optimizes your visual performance over 90 days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button 
                size="lg"
                className="h-12 px-8 text-sm font-semibold"
                onClick={() => navigate("/signup")}
              >
                Begin 90-Day Optimization
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <button 
                className="text-sm text-muted-foreground hover:text-foreground transition-system underline underline-offset-4"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See how the system works
              </button>
            </div>
          </div>

          {/* Right — Dashboard Preview */}
          <div className="hidden lg:flex justify-end animate-slide-up">
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
