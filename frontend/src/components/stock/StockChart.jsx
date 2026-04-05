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
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

export default function StockChart({ selectedStocks, activeStock }) {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStocks || selectedStocks.length === 0) return;

      setLoading(true);
      const result = await getMarketData(selectedStocks);

      console.log("RAW API RESPONSE:", result);

      setMarketData(result || {});
      setLoading(false);
    };

    fetchData();
  }, [selectedStocks]);

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
    <div className="glass-card p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">{stock}</h2>
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

      {/* CHART */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
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