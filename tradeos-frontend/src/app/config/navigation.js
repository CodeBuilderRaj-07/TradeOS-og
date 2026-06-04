import {
  LayoutDashboard,
  Activity,
  NotebookPen,
  CandlestickChart,
  BarChart3,
  Calendar,
  Brain,
  Layers3,
  Bot,
  Settings,
} from "lucide-react";

export const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Open Trades", icon: Activity, path: "/trades/open" },
  { title: "Journal", icon: NotebookPen, path: "/journal" },
  { title: "New Trade", icon: CandlestickChart, path: "/new-trade" },
  { title: "Algo Trading", icon: Bot, path: "/algo-trading" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Calendar", icon: Calendar, path: "/calendar" },
  { title: "AI Insights", icon: Brain, path: "/ai-insights" },
  { title: "Strategies", icon: Layers3, path: "/strategies" },
  { title: "Settings", icon: Settings, path: "/settings" },
];
