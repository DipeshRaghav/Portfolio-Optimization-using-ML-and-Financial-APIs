import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useMultiAI } from "../../context/MultiAIContext";
import { searchStocks } from "../../services/api";

export default function ThemeSymbolSearch({ t }) {
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
