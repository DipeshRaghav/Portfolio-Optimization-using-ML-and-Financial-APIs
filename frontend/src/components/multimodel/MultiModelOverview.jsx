import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Zap } from "lucide-react";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];

export default function MultiModelOverview({ data }) {
  if (!data?.ensemble) return null;
  const { final_score, confidence, signal, breakdown } = data.ensemble;
  const chartData = Object.entries(breakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number((value * 100).toFixed(2)),
  }));

  const signalStyle =
    signal === "buy"
      ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
      : signal === "sell"
        ? "text-red-400 bg-red-500/15 border-red-500/30"
        : "text-amber-400 bg-amber-500/15 border-amber-500/30";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Ensemble score</p>
          <p className="text-4xl font-mono font-bold text-white">{(final_score * 100).toFixed(1)}%</p>
          <p className="text-slate-500 text-xs mt-2">Weighted combination of 5 models</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" /> Confidence
          </p>
          <p className="text-4xl font-mono font-bold text-amber-300">{(confidence * 100).toFixed(0)}%</p>
          <p className="text-slate-500 text-xs mt-2">Distance from neutral (50%)</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-center">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target size={14} className="text-blue-400" /> Signal
          </p>
          <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl border text-lg font-bold uppercase tracking-wide ${signalStyle}`}>
            {signal}
          </span>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-white font-semibold text-sm mb-4">Model contribution (bullish score %)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={88} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0d1527", border: "1px solid #1e293b", borderRadius: 12 }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(v) => [`${v}%`, "Score"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
