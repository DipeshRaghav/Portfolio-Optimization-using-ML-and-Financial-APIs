import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
} from "recharts";
import { sectorPerformance, tickerData, stockHistories } from "../data/mockData";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-[#0d1b2e] border border-slate-700/80 rounded-xl p-3 text-xs shadow-2xl">
      <p className="text-white font-semibold">{label}</p>
      <p className={val >= 0 ? "text-emerald-400" : "text-red-400"}>Today: {val >= 0 ? "+" : ""}{val}%</p>
    </div>
  );
};

const marketIndices = [
  { name: "S&P 500", value: "5,217.49", change: 0.74 },
  { name: "NASDAQ", value: "16,380.28", change: 1.12 },
  { name: "DOW JONES", value: "38,904.04", change: 0.21 },
  { name: "Russell 2000", value: "2,074.88", change: -0.38 },
  { name: "VIX", value: "14.92", change: -3.42 },
];

export default function MarketAnalysisPage() {
  const multiStockData = ["AAPL", "MSFT", "TSLA"].map((s) => ({
    stock: s,
    data: stockHistories[s]?.slice(-30) ?? [],
  }));

  return (
    <div className="p-5 space-y-5 page-fade">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={20} className="text-blue-400" />
        <h1 className="text-white font-bold text-xl">Market Analysis</h1>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {marketIndices.map((idx) => (
          <div key={idx.name} className="glass-card p-4">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">{idx.name}</p>
            <p className="text-white font-mono font-bold text-lg mt-1">{idx.value}</p>
            <p className={`text-xs font-semibold flex items-center gap-1 mt-1 ${idx.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {idx.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {idx.change >= 0 ? "+" : ""}{idx.change}%
            </p>
          </div>
        ))}
      </div>

      {/* Sector Performance */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4">Sector Performance (Today)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sectorPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.35)" vertical={false} />
            <XAxis dataKey="sector" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="change" radius={[4, 4, 0, 0]}>
              {sectorPerformance.map((entry, i) => (
                <Cell key={i} fill={entry.change >= 0 ? "#22c55e" : "#ef4444"} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movers */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4">Top Movers</h2>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Symbol</th>
                <th className="text-right">Price</th>
                <th className="text-right">Change</th>
                <th className="text-right">% Change</th>
                <th className="text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {tickerData.map((t) => (
                <tr key={t.symbol}>
                  <td className="font-bold text-white">{t.symbol}</td>
                  <td className="text-right font-mono text-slate-300">${t.price.toLocaleString()}</td>
                  <td className={`text-right font-mono font-semibold ${t.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {t.change >= 0 ? "+" : ""}{t.change}
                  </td>
                  <td className={`text-right font-mono font-semibold ${t.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {t.pct >= 0 ? "+" : ""}{t.pct}%
                  </td>
                  <td className="text-right text-slate-500 text-xs">
                    {(Math.random() * 80 + 10).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 30-day comparison */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4">30-Day Price Comparison</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.35)" />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} allowDuplicatedCategory={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} width={60} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {multiStockData.map((s, i) => (
              <Line
                key={s.stock}
                data={s.data}
                type="monotone"
                dataKey="price"
                name={s.stock}
                stroke={["#3b82f6", "#22c55e", "#f59e0b"][i]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
