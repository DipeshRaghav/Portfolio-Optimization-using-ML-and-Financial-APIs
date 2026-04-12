import { ArrowUp, ArrowDown, Minus } from "lucide-react";

/**
 * Premium probability highlight card — spacious layout with color-coded bar,
 * confidence tag, and trend arrow.
 */
function getConfidence(p) {
  if (p >= 0.7)
    return {
      label: "High Confidence",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      arrow: ArrowUp,
    };
  if (p >= 0.45)
    return {
      label: "Moderate Confidence",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      arrow: Minus,
    };
  return {
    label: "Low Confidence",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    arrow: ArrowDown,
  };
}

function getBarGradient(p) {
  if (p >= 0.7) return "from-emerald-500 via-emerald-400 to-teal-400";
  if (p >= 0.45) return "from-amber-500 via-amber-400 to-yellow-400";
  return "from-rose-500 via-rose-400 to-red-400";
}

function getScoreColor(p) {
  if (p >= 0.7) return "text-emerald-300";
  if (p >= 0.45) return "text-amber-300";
  return "text-rose-300";
}

export default function MaSignalCard({ label, prob, tint = "violet", footnote }) {
  const p = prob ?? 0;
  const pct = (p * 100).toFixed(1);
  const conf = getConfidence(p);
  const TrendIcon = conf.arrow;

  return (
    <div className="glass-card group relative w-full overflow-hidden p-0 transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl">
      {/* Top accent stripe */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getBarGradient(p)}`} />

      <div className="relative px-10 py-10 md:px-12 md:py-10">
        {/* Decorative corner */}
        <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-[100px] bg-white/[0.015]" />

        {/* Header: label + confidence tag */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {label || "Bullish Probability"}
          </p>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider ${conf.bg} ${conf.color}`}
          >
            <TrendIcon size={14} />
            {conf.label}
          </span>
        </div>

        {/* Big score */}
        <div className="mt-6 flex items-baseline gap-4">
          <p
            className={`font-mono text-6xl font-extrabold tabular-nums tracking-tight ${getScoreColor(p)} md:text-7xl`}
          >
            {pct}
            <span className="text-4xl font-light opacity-70 md:text-5xl">%</span>
          </p>
          <TrendIcon size={24} className={conf.color} />
        </div>

        {/* Gradient progress bar */}
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(p)} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, p * 100))}%` }}
          />
        </div>

        {/* Scale labels */}
        <div className="mt-3 flex justify-between text-xs text-slate-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {footnote && (
          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
