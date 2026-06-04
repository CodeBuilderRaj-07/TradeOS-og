import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Activity, Target, AlertTriangle, Sparkles, Loader2, CheckCircle } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import AIInsightsSkeleton from "@/components/skeletons/AIInsightsSkeleton";
import { useAIInsights } from "@/hooks/useAIInsights";
import { pageTransition } from "@/animations/page";
import { staggerContainer, staggerItem } from "@/animations/stagger";
import API from "@/services/api";

function AIInsights() {
  const { loading, summary } = useAIInsights();
  const [analysisState, setAnalysisState] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);

  const winRate = summary?.winRate ?? 0;
  const totalTrades = (summary?.closedTrades ?? 0) + (summary?.openTrades ?? 0);
  const openTrades = summary?.openTrades ?? 0;
  const mistakesLogged = summary?.mistakesLogged ?? 0;
  const disciplineScore = Math.min(100, Math.round((summary?.winningTrades ?? 0) / Math.max(summary?.closedTrades ?? 1, 1) * 100 + 20));

  const handleGenerate = async () => {
    setAnalysisState("running");
    try {
      const res = await API.post("/ai/analyze");
      setAnalysisResult(res.data);
      setAnalysisState("complete");
    } catch {
      setAnalysisResult({
        performanceSummary: "Not enough data. Log more trades to get AI analysis.",
        behavioralPatterns: "Insufficient behavioral data.",
        riskManagement: "Insufficient risk data.",
        recommendations: ["Log more trades for personalized recommendations."],
        disciplineScore: 0,
      });
      setAnalysisState("complete");
    }
  };

  if (loading) return <AIInsightsSkeleton />;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <motion.div variants={staggerItem} initial="hidden" animate="show">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Behavioral analysis & coaching</p>
      </motion.div>

      {/* Stats */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total Trades" value={totalTrades} icon={Activity} />
        <StatCard title="Open" value={openTrades} icon={Activity} />
        <StatCard title="Win Rate" value={`${winRate.toFixed(1)}%`} icon={Target} green={winRate >= 50} />
        <StatCard title="Mistakes" value={mistakesLogged} icon={AlertTriangle} />
      </motion.section>

      {/* Generate Analysis */}
      <motion.div variants={staggerItem} initial="hidden" animate="show">
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">AI Trading Analysis</h3>
              <p className="text-sm text-muted-foreground mt-1">Powered by behavioral analysis</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={analysisState === "running"}
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {analysisState === "running" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : analysisState === "complete" ? (
                <CheckCircle size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              {analysisState === "running" ? "Analyzing..." : analysisState === "complete" ? "Regenerate" : "Generate Analysis"}
            </button>
          </div>

          {analysisState === "running" && (
            <div className="rounded-lg border border-primary/10 bg-primary/[0.03] p-5 text-center">
              <Loader2 size={24} className="animate-spin mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Running in the background — you can freely navigate away.</p>
            </div>
          )}

          {analysisState === "complete" && analysisResult && (
            <div className="space-y-5 mt-4">
              <Section title="Performance Summary" icon={Brain} color="text-primary">
                <p className="text-sm leading-7 text-foreground/80">{analysisResult.performanceSummary}</p>
              </Section>
              <Section title="Behavioral Patterns" icon={Activity} color="text-emerald-400">
                <p className="text-sm leading-7 text-foreground/80">{analysisResult.behavioralPatterns}</p>
              </Section>
              <Section title="Risk Management" icon={AlertTriangle} color="text-yellow-400">
                <p className="text-sm leading-7 text-foreground/80">{analysisResult.riskManagement}</p>
              </Section>
              <Section title="Recommendations" icon={Target} color="text-primary">
                <ul className="space-y-2">
                  {(analysisResult.recommendations || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="Discipline Score" icon={Brain} color="text-emerald-400">
                <div className="flex items-end gap-3">
                  <span className={`text-5xl font-black tracking-tight ${disciplineScore >= 70 ? "text-emerald-400" : disciplineScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {analysisResult.disciplineScore || disciplineScore}
                  </span>
                  <span className="text-sm text-muted-foreground mb-2">/ 100</span>
                </div>
              </Section>
            </div>
          )}

          {analysisState === "idle" && (
            <div className="rounded-lg border border-border bg-background/50 p-8 text-center">
              <Brain size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Click "Generate Analysis" to get AI-powered insights on your trading behavior.</p>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, green }) {
  return (
    <motion.div variants={staggerItem}>
      <GlassPanel className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <Icon size={16} />
            </div>
          )}
        </div>
        <h2 className={`mt-5 text-3xl font-bold tracking-tight ${green !== undefined ? (green ? "text-emerald-400" : "text-red-400") : "text-foreground"}`}>
          {value}
        </h2>
      </GlassPanel>
    </motion.div>
  );
}

function Section({ title, icon: Icon, color, children }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={16} className={color} />}
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default React.memo(AIInsights);
