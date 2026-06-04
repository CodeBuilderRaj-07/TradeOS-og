import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Activity, NotebookPen, CandlestickChart, Settings } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: Activity, label: "Trades", path: "/trades/open" },
  { icon: CandlestickChart, label: "New", path: "/new-trade" },
  { icon: NotebookPen, label: "Journal", path: "/journal" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/90 px-2 pb-safe backdrop-blur-2xl lg:hidden">
      {items.map((item) => {
        const active = pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-colors"
          >
            {active && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
            <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
