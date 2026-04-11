import { Bell, User, ChevronDown, Zap } from "lucide-react";

const navItems = [
  { label: "Chart AI", page: "ma-chart" },
  { label: "Technical", page: "ma-technical" },
  { label: "Sentiment", page: "ma-sentiment" },
  { label: "History", page: "ma-history" },
  { label: "Market", page: "ma-market" },
  { label: "Report", page: "ma-report" },
];

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav
      className="
        z-[9000] h-[72px] border-b border-white/[0.06] bg-[#050810]/90 shadow-[0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl md:h-[76px]
      "
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-3 min-w-fit shrink-0 cursor-pointer select-none"
          onClick={() => setActivePage("ma-chart")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap size={18} className="text-white" fill="white" />
          </div>

          <div className="leading-none">
            <span className="text-white font-extrabold text-[22px] tracking-tight">
              Smart<span className="text-violet-400">Invest</span>
            </span>
            <p className="text-slate-500 text-[9px] tracking-[2.4px] uppercase mt-1 font-bold">
              Multi-AI Terminal
            </p>
          </div>
        </div>

          <div className="hidden lg:flex flex-1 justify-center min-w-0 px-4">
          <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-slate-950/50 px-1.5 py-1.5 shadow-inner shadow-black/20 overflow-x-auto max-w-full">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`h-9 flex items-center justify-center rounded-full border whitespace-nowrap text-[10px] font-semibold tracking-[0.02em] transition-all duration-200 px-4 ${
                  activePage === item.page
                    ? "border-violet-400/30 bg-violet-500/18 text-violet-200"
                    : "border-transparent bg-transparent text-slate-400 hover:border-slate-700/40 hover:bg-slate-800/45 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 pr-1">
          <button className="relative w-10 h-10 rounded-xl bg-slate-900/45 border border-slate-800/45 flex items-center justify-center text-slate-500 hover:text-violet-400 hover:border-violet-500/30 hover:bg-slate-800/50 transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full border-2 border-[#0a1628]"></span>
          </button>

          <button className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-slate-900/45 border border-slate-800/45 hover:border-slate-700 hover:bg-slate-800/45 transition-all duration-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/30">
              <User size={14} className="text-slate-300" />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[11px] font-semibold text-slate-200">Portfolio</p>
              <p className="text-[9px] text-slate-500">Live</p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>
        </div>
      </div>
    </nav>
  );
}
