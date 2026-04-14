import { useMultiAI } from "../../context/MultiAIContext";
import ThemeSymbolSearch from "./ThemeSymbolSearch";

const PERIODS = [
  { value: "6mo", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "2y", label: "2Y" },
  { value: "5y", label: "5Y" },
];

export default function ThemeControlBar({ t, cardStyle }) {
  const { period, setPeriod, chartEpochs, setChartEpochs } = useMultiAI();

  return (
    <section style={{ ...cardStyle, display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24 }}>
      {/* Symbol */}
      <ThemeSymbolSearch t={t} />

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
  );
}
