import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getMarketData } from "../../services/api";
import { Activity, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1527] border border-slate-800/60 rounded-xl p-3 shadow-2xl">
        <p className="text-slate-400 text-[10px] mb-1 font-mono uppercase tracking-wider">Price</p>
        <p className="font-mono font-bold text-white text-lg">${Number(payload[0].value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const PERIODS = [
  { label: "1W", value: "1wk" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

export default function StockChart({ selectedStocks, activeStock }) {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1mo");

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStocks || selectedStocks.length === 0) return;

      setLoading(true);
      const result = await getMarketData(selectedStocks, period);

      console.log("RAW API RESPONSE:", result);

      setMarketData(result || {});
      setLoading(false);
    };

    fetchData();
  }, [selectedStocks, period]);

  // 🔥 SAFE STOCK SELECTION
  const stock =
    activeStock && marketData[activeStock]
      ? activeStock
      : Object.keys(marketData)[0];

  // 🔥 SAFE CHART DATA
  const chartData = useMemo(() => {
    if (!marketData || !stock || !marketData[stock]) return [];

    const history = marketData[stock]?.history;

    if (!history || history.length === 0) return [];

    return history.map((price, index) => ({
      date: index,
      price: Number(price),
    }));
  }, [stock, marketData]);

  const history = marketData[stock]?.history || [];

  const lastPrice = history[history.length - 1] || 0;
  const firstPrice = history[0] || 0;

  const priceChange = lastPrice - firstPrice;
  const pctChange = firstPrice ? (priceChange / firstPrice) * 100 : 0;

  const isUp = pctChange >= 0;

  // 🔥 LOADING
  if (loading) {
    return (
      <div className="glass-card p-10 text-white">
        Loading chart...
      </div>
    );
  }

  // 🔥 EMPTY STATE
  if (!stock || chartData.length === 0) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <Activity size={40} className="text-slate-700" />
        <p className="text-slate-500 text-sm">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            {stock}
            {loading && <Loader2 size={14} className="animate-spin text-slate-500" />}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-white text-2xl font-bold">
              ${lastPrice.toFixed(2)}
            </span>
            <span
              className={`flex items-center gap-1 ${
                isUp ? "text-green-400" : "text-red-400"
              }`}
            >
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {pctChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* PERIOD SELECTOR */}
        <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-lg border border-slate-700/50">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                period === p.value
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" hide />
            <YAxis domain={['auto', 'auto']} tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: "#334155", strokeWidth: 1, strokeDasharray: "3 3"}} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              fill="#22c55e33"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}