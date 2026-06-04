import { motion } from "framer-motion";

import {
  LayoutDashboard,
  List,
  BookOpen,
  Zap,
  Bot,
  BarChart3,
  Calendar,
  Brain,
  Layers3,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X,
  DollarSign,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Open Trades", icon: List, path: "/trades/open" },
  { title: "Journal", icon: BookOpen, path: "/journal" },
  { title: "New Trade", icon: Zap, path: "/new-trade" },
  { title: "Algo Trading", icon: Bot, path: "/algo-trading" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Calendar", icon: Calendar, path: "/calendar" },
  { title: "AI Insights", icon: Brain, path: "/ai-insights" },
  { title: "Strategies", icon: Layers3, path: "/strategies" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-[240px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex flex-col overflow-y-auto overflow-x-hidden px-3 pt-6">
          {/* LOGO + COLLAPSE */}
          <div className={`mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-primary-foreground shadow-lg shadow-blue-500/20">
                <DollarSign size={20} />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">TradeOS</h1>
                  <p className="text-[10px] font-medium tracking-wider text-muted-foreground">ALGO TRADING</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={() => { setMobileOpen(false); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground/50 hover:bg-sidebar-accent/80 lg:hidden"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${collapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-transparent text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute left-0 inset-y-0 my-auto h-5 w-0.5 rounded-r-full bg-gradient-to-b from-blue-500 to-blue-400 shadow-sm shadow-blue-500/30"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      {!collapsed && <span>{item.title}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* COLLAPSE TOGGLE (desktop) + SYSTEM STATUS */}
        <div className="mt-auto border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 transition-colors hover:bg-sidebar-accent/80">
              <div className="h-2 w-2 rounded-full bg-success shadow-md shadow-success/30" />
              <span className="text-xs font-medium text-sidebar-foreground/70">System Active</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors hover:scale-110 active:scale-95 max-lg:hidden"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
