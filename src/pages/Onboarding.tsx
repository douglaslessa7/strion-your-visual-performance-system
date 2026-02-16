import { useAuth } from "@/contexts/AuthContext";

const Onboarding = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground mb-1">STRION</h1>
          <p className="text-sm text-muted-foreground">Diagnostic Onboarding</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            Your onboarding experience is being built. This is where photo capture, questionnaire, and diagnostic results will appear.
          </p>
        </div>

        <button
          onClick={signOut}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
