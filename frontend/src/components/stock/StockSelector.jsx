import { useState, useRef, useEffect } from "react";
import { Plus, X, Search, ChevronRight, Loader2 } from "lucide-react";
import { searchStocks } from "../../services/api";

const POPULAR = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "META"];

export default function StockSelector({ selected, setSelected, onAnalyze, isLoading }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const fetchSugg = async () => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      const res = await searchStocks(input);
      setSuggestions(res);
      setIsSearching(false);
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

  const removeStock = (ticker) => setSelected(selected.filter((s) => s !== ticker));

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addStock(input);
    }
  };

  return (
    <div className="glass-card p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
          <Search size={14} className="text-blue-400" />
          Stock Selection
        </h2>
      </div>

      {/* Input Row */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Search ticker..."
            className="smart-input py-2.5 text-sm flex-1"
          />
          <button
            onClick={() => input && addStock(input)}
            className="h-[42px] w-[42px] rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 hover:bg-blue-500/25 transition-all flex items-center justify-center shrink-0"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Dropdown */}
        {(suggestions.length > 0 || isSearching) && input.trim() && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-[#0f172a] border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
             {isSearching ? (
               <div className="p-3 text-center text-slate-500 text-xs flex justify-center"><Loader2 size={14} className="animate-spin" /></div>
             ) : (
               suggestions.map((s) => (
                 <button 
                   key={s.symbol} 
                   onClick={() => addStock(s.symbol)}
                   className="w-full text-left px-4 py-2 hover:bg-slate-800/50 border-b border-slate-800/30 last:border-0 flex flex-col transition-colors"
                 >
                   <span className="font-bold text-slate-200">{s.symbol}</span>
                   <span className="text-[10px] text-slate-500 truncate mt-0.5">{s.shortname}</span>
                 </button>
               ))
             )}
          </div>
        )}
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
