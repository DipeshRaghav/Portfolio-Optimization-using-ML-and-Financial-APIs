import { useState, useEffect, useRef } from "react";
import ThemeControlBar from "../../components/multimodel/ThemeControlBar";
import {
  Loader2,
  Play,
  Zap,
  Newspaper,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  ChevronDown,
  Timer,
} from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";
import { useTheme } from "../../context/ThemeContext";
import { searchStocks } from "../../services/api";
import { LIGHT, DARK } from "../../theme/tokens";
import ThemeSymbolSearch from "../../components/multimodel/ThemeSymbolSearch";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Trigger type configs (will be themed dynamically)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getTriggerConfig(type, t) {
  const map = {
    volatility: { icon: Zap, accent: t.warning, label: "Volatility", pillBg: t.volPillBg, pillText: t.volPillText },
    news: { icon: Newspaper, accent: t.info, label: "News", pillBg: t.newsPillBg, pillText: t.newsPillText },
    risk: { icon: AlertTriangle, accent: t.danger, label: "Risk", pillBg: t.riskPillBg, pillText: t.riskPillText },
    positive: { icon: TrendingUp, accent: t.success, label: "Positive", pillBg: t.posPillBg, pillText: t.posPillText },
  };
  return map[type] || { icon: Activity, accent: t.textSecondary, label: "Event", pillBg: t.badgeBg, pillText: t.textSecondary };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Insight summary → 2×2 card data
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getInsightCards(prob, triggers, reasons, t) {
  const p = prob ?? 0;
  const volCount = triggers.filter((x) => x.type === "volatility").length;
  const newsCount = triggers.filter((x) => x.type === "news").length;
  const bullish = p >= 0.55;

  return [
    { icon: Zap, number: volCount, label: `Volatility Event${volCount !== 1 ? "s" : ""}`, color: t.warning, bg: t.insightAmber },
    { icon: Lightbulb, number: reasons.length, label: `Key Feature${reasons.length !== 1 ? "s" : ""}`, color: t.primary, bg: t.insightIndigo },
    { icon: Newspaper, number: newsCount, label: `Headline${newsCount !== 1 ? "s" : ""} Flagged`, color: t.info, bg: t.insightBlue },
    { icon: bullish ? TrendingUp : TrendingDown, number: null, label: bullish ? "Bullish Signal" : "Bearish Signal", color: bullish ? t.success : t.danger, bg: bullish ? t.insightGreen : t.insightRed },
  ];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Confidence helper
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getConfidence(p, t) {
  if (p >= 0.7) return { label: "HIGH CONFIDENCE", color: t.success, bg: t.insightGreen, arrow: ArrowUp };
  if (p >= 0.45) return { label: "MODERATE", color: t.warning, bg: t.insightAmber, arrow: Minus };
  return { label: "LOW CONFIDENCE", color: t.danger, bg: t.insightRed, arrow: ArrowDown };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Signal dot colors
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getSignalDotColor(i, t) {
  const dots = [t.primary, t.success, t.warning, t.info, t.danger, "#a855f7"];
  return dots[i % dots.length];
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Timeframe constants
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PERIODS = [
  { value: "6mo", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "2y", label: "2Y" },
  { value: "5y", label: "5Y" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MaHistoryPage() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;

  const {
    data, loading, refresh,
    period, setPeriod,
    chartEpochs, setChartEpochs,
  } = useMultiAI();

  const triggers = data?.history_triggers || [];
  const reasons = data?.reasons?.historical || [];
  const prob = data?.models?.historical?.prob_up;
  const p = prob ?? 0;
  const pct = (p * 100).toFixed(1);
  const conf = getConfidence(p, t);

  /* ── Shared card style ── */
  const card = {
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 12,
    padding: 24,
    boxShadow: t.cardShadow,
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: t.textPrimary,
      paddingTop: 40,
      paddingBottom: 80,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ═══════════════════════════════════════════
            1. HEADER
            ═══════════════════════════════════════════ */}
        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>
              History &amp; Triggers
            </h1>
            <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
              Volatility spikes, news events on the timeline, and random-forest rationale derived from return and volatility features.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 28px", borderRadius: 10, border: "none",
              background: t.primary, color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
              boxShadow: `0 2px 8px ${isDark ? "rgba(129,140,248,0.25)" : "rgba(99,102,241,0.2)"}`,
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={16} />}
            Run Analysis
          </button>
        </section>

        {/* ═══════════════════════════════════════════
            2. CONTROLS BAR
            ═══════════════════════════════════════════ */}
        <ThemeControlBar t={t} cardStyle={card} />

        {/* ═══════════════════════════════════════════
            LOADING STATE
            ═══════════════════════════════════════════ */}
        {loading && (
          <section style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 24px" }}>
            <Loader2 size={28} style={{ color: t.primary, animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary }}>Running multi-model pipeline…</p>
            <p style={{ fontSize: 12, color: t.textSecondary }}>Training sequence models and fetching headlines — often 30–120s on first run.</p>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════ */}
        {!loading && data && (
          <>
            {/* ────── 3. BULLISH PROBABILITY ────── */}
            <section style={{ ...card, borderLeft: `4px solid ${t.success}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: 48, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>
                    {pct}%
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: t.textSecondary }}>Bullish Probability</span>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: conf.bg, color: conf.color, letterSpacing: "0.03em",
                }}>
                  <conf.arrow size={13} />
                  {conf.label}
                </span>
              </div>
              {/* Progress bar — 8px, clean */}
              <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: t.trackBg, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4, background: t.success,
                  width: `${Math.min(100, Math.max(0, p * 100))}%`,
                  transition: "width 0.7s ease-out",
                }} />
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: t.textSecondary }}>
                Random forest trained on momentum, rolling returns, and volatility features.
              </p>
            </section>

            {/* ────── 4. MODEL INSIGHT SUMMARY — 2×2 grid ────── */}
            <section>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>
                Model Insight Summary
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {getInsightCards(prob, triggers, reasons, t).map((ic, i) => {
                  const Icon = ic.icon;
                  return (
                    <div key={i} style={{
                      ...card, display: "flex", alignItems: "center", gap: 16, padding: 20,
                      transition: "box-shadow 0.2s, transform 0.15s", cursor: "default",
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        background: ic.bg, flexShrink: 0,
                      }}>
                        <Icon size={20} style={{ color: ic.color }} />
                      </div>
                      <div>
                        {ic.number !== null && (
                          <p style={{ fontSize: 24, fontWeight: 700, color: t.textPrimary, lineHeight: 1 }}>{ic.number}</p>
                        )}
                        <p style={{ fontSize: 13, color: t.textSecondary, marginTop: ic.number !== null ? 2 : 0, fontWeight: 500 }}>
                          {ic.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ────── 5. FEATURE NARRATIVE — stacked rows ────── */}
            {reasons.length > 0 && (
              <section>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>
                  Feature Narrative
                </h2>
                <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {reasons.map((r, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 24px",
                      borderTop: i > 0 ? `1px solid ${t.border}` : "none",
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                        background: getSignalDotColor(i, t),
                      }} />
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>Signal {i + 1}</span>
                        <p style={{ fontSize: 14, color: t.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{r}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ────── 6. TRIGGER TIMELINE ────── */}
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, margin: 0 }}>
                  Trigger Timeline
                </h2>
                {triggers.length > 0 && (
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: t.textSecondary,
                    background: t.badgeBg, padding: "3px 10px", borderRadius: 999,
                  }}>
                    {triggers.length} event{triggers.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {triggers.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {triggers.map((tr, i) => {
                    const cfg = getTriggerConfig(tr.type, t);
                    const Icon = cfg.icon;
                    return (
                      <div key={i} style={{
                        ...card, borderLeft: `4px solid ${cfg.accent}`, padding: 20,
                        display: "flex", flexDirection: "column", gap: 8,
                        transition: "box-shadow 0.2s",
                      }}>
                        {/* pill badge + date */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "3px 10px", borderRadius: 999,
                            background: cfg.pillBg, color: cfg.pillText,
                            fontSize: 11, fontWeight: 600,
                          }}>
                            <Icon size={13} />
                            {cfg.label}
                          </span>
                          <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "monospace" }}>
                            {tr.date?.slice(0, 16)}
                          </span>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 500, color: t.textPrimary, lineHeight: 1.5 }}>{tr.title}</p>
                        {tr.detail && (
                          <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5 }}>{tr.detail}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ ...card, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Timer size={28} style={{ color: t.textMuted }} />
                  <p style={{ fontSize: 14, color: t.textSecondary }}>No trigger events available</p>
                  <p style={{ fontSize: 12, color: t.textMuted }}>Run analysis to detect volatility events and headlines</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Empty state */}
        {!loading && !data && (
          <section style={{
            ...card, padding: "56px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
              background: t.activePillBg,
            }}>
              <Play size={24} style={{ color: t.primary }} />
            </div>
            <p style={{ fontSize: 14, color: t.textSecondary, textAlign: "center", maxWidth: 360 }}>
              Run analysis from the control bar to load data.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
