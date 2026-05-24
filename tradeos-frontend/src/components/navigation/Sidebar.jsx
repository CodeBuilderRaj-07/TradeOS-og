import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Activity,
  NotebookPen,
  CandlestickChart,
  BarChart3,
  Calendar,
  Brain,
  Layers3,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Open Trades",
    icon: Activity,
    path: "/open-trades",
  },
  {
    title: "Journal",
    icon: NotebookPen,
    path: "/journal",
  },
  {
    title: "New Trade",
    icon: CandlestickChart,
    path: "/new-trade",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "AI Insights",
    icon: Brain,
    path: "/ai-insights",
  },
  {
    title: "Strategies",
    icon: Layers3,
    path: "/strategies",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}) {

  return (

    <>

      {/* Mobile Overlay */}
      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />

      )}

      {/* Sidebar */}
      <motion.aside

        initial={{
          opacity: 0,
          x: -30,
        }}

        animate={{
          opacity: 1,
          x: 0,
        }}

        transition={{
          duration: 0.35,
        }}

        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col justify-between border-r border-white/5 bg-[#050816]/95 p-4 backdrop-blur-2xl transition-transform duration-300

        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0`}
      >

        {/* Top */}
        <div>

          {/* Logo */}
          <div className="mb-8 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-bold text-white shadow-[0_0_35px_rgba(37,99,235,0.35)]">

                ↗

              </div>

              <div>

                <h1 className="text-lg font-bold tracking-tight text-white">

                  TradeOS

                </h1>

                <p className="text-xs text-blue-400">

                  Trading Workspace

                </p>

              </div>

            </div>

            {/* Mobile Close */}
            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 lg:hidden"
            >

              <X size={16} />

            </button>

          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.title}
                  to={item.path}

                  onClick={() =>
                    setMobileOpen(false)
                  }

                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300

                    ${
                      isActive
                        ? "border border-blue-500/10 bg-gradient-to-r from-blue-500/20 to-transparent text-white shadow-[0_0_30px_rgba(37,99,235,0.12)]"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    }
                  `
                  }
                >

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <Icon
                    size={18}
                    strokeWidth={2}
                  />

                  <span>
                    {item.title}
                  </span>

                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* User Card */}
        <div className="<GlassPanel /> p-4 backdrop-blur-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.25)]">

              A

            </div>

            <div>

              <h4 className="text-sm font-semibold text-white">

                Ashutosh

              </h4>

              <p className="text-xs text-blue-400">

                Professional Trader

              </p>

            </div>

          </div>

        </div>

      </motion.aside>

    </>
  );
}