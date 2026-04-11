export default function MaReasonsPanel({ title = "Why this read", subtitle, reasons = [] }) {
  if (!reasons.length) return null;
  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="border-b border-white/5 bg-slate-950/40 px-6 py-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <ul className="divide-y divide-white/[0.04]">
        {reasons.map((r, i) => (
          <li
            key={i}
            className="flex gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-300">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-300">{r}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
