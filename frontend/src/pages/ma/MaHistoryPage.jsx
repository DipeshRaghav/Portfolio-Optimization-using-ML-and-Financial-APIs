import {
  History,
  Loader2,
  Play,
  Timer,
  Zap,
  Newspaper,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Activity,
} from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import MaReasonsPanel from "../../components/multimodel/MaReasonsPanel";
import MaSignalCard from "../../components/multimodel/MaSignalCard";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Trigger type visual configs
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TRIGGER_CONFIG = {
  volatility: {
    icon: Zap,
    text: "text-amber-400",
    dot: "bg-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    ringColor: "ring-amber-500/30",
    label: "Volatility Alert",
  },
  news: {
    icon: Newspaper,
    text: "text-sky-400",
    dot: "bg-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    ringColor: "ring-sky-500/30",
    label: "News Event",
  },
  risk: {
    icon: AlertTriangle,
    text: "text-rose-400",
    dot: "bg-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    ringColor: "ring-rose-500/30",
    label: "Risk Alert",
  },
  positive: {
    icon: TrendingUp,
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    ringColor: "ring-emerald-500/30",
    label: "Positive Signal",
  },
};
const FALLBACK_CONFIG = {
  icon: Activity,
  text: "text-slate-400",
  dot: "bg-slate-400",
  bg: "bg-slate-500/10",
  border: "border-slate-500/20",
  ringColor: "ring-slate-500/30",
  label: "Event",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Insight summary builder
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getInsightSummary(prob, triggers, reasons) {
  const p = prob ?? 0;
  const pct = (p * 100).toFixed(1);
  const insights = [];

  if (p >= 0.65) {
    insights.push({ icon: TrendingUp, text: "Market shows bullish behavior with positive momentum signals", color: "text-emerald-400" });
  } else if (p >= 0.45) {
    insights.push({ icon: Activity, text: "Market shows moderate bullish behavior, mixed signals detected", color: "text-amber-400" });
  } else {
    insights.push({ icon: TrendingDown, text: "Market shows bearish tendency, caution recommended", color: "text-rose-400" });
  }

  const volTriggers = triggers.filter((t) => t.type === "volatility").length;
  if (volTriggers > 0) {
    insights.push({
      icon: Zap,
      text: `${volTriggers} volatility event${volTriggers > 1 ? "s" : ""} detected — elevated market activity`,
      color: "text-amber-400",
    });
  }

  if (reasons.length > 0) {
    insights.push({
      icon: Lightbulb,
      text: `${reasons.length} key feature${reasons.length > 1 ? "s" : ""} contributing to the ${pct}% probability score`,
      color: "text-violet-400",
    });
  }

  const newsTriggers = triggers.filter((t) => t.type === "news").length;
  if (newsTriggers > 0) {
    insights.push({
      icon: Newspaper,
      text: `${newsTriggers} headline${newsTriggers > 1 ? "s" : ""} flagged — sentiment factored into analysis`,
      color: "text-sky-400",
    });
  } else {
    insights.push({
      icon: Newspaper,
      text: "No major headlines detected — signal driven by technical factors",
      color: "text-slate-400",
    });
  }

  return insights;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MaHistoryPage() {
  const { data, loading, refresh } = useMultiAI();
  const triggers = data?.history_triggers || [];
  const reasons = data?.reasons?.historical || [];
  const prob = data?.models?.historical?.prob_up;

  /* Header action button */
  const heroAction = (
    <button
      type="button"
      onClick={refresh}
      disabled={loading}
      className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/40 hover:scale-[1.03] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Play size={18} />
      )}
      Run Analysis
    </button>
  );

  return (
    <div className="w-full py-10 pb-32 md:py-14">
      {/* ════════════════════════════════════════════
          1. HERO HEADER
          ════════════════════════════════════════════ */}
      <section>
        <MaPageHero
          icon={History}
          accent="amber"
          badge="Rolling stats"
          tagline="Historical Signal Analysis"
          title="History & triggers"
          highlight="History"
          subtitle="Volatility spikes, news events on the timeline, and random-forest rationale derived from return and volatility features."
          action={heroAction}
        />
      </section>

      {/* ════════════════════════════════════════════
          5. CONTROL BAR
          ════════════════════════════════════════════ */}
      <section className="mt-10">
        <MaControlBar />
      </section>

      {/* Status indicators */}
      <section className="mt-10">
        <MaLoading />
        <MaError />
      </section>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════════ */}
      {!loading && data && (
        <>
          {/* ────────────────────────────────────────
              2. PROBABILITY / SCORE CARD
              ──────────────────────────────────────── */}
          <section className="mt-12">
            <MaSignalCard
              label="Historical Model — Bullish Probability"
              prob={prob}
              tint="amber"
              footnote="Random forest trained on momentum, rolling returns, and volatility features."
            />
          </section>

          {/* ────────────────────────────────────────
              8. INSIGHT SUMMARY (NEW)
              ──────────────────────────────────────── */}
          <section className="mt-12">
            <div className="glass-card overflow-hidden p-0">
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-white/5 bg-gradient-to-r from-violet-950/40 to-indigo-950/30 px-10 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
                  <Lightbulb className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Model Insight Summary
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Key takeaways from the historical analysis pipeline
                  </p>
                </div>
              </div>

              {/* Insight rows */}
              <div className="divide-y divide-white/[0.04]">
                {getInsightSummary(prob, triggers, reasons).map(
                  (insight, i) => {
                    const Icon = insight.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-5 px-10 py-5 transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                          <Icon size={18} className={insight.color} />
                        </div>
                        <p className="text-[15px] leading-relaxed text-slate-300">
                          {insight.text}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* ────────────────────────────────────────
              3. FEATURE NARRATIVE — bullet cards
              ──────────────────────────────────────── */}
          <section className="mt-12">
            <MaReasonsPanel
              title="Feature Narrative"
              subtitle="Why the historical model leans this way — key signals driving the score"
              reasons={reasons}
            />
          </section>

          {/* ────────────────────────────────────────
              4. TRIGGER TIMELINE — vertical timeline
              ──────────────────────────────────────── */}
          <section className="mt-12">
            <div className="glass-card overflow-hidden p-0">
              {/* Timeline header */}
              <div className="flex items-center gap-4 border-b border-white/5 bg-slate-950/40 px-10 py-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <Timer className="h-5 w-5 text-amber-400/90" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Trigger Timeline
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Recent volatility events and headlines
                  </p>
                </div>
                {triggers.length > 0 && (
                  <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold tabular-nums text-slate-400 ring-1 ring-white/[0.06]">
                    {triggers.length} event{triggers.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Vertical timeline body */}
              <div className="overflow-y-auto px-10 py-8">
                {triggers.length > 0 ? (
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/40 via-slate-700/30 to-transparent" />

                    <div className="space-y-3">
                      {triggers.map((t, i) => {
                        const config =
                          TRIGGER_CONFIG[t.type] || FALLBACK_CONFIG;
                        const TriggerIcon = config.icon;

                        return (
                          <div
                            key={i}
                            className="group relative flex gap-8"
                          >
                            {/* Timeline node */}
                            <div className="relative z-10 shrink-0">
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.bg} ring-1 ${config.ringColor} bg-slate-950 transition-all duration-200 group-hover:scale-110 group-hover:ring-2`}
                              >
                                <TriggerIcon
                                  size={18}
                                  className={config.text}
                                />
                              </div>
                            </div>

                            {/* Event card */}
                            <div className="flex-1 mb-3 rounded-2xl border border-white/[0.05] bg-slate-950/40 px-8 py-6 transition-all duration-200 group-hover:border-white/[0.1] group-hover:bg-slate-900/40 group-hover:shadow-xl">
                              {/* Card header row */}
                              <div className="flex items-center justify-between gap-4">
                                <span
                                  className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${config.text}`}
                                >
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full ${config.dot} animate-pulse`}
                                  />
                                  {config.label}
                                </span>
                                <span className="font-mono text-xs tabular-nums text-slate-600 group-hover:text-slate-500 transition-colors">
                                  {t.date?.slice(0, 16)}
                                </span>
                              </div>

                              {/* Card body */}
                              <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-200 group-hover:text-white transition-colors">
                                {t.title}
                              </p>
                              {t.detail && (
                                <p className="mt-2 text-sm leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors">
                                  {t.detail}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800/50 ring-1 ring-white/[0.06]">
                      <Timer className="h-7 w-7 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-base text-slate-500">
                        No trigger events available
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Run analysis to detect volatility events and headlines
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {!loading && !data && (
        <section className="mt-12">
          <MaEmptyState />
        </section>
      )}
    </div>
  );
}
