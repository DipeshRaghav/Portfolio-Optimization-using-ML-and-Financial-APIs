import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { searchStocks } from "../../services/api";
import { useMultiAI } from "../../context/MultiAIContext";

const MIN_QUERY = 1;

export default function MaSymbolSearch() {
  const { symbol, setSymbol, refresh } = useMultiAI();
  const [input, setInput] = useState(symbol);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const blurTimer = useRef(null);

  useEffect(() => {
    setInput(symbol);
  }, [symbol]);

  const runSearch = useCallback(async (q) => {
    const t = q.trim();
    if (t.length < MIN_QUERY) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const rows = await searchStocks(t);
    setResults(Array.isArray(rows) ? rows.slice(0, 5) : []);
    setLoading(false);
    setHighlight(0);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      runSearch(input);
    }, 280);
    return () => clearTimeout(t);
  }, [input, runSearch]);

  const pickSymbol = async (sym) => {
    const s = String(sym || "").trim().toUpperCase();
    if (!s) return;
    setSymbol(s);
    setInput(s);
    setOpen(false);
    setResults([]);
    await refresh(s);
  };

  const onBlurPanel = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 180);
  };

  const onFocusPanel = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setOpen(true);
  };

  const onKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === "Enter") {
        const raw = input.trim().toUpperCase();
        if (raw) void pickSymbol(raw);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % results.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + results.length) % results.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const row = results[highlight];
      if (row?.symbol) pickSymbol(row.symbol);
      return;
    }
  };

  useEffect(() => {
    const onDoc = (ev) => {
      if (wrapRef.current && !wrapRef.current.contains(ev.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative min-w-[min(100%,320px)] max-w-md">
      <label className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider block mb-1">
        Symbol
      </label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          size={16}
          aria-hidden
        />
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="symbol-search-listbox"
          role="combobox"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={onFocusPanel}
          onBlur={onBlurPanel}
          onKeyDown={onKeyDown}
          placeholder="Search ticker or company…"
          className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-9 py-2 font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50"
        />
        {loading ? (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 animate-spin"
            size={16}
            aria-hidden
          />
        ) : (
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            size={16}
            aria-hidden
          />
        )}
      </div>

      {open && (results.length > 0 || (loading && input.trim().length >= MIN_QUERY)) && (
        <ul
          id="symbol-search-listbox"
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/95 shadow-xl backdrop-blur-sm py-1 max-h-64 overflow-auto"
        >
          {loading && results.length === 0 && (
            <li className="px-3 py-2 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="animate-spin shrink-0" size={14} /> Searching…
            </li>
          )}
          {results.map((row, i) => (
            <li key={`${row.symbol}-${i}`} role="option" aria-selected={highlight === i}>
              <button
                type="button"
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  highlight === i ? "bg-violet-600/25 text-white" : "text-slate-200 hover:bg-slate-800/80"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSymbol(row.symbol)}
              >
                <div className="font-mono font-semibold text-violet-300">{row.symbol}</div>
                <div className="text-xs text-slate-400 line-clamp-2">
                  {row.name || row.longname || row.shortname || "—"}
                  {row.exchange ? (
                    <span className="text-slate-500"> · {row.exchange}</span>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
