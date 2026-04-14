import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Globe, Loader2, Play, TrendingUp } from "lucide-react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";

export default function MaMarketPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const { data, loading, refresh } = useMultiAI();
  const macro = data?.market_analysis || {};
  const reasons = data?.reasons?.market || [];
  const mkt = data?.models?.market || {};
  const spx = macro.spx || [];
  const vix = macro.vix || [];
  
  const p = mkt.prob_up ?? 0;
  const bias = p == null ? "neutral" : p >= 0.55 ? "bullish" : p <= 0.45 ? "bearish" : "neutral";

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.cardShadow };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: t.textPrimary, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* HEADER */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>Market Context</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>S&amp;P 500 and VIX series plus market-model bias — how the tape supports or fights your ticker read.</p>
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
            <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary }}>Running macro analysis…</p>
            <p style={{ fontSize: 12, color: t.textSecondary }}>Checking broader market metrics and volatility.</p>
          </section>
        )}

        {/* MAIN CONTENT */}
        {!loading && data && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {/* S&P 500 Chart */}
              <section style={{ ...card, padding: 0, overflow: "hidden", borderTop: `4px solid ${t.info}` }}>
                <div style={{ padding: "12px 20px", borderBottom: `1px solid ${t.border}`, background: t.badgeBg }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, margin: 0, color: t.info, textTransform: "uppercase", letterSpacing: "0.05em" }}>S&amp;P 500</h3>
                  <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, marginTop: 4 }}>Recent index path (proxy)</p>
                </div>
                <div style={{ height: 240, padding: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spx}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis tick={{ fill: t.textSecondary, fontSize: 10 }} domain={["auto", "auto"]} width={50} tickLine={false} axisLine={{ stroke: t.border }} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: t.cardShadow, fontSize: 12, color: t.textPrimary }} />
                      <Line type="monotone" dataKey="value" stroke={t.info} strokeWidth={2.5} dot={false} name="SPX" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* VIX Chart */}
              <section style={{ ...card, padding: 0, overflow: "hidden", borderTop: `4px solid ${t.warning}` }}>
                <div style={{ padding: "12px 20px", borderBottom: `1px solid ${t.border}`, background: t.badgeBg }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, margin: 0, color: t.warning, textTransform: "uppercase", letterSpacing: "0.05em" }}>VIX</h3>
                  <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, marginTop: 4 }}>Implied volatility index</p>
                </div>
                <div style={{ height: 240, padding: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vix}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis tick={{ fill: t.textSecondary, fontSize: 10 }} domain={["auto", "auto"]} width={40} tickLine={false} axisLine={{ stroke: t.border }} />
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: t.cardShadow, fontSize: 12, color: t.textPrimary }} />
                      <Line type="monotone" dataKey="value" stroke={t.warning} strokeWidth={2.5} dot={false} name="VIX" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <section style={{ ...card, borderLeft: `4px solid ${t.success}`, maxWidth: 500 }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Market model</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <TrendingUp size={28} color={t.success} />
                <span style={{ fontSize: 40, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>{((p) * 100).toFixed(1)}<span style={{ fontSize: 24, fontWeight: 300, color: t.success, marginLeft: 2 }}>%</span></span>
              </div>
              <p style={{ margin: 0, marginTop: 12, fontSize: 13, color: t.textSecondary }}>
                Bias: <span style={{ fontFamily: "monospace", fontWeight: 600, color: t.textPrimary, marginLeft: 4 }}>{mkt.market_bias?.toFixed?.(3) ?? mkt.market_bias}</span>
              </p>
              {macro.error && <p style={{ fontSize: 12, color: t.danger, marginTop: 8 }}>Macro series: {macro.error}</p>}
            </section>

            {/* Reasons */}
            <section style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${t.border}`, padding: "16px 24px", background: t.badgeBg }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Macro narrative</h2>
                <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, marginTop: 4 }}>Context for the market vertical</p>
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
              <Globe size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>Run analysis from the control bar to load market context.</p>
          </section>
        )}
      </div>
    </div>
  );
}
