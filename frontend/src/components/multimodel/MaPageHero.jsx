/**
 * Consistent page header for Multi-AI routes (accent + gradient title).
 */
const ACCENTS = {
  violet: {
    iconWrap: "from-violet-600/35 to-indigo-600/25 ring-violet-500/20",
    icon: "text-violet-200",
    glow: "bg-violet-600/15",
    chip: "border-violet-500/25 bg-violet-500/10 text-violet-200/90",
  },
  cyan: {
    iconWrap: "from-cyan-600/35 to-sky-600/25 ring-cyan-500/20",
    icon: "text-cyan-100",
    glow: "bg-cyan-600/15",
    chip: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200/90",
  },
  emerald: {
    iconWrap: "from-emerald-600/35 to-teal-600/25 ring-emerald-500/20",
    icon: "text-emerald-100",
    glow: "bg-emerald-600/15",
    chip: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200/90",
  },
  amber: {
    iconWrap: "from-amber-600/35 to-orange-600/25 ring-amber-500/20",
    icon: "text-amber-100",
    glow: "bg-amber-600/15",
    chip: "border-amber-500/25 bg-amber-500/10 text-amber-200/90",
  },
  sky: {
    iconWrap: "from-sky-600/35 to-blue-600/25 ring-sky-500/20",
    icon: "text-sky-100",
    glow: "bg-sky-600/15",
    chip: "border-sky-500/25 bg-sky-500/10 text-sky-200/90",
  },
  fuchsia: {
    iconWrap: "from-fuchsia-600/35 to-pink-600/25 ring-fuchsia-500/20",
    icon: "text-fuchsia-100",
    glow: "bg-fuchsia-600/15",
    chip: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200/90",
  },
};

export default function MaPageHero({
  icon: Icon,
  accent = "violet",
  badge,
  title,
  highlight,
  subtitle,
}) {
  const a = ACCENTS[accent] || ACCENTS.violet;
  const hasHighlight = Boolean(highlight && title.includes(highlight));
  const i = hasHighlight ? title.indexOf(highlight) : -1;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950/80 px-6 py-7 md:px-9 md:py-8">
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${a.glow} blur-3xl`}
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          {badge && (
            <div
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${a.chip}`}
            >
              {badge}
            </div>
          )}
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ${a.iconWrap}`}
            >
              {Icon && <Icon className={a.icon} size={22} aria-hidden />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                {hasHighlight ? (
                  <>
                    {title.slice(0, i)}
                    <span className="gradient-text">{highlight}</span>
                    {title.slice(i + highlight.length)}
                  </>
                ) : (
                  title
                )}
              </h1>
              {subtitle && (
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
