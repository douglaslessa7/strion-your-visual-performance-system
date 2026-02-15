import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-base font-bold tracking-tight text-foreground">
          STRION
        </button>
        <div className="flex items-center gap-4">
          <button 
            className="text-sm text-muted-foreground hover:text-foreground transition-system"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <Button size="sm" className="h-8 px-4 text-xs font-semibold" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
