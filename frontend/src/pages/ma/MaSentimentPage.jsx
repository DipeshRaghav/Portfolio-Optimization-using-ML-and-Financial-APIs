import { Loader2, MessageCircle, Newspaper, Play } from "lucide-react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";

export default function MaSentimentPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const { data, loading, refresh } = useMultiAI();
  const m = data?.models?.sentiment || {};
  const items = m.headlines_scored || [];
  const articles = data?.news_articles || [];
  const p = m.prob_up ?? 0;

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.cardShadow };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: t.textPrimary, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* HEADER */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>Sentiment Intelligence</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>Transformer scores per headline; FinBERT is an optional upgrade for production finance NLP.</p>
          </div>
          <button type="button" onClick={refresh} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 28px", borderRadius: 10, border: "none", background: t.primary, color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "background 0.2s", boxShadow: `0 2px 8px ${isDark ? "rgba(129,140,248,0.25)" : "rgba(99,102,241,0.2)"}` }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={16} />}
            Run Analysis
          </button>
        </section>

        {/* CONTROLS */}
        <ThemeControlBar t={t} cardStyle={card} />

        {/* LOADING */}
        {loading && (
          <section style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 24px" }}>
            <Loader2 size={28} style={{ color: t.primary, animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary }}>Running NLP pipeline…</p>
            <p style={{ fontSize: 12, color: t.textSecondary }}>Fetching headlines and scoring via transformers.</p>
          </section>
        )}

        {/* MAIN CONTENT */}
        {!loading && data && (
          <div style={{ display: "grid", gap: 24 }}>
            <section style={{ ...card, borderLeft: `4px solid ${t.success}` }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Aggregate Sentiment</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>{((p) * 100).toFixed(1)}</span>
                <span style={{ fontSize: 24, fontWeight: 300, color: t.success }}>%</span>
              </div>
              <p style={{ margin: 0, marginTop: 8, fontSize: 12, color: t.textSecondary }}>
                Score (−1…+1): <span style={{ fontFamily: "monospace", color: t.textPrimary, fontWeight: 600 }}>{m.sentiment_score?.toFixed(3)}</span>
              </p>
              {m.training_note && <p style={{ fontSize: 12, color: t.textMuted, marginTop: 8 }}>{m.training_note}</p>}
              <p style={{ fontSize: 10, color: t.textMuted, marginTop: 4, fontFamily: "monospace" }}>{m.model_mode} · {m.model_name}</p>
            </section>

            {/* Headlines */}
            <section style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${t.border}`, padding: "16px 24px", background: t.badgeBg }}>
                <Newspaper size={18} style={{ color: t.info }} />
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Per-headline scores</h2>
              </div>
              <div style={{ padding: 16, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((row, i) => (
                  <div key={i} style={{ padding: 16, border: `1px solid ${t.border}`, borderRadius: 8, background: t.inputBg }}>
                    <p style={{ fontSize: 14, color: t.textPrimary, fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{row.headline}</p>
                    <p style={{ fontSize: 11, color: t.textSecondary, marginTop: 8, margin: 0 }}>
                      <span style={{ fontWeight: 600, color: row.label === "positive" ? t.success : row.label === "negative" ? t.danger : t.warning, textTransform: "uppercase" }}>{row.label}</span>
                      <span style={{ margin: "0 8px", color: t.border }}>|</span>
                      polarity: <span style={{ fontFamily: "monospace", color: t.textPrimary }}>{row.polarity?.toFixed?.(3) ?? row.polarity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Sources */}
            <section style={{ ...card }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0, marginBottom: 12 }}>Source metadata</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {articles.slice(0, 12).map((a, i) => (
                  <li key={i} style={{ fontSize: 12, color: t.textSecondary, borderBottom: i < 11 ? `1px solid ${t.border}` : "none", paddingBottom: i < 11 ? 8 : 0, paddingTop: i > 0 ? 8 : 0 }}>
                    <span style={{ color: t.textMuted }}>{a.published}</span> — {a.publisher} — {a.title?.slice(0, 90)}{a.title?.length > 90 ? "…" : ""}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !data && (
          <section style={{ ...card, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: t.activePillBg }}>
              <MessageCircle size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>Run analysis from the control bar to load sentiment.</p>
          </section>
        )}
      </div>
    </div>
  );
}
