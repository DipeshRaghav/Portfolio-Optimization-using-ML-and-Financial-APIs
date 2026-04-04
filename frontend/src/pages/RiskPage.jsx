import RiskMetrics from "../components/risk/RiskMetrics";
import EfficientFrontier from "../components/frontier/EfficientFrontier";
import InvestmentSimulation from "../components/simulation/InvestmentSimulation";
import { ShieldAlert, AlertTriangle } from "lucide-react";

const riskAlerts = [
  { level: "warning", msg: "TSLA RSI at 38 — approaching oversold territory", time: "2 min ago" },
  { level: "critical", msg: "Portfolio beta 1.12 — above market neutral threshold", time: "15 min ago" },
  { level: "info", msg: "AAPL MA20 crossover detected — bullish signal", time: "1 hr ago" },
  { level: "info", msg: "Volatility decreased 0.8% since last rebalance", time: "3 hr ago" },
];

export default function RiskPage() {
  return (
    <div className="p-5 space-y-5 page-fade">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert size={20} className="text-red-400" />
        <h1 className="text-white font-bold text-xl">Risk Analysis</h1>
      </div>

      {/* Alerts */}
      <div className="glass-card p-5">
        <h2 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-400" /> Risk Alerts
        </h2>
        <div className="space-y-2">
          {riskAlerts.map((a, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                a.level === "critical"
                  ? "bg-red-500/10 border-red-500/25 text-red-300"
                  : a.level === "warning"
                  ? "bg-yellow-500/10 border-yellow-500/25 text-yellow-300"
                  : "bg-blue-500/10 border-blue-500/25 text-blue-300"
              }`}
            >
              <span className="mt-0.5 flex-shrink-0">
                {a.level === "critical" ? "🔴" : a.level === "warning" ? "🟡" : "🔵"}
              </span>
              <div className="flex-1">
                <p>{a.msg}</p>
                <p className="text-[11px] opacity-60 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RiskMetrics />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <EfficientFrontier />
        <InvestmentSimulation />
      </div>
    </div>
  );
}
