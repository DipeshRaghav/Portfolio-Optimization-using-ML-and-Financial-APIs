import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CandlestickChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

const fmtPrice = (v) =>
  typeof v === "number" && !Number.isNaN(v)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(v)
    : "—";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  const isFc = row?.is_forecast;
  const v = row?.close;
  return (
    <div className="rounded-xl border border-slate-600/80 bg-slate-950/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{String(label)}</p>
      <p className="font-mono text-lg text-white">{fmtPrice(v)}</p>
      <p className={`text-xs mt-1 ${isFc ? "text-violet-300" : "text-indigo-300"}`}>
        {isFc ? "Illustrative forecast" : "Historical close"}
      </p>
    </div>
  );
}

export default function MaChartPage() {
  const { data, loading } = useMultiAI();
  const series = data?.chart_series || [];
  const reasons = data?.reasons?.chart || [];
  const prob = data?.models?.chart?.prob_up;
  const fh = data?.models?.chart?.meta?.forward_horizon ?? 5;
  const sym = data?.symbol || "";
  const ens = data?.ensemble;
  const confidence = ens?.confidence;

  const composed = useMemo(() => {
    if (!series.length) return [];
    return series.map((p) => ({
      ...p,
      hist: p.is_forecast ? null : p.close,
      forecast: p.is_forecast ? p.close : null,
    }));
  }, [series]);

  const lastHist = useMemo(() => {
    for (let i = composed.length - 1; i >= 0; i--) {
      if (composed[i].hist != null) return composed[i].hist;
    }
    return null;
  }, [composed]);

  const bias =
    prob == null ? "neutral" : prob >= 0.55 ? "bullish" : prob <= 0.45 ? "bearish" : "neutral";

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-8 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-violet-950/30 px-6 py-8 md:px-10 md:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-violet-200/90">
              <Activity className="h-3.5 w-3.5 text-violet-400" aria-hidden />
              Sequence model
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-600/30 ring-1 ring-white/10">
                <CandlestickChart className="text-violet-200" size={26} aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  <span className="gradient-text">Chart</span> intelligence
                </h1>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                  Stacked LSTM reads enriched OHLCV windows and estimates{" "}
                  <span className="text-slate-300">{fh}-day forward</span> direction — shown with
                  history and an illustrative path from the ensemble.
                </p>
              </div>
            </div>
          </div>
          {sym && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-emerald-400/80" aria-hidden />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Ticker</p>
                <p className="font-mono text-xl font-semibold text-white">{sym}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MaControlBar />
      <MaLoading />
      <MaError />

      {!loading && data && (
        <>
          {/* Signal + chart */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-card relative overflow-hidden p-6">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-violet-500/10" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {fh}-day outlook
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-bold tracking-tight text-white tabular-nums">
                    {((prob ?? 0) * 100).toFixed(1)}
                  </span>
                  <span className="text-2xl font-light text-violet-300/90">%</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Probability of positive forward return</p>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wide text-slate-500">
                    <span>Bearish</span>
                    <span>Bullish</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500/80 via-amber-400/90 to-emerald-400/90 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, (prob ?? 0.5) * 100))}%` }}
                    />
                  </div>
                  <p className="text-center text-[11px] font-medium capitalize text-slate-400">
                    Bias: <span className="text-slate-200">{bias}</span>
                    {confidence != null && (
                      <span className="text-slate-500">
                        {" "}
                        · ensemble confidence {(confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </p>
                </div>

                {lastHist != null && (
                  <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/50 px-3 py-2">
                    <p className="text-[10px] uppercase text-slate-500">Last close (history)</p>
                    <p className="font-mono text-sm text-slate-200">{fmtPrice(lastHist)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-5 lg:col-span-8 lg:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-amber-400/90" aria-hidden />
                  Price path
                </h2>
                <p className="text-[11px] text-slate-500">
                  Solid + fill = history · dashed = illustrative forecast
                </p>
              </div>
              <div className="h-[min(420px,55vh)] w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={composed} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
                    <defs>
                      <linearGradient id="histFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      tickLine={false}
                      axisLine={{ stroke: "#334155" }}
                      minTickGap={28}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      tickLine={false}
                      axisLine={{ stroke: "#334155" }}
                      tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed?.(2) ?? v
                      }
                      width={52}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: 16 }}
                      formatter={(value) => (
                        <span className="text-xs text-slate-400">{value}</span>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="hist"
                      name="History"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#histFill)"
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={600}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name="Forecast"
                      stroke="#c4b5fd"
                      strokeWidth={2}
                      strokeDasharray="7 5"
                      dot={false}
                      connectNulls
                      isAnimationActive={true}
                      animationDuration={600}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-600">
                Illustrative continuation from ensemble score — not a price target or investment
                advice.
              </p>
            </div>
          </div>

          {/* Reasons */}
          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-white/5 bg-slate-950/40 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">Why this read</h2>
              <p className="text-xs text-slate-500">Model context + simple price structure</p>
            </div>
            <ul className="divide-y divide-white/[0.04]">
              {reasons.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-300">{r}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {!loading && !data && (
        <div className="glass-card py-20 text-center">
          <CandlestickChart className="mx-auto mb-3 h-10 w-10 text-slate-600" aria-hidden />
          <p className="text-slate-400 text-sm">Run analysis from the control bar to load the chart.</p>
        </div>
      )}
    </div>
  );
}
