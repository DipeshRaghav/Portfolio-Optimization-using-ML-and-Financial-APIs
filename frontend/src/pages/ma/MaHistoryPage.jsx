import { useState, useEffect, useRef } from "react";
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Theme tokens — light & dark palettes
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const LIGHT = {
  bg: "#f8f9fb",
  card: "#ffffff",
  border: "#e5e7eb",
  primary: "#6366f1",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
  danger: "#ef4444",
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  trackBg: "#e5e7eb",
  inputBg: "#ffffff",
  hoverBg: "#f9fafb",
  activePillBg: "#eef2ff",
  activePillText: "#6366f1",
  dropdownBg: "#ffffff",
  dropdownHover: "#eef2ff",
  badgeBg: "#f3f4f6",
  cardShadow: "0 1px 3px rgba(0,0,0,0.04)",
  cardHoverShadow: "0 4px 16px rgba(0,0,0,0.06)",
  // pill badge palettes
  volPillBg: "#fef3c7", volPillText: "#92400e",
  newsPillBg: "#dbeafe", newsPillText: "#1e40af",
  riskPillBg: "#fee2e2", riskPillText: "#991b1b",
  posPillBg: "#dcfce7", posPillText: "#166534",
  // insight card bgs
  insightAmber: "#fef3c7", insightIndigo: "#e0e7ff",
  insightBlue: "#dbeafe", insightGreen: "#dcfce7", insightRed: "#fee2e2",
};

const DARK = {
  bg: "#0f1117",
  card: "#1a1b2e",
  border: "rgba(255,255,255,0.08)",
  primary: "#818cf8",
  success: "#4ade80",
  warning: "#fbbf24",
  info: "#60a5fa",
  danger: "#f87171",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  trackBg: "rgba(255,255,255,0.08)",
  inputBg: "rgba(15,23,42,0.6)",
  hoverBg: "rgba(255,255,255,0.03)",
  activePillBg: "rgba(99,102,241,0.18)",
  activePillText: "#a5b4fc",
  dropdownBg: "#1e1f36",
  dropdownHover: "rgba(99,102,241,0.2)",
  badgeBg: "rgba(255,255,255,0.06)",
  cardShadow: "0 1px 3px rgba(0,0,0,0.3)",
  cardHoverShadow: "0 6px 24px rgba(0,0,0,0.35)",
  // pill badge palettes
  volPillBg: "rgba(251,191,36,0.15)", volPillText: "#fbbf24",
  newsPillBg: "rgba(96,165,250,0.15)", newsPillText: "#93c5fd",
  riskPillBg: "rgba(248,113,113,0.15)", riskPillText: "#fca5a5",
  posPillBg: "rgba(74,222,128,0.15)", posPillText: "#86efac",
  // insight card bgs
  insightAmber: "rgba(251,191,36,0.1)", insightIndigo: "rgba(129,140,248,0.1)",
  insightBlue: "rgba(96,165,250,0.1)", insightGreen: "rgba(74,222,128,0.1)", insightRed: "rgba(248,113,113,0.1)",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
   Inline Symbol Search — theme-aware
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HistorySymbolSearch({ t }) {
  const { symbol, setSymbol, refresh } = useMultiAI();
  const [input, setInput] = useState(symbol);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const blurTimer = useRef(null);

  useEffect(() => { setInput(symbol); }, [symbol]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = input.trim();
      if (q.length < 1) { setResults([]); setLoading(false); return; }
      setLoading(true);
      const rows = await searchStocks(q);
      setResults(Array.isArray(rows) ? rows.slice(0, 5) : []);
      setLoading(false);
      setHighlight(0);
    }, 280);
    return () => clearTimeout(timer);
  }, [input]);

  const pickSymbol = async (sym) => {
    const s = String(sym || "").trim().toUpperCase();
    if (!s) return;
    setSymbol(s); setInput(s); setOpen(false); setResults([]);
    await refresh(s);
  };

  useEffect(() => {
    const onDoc = (ev) => { if (wrapRef.current && !wrapRef.current.contains(ev.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === "Enter") { const raw = input.trim().toUpperCase(); if (raw) void pickSymbol(raw); }
      return;
    }
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((i) => (i + 1) % results.length); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((i) => (i - 1 + results.length) % results.length); return; }
    if (e.key === "Enter") { e.preventDefault(); const row = results[highlight]; if (row?.symbol) pickSymbol(row.symbol); }
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 320 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        Symbol
      </label>
      <div style={{ position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} />
        <input
          type="text" autoComplete="off" value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => { if (blurTimer.current) clearTimeout(blurTimer.current); setOpen(true); }}
          onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 180); }}
          onKeyDown={onKeyDown}
          placeholder="Search ticker…"
          style={{
            width: "100%", padding: "10px 36px 10px 36px", borderRadius: 8,
            border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary,
            fontSize: 14, fontFamily: "'Inter', system-ui, sans-serif", outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        {loading ? (
          <Loader2 size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: t.primary, animation: "spin 1s linear infinite" }} />
        ) : (
          <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} />
        )}
      </div>
      {open && results.length > 0 && (
        <ul style={{
          position: "absolute", zIndex: 50, marginTop: 4, width: "100%", borderRadius: 10,
          border: `1px solid ${t.border}`, background: t.dropdownBg, boxShadow: t.cardHoverShadow,
          padding: "4px 0", maxHeight: 240, overflowY: "auto", listStyle: "none",
        }}>
          {results.map((row, i) => (
            <li key={`${row.symbol}-${i}`}>
              <button type="button" style={{
                width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 13, cursor: "pointer",
                border: "none", background: highlight === i ? t.dropdownHover : "transparent",
                color: t.textPrimary, fontFamily: "'Inter', system-ui, sans-serif", transition: "background 0.15s",
              }}
              onMouseDown={(e) => e.preventDefault()} onClick={() => pickSymbol(row.symbol)} onMouseEnter={() => setHighlight(i)}>
                <div style={{ fontWeight: 600, color: t.primary, fontFamily: "monospace" }}>{row.symbol}</div>
                <div style={{ fontSize: 12, color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.name || row.longname || row.shortname || "—"}
                  {row.exchange ? <span style={{ color: t.textMuted }}> · {row.exchange}</span> : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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
        <section style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24 }}>
          {/* Symbol */}
          <HistorySymbolSearch t={t} />

          {/* Timeframe */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Timeframe
            </label>
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}` }}>
              {PERIODS.map((pr, idx) => (
                <button
                  key={pr.value}
                  type="button"
                  onClick={() => setPeriod(pr.value)}
                  style={{
                    padding: "8px 18px", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    background: period === pr.value ? t.activePillBg : t.card,
                    color: period === pr.value ? t.activePillText : t.textSecondary,
                    transition: "all 0.15s",
                    borderRight: idx < PERIODS.length - 1 ? `1px solid ${t.border}` : "none",
                  }}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* LSTM Epochs */}
          <div style={{ minWidth: 200, flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              LSTM Epochs
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range" min={1} max={12}
                value={chartEpochs}
                onChange={(e) => setChartEpochs(Number(e.target.value))}
                style={{ flex: 1, accentColor: t.primary, cursor: "pointer" }}
              />
              <span style={{
                display: "inline-block", minWidth: 38, textAlign: "center",
                padding: "4px 10px", borderRadius: 6,
                background: t.activePillBg, color: t.activePillText,
                fontSize: 13, fontWeight: 600, fontFamily: "monospace",
              }}>
                {chartEpochs}
              </span>
            </div>
          </div>
        </section>

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
