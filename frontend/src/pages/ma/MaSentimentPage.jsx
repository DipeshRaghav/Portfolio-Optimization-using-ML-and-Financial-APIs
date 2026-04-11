import { MessageCircle } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaSentimentPage() {
  const { data, loading } = useMultiAI();
  const m = data?.models?.sentiment || {};
  const items = m.headlines_scored || [];
  const articles = data?.news_articles || [];

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="text-emerald-400" size={22} />
        <div>
          <h1 className="text-white font-bold text-xl">Sentiment (real headlines)</h1>
          <p className="text-slate-500 text-sm">
            Yahoo Finance + optional Finnhub / NewsAPI. DistilBERT scores each line; FinBERT fine-tune is optional for
            production.
          </p>
        </div>
      </div>
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <>
          <div className="glass-card p-6 space-y-2">
            <p className="text-slate-500 text-xs uppercase font-semibold">Aggregate sentiment</p>
            <p className="text-3xl font-mono text-emerald-300">{((m.prob_up ?? 0) * 100).toFixed(1)}% bullish</p>
            <p className="text-slate-400 text-sm">Score (−1…+1): {m.sentiment_score?.toFixed(3)}</p>
            <p className="text-slate-600 text-xs mt-3">{m.training_note}</p>
            <p className="text-slate-600 text-[10px] font-mono">Mode: {m.model_mode} · {m.model_name}</p>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-4">Per-headline scores</h2>
            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {items.map((row, i) => (
                <div key={i} className="border border-slate-800/80 rounded-xl p-3 text-sm">
                  <p className="text-slate-200">{row.headline}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {row.label} · polarity {row.polarity?.toFixed?.(3) ?? row.polarity}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold text-sm mb-3">Sources (metadata)</h2>
            <ul className="text-xs text-slate-500 space-y-2 font-mono">
              {articles.slice(0, 12).map((a, i) => (
                <li key={i}>
                  {a.published} — {a.publisher} — {a.title?.slice(0, 80)}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!loading && !data && (
        <p className="text-slate-500 text-sm text-center py-16">Run analysis from the control bar.</p>
      )}
    </div>
  );
}
