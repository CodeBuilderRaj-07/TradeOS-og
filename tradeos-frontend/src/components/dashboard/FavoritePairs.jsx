import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ALL_PAIRS, getFavorites, saveFavorites } from "@/app/config/pairs";
import { X, Star, Plus } from "lucide-react";

const CATEGORIES = ["Crypto", "Forex", "Metals", "Commodities"];

export default function FavoritePairs({ onClose, onUpdate }) {
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggle = (value) => {
    setFavorites((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      if (prev.length >= 10) return prev;
      return [...prev, value];
    });
  };

  const save = () => {
    saveFavorites(favorites);
    onUpdate();
    onClose();
  };

  const filtered = ALL_PAIRS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.value.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  CATEGORIES.forEach((cat) => {
    const items = filtered.filter((p) => p.category === cat);
    if (items.length) grouped[cat] = items;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Favorite Pairs</h2>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pairs..."
            className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Pairs list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Object.entries(grouped).map(([category, pairs]) => (
            <div key={category}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{category}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {pairs.map((p) => {
                  const isFav = favorites.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      onClick={() => toggle(p.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        isFav
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-sidebar-accent/50 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-transparent"
                      }`}
                    >
                      <Star size={12} className={isFav ? "fill-primary text-primary" : "text-muted-foreground"} />
                      <span className="flex-1">{p.label}</span>
                      {!p.binance && (
                        <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">offline</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">No pairs found</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground/60">{favorites.length}/10 pairs selected</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="h-8 px-4 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={save} className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">Save</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}