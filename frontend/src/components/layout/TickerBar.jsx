import { tickerData } from "../../data/mockData";
import { formatInstrumentPrice } from "../../utils/priceFormat";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { LIGHT, DARK } from "../../theme/tokens";

export default function TickerBar() {
  const { isDark } = useTheme();
  const t = isDark ? DARK : LIGHT;
  const doubled = [...tickerData, ...tickerData];

  return (
    <div className="ticker-wrap overflow-hidden" style={{ position: "relative", background: t.card, borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
      <div style={{ pointerEvents: "none", position: "absolute", top: 0, bottom: 0, left: 0, zIndex: 1, width: 64, background: `linear-gradient(to right, ${t.card}, transparent)` }} aria-hidden />
      <div style={{ pointerEvents: "none", position: "absolute", top: 0, bottom: 0, right: 0, zIndex: 1, width: 64, background: `linear-gradient(to left, ${t.card}, transparent)` }} aria-hidden />
      
      <div className="ticker-track">
        {doubled.map((item, i) => {
          const isUp = item.change >= 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderRight: `1px solid ${t.border}` }}>
              <span style={{ color: t.textSecondary, fontWeight: 700, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                {item.symbol}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: t.textPrimary }}>
                {formatInstrumentPrice(item.price, item.symbol)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800, color: isUp ? t.success : t.danger }}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isUp ? "+" : ""}
                {item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
