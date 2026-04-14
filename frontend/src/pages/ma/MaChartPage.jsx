import { useMemo } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Activity, CandlestickChart, Sparkles, TrendingUp, Loader2, Play } from "lucide-react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";
import { formatAxisPriceTick, formatInstrumentPrice } from "../../utils/priceFormat";

function ChartTooltip({ active, payload, label, symbol, t }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  const isFc = row?.is_forecast;
  const v = row?.close;
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: t.cardShadow }}>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 4 }}>{String(label)}</p>
      <p style={{ fontFamily: "monospace", fontSize: 18, color: t.textPrimary, margin: 0 }}>{formatInstrumentPrice(v, symbol)}</p>
      <p style={{ fontSize: 12, marginTop: 4, color: isFc ? t.primary : t.info }}>{isFc ? "Illustrative forecast" : "Historical close"}</p>
    </div>
  );
}

export default function MaChartPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const { data, loading, symbol: ctxSymbol, refresh, period, setPeriod, chartEpochs, setChartEpochs } = useMultiAI();
  const series = data?.chart_series || [];
  const reasons = data?.reasons?.chart || [];
  const prob = data?.models?.chart?.prob_up;
  const fh = data?.models?.chart?.meta?.forward_horizon ?? 5;
  const sym = data?.symbol || ctxSymbol || "";
  const ens = data?.ensemble;
  const confidence = ens?.confidence;

  const composed = useMemo(() => {
    if (!series.length) return [];
    return series.map((p) => ({
      ...p, hist: p.is_forecast ? null : p.close, forecast: p.is_forecast ? p.close : null,
    }));
  }, [series]);

  const lastHist = useMemo(() => {
    for (let i = composed.length - 1; i >= 0; i--) { if (composed[i].hist != null) return composed[i].hist; }
    return null;
  }, [composed]);

  const p = prob ?? 0;
  const bias = p == null ? "neutral" : p >= 0.55 ? "bullish" : p <= 0.45 ? "bearish" : "neutral";

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.cardShadow };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: t.textPrimary, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* HEADER */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>Chart Intelligence</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>Stacked LSTM reads enriched OHLCV windows and estimates direction — shown with history and an illustrative path from the ensemble.</p>
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
            <p style={{ fontSize: 12, color: t.textSecondary }}>Training sequence models and fetching headlines.</p>
          </section>
        )}

        {/* MAIN CONTENT */}
        {!loading && data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <section style={{ ...card, borderLeft: `4px solid ${t.primary}` }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>{fh}-day outlook</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 48, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>{((p) * 100).toFixed(1)}</span>
                  <span style={{ fontSize: 24, fontWeight: 300, color: t.primary }}>%</span>
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
                  <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Why this read</h2>
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

            {/* CHART */}
            <section style={{ ...card, flex: 2, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={16} color={t.warning} /> Price path</h2>
                <p style={{ fontSize: 11, color: t.textSecondary, margin: 0 }}>Solid = history · dashed = forecast</p>
              </div>
              <div style={{ flex: 1, minHeight: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={composed} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="histFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.primary} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={t.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: t.textSecondary, fontSize: 10 }} tickLine={false} axisLine={{ stroke: t.border }} minTickGap={30} />
                    <YAxis domain={["auto", "auto"]} tick={{ fill: t.textSecondary, fontSize: 10 }} tickLine={false} axisLine={{ stroke: t.border }} tickFormatter={(v) => formatAxisPriceTick(v, sym)} />
                    <RechartsTooltip content={<ChartTooltip symbol={sym} t={t} />} />
                    <Area type="monotone" dataKey="hist" name="History" stroke={t.primary} strokeWidth={2.5} fill="url(#histFill)" dot={false} isAnimationActive={true} animationDuration={600} />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke={t.info} strokeWidth={2} strokeDasharray="7 5" dot={false} connectNulls isAnimationActive={true} animationDuration={600} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !data && (
          <section style={{ ...card, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: t.activePillBg }}>
              <Play size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>Run analysis from the control bar to load the chart.</p>
          </section>
        )}
      </div>
    </div>
  );
}
