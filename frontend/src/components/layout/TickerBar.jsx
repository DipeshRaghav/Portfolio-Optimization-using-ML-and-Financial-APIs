import { tickerData } from "../../data/mockData";
import { formatInstrumentPrice } from "../../utils/priceFormat";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TickerBar() {
  const doubled = [...tickerData, ...tickerData];

  return (
    <div className="relative bg-[#080d18]/85 border-b border-white/[0.05] py-2.5 ticker-wrap overflow-hidden backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-[#080d18] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-[#080d18] to-transparent"
        aria-hidden
      />
      <div className="ticker-track">
        {doubled.map((item, i) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-6 border-r border-slate-800/30"
            >
              <span className="text-slate-400 font-bold text-[10px] tracking-[1.5px] uppercase">
                {item.symbol}
              </span>
              <span className="font-mono text-[11px] font-bold text-white">
                {formatInstrumentPrice(item.price, item.symbol)}
              </span>
              <span
                className={`flex items-center gap-1 text-[10px] font-extrabold ${
                  isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isUp ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
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

