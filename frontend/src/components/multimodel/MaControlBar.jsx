import { Loader2, Play } from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";

const PERIODS = [
  { value: "6mo", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "2y", label: "2Y" },
  { value: "5y", label: "5Y" },
];

export default function MaControlBar() {
  const {
    symbol,
    setSymbol,
    period,
    setPeriod,
    chartEpochs,
    setChartEpochs,
    loading,
    refresh,
    lastLoadedAt,
  } = useMultiAI();

  return (
    <div className="glass-card p-4 mb-6 flex flex-col xl:flex-row xl:items-end gap-4 flex-wrap">
      <div className="flex flex-wrap items-end gap-3 flex-1">
        <div>
          <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
            Symbol
          </label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-white w-32"
            placeholder="AAPL"
          />
        </div>
        <div>
          <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
            History
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
            LSTM epochs ({chartEpochs})
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={chartEpochs}
            onChange={(e) => setChartEpochs(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          Run analysis
        </button>
        {lastLoadedAt && (
          <span className="text-slate-600 text-[10px] font-mono hidden sm:inline">
            {new Date(lastLoadedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
