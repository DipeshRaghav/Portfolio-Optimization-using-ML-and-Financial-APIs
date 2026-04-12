import {
  TrendingUp,
  BarChart3,
  Activity,
  Gauge,
  Zap,
  Brain,
} from "lucide-react";

/**
 * Feature narrative as styled bullet cards with icons — spacious 2-column grid.
 */
const FEATURE_ICONS = [TrendingUp, BarChart3, Activity, Gauge, Zap, Brain];
const ICON_COLORS = [
  "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  "text-sky-400 bg-sky-500/10 ring-sky-500/20",
  "text-violet-400 bg-violet-500/10 ring-violet-500/20",
  "text-orange-400 bg-orange-500/10 ring-orange-500/20",
  "text-fuchsia-400 bg-fuchsia-500/10 ring-fuchsia-500/20",
];

export default function MaReasonsPanel({
  title = "Why this read",
  subtitle,
  reasons = [],
}) {
  if (!reasons.length) return null;

  return (
    <div className="glass-card w-full overflow-hidden p-0">
      {/* Section header */}
      <div className="border-b border-white/5 bg-slate-950/40 px-10 py-6">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-violet-400/80" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      {/* Bullet cards grid */}
      <div className="grid gap-4 p-8 sm:grid-cols-2 md:p-10">
        {reasons.map((r, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          const colorClass = ICON_COLORS[i % ICON_COLORS.length];
          return (
            <div
              key={i}
              className="group flex gap-5 rounded-2xl border border-white/[0.04] bg-slate-950/30 p-6 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.02] hover:scale-[1.02]"
            >
              {/* Icon badge */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${colorClass}`}
              >
                <Icon size={18} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500/80">
                  Signal {i + 1}
                </span>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors">
                  {r}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
