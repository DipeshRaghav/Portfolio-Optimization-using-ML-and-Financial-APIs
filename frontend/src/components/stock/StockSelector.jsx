import { useState, useRef, useEffect } from "react";
import { Plus, X, Search, ChevronRight, Loader2 } from "lucide-react";
import { searchStocks } from "../../services/api";

const POPULAR = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "META"];

export default function StockSelector({
  selected,
  setSelected,
  onAnalyze,
  isLoading,
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSugg = async () => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await searchStocks(input);
        setSuggestions(res || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSugg, 300);
    return () => clearTimeout(timeoutId);
  }, [input]);

  const addStock = (ticker) => {
    const clean = ticker.trim().toUpperCase();

    if (clean && !selected.includes(clean) && selected.length < 6) {
      setSelected([...selected, clean]);
    }

    setInput("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeStock = (ticker) => {
    setSelected(selected.filter((s) => s !== ticker));
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addStock(input);
    }
  };

  return (
    <div
      className="glass-card h-full flex flex-col"
      style={{
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <Search size={14} className="text-blue-400 shrink-0" />
        <h2
          className="text-white font-semibold text-sm tracking-wide leading-none"
          style={{ margin: 0 }}
        >
          Stock Selection
        </h2>
      </div>


      {/* Search Input + Plus Button */}
      <div
        className="relative"
        style={{
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Search ticker..."
            className="smart-input py-2.5 text-sm"
            style={{ flex: 1, minWidth: 0 }}
          />

          <button
            type="button"
            onClick={() => input.trim() && addStock(input)}
            style={{
              height: "42px",
              width: "42px",
              minWidth: "42px",
              borderRadius: "12px",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.25)",
              color: "#60a5fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Dropdown */}
        {(suggestions.length > 0 || isSearching) && input.trim() && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-[#0f172a] border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            {isSearching ? (
              <div className="p-3 text-center text-slate-500 text-xs flex justify-center">
                <Loader2 size={14} className="animate-spin" />
              </div>
            ) : (
              suggestions.map((s) => (
                <button
                  key={s.symbol}
                  type="button"
                  onClick={() => addStock(s.symbol)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800/50 border-b border-slate-800/30 last:border-0 flex flex-col transition-colors"
                >
                  <span className="font-bold text-slate-200">{s.symbol}</span>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5">
                    {s.shortname}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main content sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Popular Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p
            className="text-[9px] uppercase tracking-[2px] text-slate-600 font-semibold"
            style={{ margin: 0 }}
          >
            Popular
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {POPULAR.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addStock(s)}
                disabled={selected.includes(s)}
                style={{
                  fontSize: "10px",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  border: "none",
                  cursor: selected.includes(s) ? "default" : "pointer",
                  background: selected.includes(s)
                    ? "rgba(59,130,246,0.14)"
                    : "rgba(59,130,246,0.08)",
                  color: selected.includes(s)
                    ? "rgba(96,165,250,0.55)"
                    : "#7c93c9",
                  transition: "all 0.2s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            className="text-[9px] uppercase tracking-[2px] text-slate-600 font-semibold"
            style={{ margin: 0 }}
          >
            Selected ({selected.length})
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {selected.map((s) => (
              <span
                key={s}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid rgba(59,130,246,0.3)",
                  background: "rgba(59,130,246,0.08)",
                  color: "#93c5fd",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeStock(s)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(148,163,184,0.2)",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "28px",
        }}
      >
        <button
          type="button"
          onClick={() => onAnalyze(selected)}
          disabled={selected.length === 0 || isLoading}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(59,130,246,0.22), 0 0 18px rgba(59,130,246,0.22), 0 8px 24px rgba(59,130,246,0.18)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "16px",
            border: "1px solid rgba(59,130,246,0.28)",
            background:
              selected.length === 0 || isLoading
                ? "rgba(59,130,246,0.10)"
                : "rgba(59,130,246,0.16)",
            color:
              selected.length === 0 || isLoading
                ? "rgba(96,165,250,0.5)"
                : "#93c5fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 700,
            cursor:
              selected.length === 0 || isLoading ? "not-allowed" : "pointer",
            opacity: 1,
            transition: "all 0.22s ease",
            boxSizing: "border-box",
            boxShadow: "none",
            transform: "translateY(0)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ChevronRight size={16} />
              Analyze Portfolio
            </>
          )}
        </button>
      </div>

    </div>
  );
}
