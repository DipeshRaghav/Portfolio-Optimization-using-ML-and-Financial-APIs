import { useState, useMemo } from "react";
import {
  ResponsiveContainer, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Area, AreaChart,
} from "recharts";
import { stockHistories } from "../../data/mockData";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

const TIME_FILTERS = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

const STOCK_META = {
  AAPL: "NASDAQ", MSFT: "NASDAQ", GOOGL: "NASDAQ",
  TSLA: "NASDAQ", AMZN: "NASDAQ", NVDA: "NASDAQ",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1527] border border-slate-800/60 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-slate-500 text-[10px] mb-1.5 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span className="text-white font-mono font-semibold">${p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default function StockChart({ selectedStocks, activeStock }) {
  const [activeTime, setActiveTime] = useState("1M");
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);

  const stock = activeStock || selectedStocks[0];
  const days = TIME_FILTERS.find((f) => f.label === activeTime)?.days || 30;

  const chartData = useMemo(() => {
    if (!stock || !stockHistories[stock]) return [];
    return stockHistories[stock].slice(-days).map((p) => ({
      date: p.date, price: p.price, ma20: p.ma20, ma50: p.ma50,
    }));
  }, [stock, days]);

  const history = stock ? stockHistories[stock]?.slice(-days) : [];
  const lastPrice = history?.[history.length - 1]?.price ?? 0;
  const firstPrice = history?.[0]?.price ?? 0;
  const priceChange = lastPrice - firstPrice;
  const pctChange = firstPrice ? (priceChange / firstPrice) * 100 : 0;
  const isUp = pctChange >= 0;
  const volume = history?.[history.length - 1]?.volume;

  if (!stock || !stockHistories[stock]) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center gap-4 min-h-[480px]">
        <Activity size={40} className="text-slate-700" />
        <p className="text-slate-500 text-sm">Select a stock to view chart</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-white font-bold text-2xl tracking-tight">{stock}</h2>
            <span className="text-[9px] font-bold uppercase tracking-[2px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
              {STOCK_META[stock] || "NYSE"}
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-mono font-extrabold text-4xl text-white tracking-tight">
              ${lastPrice.toFixed(2)}
            </span>
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isUp ? "+" : ""}{priceChange.toFixed(2)} ({isUp ? "+" : ""}{pctChange.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Overlays */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 text-[10px] font-medium mr-1">Overlays:</span>
            {[
              { label: "MA20", active: showMA20, toggle: () => setShowMA20(!showMA20), color: "emerald" },
              { label: "MA50", active: showMA50, toggle: () => setShowMA50(!showMA50), color: "amber" },
            ].map((o) => (
              <button
                key={o.label}
                onClick={o.toggle}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                  o.active
                    ? `bg-${o.color}-500/15 text-${o.color}-400 border border-${o.color}-500/30`
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* Time Filters */}
          <div className="flex bg-slate-800/30 p-1 rounded-xl">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveTime(f.label)}
                className={`time-btn ${activeTime === f.label ? "active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.15)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#334155", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(1, Math.floor(chartData.length / 8))}
            />
            <YAxis
              tick={{ fill: "#334155", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={55}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              name={stock}
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#22d3ee" }}
            />
            {showMA20 && (
              <Line type="monotone" dataKey="ma20" name="MA20" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
            )}
            {showMA50 && (
              <Line type="monotone" dataKey="ma50" name="MA50" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-[10px] text-slate-600">
        <span>📊 Vol: {volume ? (volume / 1e6).toFixed(1) + "M" : "—"}</span>
        <span>Data points: {chartData.length}</span>
      </div>
    </div>
  );
}
