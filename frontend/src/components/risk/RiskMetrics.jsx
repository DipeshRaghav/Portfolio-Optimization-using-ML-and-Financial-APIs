import { riskMetrics as fallbackMetrics } from "../../data/mockData";
import { TrendingUp, Activity, Award, ShieldCheck, ArrowDownLeft, BarChart2, Loader2 } from "lucide-react";

const colorMap = {
  emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/15", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/8", border: "border-amber-500/15", text: "text-amber-400" },
  blue: { bg: "bg-blue-500/8", border: "border-blue-500/15", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/8", border: "border-purple-500/15", text: "text-purple-400" },
  red: { bg: "bg-red-500/8", border: "border-red-500/15", text: "text-red-400" },
  cyan: { bg: "bg-cyan-500/8", border: "border-cyan-500/15", text: "text-cyan-400" },
};

export default function RiskMetrics({ data }) {
  const metrics = data || fallbackMetrics;

  const cards = [
    { key: "expectedReturn", label: "Expected Return", value: `+${metrics.expectedReturn}%`, icon: TrendingUp, color: "emerald", subtitle: "Annualized" },
    { key: "volatility", label: "Volatility (σ)", value: `${metrics.volatility}%`, icon: Activity, color: "amber", subtitle: "Annualized" },
    { key: "sharpeRatio", label: "Sharpe Ratio", value: `${metrics.sharpeRatio}`, icon: Award, color: "blue", subtitle: "Risk-adjusted" },
    { key: "sortinoRatio", label: "Sortino Ratio", value: `${metrics.sortinoRatio}`, icon: ShieldCheck, color: "purple", subtitle: "Downside-adj" },
    { key: "maxDrawdown", label: "Max Drawdown", value: `${metrics.maxDrawdown}%`, icon: ArrowDownLeft, color: "red", subtitle: "Peak-to-trough" },
    { key: "beta", label: "Portfolio Beta", value: `${metrics.beta}`, icon: BarChart2, color: "cyan", subtitle: "Market corr." },
  ];

  return (
    <div className="glass-card p-8 h-full flex flex-col">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
          <span>⚡ Risk Analysis</span>
          {!data && <Loader2 size={12} className="animate-spin text-slate-500" />}
        </h2>
      </div>

      {/* Added inner padding wrapper so cards don't touch parent */}
      <div className="flex-1 px-3 py-2">
        <div className="grid grid-cols-2 gap-4 h-full">
          {cards.map((c) => {
            const cm = colorMap[c.color];
            return (
              <div
                key={c.key}
                className={`${cm.bg} border ${cm.border} rounded-2xl px-4 py-5 flex flex-col items-center justify-center text-center min-h-[140px]`}
              >
                <c.icon size={16} className={`${cm.text} mb-2 opacity-80`} />

                <p className={`font-mono text-xl lg:text-2xl font-extrabold ${cm.text} leading-none mb-2`}>
                  {c.value}
                </p>

                <p className="text-slate-200 text-[12px] font-semibold leading-tight">
                  {c.label}
                </p>

                <p className="text-slate-500 text-[10px] uppercase tracking-wide mt-1">
                  {c.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/30 px-3">
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
