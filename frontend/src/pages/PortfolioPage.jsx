import PortfolioAllocation from "../components/portfolio/PortfolioAllocation";
import MLPredictions from "../components/predictions/MLPredictions";
import StockChart from "../components/stock/StockChart";
import { PieChart, BarChart2 } from "lucide-react";
import { formatPriceBySymbol } from "../utils/currency";

const holdings = [
  { stock: "AAPL", shares: 50, avgCost: 155.2, current: 178.42, value: 8921, weight: 30 },
  { stock: "MSFT", shares: 18, avgCost: 340.1, current: 382.15, value: 6879, weight: 25 },
  { stock: "GOOGL", shares: 42, avgCost: 140.8, current: 155.72, value: 6540, weight: 20 },
  { stock: "TSLA", shares: 30, avgCost: 210.5, current: 241.88, value: 7256, weight: 25 },
];

export default function PortfolioPage() {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  return (
    <div className="p-5 space-y-5 page-fade">
      <div className="flex items-center gap-2 mb-2">
        <PieChart size={20} className="text-blue-400" />
        <h1 className="text-white font-bold text-xl">Portfolio</h1>
      </div>

      {/* Portfolio Value */}
      <div className="glass-card p-8">
        <p className="text-slate-400 text-sm">Total Portfolio Value</p>
        <p className="text-white font-mono font-bold text-4xl mt-1">{formatPriceBySymbol("AAPL", totalValue)}</p>
        <p className="text-emerald-400 text-sm font-semibold mt-2">+$2,840 (+18.4%) All Time</p>
      </div>

      {/* Holdings Table */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-blue-400" /> Holdings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Stock</th>
                <th className="text-right">Shares</th>
                <th className="text-right">Avg Cost</th>
                <th className="text-right">Current</th>
                <th className="text-right">P&L</th>
                <th className="text-right">Value</th>
                <th className="text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const pnl = (h.current - h.avgCost) * h.shares;
                const pnlPct = ((h.current - h.avgCost) / h.avgCost) * 100;
                return (
                  <tr key={h.stock}>
                    <td className="font-bold text-white">{h.stock}</td>
                    <td className="text-right font-mono text-slate-300">{h.shares}</td>
                    <td className="text-right font-mono text-slate-400">{formatPriceBySymbol(h.stock, h.avgCost)}</td>
                    <td className="text-right font-mono text-slate-300">{formatPriceBySymbol(h.stock, h.current)}</td>
                    <td className={`text-right font-mono font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {pnl >= 0 ? "+" : ""}
                      {formatPriceBySymbol(h.stock, Math.abs(pnl), { maximumFractionDigits: 0 })}
                      <span className="text-xs ml-1 opacity-75">({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)</span>
                    </td>
                    <td className="text-right font-mono text-white font-semibold">{formatPriceBySymbol(h.stock, h.value)}</td>
                    <td className="text-right">
                      <span className="text-blue-400 font-semibold text-xs">{h.weight}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <PortfolioAllocation selectedStocks={holdings.map((h) => h.stock)} />
        <StockChart selectedStocks={["AAPL", "MSFT"]} />
      </div>

      <MLPredictions selectedStocks={holdings.map((h) => h.stock)} />
    </div>
  );
}
