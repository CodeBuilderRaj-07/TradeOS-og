import { useState } from "react";

import { motion } from "framer-motion";

import {
  User,
  Bell,
  Shield,
  Brain,
  Save,
  Lock,
  Moon,
  Laptop,
  ChevronRight,
} from "lucide-react";

import {
  successToast,
} from "@/services/toastService";

export default function Settings() {

  const [formData, setFormData] =
    useState({

      fullName:
        "Ashutosh Pattnaik",

      email:
        "ashutosh@tradeos.ai",

      tradingStyle:
        "Scalping",
    });

  const [notifications,
    setNotifications] =
    useState({

      tradeAlerts: true,
      aiReports: true,
      marketNews: false,
    });

  const handleSave =
    () => {

      successToast(
        "Settings updated successfully"
      );
    };

  const toggleNotification =
    (key) => {

      setNotifications(
        (prev) => ({

          ...prev,

          [key]:
            !prev[key],
        })
      );
    };

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.35,
      }}

      className="space-y-6"
    >

      {/* Header */}
      <div>

        <h1 className="text-4xl font-black tracking-tight text-white">

          Settings

        </h1>

        <p className="mt-2 text-sm text-zinc-500">

          Manage your workspace preferences and trading environment

        </p>

      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Left */}
        <div className="space-y-5">

          {/* Profile */}
          <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">

                <User
                  size={22}
                  className="text-blue-400"
                />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">

                  Profile Settings

                </h3>

                <p className="text-sm text-zinc-500">

                  Manage your account information

                </p>

              </div>

            </div>

            <div className="space-y-5">

              {/* Name */}
              <div>

                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

                  Full Name

                </label>

                <input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      fullName:
                        e.target.value,
                    })
                  }
                  className="h-14 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all duration-300 focus:border-blue-500/20"
                />

              </div>

              {/* Email */}
              <div>

                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

                  Email Address

                </label>

                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      email:
                        e.target.value,
                    })
                  }
                  className="h-14 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all duration-300 focus:border-blue-500/20"
                />

              </div>

              {/* Trading Style */}
              <div>

                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

                  Trading Style

                </label>

                <select
                  value={
                    formData.tradingStyle
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      tradingStyle:
                        e.target.value,
                    })
                  }
                  className="h-14 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all duration-300 focus:border-blue-500/20"
                >

                  <option>
                    Scalping
                  </option>

                  <option>
                    Swing Trading
                  </option>

                  <option>
                    Intraday
                  </option>

                </select>

              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]"
              >

                <Save size={18} />

                Save Changes

              </button>

            </div>

          </div>

          {/* Security */}
          <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">

                <Shield
                  size={22}
                  className="text-red-400"
                />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">

                  Security

                </h3>

                <p className="text-sm text-zinc-500">

                  Password and authentication controls

                </p>

              </div>

            </div>

            <div className="space-y-4">

              {[
                "Change Password",
                "Two-Factor Authentication",
                "Login Sessions",
              ].map((item) => (

                <button
                  key={item}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-[#0B1120]/70 px-5 py-4 text-left transition-all duration-300 hover:border-blue-500/20"
                >

                  <div className="flex items-center gap-3">

                    <Lock
                      size={18}
                      className="text-zinc-400"
                    />

                    <span className="text-sm font-medium text-white">

                      {item}

                    </span>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-zinc-500"
                  />

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* Right */}
        <div className="space-y-5">

          {/* Notifications */}
          <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">

                <Bell
                  size={22}
                  className="text-yellow-400"
                />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">

                  Notifications

                </h3>

                <p className="text-sm text-zinc-500">

                  Manage alerts and workspace notifications

                </p>

              </div>

            </div>

            <div className="space-y-5">

              {[
                {
                  key:
                    "tradeAlerts",

                  title:
                    "Trade Alerts",
                },

                {
                  key:
                    "aiReports",

                  title:
                    "AI Reports",
                },

                {
                  key:
                    "marketNews",

                  title:
                    "Market News",
                },
              ].map((item) => (

                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0B1120]/70 px-5 py-4"
                >

                  <span className="text-sm font-medium text-white">

                    {item.title}

                  </span>

                  <button
                    onClick={() =>
                      toggleNotification(
                        item.key
                      )
                    }
                    className={`relative h-7 w-14 rounded-full transition-all duration-300

                    ${
                      notifications[
                        item.key
                      ]
                        ? "bg-blue-500"
                        : "bg-zinc-700"
                    }`}
                  >

                    <div
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300

                      ${
                        notifications[
                          item.key
                        ]
                          ? "right-1"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* Workspace */}
          <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">

                <Brain
                  size={22}
                  className="text-purple-400"
                />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">

                  Workspace Controls

                </h3>

                <p className="text-sm text-zinc-500">

                  AI and trading environment settings

                </p>

              </div>

            </div>

            <div className="space-y-4">

              {[
                "Paper Trading",
                "AI Assistant",
                "Auto Journal Sync",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0B1120]/70 px-5 py-4"
                >

                  <span className="text-sm font-medium text-white">

                    {item}

                  </span>

                  <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">

                    Active

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Appearance */}
          <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">

                <Moon
                  size={22}
                  className="text-indigo-400"
                />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">

                  Appearance

                </h3>

                <p className="text-sm text-zinc-500">

                  Theme and interface preferences

                </p>

              </div>

            </div>

            <button className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-[#0B1120]/70 px-5 py-4 transition-all duration-300 hover:border-blue-500/20">

              <div className="flex items-center gap-3">

                <Laptop
                  size={18}
                  className="text-zinc-400"
                />

                <span className="text-sm font-medium text-white">

                  Dark Mode Enabled

                </span>

              </div>

              <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">

                Active

              </div>

            </button>

          </div>

        </div>

      </div>

    </motion.div>
  );
}