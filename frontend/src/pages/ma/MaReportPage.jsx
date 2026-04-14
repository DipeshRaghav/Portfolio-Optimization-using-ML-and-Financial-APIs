import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileCheck, Zap, Loader2, Play } from "lucide-react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";
import { formatAxisPriceTick, formatInstrumentPrice } from "../../utils/priceFormat";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

function ReportPriceTooltip({ active, payload, label, symbol, t }) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const v = row?.value;
  const seriesName = row?.name;
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: t.cardShadow }}>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 4 }}>{String(label)}</p>
      <p style={{ fontFamily: "monospace", fontSize: 18, color: t.textPrimary, margin: 0 }}>{formatInstrumentPrice(v, symbol)}</p>
      {seriesName && <p style={{ fontSize: 12, marginTop: 4, color: t.textMuted }}>{seriesName}</p>}
    </div>
  );
}

export default function MaReportPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const { data, loading, symbol: ctxSymbol, refresh } = useMultiAI();
  const sym = data?.symbol || ctxSymbol || "";
  const ens = data?.ensemble;
  const breakdown = ens?.breakdown || {};
  const barData = Object.entries(breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: Number(value) * 100,
  }));
  const series = data?.chart_series || [];
  const histPts = series.filter((p) => !p.is_forecast);
  const fcPts = series.filter((p) => p.is_forecast);
  const bridge = histPts.length && fcPts.length ? [histPts[histPts.length - 1], ...fcPts] : fcPts;

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.cardShadow };

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: t.textPrimary, paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* HEADER */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>Final Intelligence Report</h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>Every vertical, weighted ensemble, confidence, and an illustrative price continuation — one view before you decide.</p>
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
            <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary }}>Compiling final report…</p>
            <p style={{ fontSize: 12, color: t.textSecondary }}>Aggregating multi-model ensemble weights.</p>
          </section>
        )}

        {/* MAIN CONTENT */}
        {!loading && data && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <section style={{ ...card, borderTop: `4px solid ${t.primary}` }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Final score</p>
                <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: t.primary }}>{((ens?.final_score ?? 0) * 100).toFixed(1)}%</p>
              </section>
              
              <section style={{ ...card, borderTop: `4px solid ${t.warning}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Signal</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Zap size={28} color={t.warning} />
                  <span style={{ fontSize: 24, fontWeight: 700, color: t.textPrimary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{(ens?.signal || "hold")}</span>
                </div>
              </section>
              
              <section style={{ ...card, borderTop: `4px solid ${t.info}` }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: t.textSecondary, marginBottom: 8 }}>Confidence</p>
                <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: t.textPrimary }}>{((ens?.confidence ?? 0) * 100).toFixed(1)}%</p>
              </section>
            </div>

            {/* Verticals Chart */}
            <section style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${t.border}`, padding: "16px 24px", background: t.badgeBg }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Vertical contributions</h2>
                <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, marginTop: 4 }}>Bullish proxy by model (% scale)</p>
              </div>
              <div style={{ height: 280, padding: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={{ stroke: t.border }} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: t.textSecondary, fontSize: 10 }} width={50} axisLine={{ stroke: t.border }} tickLine={false} />
                    <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: t.cardShadow, fontSize: 12, color: t.textPrimary }} formatter={(v) => [`${Number(v).toFixed(1)}%`, "Score"]} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Price continuation Chart */}
            <section style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ borderBottom: `1px solid ${t.border}`, padding: "16px 24px", background: t.badgeBg }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, margin: 0 }}>Price + continuation</h2>
                <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, marginTop: 4 }}>History vs illustrative ensemble path</p>
              </div>
              <div style={{ height: 360, padding: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: t.textSecondary, fontSize: 10 }} minTickGap={28} axisLine={{ stroke: t.border }} tickLine={false} />
                    <YAxis domain={["auto", "auto"]} tick={{ fill: t.textSecondary, fontSize: 10 }} width={60} tickFormatter={(v) => formatAxisPriceTick(v, sym)} axisLine={{ stroke: t.border }} tickLine={false} />
                    <Tooltip content={<ReportPriceTooltip symbol={sym} t={t} />} />
                    <Legend wrapperStyle={{ paddingTop: 12 }} />
                    <Line type="monotone" data={histPts} dataKey="close" name="History" stroke={t.primary} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" data={bridge} dataKey="close" name="Forecast" stroke={t.info} strokeWidth={2} strokeDasharray="7 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ margin: 0, padding: "12px 24px", textAlign: "center", fontSize: 10, color: t.textSecondary, borderTop: `1px solid ${t.border}`, background: t.badgeBg }}>
                Forecast encodes ensemble direction only (illustrative). Not investment advice.
              </p>
            </section>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !data && (
          <section style={{ ...card, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: t.activePillBg }}>
              <FileCheck size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>Run analysis from the control bar to compile report.</p>
          </section>
        )}
      </div>
    </div>
  );
}
