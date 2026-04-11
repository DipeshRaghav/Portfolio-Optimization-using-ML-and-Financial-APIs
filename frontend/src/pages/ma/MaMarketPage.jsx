import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Globe } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaMarketPage() {
  const { data, loading } = useMultiAI();
  const macro = data?.market_analysis || {};
  const reasons = data?.reasons?.market || [];
  const mkt = data?.models?.market || {};
  const spx = macro.spx || [];
  const vix = macro.vix || [];

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Globe className="text-sky-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">Market context</h1>
          <p className="text-slate-500 text-sm">Index & volatility backdrop + model bias</p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <h3 className="text-slate-400 text-xs uppercase mb-2">S&amp;P 500 (proxy)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spx}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#0d1527", border: "1px solid #334155" }} />
                    <Line type="monotone" dataKey="value" stroke="#38bdf8" dot={false} strokeWidth={2} name="SPX" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-slate-400 text-xs uppercase mb-2">VIX</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vix}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#0d1527", border: "1px solid #334155" }} />
                    <Line type="monotone" dataKey="value" stroke="#f472b6" dot={false} strokeWidth={2} name="VIX" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <p className="text-slate-500 text-xs uppercase font-semibold">Market model</p>
            <p className="text-2xl font-mono text-sky-300">P(up) {((mkt.prob_up ?? 0) * 100).toFixed(1)}%</p>
            <p className="text-slate-400 text-sm">Bias: {mkt.market_bias?.toFixed?.(3) ?? mkt.market_bias}</p>
            <h2 className="text-white font-semibold text-sm pt-2">Triggers & narrative</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            {macro.error && <p className="text-red-400 text-xs">Macro series: {macro.error}</p>}
          </div>
        </>
      )}
      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar.</p>
      )}
    </div>
  );
}
