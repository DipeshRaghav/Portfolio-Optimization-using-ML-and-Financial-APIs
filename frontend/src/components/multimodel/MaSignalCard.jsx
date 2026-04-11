/**
 * Probability + sentiment bar (matches Chart page visual language).
 */
const TINT = {
  cyan: { text: "text-cyan-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
  emerald: { text: "text-emerald-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
  amber: { text: "text-amber-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
  sky: { text: "text-sky-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
  fuchsia: { text: "text-fuchsia-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
  violet: { text: "text-violet-300", bar: "from-rose-500/80 via-amber-400/90 to-emerald-400/90" },
};

export default function MaSignalCard({
  label,
  prob,
  tint = "violet",
  footnote,
}) {
  const p = prob ?? 0;
  const t = TINT[tint] || TINT.violet;
  return (
    <div className="glass-card relative overflow-hidden p-6">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-white/[0.03]" />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-4xl font-bold tabular-nums ${t.text}`}>
        {(p * 100).toFixed(1)}
        <span className="text-2xl font-light opacity-80">%</span>
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${t.bar} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, p * 100))}%` }}
        />
      </div>
      {footnote && <p className="mt-3 text-xs text-slate-500">{footnote}</p>}
    </div>
  );
}
