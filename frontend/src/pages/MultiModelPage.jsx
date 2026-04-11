import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Brain,
  ChevronRight,
  LineChart,
  Loader2,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { getMultiModelPrediction } from "../services/api";
import MetricCard from "../components/common/MetricCard";

const TABS = [
  { id: "overview", label: "Overview", icon: Brain },
  { id: "models", label: "By model", icon: LineChart },
  { id: "risk", label: "Risk & VaR", icon: Shield },
  { id: "backtest", label: "Backtest", icon: Activity },
];

const PERIODS = [
  { value: "6mo", label: "6 months" },
  { value: "1y", label: "1 year" },
  { value: "2y", label: "2 years" },
  { value: "5y", label: "5 years" },
];

const MODEL_KEYS = [
  { key: "chart", label: "Chart (LSTM)" },
  { key: "indicator", label: "Technical (XGB/RF)" },
  { key: "sentiment", label: "Sentiment (NLP)" },
  { key: "historical", label: "Historical stats" },
  { key: "market", label: "Market context" },
];

function signalColor(sig) {
  if (sig === "buy") return "text-emerald-400";
  if (sig === "sell") return "text-red-400";
  return "text-amber-300";
}

export default function MultiModelPage({ selectedStocks }) {
  const [period, setPeriod] = useState("2y");
  const [chartEpochs, setChartEpochs] = useState(4);
  const [activeSymbols, setActiveSymbols] = useState(() =>
    (selectedStocks && selectedStocks.length ? selectedStocks : ["AAPL"]).slice(0, 3)
  );
  const [tab, setTab] = useState("overview");
  const [modelFilter, setModelFilter] = useState(() =>
    MODEL_KEYS.reduce((acc, m) => ({ ...acc, [m.key]: true }), {})
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastMeta, setLastMeta] = useState(null);

  const runFetch = useCallback(async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await getMultiModelPrediction(activeSymbols, period, chartEpochs);
      setData(res);
      setLastMeta({ period, chartEpochs, symbols: [...activeSymbols] });
    } finally {
      setLoading(false);
    }
  }, [activeSymbols, period, chartEpochs]);

  const breakdownChartData = useMemo(() => {
    if (!data?.results?.length) return [];
    const r = data.results[0];
    const br = r?.ensemble?.breakdown;
    if (!br) return [];
    return Object.entries(br).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(value) * 100,
    }));
  }, [data]);

  const toggleSymbol = (sym) => {
    setActiveSymbols((prev) => {
      if (prev.includes(sym)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== sym);
      }
      if (prev.length >= 3) return prev;
      return [...prev, sym];
    });
  };

  const toggleModelFilter = (key) => {
    setModelFilter((f) => ({ ...f, [key]: !f[key] }));
  };

  return (
    <div className="p-5 space-y-5 page-fade max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={22} className="text-violet-400" />
            <h1 className="text-white font-bold text-xl tracking-tight">Multi-AI prediction</h1>
          </div>
          <p className="text-slate-500 text-sm max-w-xl">
            Five independent models (chart, technicals, sentiment, historical, market) combined with a
            weighted ensemble, then risk metrics and a demo backtest. Tune period and training depth below.
          </p>
        </div>
        <button
          type="button"
          onClick={runFetch}
          disabled={loading || !activeSymbols.length}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Run analysis
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <SlidersHorizontal size={14} />
          Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="text-slate-500 text-xs block mb-1">History period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-slate-500 text-xs block mb-1">
              LSTM epochs ({chartEpochs}) — lower is faster
            </label>
            <input
              type="range"
              min={2}
              max={12}
              value={chartEpochs}
              onChange={(e) => setChartEpochs(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-500 text-xs block mb-1">Symbols (max 3)</label>
            <div className="flex flex-wrap gap-2">
              {(selectedStocks?.length ? selectedStocks : ["AAPL", "MSFT", "GOOGL"]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymbol(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                    activeSymbols.includes(s)
                      ? "bg-violet-500/20 border-violet-500/50 text-violet-200"
                      : "bg-slate-900/50 border-slate-700 text-slate-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-4">
          <p className="text-slate-500 text-xs mb-2">Show in “By model” tab</p>
          <div className="flex flex-wrap gap-2">
            {MODEL_KEYS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleModelFilter(m.key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  modelFilter[m.key]
                    ? "border-slate-600 text-slate-200 bg-slate-800/60"
                    : "border-transparent text-slate-600 line-through"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="glass-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="animate-spin text-violet-400" size={32} />
          <p className="text-sm">Training models & building ensemble… this can take 30–90s on first run.</p>
        </div>
      )}

      {!loading && data?.errors?.length > 0 && !data?.results?.length && (
        <div className="glass-card p-6 border border-red-500/20 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-300 font-semibold text-sm">Could not load multi-model results</p>
            <ul className="text-slate-400 text-sm mt-2 space-y-1">
              {data.errors.map((e, i) => (
                <li key={i}>
                  {e.symbol && <span className="font-mono text-slate-300">{e.symbol}: </span>}
                  {e.error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!loading && data?.results?.length > 0 && (
        <>
          {lastMeta && (
            <p className="text-slate-600 text-xs font-mono">
              Last run: {lastMeta.symbols.join(", ")} · {lastMeta.period} · {lastMeta.chartEpochs} LSTM epochs
            </p>
          )}

          {tab === "overview" && (
            <div className="space-y-5">
              {data.results.map((r) => (
                <div key={r.symbol} className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                    <ChevronRight size={16} className="text-violet-500" />
                    {r.symbol}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      label="Ensemble score"
                      value={(r.ensemble?.final_score * 100).toFixed(1)}
                      unit="%"
                      color="purple"
                      icon={TrendingUp}
                      subtitle="Weighted combination of 5 models"
                    />
                    <MetricCard
                      label="Confidence"
                      value={(r.ensemble?.confidence * 100).toFixed(1)}
                      unit="%"
                      color="blue"
                      subtitle="Distance from neutral (50%)"
                    />
                    <div className="glass-card p-5 flex flex-col justify-center">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        Signal
                      </span>
                      <p className={`text-3xl font-bold font-mono ${signalColor(r.ensemble?.signal)}`}>
                        {(r.ensemble?.signal || "hold").toUpperCase()}
                      </p>
                    </div>
                    <MetricCard
                      label="Risk score"
                      value={r.risk?.risk_score?.toFixed(1) ?? "—"}
                      unit="/100"
                      color="yellow"
                      icon={Shield}
                      subtitle="Heuristic from vol & drawdown"
                    />
                  </div>
                </div>
              ))}

              {breakdownChartData.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                    Contribution by model (first symbol)
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={breakdownChartData} layout="vertical" margin={{ left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#0d1527",
                            border: "1px solid #334155",
                            borderRadius: 12,
                          }}
                          formatter={(v) => [`${Number(v).toFixed(1)}%`, "Score"]}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {breakdownChartData.map((_, i) => (
                            <Cell key={i} fill={["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"][i % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "models" && (
            <div className="space-y-6">
              {data.results.map((r) => (
                <div key={r.symbol} className="glass-card overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800/80 font-mono text-violet-300 text-sm">
                    {r.symbol}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full data-table text-sm">
                      <thead>
                        <tr>
                          <th className="text-left">Model</th>
                          <th className="text-right">P(up)</th>
                          <th className="text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MODEL_KEYS.filter((m) => modelFilter[m.key]).map((m) => {
                          const block = r.models?.[m.key];
                          const p = block?.prob_up ?? block?.raw_score;
                          let note = "";
                          if (m.key === "sentiment" && block?.sentiment_score != null) {
                            note = `Sentiment ${block.sentiment_score.toFixed(2)} (−1…+1)`;
                          } else if (m.key === "market" && block?.market_bias != null) {
                            note = `Bias ${block.market_bias.toFixed(2)}`;
                          } else {
                            note = "—";
                          }
                          return (
                            <tr key={m.key}>
                              <td className="font-medium text-slate-200">{m.label}</td>
                              <td className="text-right font-mono text-emerald-300">
                                {p != null ? `${(p * 100).toFixed(1)}%` : "—"}
                              </td>
                              <td className="text-slate-500 text-xs">{note}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "risk" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {data.results.map((r) => (
                <div key={r.symbol} className="glass-card p-6 space-y-4">
                  <h3 className="font-mono text-violet-300">{r.symbol}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Annualized vol</p>
                      <p className="font-mono text-white text-lg">
                        {((r.risk?.portfolio_vol_annual || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Historical VaR (95%)</p>
                      <p className="font-mono text-amber-300 text-lg">
                        {(r.risk?.var_historical * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Max drawdown</p>
                      <p className="font-mono text-red-300 text-lg">
                        {((r.risk?.max_drawdown || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Risk score</p>
                      <p className="font-mono text-white text-lg">{r.risk?.risk_score?.toFixed(1)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Suggestions</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                      {(r.risk?.suggestions || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "backtest" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {data.results.map((r) => (
                <div key={r.symbol} className="glass-card p-6 space-y-4">
                  <h3 className="font-mono text-violet-300">{r.symbol}</h3>
                  <p className="text-slate-500 text-xs">{r.backtest?.note}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Total return</p>
                      <p
                        className={`font-mono text-lg ${
                          (r.backtest?.total_return || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {((r.backtest?.total_return || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Sharpe</p>
                      <p className="font-mono text-white text-lg">{r.backtest?.sharpe?.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Win rate</p>
                      <p className="font-mono text-slate-200 text-lg">
                        {((r.backtest?.win_rate || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Max DD (equity)</p>
                      <p className="font-mono text-red-300 text-lg">
                        {((r.backtest?.max_drawdown || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !data && (
        <div className="glass-card p-10 text-center text-slate-500 text-sm">
          Configure filters and click <span className="text-violet-400 font-semibold">Run analysis</span> to load
          multi-model output from the API.
        </div>
      )}
    </div>
  );
}
