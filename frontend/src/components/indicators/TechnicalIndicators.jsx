import { useState, useEffect } from "react";
import { Activity, BarChart2, TrendingUp, Volume2, AlertCircle, Loader2 } from "lucide-react";
import { getTechnicalData } from "../../services/api";
import { formatPriceBySymbol } from "../../utils/currency";

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTechs = async () => {
      if (!stock) return;
      setLoading(true);
      const res = await getTechnicalData(stock);
      setData(res);
      setLoading(false);
    };
    fetchTechs();
  }, [stock]);

  if (loading) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 min-h-[280px]">
        <Loader2 size={24} className="animate-spin text-slate-500" />
        <p className="text-slate-500 text-sm">Calculating...</p>
      </div>
    );
  }

  if (!stock || !data || data.error) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 min-h-[280px]">
        <AlertCircle size={24} className="text-slate-700" />
        <p className="text-slate-500 text-sm">{!stock ? "Select a stock" : `No data for ${stock}`}</p>
      </div>
    );
  }

  const rsiStyle = getRsiColor(data.rsi);

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800/60 pb-4">
        <h2 className="text-white font-semibold text-lg tracking-wide">📊 Technical Indicators</h2>
        <span className="text-xs font-bold uppercase tracking-[2px] bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full">{stock}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* RSI */}
        <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/40 shadow-inner flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-slate-500">
              <Activity size={14} /> RSI (14)
            </span>
            <span className={`text-xl font-bold font-mono ${rsiStyle.text}`}>{data.rsi}</span>
          </div>
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${data.rsi}%`, background: data.rsi >= 70 ? "#ef4444" : data.rsi <= 30 ? "#22c55e" : "#f59e0b" }} />
          </div>
          <span className={`text-xs font-semibold ${rsiStyle.text}`}>{rsiStyle.label} Zone</span>
        </div>

        {/* MACD */}
        <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/40 shadow-inner flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-slate-500">
              <BarChart2 size={14} /> MACD
            </span>
            <span className={`text-xl font-bold font-mono ${data.macdValue >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {data.macdValue >= 0 ? "+" : ""}{data.macdValue}
            </span>
          </div>
          <p className={`mt-2 text-sm font-bold ${getSignalColor(data.macd)} bg-slate-800/40 w-fit px-3 py-1 rounded-lg`}>
            {data.macd} Trend
          </p>
        </div>

        {/* Moving Averages */}
        <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/40 shadow-inner space-y-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-slate-500 mb-2">
            <TrendingUp size={14} /> Moving Averages
          </span>
          {[{ label: "MA 20", val: data.ma20 }, { label: "MA 50", val: data.ma50 }, { label: "MA 200", val: data.ma200 }].map((m) => (
            <div key={m.label} className="flex justify-between items-center border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
              <span className="text-slate-400 text-xs font-medium">{m.label}</span>
              <span className={`text-sm font-semibold text-slate-200 font-mono`}>{formatPriceBySymbol(stock, m.val)}</span>
            </div>
          ))}
        </div>

        {/* Bollinger Bands */}
        <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/40 shadow-inner space-y-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-slate-500 mb-2">
            <Activity size={14} /> Bollinger Bands
          </span>
          <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
            <span className="text-slate-400 text-xs font-medium">Upper Band</span>
            <span className="text-sm font-semibold text-emerald-400 font-mono">{formatPriceBySymbol(stock, data.bbUpper)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-medium">Lower Band</span>
            <span className="text-sm font-semibold text-red-400 font-mono">{formatPriceBySymbol(stock, data.bbLower)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800/40 shadow-inner flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-slate-500">
              <Volume2 size={14} /> Volume
            </span>
          </div>
          <div className={`mt-auto text-center py-3 rounded-xl bg-slate-800/30 border border-slate-700/50`}>
            <span className={`text-lg font-extrabold ${getSignalColor(data.volume)}`}>{data.volume}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
