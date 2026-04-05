import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Area, AreaChart,
} from "recharts";
import { getMarketData } from "../../services/api";
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
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  const stock = activeStock || selectedStocks[0];
  const days = TIME_FILTERS.find((f) => f.label === activeTime)?.days || 30;

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStocks || selectedStocks.length === 0) return;

      setLoading(true);
      const result = await getMarketData(selectedStocks);
      console.log("MARKET DATA:", result);
      setMarketData(result || {});
      setLoading(false);
    };

    fetchData();
  }, [selectedStocks]);

  // 🔥 FORMAT DATA FOR CHART
  const chartData = useMemo(() => {
    if (!stock || !marketData[stock]) return [];

    const history = marketData[stock].history.slice(-days);

    return history.map((price, index) => ({
      date: index,
      price: price,
    }));
  }, [stock, marketData, days]);

  const history = marketData[stock]?.history || [];
  const lastPrice = history[history.length - 1] || 0;
  const firstPrice = history[0] || 0;

  const priceChange = lastPrice - firstPrice;
  const pctChange = firstPrice ? (priceChange / firstPrice) * 100 : 0;
  const isUp = pctChange >= 0;

  if (loading) {
    return (
      <div className="glass-card p-10 text-white">
        Loading chart...
      </div>
    );
  }

  if (!stock || !marketData[stock]) {
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

      {/* Chart */}
      <div className="w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.15)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22d3ee"
              fillOpacity={0.2}
              fill="#22d3ee"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 text-[10px] text-slate-600 text-right">
        Data points: {chartData.length}
      </div>
    </div>
  );
}