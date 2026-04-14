import { Activity, Loader2, Play, Wrench } from "lucide-react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";

export default function MaTechnicalPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const { data, loading, refresh } = useMultiAI();
  const reasons = data?.reasons?.technical || [];
  const prob = data?.models?.indicator?.prob_up;
  const p = prob ?? 0;
  const bias = p == null ? "neutral" : p >= 0.55 ? "bullish" : p <= 0.45 ? "bearish" : "neutral";

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.cardShadow };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: t.textPrimary, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* HEADER */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>Technical Analysis</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>RSI, MACD, Bollinger bands, and moving averages — distilled into a bullish probability for the next move.</p>
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
            <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary }}>Running multi-model pipeline…</p>
            <p style={{ fontSize: 12, color: t.textSecondary }}>Running XGBoost on engineered technical features.</p>
          </section>
        )}

        {/* MAIN CONTENT */}
        {!loading && data && (
          <div style={{ display: "grid", gap: 24 }}>
            <section style={{ ...card, borderLeft: `4px solid ${t.info}`, maxWidth: 500 }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Indicator model</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>{((p) * 100).toFixed(1)}</span>
                <span style={{ fontSize: 24, fontWeight: 300, color: t.info }}>%</span>
              </div>
              <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: t.textSecondary }}>Probability of positive forward return</p>
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, textTransform: "uppercase", color: t.textSecondary, marginBottom: 4 }}>
                  <span>Bearish</span><span>Bullish</span>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: t.trackBg, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, p * 100))}%`, background: p >= 0.55 ? t.success : p <= 0.45 ? t.danger : t.warning, transition: "width 0.5s ease" }} />
                </div>
                <p style={{ margin: 0, textAlign: "center", fontSize: 11, fontWeight: 500, color: t.textSecondary, marginTop: 8 }}>Bias: <span style={{ color: t.textPrimary, textTransform: "capitalize" }}>{bias}</span></p>
              </div>
            </section>

            {/* Reasons */}
            <section style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${t.border}`, padding: "16px 24px", background: t.badgeBg }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Drivers behind the signal</h2>
              </div>
              <div style={{ padding: 0 }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "16px 24px", borderTop: i > 0 ? `1px solid ${t.border}` : "none" }}>
                    <span style={{ flexShrink: 0, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: t.activePillBg, color: t.activePillText, fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.5, margin: 0 }}>{r}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !data && (
          <section style={{ ...card, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: t.activePillBg }}>
              <Wrench size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>Run analysis from the control bar to load the technical read.</p>
          </section>
        )}
      </div>
    </div>
  );
}
