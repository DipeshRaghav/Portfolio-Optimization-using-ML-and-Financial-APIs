import { MessageCircle, Newspaper } from "lucide-react";
import MaControlBar from "../../components/multimodel/MaControlBar";
import MaEmptyState from "../../components/multimodel/MaEmptyState";
import MaPageHero from "../../components/multimodel/MaPageHero";
import { MaError, MaLoading } from "../../components/multimodel/MaStatus";
import { useMultiAI } from "../../context/MultiAIContext";

export default function MaSentimentPage() {
  const { data, loading } = useMultiAI();
  const m = data?.models?.sentiment || {};
  const items = m.headlines_scored || [];
  const articles = data?.news_articles || [];

  return (
    <div className="space-y-6 py-5 pb-16 md:py-8">
      <MaPageHero
        icon={MessageCircle}
        accent="emerald"
        badge="Live headlines"
        title="Sentiment intelligence"
        highlight="Sentiment"
        subtitle="Yahoo Finance plus optional Finnhub / NewsAPI. Transformer scores per headline; FinBERT is an optional upgrade for production finance NLP."
      />
      <MaControlBar />
      <MaLoading />
      <MaError />
      {!loading && data && (
        <div className="space-y-6">
          <div className="glass-card relative overflow-hidden p-6 ring-1 ring-emerald-500/10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Aggregate sentiment
            </p>
            <p className="mt-1 font-mono text-4xl font-bold text-emerald-300 tabular-nums">
              {((m.prob_up ?? 0) * 100).toFixed(1)}
              <span className="text-xl font-normal text-emerald-400/80">% bullish</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Score (−1…+1): <span className="font-mono text-slate-200">{m.sentiment_score?.toFixed(3)}</span>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{m.training_note}</p>
            <p className="mt-2 font-mono text-[10px] text-slate-600">
              {m.model_mode} · {m.model_name}
            </p>
          </div>

          <div className="glass-card overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-white/5 bg-slate-950/40 px-6 py-4">
              <Newspaper className="h-4 w-4 text-emerald-400/90" />
              <div>
                <h2 className="text-sm font-semibold text-white">Per-headline scores</h2>
                <p className="text-xs text-slate-500">Polarity and label per story</p>
              </div>
            </div>
            <div className="max-h-[min(520px,55vh)] space-y-2 overflow-y-auto p-4">
              {items.map((row, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-4 transition-colors hover:border-emerald-500/15 hover:bg-slate-900/50"
                >
                  <p className="text-sm leading-snug text-slate-200">{row.headline}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium text-emerald-400/90">{row.label}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    polarity{" "}
                    <span className="font-mono text-slate-400">
                      {row.polarity?.toFixed?.(3) ?? row.polarity}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="mb-3 text-sm font-semibold text-white">Source metadata</h2>
            <ul className="space-y-2 font-mono text-[11px] leading-relaxed text-slate-500">
              {articles.slice(0, 12).map((a, i) => (
                <li key={i} className="border-b border-white/[0.04] pb-2 last:border-0">
                  <span className="text-slate-600">{a.published}</span> — {a.publisher} —{" "}
                  {a.title?.slice(0, 90)}
                  {a.title?.length > 90 ? "…" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!loading && !data && <MaEmptyState />}
    </div>
  );
}
