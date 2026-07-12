import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Sun, Moon, LogOut, Settings, User, Camera, Bot, SwitchCamera } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useAccountStore } from "@/store/accountStore";
import { getAvatar, setAvatar, removeAvatar } from "@/services/tokenService";
import PnLTicker from "@/components/navigation/PnLTicker";

export default function Topbar({ setMobileOpen, onAiChatToggle }) {
  const navigate = useNavigate();
  const inputRef = useRef();
  const menuRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const { accounts, activeAccount, setActiveAccount, fetchAccounts } = useAccountStore();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef();
  const avatarUrl = getAvatar();
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "T";

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/journal?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setAvatar(dataUrl);
        setAvatarKey((k) => k + 1);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-6 backdrop-blur-2xl"
    >
      {/* LEFT */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/20 hover:text-foreground xl:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div className="flex h-10 w-[300px] items-center gap-3 rounded-lg border border-border bg-card px-4 backdrop-blur-xl transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-glow hover:border-primary/20 xl:w-[360px]">
        <button onClick={() => { if (searchValue.trim()) { navigate(`/journal?search=${encodeURIComponent(searchValue.trim())}`); setSearchValue(""); } }} className="text-muted-foreground hover:text-foreground transition-colors shrink-0"><Search size={16} /></button>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Search trades, pairs, notes... (Ctrl+K)"
          data-search-input
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-2">
        {/* AI CHAT TOGGLE */}
        <button
          onClick={onAiChatToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-primary/20 hover:text-primary hover:shadow-glow active:scale-95"
          title="AI Trading Assistant"
        >
          <Bot size={16} />
        </button>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-primary/20 hover:text-foreground"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* P&L TICKER */}
        <PnLTicker />

        {/* ACCOUNT SWITCHER */}
        <div className="relative" ref={accountMenuRef}>
          <div
            onClick={() => setAccountMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 backdrop-blur-xl cursor-pointer hover:bg-card/80 hover:border-primary/20 transition-all duration-200"
          >
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-soft shadow-md shadow-success/30" />
            <span className="text-xs font-medium text-foreground/80 max-w-[100px] truncate">{activeAccount?.name || user?.fullName || "Account"}</span>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 shrink-0 ${accountMenuOpen ? "rotate-180" : ""}`} />
          </div>

          <AnimatePresence>
            {accountMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl shadow-black/10 backdrop-blur-2xl overflow-hidden z-50"
              >
                <div className="border-b border-border px-4 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Trading Accounts</p>
                </div>
                {accounts.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-muted-foreground">No accounts yet</div>
                ) : (
                  accounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => { setActiveAccount(acc); setAccountMenuOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        activeAccount?.id === acc.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full shrink-0 ${acc.active ? "bg-success" : "bg-muted"}`} />
                      <div className="text-left min-w-0">
                        <p className="text-sm font-medium truncate">{acc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{acc.broker} · {acc.currency}</p>
                      </div>
                    </button>
                  ))
                )}
                <button
                  onClick={() => { navigate("/settings"); setAccountMenuOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors border-t border-border"
                >
                  <Settings size={14} />
                  Manage Accounts
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* USER DROPDOWN */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 backdrop-blur-xl cursor-pointer hover:bg-card/80 hover:border-primary/20 transition-all duration-200"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-xs font-bold text-primary-foreground shadow-lg shadow-blue-500/20 ring-2 ring-primary/20">
                {initials}
              </div>
            )}
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl shadow-black/10 backdrop-blur-2xl overflow-hidden"
              >
                {/* User info */}
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                </div>

                {/* Avatar upload */}
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                >
                  <Camera size={16} />
                  Change Avatar
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {avatarUrl && (
                  <button
                    onClick={() => { removeAvatar(); setAvatarKey((k) => k + 1); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                  >
                    <User size={16} />
                    Remove Avatar
                  </button>
                )}

                {/* Settings */}
                <button
                  onClick={() => { navigate("/settings"); setMenuOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors border-t border-border"
                >
                  <Settings size={16} />
                  Settings
                </button>

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
