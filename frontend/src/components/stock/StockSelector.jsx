import { useState, useRef } from "react";
import { Plus, X, Search, ChevronRight, Loader2 } from "lucide-react";

const POPULAR = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "META"];

export default function StockSelector({ selected, setSelected, onAnalyze, isLoading }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  const addStock = (ticker) => {
    const clean = ticker.trim().toUpperCase();
    if (clean && !selected.includes(clean) && selected.length < 6) {
      setSelected([...selected, clean]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const removeStock = (ticker) => setSelected(selected.filter((s) => s !== ticker));

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addStock(input);
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
          <Search size={14} className="text-blue-400" />
          Stock Selection
        </h2>
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 mb-4">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter ticker..."
          className="smart-input py-2.5 text-sm flex-1"
        />
        <button
          onClick={() => input && addStock(input)}
          className="h-[42px] w-[42px] rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 hover:bg-blue-500/25 transition-all flex items-center justify-center shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Popular */}
      <p className="text-[9px] uppercase tracking-[2px] text-slate-600 mb-2 font-semibold">Popular</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {POPULAR.map((s) => (
          <button
            key={s}
            onClick={() => addStock(s)}
            disabled={selected.includes(s)}
            className={`text-[10px] px-2.5 py-1 rounded-lg font-bold tracking-wide transition-all ${
              selected.includes(s)
                ? "bg-blue-500/10 text-blue-400 opacity-50 cursor-default"
                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Selected */}
      <p className="text-[9px] uppercase tracking-[2px] text-slate-600 mb-2 font-semibold">Selected ({selected.length})</p>
      <div className="flex flex-wrap gap-2 mb-5 items-start">
        {selected.map((s) => (
          <span key={s} className="chip">
            {s}
            <button onClick={() => removeStock(s)} className="chip-remove">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>


      {/* Analyze */}
      <button
        onClick={() => onAnalyze(selected)}
        disabled={selected.length === 0 || isLoading}
        className="btn-success w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
      >
        {isLoading ? (
          <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
        ) : (
          <><ChevronRight size={16} /> Analyze Portfolio</>
        )}
      </button>
    </div>
  );
}
