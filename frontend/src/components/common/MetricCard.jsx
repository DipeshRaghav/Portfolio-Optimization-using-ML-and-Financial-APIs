import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({
  label,
  value,
  unit = "",
  change,
  changeLabel,
  color = "blue",
  icon: Icon,
  subtitle,
}) {
  const colorMap = {
    green: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  };

  const c = colorMap[color] || colorMap.blue;

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={15} className={c.text} />
          </div>
        )}
      </div>

      <div>
        <p className={`metric-value ${c.text}`}>
          {value}
          <span className="text-lg ml-1 font-mono text-slate-400">{unit}</span>
        </p>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>

      {change !== undefined && (
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-slate-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={13} />
          ) : isNegative ? (
            <TrendingDown size={13} />
          ) : (
            <Minus size={13} />
          )}
          <span>
            {isPositive ? "+" : ""}
            {change}%
          </span>
          {changeLabel && <span className="text-slate-500 font-normal">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
