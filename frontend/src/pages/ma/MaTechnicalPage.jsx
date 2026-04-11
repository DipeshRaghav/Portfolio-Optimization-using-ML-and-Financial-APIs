import { Wrench } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaTechnicalPage() {
  const { data, loading } = useMultiAI();
  const reasons = data?.reasons?.technical || [];
  const prob = data?.models?.indicator?.prob_up;

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="text-cyan-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">Technical analysis</h1>
          <p className="text-slate-500 text-sm">RSI, MACD, Bollinger, moving averages — drivers of the signal</p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <div className="glass-card p-6 space-y-6">
          <div>
            <p className="text-slate-500 text-xs uppercase font-semibold">Model P(up)</p>
            <p className="text-3xl font-mono text-cyan-300">{((prob ?? 0) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm mb-3">Reasons for this prediction</h2>
            <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar.</p>
      )}
    </div>
  );
}
