import { riskMetrics } from "../../data/mockData";
import { TrendingUp, Activity, Award, ShieldCheck, ArrowDownLeft, BarChart2 } from "lucide-react";

const cards = [
  { key: "expectedReturn", label: "Expected Return", value: `+${riskMetrics.expectedReturn}%`, icon: TrendingUp, color: "emerald", subtitle: "Annualized" },
  { key: "volatility", label: "Volatility (σ)", value: `+${riskMetrics.volatility}%`, icon: Activity, color: "amber", subtitle: "Annualized" },
  { key: "sharpeRatio", label: "Sharpe Ratio", value: `${riskMetrics.sharpeRatio}`, icon: Award, color: "blue", subtitle: "Risk-adjusted" },
  { key: "sortinoRatio", label: "Sortino Ratio", value: `${riskMetrics.sortinoRatio}`, icon: ShieldCheck, color: "purple", subtitle: "Downside-adj" },
  { key: "maxDrawdown", label: "Max Drawdown", value: `${riskMetrics.maxDrawdown}%`, icon: ArrowDownLeft, color: "red", subtitle: "Peak-to-trough" },
  { key: "beta", label: "Portfolio Beta", value: `${riskMetrics.beta}`, icon: BarChart2, color: "cyan", subtitle: "Market corr." },
];

const colorMap = {
  emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/15", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/8", border: "border-amber-500/15", text: "text-amber-400" },
  blue: { bg: "bg-blue-500/8", border: "border-blue-500/15", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/8", border: "border-purple-500/15", text: "text-purple-400" },
  red: { bg: "bg-red-500/8", border: "border-red-500/15", text: "text-red-400" },
  cyan: { bg: "bg-cyan-500/8", border: "border-cyan-500/15", text: "text-cyan-400" },
};

export default function RiskMetrics() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h2 className="text-white font-semibold text-sm tracking-wide mb-5">⚡ Risk Analysis</h2>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {cards.map((c) => {
          const cm = colorMap[c.color];
          return (
            <div
              key={c.key}
              className={`${cm.bg} border ${cm.border} rounded-2xl p-4 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02]`}
            >
              <p className={`font-mono text-xl font-extrabold ${cm.text} leading-none mb-1`}>
                {c.value}
              </p>
              <p className="text-slate-300 text-[11px] font-semibold">{c.label}</p>
              <p className="text-slate-600 text-[9px] mt-0.5">{c.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Risk Score */}
      <div className="mt-5 pt-4 border-t border-slate-800/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-[11px] font-semibold">Overall Risk Score</span>
          <span className="text-amber-400 font-mono text-xs font-bold">Moderate (5.8/10)</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500/80 w-[20%]" />
          <div className="h-full bg-amber-500/80 w-[38%] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-amber-500/50 border border-amber-400" />
          </div>
          <div className="h-full bg-red-500/60 flex-1" />
        </div>
      </div>
    </div>
  );
}
