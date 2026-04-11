import { AlertTriangle, Loader2 } from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";

export function MaLoading() {
  const { loading } = useMultiAI();
  if (!loading) return null;
  return (
    <div className="glass-card p-10 flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="animate-spin text-violet-400" size={36} />
      <p className="text-sm text-center max-w-md">
        Training models and fetching live news… This often takes 30–120s on first run.
      </p>
    </div>
  );
}

export function MaError() {
  const { error, loading } = useMultiAI();
  if (loading || !error) return null;
  return (
    <div className="glass-card p-5 border border-red-500/30 flex gap-3 text-sm">
      <AlertTriangle className="text-red-400 shrink-0" size={20} />
      <div>
        <p className="text-red-300 font-semibold">Request failed</p>
        <p className="text-slate-400 mt-1">{error}</p>
      </div>
    </div>
  );
}
