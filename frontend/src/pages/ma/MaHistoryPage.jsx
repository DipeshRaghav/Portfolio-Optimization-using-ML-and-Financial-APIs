import { History } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaHistoryPage() {
  const { data, loading } = useMultiAI();
  const triggers = data?.history_triggers || [];
  const reasons = data?.reasons?.historical || [];
  const prob = data?.models?.historical?.prob_up;

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <History className="text-amber-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">History & triggers</h1>
          <p className="text-slate-500 text-sm">Volatility events, headline timeline, rolling-stat rationale</p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <>
          <div className="glass-card p-6">
            <p className="text-slate-500 text-xs uppercase font-semibold">Historical model P(up)</p>
            <p className="text-3xl font-mono text-amber-300">{((prob ?? 0) * 100).toFixed(1)}%</p>
            <h2 className="text-white font-semibold text-sm mt-6 mb-2">Why (features)</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Trigger timeline (recent)</h2>
            <div className="space-y-3 max-h-[520px] overflow-y-auto">
              {triggers.map((t, i) => (
                <div key={i} className="flex gap-3 text-sm border-b border-slate-800/60 pb-3">
                  <span className="text-slate-500 font-mono text-[10px] shrink-0 w-36">{t.date?.slice(0, 16)}</span>
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        t.type === "news" ? "text-emerald-400" : "text-orange-400"
                      }`}
                    >
                      {t.type}
                    </span>
                    <p className="text-slate-200">{t.title}</p>
                    <p className="text-slate-500 text-xs">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar.</p>
      )}
    </div>
  );
}
