import {
  Search,
  Bell,
  ChevronDown,
  Bitcoin,
  Menu,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  connectMarketSocket,
  disconnectMarketSocket,
} from "@/services/marketSocket";

import {
  requestNotificationPermission,
} from "@/services/oneSignal";

export default function Topbar({
  setMobileOpen,
}) {

  const [btcPrice, setBtcPrice] =
    useState(null);

  useEffect(() => {

    connectMarketSocket((data) => {

      if (
        data.symbol === "BTCUSDT"
      ) {

        setBtcPrice(data.price);
      }
    });

    return () => {

      disconnectMarketSocket();
    };

  }, []);

  return (

    <motion.header

      initial={{
        opacity: 0,
        y: -15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.35,
      }}

      className="sticky top-0 z-30 mb-6 flex items-center justify-between gap-4 border-b border-white/5 bg-[#050816]/80 px-4 py-4 backdrop-blur-2xl sm:px-5 lg:px-6"
    >

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={() =>
            setMobileOpen(true)
          }
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/20 hover:text-white lg:hidden"
        >

          <Menu size={18} />

        </button>

        {/* Search */}
        <div className="hidden md:flex h-12 w-[320px] items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/20 xl:w-[360px]">

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search trades, analytics..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />

        </div>

      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">

        {/* BTC Live */}
        <div className="hidden xl:flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">

            <Bitcoin
              size={18}
              className="text-orange-400"
            />

          </div>

          <div>

            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">

              BTCUSDT LIVE

            </p>

            <h3 className="text-sm font-bold text-green-400">

              {btcPrice
                ? `$${Number(
                    btcPrice
                  ).toLocaleString()}`
                : "Loading..."}

            </h3>

          </div>

        </div>

        {/* Live Status */}
        <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">

          <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />

          <span className="text-xs font-medium text-zinc-300">

            WebSocket Live

          </span>

        </div>

        {/* Notification */}
        <button
          onClick={
            requestNotificationPermission
          }
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/20 hover:text-white"
        >

          <Bell size={18} />

          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2 backdrop-blur-xl">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 font-bold text-white shadow-[0_0_25px_rgba(37,99,235,0.3)]">

            A

          </div>

          <div className="hidden sm:block">

            <h4 className="text-sm font-semibold text-white">

              Ashutosh

            </h4>

            <p className="text-xs text-zinc-500">

              Professional

            </p>

          </div>

          <ChevronDown
            size={16}
            className="hidden sm:block text-zinc-500"
          />

        </div>

      </div>

    </motion.header>
  );
}