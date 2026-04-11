import { AlertTriangle, Loader2 } from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";

export function MaLoading() {
  const { loading } = useMultiAI();
  if (!loading) return null;
  return (
    <div className="glass-card relative overflow-hidden p-10 flex flex-col items-center justify-center gap-4 text-slate-400 ring-1 ring-violet-500/10">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.06] to-transparent pointer-events-none" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
        <Loader2 className="animate-spin text-violet-400" size={32} />
      </div>
      <div className="relative text-center">
        <p className="text-sm font-medium text-slate-300">Running multi-model pipeline</p>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Training sequence models and fetching headlines — often 30–120s on first run.
        </p>
      </div>
    </div>
  );
}

export function MaError() {
  const { error, loading } = useMultiAI();
  if (loading || !error) return null;
  return (
    <div className="glass-card flex gap-4 p-5 text-sm ring-1 ring-red-500/25 bg-red-950/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
        <AlertTriangle className="text-red-400" size={20} />
      </div>
      <div>
        <p className="font-semibold text-red-200">Something went wrong</p>
        <p className="mt-1 text-slate-400 text-sm leading-relaxed">{error}</p>
      </div>
    </div>
  );
}
