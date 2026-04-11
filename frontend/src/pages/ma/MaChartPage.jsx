import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CandlestickChart } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaChartPage() {
  const { data, loading } = useMultiAI();
  const series = data?.chart_series || [];
  const histPts = series.filter((p) => !p.is_forecast);
  const fcPts = series.filter((p) => p.is_forecast);
  const bridge =
    histPts.length && fcPts.length
      ? [histPts[histPts.length - 1], ...fcPts]
      : fcPts;
  const reasons = data?.reasons?.chart || [];
  const prob = data?.models?.chart?.prob_up;
  const fh = data?.models?.chart?.meta?.forward_horizon ?? 5;
  const sym = data?.symbol || "";

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <CandlestickChart className="text-violet-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">Chart model</h1>
          <p className="text-slate-500 text-sm">
            Stacked LSTM on enriched OHLCV windows — {fh}-day forward return probability
          </p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />

      {!loading && data && (
        <>
          <div className="glass-card p-6">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <p className="text-slate-500 text-xs uppercase font-semibold">P({fh}d forward ↑)</p>
                <p className="text-3xl font-mono text-violet-300">{((prob ?? 0) * 100).toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">{sym}</p>
                <p className="text-slate-400 text-sm">Historical close + illustrative forecast from ensemble</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} minTickGap={24} />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#0d1527", border: "1px solid #334155", borderRadius: 12 }}
                    labelFormatter={(l) => String(l)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    data={histPts}
                    dataKey="close"
                    name="History"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    data={bridge}
                    dataKey="close"
                    name="Forecast"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-slate-600 text-[10px] mt-2">
              Purple solid = historical close; lighter dashed = illustrative forward path from ensemble score (not advice).
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-3">Why this prediction</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar to load data.</p>
      )}
    </div>
  );
}
