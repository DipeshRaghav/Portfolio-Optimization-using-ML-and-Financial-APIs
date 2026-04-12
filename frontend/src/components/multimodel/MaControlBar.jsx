import { Loader2, Play, Clock } from "lucide-react";
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
    <div className="glass-card w-full px-8 py-6 md:px-10 md:py-7 ring-1 ring-white/[0.04]">
      <div className="flex flex-col xl:flex-row xl:items-end gap-6">
        {/* ─── Left: controls ─── */}
        <div className="flex flex-wrap items-end gap-6 flex-1">
          {/* Symbol search */}
          <MaSymbolSearch />

          {/* Timeframe pill group */}
          <div>
            <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-2.5">
              Timeframe
            </label>
            <div className="flex rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={`px-5 py-3 text-sm font-medium transition-all duration-200 ${
                    period === p.value
                      ? "bg-violet-500/20 text-violet-300 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Epoch slider */}
          <div className="min-w-[220px]">
            <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-2.5">
              LSTM Epochs
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={12}
                value={chartEpochs}
                onChange={(e) => setChartEpochs(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none bg-slate-800 accent-violet-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-violet-500/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-violet-400 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="rounded-lg bg-violet-500/10 px-3 py-1.5 font-mono text-sm font-semibold text-violet-300 ring-1 ring-violet-500/20 tabular-nums min-w-[44px] text-center">
                {chartEpochs}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Right: run + timestamp ─── */}
        <div className="flex items-center gap-5 shrink-0">
          {lastLoadedAt && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <Clock size={12} />
              <span className="font-mono">
                {new Date(lastLoadedAt).toLocaleTimeString()}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Play size={18} />
            )}
            Run analysis
          </button>
        </div>
      </div>
    </div>
  );
}
