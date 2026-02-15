import { LayoutDashboard, FileText, TrendingUp, Bot, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Protocol", path: "/protocol" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Bot, label: "AI", path: "/assistant" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((t) => {
          const active = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`flex flex-col items-center gap-1 transition-system ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
