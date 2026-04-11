import { Loader2, Play } from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";
import MaSymbolSearch from "./MaSymbolSearch";

const PERIODS = [
  { value: "6mo", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "2y", label: "2Y" },
  { value: "5y", label: "5Y" },
];

export default function MaControlBar() {
  const {
    period,
    setPeriod,
    chartEpochs,
    setChartEpochs,
    loading,
    refresh,
    lastLoadedAt,
  } = useMultiAI();

  return (
    <div className="glass-card p-4 md:p-5 mb-2 flex flex-col xl:flex-row xl:items-end gap-4 flex-wrap ring-1 ring-white/[0.04]">
      <div className="flex flex-wrap items-end gap-4 flex-1">
        <MaSymbolSearch />
        <div>
          <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
            History
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-200 shadow-inner shadow-black/20 outline-none transition focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20"
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
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:shadow-none"
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
