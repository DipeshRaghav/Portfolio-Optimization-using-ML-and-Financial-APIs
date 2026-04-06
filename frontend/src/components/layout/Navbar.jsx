import { Bell, User, ChevronDown, Zap } from "lucide-react";

const navItems = [
  { label: "Dashboard", page: "dashboard" },
  { label: "Market Analysis", page: "market" },
  { label: "Portfolio", page: "portfolio" },
  { label: "Risk Analysis", page: "risk" },
  { label: "Reports", page: "reports" },
];

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav
      className="
        h-[76px]
        bg-[#050810]/95
        border-b border-slate-800/50
        backdrop-blur-md
        z-[9000]
      "
      style={{
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="h-full w-full flex items-center justify-between gap-8">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-3 min-w-fit shrink-0 cursor-pointer select-none"
          onClick={() => setActivePage("dashboard")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={18} className="text-white" fill="white" />
          </div>

          <div className="leading-none">
            <span className="text-white font-extrabold text-[22px] tracking-tight">
              Smart<span className="text-blue-400">Invest</span>
            </span>
            <p className="text-slate-500 text-[9px] tracking-[2.4px] uppercase mt-1 font-bold">
              Fintech Terminal
            </p>
          </div>
        </div>

        {/* Center: Nav */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0 px-6">
          <div className="flex items-center gap-2 rounded-full border border-slate-800/40 bg-slate-900/45 px-2 py-2 shadow-inner shadow-black/10">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`h-10 flex items-center justify-center rounded-full border whitespace-nowrap text-[10px] font-semibold tracking-[0.02em] transition-all duration-200 ${
  activePage === item.page
    ? "border-blue-400/30 bg-blue-500/18 text-blue-300 shadow-[0_0_0_1px_rgba(96,165,250,0.06)]"
    : "border-transparent bg-transparent text-slate-400 hover:border-slate-700/40 hover:bg-slate-800/45 hover:text-slate-200"
}`}
style={{
  paddingLeft: "32px",
  paddingRight: "32px",
  lineHeight: 1
}}

              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0 pr-1">
          <button className="relative w-10 h-10 rounded-xl bg-slate-900/45 border border-slate-800/45 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a1628]"></span>
          </button>

          <button className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-slate-900/45 border border-slate-800/45 hover:border-slate-700 hover:bg-slate-800/45 transition-all duration-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/30">
              <User size={14} className="text-slate-300" />
            </div>

            <div className="hidden md:block text-left leading-none">
              <p className="text-white text-[11px] font-bold">Dipesh R.</p>
              <p className="text-slate-500 text-[9px] mt-1">Pro Plan</p>
            </div>

            <ChevronDown size={13} className="text-slate-600 hidden md:block" />
          </button>
        </div>
      </div>
    </nav>
  );
}
