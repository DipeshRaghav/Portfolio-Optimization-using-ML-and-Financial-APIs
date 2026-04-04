import { technicalIndicators } from "../../data/mockData";
import { Activity, BarChart2, TrendingUp, Volume2, AlertCircle } from "lucide-react";

const getRsiColor = (rsi) => {
  if (rsi >= 70) return { text: "text-red-400", label: "Overbought", bg: "bg-red-500/10" };
  if (rsi <= 30) return { text: "text-emerald-400", label: "Oversold", bg: "bg-emerald-500/10" };
  return { text: "text-amber-400", label: "Neutral", bg: "bg-amber-500/10" };
};

const getSignalColor = (signal) => {
  if (["Bullish", "Positive", "High", "Above Avg", "Very High"].includes(signal)) return "text-emerald-400";
  if (["Bearish", "Negative"].includes(signal)) return "text-red-400";
  return "text-amber-400";
};

export default function TechnicalIndicators({ selectedStocks }) {
  const stock = selectedStocks[0];
  const data = stock ? technicalIndicators[stock] : null;

  if (!stock || !data) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 min-h-[280px]">
        <AlertCircle size={24} className="text-slate-700" />
        <p className="text-slate-500 text-sm">{!stock ? "Select a stock" : `No data for ${stock}`}</p>
      </div>
    );
  }

  const rsiStyle = getRsiColor(data.rsi);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-sm tracking-wide">📊 Technical Indicators</h2>
        <span className="text-[9px] font-bold uppercase tracking-[2px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">{stock}</span>
      </div>

      <div className="space-y-4">
        {/* RSI */}
        <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800/20">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
              <Activity size={12} /> RSI (14)
            </span>
            <span className={`text-sm font-bold font-mono ${rsiStyle.text}`}>{data.rsi}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden mb-1.5">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${data.rsi}%`, background: data.rsi >= 70 ? "#ef4444" : data.rsi <= 30 ? "#22c55e" : "#f59e0b" }} />
          </div>
          <span className={`text-[10px] font-semibold ${rsiStyle.text}`}>{rsiStyle.label}</span>
        </div>

        {/* MACD */}
        <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
              <BarChart2 size={12} /> MACD
            </span>
            <span className={`text-sm font-bold font-mono ${data.macdValue >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.macdValue >= 0 ? "+" : ""}{data.macdValue}
            </span>
          </div>
          <p className={`mt-1.5 text-[10px] font-semibold ${getSignalColor(data.macd)}`}>● {data.macd}</p>
        </div>

        {/* Moving Averages */}
        <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800/20 space-y-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
            <TrendingUp size={12} /> Moving Averages
          </span>
          {[{ label: "MA 20", val: data.ma20 }, { label: "MA 50", val: data.ma50 }].map((m) => (
            <div key={m.label} className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">{m.label}</span>
              <span className={`text-xs font-semibold ${getSignalColor(m.val)}`}>● {m.val}</span>
            </div>
          ))}
        </div>

        {/* Volume */}
        <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
              <Volume2 size={12} /> Volume Trend
            </span>
            <span className={`text-xs font-semibold ${getSignalColor(data.volume)}`}>{data.volume}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
