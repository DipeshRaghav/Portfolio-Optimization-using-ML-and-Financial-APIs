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
      {/* Header - Centered */}
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
          <span>⚡ Risk Analysis</span>
          {!data && <Loader2 size={12} className="animate-spin text-slate-500" />}
        </h2>
      </div>

      {/* Metrics Grid - Perfectly Centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {cards.map((c, index) => {
            const cm = colorMap[c.color];
            return (
              <div
                key={c.key}
                className={`
                  ${cm.bg} ${cm.border} rounded-2xl p-6 flex flex-col items-center justify-center 
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                  min-h-[120px]
                `}
              >
                {/* Icon */}
                <c.icon size={20} className={`${cm.text} mb-3 opacity-80`} />
                
                {/* Value - Perfectly Centered */}
                <div className="flex flex-col items-center text-center">
                  <p className={`font-mono text-2xl lg:text-3xl font-black ${cm.text} leading-tight mb-1.5`}>
                    {c.value}
                  </p>
                  <p className="text-slate-300 text-sm font-semibold leading-tight px-2">
                    {c.label}
                  </p>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mt-0.5">
                    {c.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Score - Full Width Centered */}
      <div className="mt-8 pt-6 border-t border-slate-800/30">
        <div className="flex flex-col items-center gap-3">
          {/* Title */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-semibold">Overall Risk Score</span>
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Moderate (5.8/10)
            </span>
          </div>
          
          {/* Progress Bar - Perfectly Centered */}
          <div className="w-full max-w-md bg-slate-800/50 rounded-full overflow-hidden h-2.5 shadow-inner">
            <div className="h-full flex bg-gradient-to-r from-emerald-500/90 via-amber-500/80 to-red-500/70 rounded-full shadow-lg">
              <div className="w-[20%] bg-emerald-500/100" />
              <div className="w-[38%] bg-amber-500/100 relative">
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-amber-500/50 border-2 border-amber-400" />
              </div>
              <div className="flex-1 bg-red-500/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
