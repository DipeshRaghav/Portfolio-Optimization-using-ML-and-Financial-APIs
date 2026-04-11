import { Sparkles } from "lucide-react";

export default function MaEmptyState({ message = "Run analysis from the control bar to load data." }) {
  return (
    <div className="glass-card py-16 px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
        <Sparkles className="h-7 w-7 text-violet-400/80" aria-hidden />
      </div>
      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">{message}</p>
    </div>
  );
}
