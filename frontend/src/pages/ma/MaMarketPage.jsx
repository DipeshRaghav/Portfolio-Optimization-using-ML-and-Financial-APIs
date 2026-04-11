import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Globe, TrendingUp } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import MaReasonsPanel from "../../components/multimodel/MaReasonsPanel";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

const tip = { background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 };

export default function MaMarketPage() {
  const { data, loading } = useMultiAI();
  const macro = data?.market_analysis || {};
  const reasons = data?.reasons?.market || [];
  const mkt = data?.models?.market || {};
  const spx = macro.spx || [];
  const vix = macro.vix || [];

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-6 pb-16">
      <MaPageHero
        icon={Globe}
        accent="sky"
        badge="Macro"
        title="Market context"
        highlight="Market"
        subtitle="S&amp;P 500 and VIX series plus market-model bias — how the tape supports or fights your ticker read."
      />
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="glass-card overflow-hidden p-0 ring-1 ring-sky-500/10">
              <div className="border-b border-white/5 bg-slate-950/50 px-5 py-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-sky-400/90">
                  S&amp;P 500
                </h3>
                <p className="text-xs text-slate-500">Recent index path (proxy)</p>
              </div>
              <div className="h-60 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spx}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={["auto", "auto"]} width={48} />
                    <Tooltip contentStyle={tip} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={false}
                      name="SPX"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card overflow-hidden p-0 ring-1 ring-fuchsia-500/10">
              <div className="border-b border-white/5 bg-slate-950/50 px-5 py-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400/90">VIX</h3>
                <p className="text-xs text-slate-500">Implied volatility index</p>
              </div>
              <div className="h-60 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vix}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={["auto", "auto"]} width={48} />
                    <Tooltip contentStyle={tip} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#f472b6"
                      strokeWidth={2.5}
                      dot={false}
                      name="VIX"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card relative overflow-hidden p-6">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-sky-500/10" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Market model
                </p>
                <p className="mt-1 flex items-center gap-2 font-mono text-3xl font-bold text-sky-300">
                  <TrendingUp className="h-7 w-7 text-sky-400/80" />
                  {((mkt.prob_up ?? 0) * 100).toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Bias:{" "}
                  <span className="font-mono text-slate-200">
                    {mkt.market_bias?.toFixed?.(3) ?? mkt.market_bias}
                  </span>
                </p>
              </div>
            </div>
            {macro.error && (
              <p className="mt-4 text-xs text-red-400">Macro series: {macro.error}</p>
            )}
          </div>
          <MaReasonsPanel
            title="Macro narrative"
            subtitle="Context for the market vertical"
            reasons={reasons}
          />
        </div>
      )}
      {!loading && !data && <MaEmptyState />}
    </div>
  );
}
