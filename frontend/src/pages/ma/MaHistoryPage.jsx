import { History, Timer } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import MaReasonsPanel from "../../components/multimodel/MaReasonsPanel";
import MaSignalCard from "../../components/multimodel/MaSignalCard";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaHistoryPage() {
  const { data, loading } = useMultiAI();
  const triggers = data?.history_triggers || [];
  const reasons = data?.reasons?.historical || [];
  const prob = data?.models?.historical?.prob_up;

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-6 pb-16">
      <MaPageHero
        icon={History}
        accent="amber"
        badge="Rolling stats"
        title="History & triggers"
        highlight="History"
        subtitle="Volatility spikes, news on the timeline, and random-forest rationale from return and volatility features."
      />
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <div className="space-y-6">
          <MaSignalCard
            label="Historical model — P(up)"
            prob={prob}
            tint="amber"
            footnote="Random forest on momentum and volatility features."
          />
          <MaReasonsPanel
            title="Feature narrative"
            subtitle="Why the historical vertical leans this way"
            reasons={reasons}
          />
          <div className="glass-card overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-white/5 bg-slate-950/40 px-6 py-4">
              <Timer className="h-4 w-4 text-amber-400/90" />
              <div>
                <h2 className="text-sm font-semibold text-white">Trigger timeline</h2>
                <p className="text-xs text-slate-500">Recent volatility events and headlines</p>
              </div>
            </div>
            <div className="max-h-[min(560px,60vh)] space-y-0 overflow-y-auto p-2">
              {triggers.map((t, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-b border-white/[0.04] px-4 py-4 last:border-0 hover:bg-white/[0.02]"
                >
                  <span className="w-36 shrink-0 font-mono text-[10px] text-slate-500">
                    {t.date?.slice(0, 16)}
                  </span>
                  <div className="min-w-0 border-l-2 border-amber-500/25 pl-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        t.type === "news" ? "text-emerald-400" : "text-orange-400"
                      }`}
                    >
                      {t.type}
                    </span>
                    <p className="mt-1 text-sm text-slate-200">{t.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!loading && !data && <MaEmptyState />}
    </div>
  );
}
