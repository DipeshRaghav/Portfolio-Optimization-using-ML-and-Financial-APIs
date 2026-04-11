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
import { FileCheck } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

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
    <div className="p-5 max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-2">
        <FileCheck className="text-fuchsia-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">Final report</h1>
          <p className="text-slate-500 text-sm">All verticals + ensemble + forecast continuation</p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <p className="text-slate-500 text-xs uppercase">Final score</p>
              <p className="text-3xl font-mono text-fuchsia-300">{((ens?.final_score ?? 0) * 100).toFixed(1)}%</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-slate-500 text-xs uppercase">Signal</p>
              <p className="text-3xl font-bold text-white">{(ens?.signal || "hold").toUpperCase()}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-slate-500 text-xs uppercase">Confidence</p>
              <p className="text-3xl font-mono text-slate-200">{((ens?.confidence ?? 0) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Vertical contributions (% bullish proxy)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#0d1527", border: "1px solid #334155" }}
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, "Score"]}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Price + predicted continuation</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} minTickGap={28} />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0d1527", border: "1px solid #334155" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    data={histPts}
                    dataKey="close"
                    name="History"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    data={bridge}
                    dataKey="close"
                    name="Forecast"
                    stroke="#f472b6"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-slate-600 text-[10px] mt-2">
              Forecast segment encodes ensemble direction only (illustrative). Not investment advice.
            </p>
          </div>
        </>
      )}
      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar.</p>
      )}
    </div>
  );
}
