import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { User, Plus, Trash2, Upload, Check, Star, LogOut, Shield, Sun, Moon, Bell, Volume2, VolumeX } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { getNotificationSettings, setNotificationSettings } from "@/services/notificationSettings";

const BROKERS = ["MT4", "MT5", "cTrader", "Binance", "Bybit", "IBKR", "TradingView", "NinjaTrader", "Thinkorswim", "Other"];

export default function Settings() {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    broker: "MT4",
    type: "live",
    initialBalance: "",
    currentBalance: "",
    currency: "USD",
    leverage: "1:100",
    maxDailyLoss: "",
    maxTradesPerDay: "",
    defaultRisk: 1,
  });
  const fileInputRef = useRef();
  const [notify, setNotify] = useState(getNotificationSettings());

  useEffect(() => {
    API.get("/trading-accounts")
      .then((res) => setAccounts(res.data || []))
      .catch(() => errorToast("Failed to load accounts"))
      .finally(() => setLoading(false));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Account name is required";
    if (!formData.initialBalance || Number(formData.initialBalance) <= 0) errors.initialBalance = "Enter a valid balance";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await API.post("/trading-accounts", {
        ...formData,
        initialBalance: Number(formData.initialBalance) || 0,
        currentBalance: Number(formData.currentBalance) || Number(formData.initialBalance) || 0,
        maxDailyLoss: Number(formData.maxDailyLoss) || 0,
        maxTradesPerDay: Number(formData.maxTradesPerDay) || 0,
        defaultRisk: Number(formData.defaultRisk) || 1,
      });
      successToast("Account created");
      setShowForm(false);
      setFormData({ name: "", broker: "MT4", type: "live", initialBalance: "", currentBalance: "", currency: "USD", leverage: "1:100", maxDailyLoss: "", maxTradesPerDay: "", defaultRisk: 1 });
      setFormErrors({});
      const res = await API.get("/trading-accounts");
      setAccounts(res.data || []);
    } catch {
      errorToast("Failed to create account");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/trading-accounts/${id}`);
      successToast("Account deleted");
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      setConfirmDelete(null);
    } catch {
      errorToast("Failed to delete account");
    }
  };

  const handleSetActive = async (id) => {
    try {
      await API.put(`/trading-accounts/${id}`, { active: true });
      setAccounts((prev) => prev.map((a) => ({ ...a, active: a.id === id })));
      successToast("Active account set");
    } catch {
      errorToast("Failed to set active account");
    }
  };

  const handleNotifyToggle = (key) => {
    const next = { ...notify, [key]: !notify[key] };
    setNotify(next);
    setNotificationSettings(next);
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const form = new FormData();
      form.append("file", file);
      await API.post("/trades/import", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successToast("Trades imported successfully");
    } catch {
      errorToast("Failed to import trades");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="skeleton mt-3 h-4 w-64 rounded-full" />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr] mt-6">
          <div className="glass p-6"><div className="skeleton h-64 w-full rounded-lg" /></div>
          <div className="space-y-5">
            <div className="glass p-6"><div className="skeleton h-32 w-full rounded-lg" /></div>
            <div className="glass p-6"><div className="skeleton h-48 w-full rounded-lg" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6 max-w-[1000px] mx-auto">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage accounts & preferences</p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Left - Accounts */}
        <div className="space-y-5">
          {/* Trading Accounts */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <User size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Trading Accounts</h3>
                  <p className="text-sm text-muted-foreground">{accounts.length} account{accounts.length !== 1 ? "s" : ""} linked</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
                {showForm ? "Cancel" : "Add"}
              </button>
            </div>

            {/* New Account Form */}
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-4 rounded-lg border border-border bg-background/50 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account Name</label>
                    <input value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }} placeholder="e.g. Main FTMO" className={`h-11 w-full rounded-lg border ${formErrors.name ? "border-red-500/50" : "border-border"} bg-background/70 px-4 text-sm outline-none focus:border-primary/30`} />
                    {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Broker</label>
                    <select value={formData.broker} onChange={(e) => setFormData({ ...formData, broker: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary/30">
                      {BROKERS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary/30">
                      <option value="live">Live</option>
                      <option value="demo">Demo</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Currency</label>
                    <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary/30">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Initial Balance</label>
                    <input type="number" value={formData.initialBalance} onChange={(e) => { setFormData({ ...formData, initialBalance: e.target.value }); if (formErrors.initialBalance) setFormErrors({ ...formErrors, initialBalance: "" }); }} className={`h-11 w-full rounded-lg border ${formErrors.initialBalance ? "border-red-500/50" : "border-border"} bg-background/70 px-4 text-sm font-mono outline-none focus:border-primary/30`} />
                    {formErrors.initialBalance && <p className="mt-1 text-xs text-red-400">{formErrors.initialBalance}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current Balance</label>
                    <input type="number" value={formData.currentBalance} onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono outline-none focus:border-primary/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Leverage</label>
                    <select value={formData.leverage} onChange={(e) => setFormData({ ...formData, leverage: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm outline-none focus:border-primary/30">
                      {["1:1", "1:10", "1:30", "1:50", "1:100", "1:200", "1:500"].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Default Risk %</label>
                    <input type="number" step="0.1" value={formData.defaultRisk} onChange={(e) => setFormData({ ...formData, defaultRisk: e.target.value })} className="h-11 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono outline-none focus:border-primary/30" />
                  </div>
                </div>
                <button onClick={handleCreate} disabled={!formData.name} className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                  Create Account
                </button>
              </motion.div>
            )}

            {/* Account Cards */}
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No trading accounts yet. Add your first account to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      {acc.active && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{acc.name}</span>
                          <span className="text-[10px] font-medium uppercase text-muted-foreground px-2 py-0.5 rounded border border-border">{acc.type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{acc.broker} · ${Number(acc.currentBalance || acc.initialBalance || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!acc.active && (
                        <button onClick={() => handleSetActive(acc.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary transition-colors">
                          <Check size={14} />
                        </button>
                      )}
                      <button onClick={() => setConfirmDelete(acc)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Right - CSV Import */}
        <div className="space-y-5">
          <GlassPanel className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <Upload size={22} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">CSV Import</h3>
                <p className="text-sm text-muted-foreground">Bulk import trades from CSV</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-5 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <Upload size={24} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Click to upload CSV</span>
                <span className="text-xs text-muted-foreground">pairs, direction, prices, pnl, dates</span>
              </label>
            </div>
            <div className="mt-4 text-xs text-muted-foreground leading-6">
              <p>Expected columns: <span className="font-mono text-foreground">pair, direction, entry_price, exit_price, lot_size, pnl, entry_date, exit_date</span></p>
            </div>
          </GlassPanel>

          {/* Notifications */}
          <GlassPanel className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Bell size={22} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Choose which alerts you receive</p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { key: "soundEnabled", label: "Sound Effects", icon: notify.soundEnabled ? Volume2 : VolumeX },
                { key: "tpEnabled", label: "Take Profit Alerts", icon: Bell },
                { key: "slEnabled", label: "Stop Loss Alerts", icon: Bell },
                { key: "beEnabled", label: "Break Even Alerts", icon: Bell },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleNotifyToggle(key)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background/50 px-5 py-3.5 transition-colors hover:bg-background/80"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={notify[key] ? "text-purple-400" : "text-muted-foreground"} />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <div className={`h-5 w-9 rounded-full transition-colors ${notify[key] ? "bg-purple-500" : "bg-border"}`}>
                    <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notify[key] ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>
              ))}
            </div>
          </GlassPanel>

          {/* Profile Summary */}
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {authUser?.fullName ? authUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "T"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{authUser?.fullName || "Trader"}</h3>
                <p className="text-sm text-muted-foreground">{authUser?.email || "Set up your profile"}</p>
              </div>
            </div>
          </GlassPanel>

          {/* Account / Session */}
          <GlassPanel className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Shield size={22} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Account & Session</h3>
                <p className="text-sm text-muted-foreground">Manage login & security</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{authUser?.email || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Signed in account</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </GlassPanel>

          {/* Theme */}
          <GlassPanel className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Sun size={22} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground">Toggle between dark and light mode</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-background/50 px-5 py-4 transition-colors hover:bg-background/80"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-400" />}
                <span className="text-sm font-medium text-foreground">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground capitalize">{theme}</span>
            </button>
          </GlassPanel>
        </div>
      </motion.div>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete.id)}
        title="Delete Account"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}

