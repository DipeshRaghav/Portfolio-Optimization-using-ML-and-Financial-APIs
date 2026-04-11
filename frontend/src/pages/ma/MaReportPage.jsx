import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileCheck, Zap } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

const tip = { background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 };

function signalClass(sig) {
  const s = (sig || "hold").toLowerCase();
  if (s === "buy") return "signal-buy";
  if (s === "sell") return "signal-sell";
  return "signal-hold";
}

export default function MaReportPage() {
  const { data, loading } = useMultiAI();
  const ens = data?.ensemble;
  const breakdown = ens?.breakdown || {};
  const barData = Object.entries(breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: Number(value) * 100,
  }));
  const series = data?.chart_series || [];
  const histPts = series.filter((p) => !p.is_forecast);
  const fcPts = series.filter((p) => p.is_forecast);
  const bridge =
    histPts.length && fcPts.length ? [histPts[histPts.length - 1], ...fcPts] : fcPts;

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-6 pb-20">
      <MaPageHero
        icon={FileCheck}
        accent="fuchsia"
        badge="Synthesis"
        title="Final intelligence report"
        highlight="intelligence"
        subtitle="Every vertical, weighted ensemble, confidence, and an illustrative price continuation — one view before you decide."
      />
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass-card relative overflow-hidden p-6 ring-1 ring-fuchsia-500/15">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-fuchsia-500/15 blur-2xl" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Final score
              </p>
              <p className="relative mt-1 font-mono text-3xl font-bold text-fuchsia-300">
                {((ens?.final_score ?? 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="glass-card relative flex flex-col justify-center overflow-hidden p-6 ring-1 ring-violet-500/15">
              <div className="absolute -left-4 bottom-0 h-20 w-20 rounded-full bg-violet-500/15 blur-2xl" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Signal</p>
              <div className="relative mt-2 flex items-center gap-3">
                <Zap className="h-6 w-6 text-amber-400/90" />
                <span className={`${signalClass(ens?.signal)} text-sm`}>
                  {(ens?.signal || "hold").toUpperCase()}
                </span>
              </div>
            </div>
            <div className="glass-card relative overflow-hidden p-6 ring-1 ring-slate-500/20">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-white/[0.04]" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Confidence
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-slate-200">
                {((ens?.confidence ?? 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-white/5 bg-slate-950/40 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Vertical contributions</h2>
              <p className="text-xs text-slate-500">Bullish proxy by model (% scale)</p>
            </div>
            <div className="h-72 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} width={40} />
                  <Tooltip
                    contentStyle={tip}
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, "Score"]}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-white/5 bg-slate-950/40 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Price + continuation</h2>
              <p className="text-xs text-slate-500">History vs illustrative ensemble path</p>
            </div>
            <div className="h-[min(400px,50vh)] min-h-[260px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} minTickGap={28} />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 10 }} width={52} />
                  <Tooltip contentStyle={tip} />
                  <Legend />
                  <Line
                    type="monotone"
                    data={histPts}
                    dataKey="close"
                    name="History"
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    data={bridge}
                    dataKey="close"
                    name="Forecast"
                    stroke="#f472b6"
                    strokeWidth={2}
                    strokeDasharray="7 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="border-t border-white/5 px-6 py-3 text-center text-[10px] text-slate-600">
              Forecast encodes ensemble direction only (illustrative). Not investment advice.
            </p>
          </div>
        </>
      )}
      {!loading && !data && <MaEmptyState />}
    </div>
  );
}
