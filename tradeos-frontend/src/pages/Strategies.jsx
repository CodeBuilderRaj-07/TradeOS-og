import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers3, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";
import { pageTransition } from "@/animations/page";
import { staggerContainer, staggerItem } from "@/animations/stagger";

function StrategiesSkeleton() {
  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton mt-3 h-4 w-64 rounded-full" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-5">
            <div className="skeleton h-6 w-36 rounded-full" />
            <div className="skeleton mt-3 h-4 w-56 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newStrategy, setNewStrategy] = useState({
    name: "",
    description: "",
    rules: "",
    checklist: [],
  });
  const [checklistInput, setChecklistInput] = useState("");

  const fetchStrategies = async () => {
    try {
      const res = await API.get("/strategies");
      setStrategies(res.data || []);
    } catch { errorToast("Failed to load strategies"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStrategies(); }, []);

  const createStrategy = async () => {
    if (!newStrategy.name) return;
    try {
      await API.post("/strategies", {
        ...newStrategy,
        checklist: newStrategy.checklist.filter(Boolean),
      });
      setShowForm(false);
      setNewStrategy({ name: "", description: "", rules: "", checklist: [] });
      successToast("Strategy created");
      fetchStrategies();
    } catch {
      errorToast("Failed to create strategy");
    }
  };

  const deleteStrategy = async (id) => {
    try {
      await API.delete(`/strategies/${id}`);
      successToast("Strategy deleted");
      fetchStrategies();
    } catch {
      errorToast("Failed to delete strategy");
    }
  };

  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;
    setNewStrategy({
      ...newStrategy,
      checklist: [...newStrategy.checklist, checklistInput.trim()],
    });
    setChecklistInput("");
  };

  const removeChecklistItem = (index) => {
    setNewStrategy({
      ...newStrategy,
      checklist: newStrategy.checklist.filter((_, i) => i !== index),
    });
  };

  if (loading) return <StrategiesSkeleton />;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <motion.div variants={staggerItem} initial="hidden" animate="show" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Strategies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your trading strategies & checklists</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          {showForm ? "Cancel" : "New Strategy"}
        </button>
      </motion.div>

      {/* New Strategy Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <GlassPanel className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Create New Strategy</h3>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                <input
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                  placeholder="e.g. Breakout Momentum"
                  className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                  placeholder="Describe your strategy..."
                  rows={2}
                  className="min-h-[60px] w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Rules</label>
                <textarea
                  value={newStrategy.rules}
                  onChange={(e) => setNewStrategy({ ...newStrategy, rules: e.target.value })}
                  placeholder="Entry conditions, exit rules, risk parameters..."
                  rows={2}
                  className="min-h-[60px] w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/30 resize-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pre-Trade Checklist</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                    placeholder="Add checklist item..."
                    className="h-10 flex-1 rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
                  />
                  <button onClick={addChecklistItem} className="h-10 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground">
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {newStrategy.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background/30 px-3 py-2">
                      <GripVertical size={14} className="text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm text-foreground">{item}</span>
                      <button onClick={() => removeChecklistItem(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={createStrategy}
                disabled={!newStrategy.name}
                className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Save Strategy
              </button>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategy List */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
        {strategies.length === 0 ? (
          <GlassPanel className="p-14 text-center">
            <Layers3 size={32} className="mx-auto text-muted-foreground mb-3" />
            <h2 className="text-xl font-bold text-foreground">No strategies yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create your first trading strategy to get started.</p>
          </GlassPanel>
        ) : (
          strategies.map((strategy) => {
            const isExpanded = expandedId === strategy.id;
            return (
              <motion.div key={strategy.id} variants={staggerItem}>
                <GlassPanel className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{strategy.name}</h3>
                      {strategy.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{strategy.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : strategy.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => deleteStrategy(strategy.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          {strategy.rules && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Rules</p>
                              <p className="text-sm text-foreground/80">{strategy.rules}</p>
                            </div>
                          )}
                          {strategy.checklist && strategy.checklist.length > 0 && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pre-Trade Checklist</p>
                              <div className="space-y-1">
                                {strategy.checklist.map((item, ci) => (
                                  <div key={ci} className="flex items-center gap-2 rounded-lg border border-border bg-background/30 px-3 py-2">
                                    <div className="h-4 w-4 rounded border border-muted-foreground/30" />
                                    <span className="text-sm text-foreground">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassPanel>
              </motion.div>
            );
          })
        )}
      </motion.section>
    </motion.div>
  );
}

export default React.memo(Strategies);
