import React from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Chart AI", page: "ma-chart" },
  { label: "Technical", page: "ma-technical" },
  { label: "Sentiment", page: "ma-sentiment" },
  { label: "History", page: "ma-history" },
  { label: "Market", page: "ma-market" },
  { label: "Report", page: "ma-report" },
];

export default function Navbar({ activePage, setActivePage }) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-[9000] h-[80px] md:h-[88px] border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-2xl">
      {/* Increased max-width and internal padding for a spacious feel */}
      <div className="mx-auto h-full max-w-[1600px] px-8 lg:px-12 flex items-center justify-between">
        
        {/* ───────── LEFT: LOGO (Widened Spacing) ───────── */}
        <div className="flex items-center flex-1 justify-start">
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setActivePage("ma-chart")}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/10">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-[22px] leading-none tracking-tight">
                Smart<span className="text-violet-400">Invest</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[3px] mt-1.5">
                Multi-AI Terminal
              </span>
            </div>
          </motion.div>
        </div>

        {/* ───────── CENTER: NAV ITEMS (Increased Gap & Padding) ───────── */}
        <div className="hidden lg:flex flex-[2] justify-center">
          <div className="flex items-center p-2 rounded-2xl bg-slate-950/40 border border-white/[0.04] shadow-inner">
            {/* Increased gap between buttons from gap-1 to gap-3 */}
            <div className="flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => setActivePage(item.page)}
                    className={`relative px-6 py-2.5 rounded-xl text-[13px] font-bold tracking-wider transition-all duration-300
                      ${isActive ? "text-white" : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-violet-500/10 border border-violet-500/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───────── RIGHT: UTILITIES (More separation) ───────── */}
        <div className="flex items-center flex-1 justify-end gap-6">
          
          {/* Icons Grouped with larger gap */}
          <div className="flex items-center gap-4 pr-6 border-r border-white/[0.1]">
            <NavIconButton onClick={toggle}>
              {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-indigo-400" />}
            </NavIconButton>
            
            <NavIconButton className="relative">
              <Bell size={19} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-violet-500 rounded-full border-[3px] border-[#050810]" />
            </NavIconButton>
          </div>

          {/* Profile with wider internal padding */}
          <button className="flex items-center gap-4 pl-1.5 pr-4 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.06] transition-all group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center border border-white/10 group-hover:border-violet-500/50 transition-colors">
              <User size={16} className="text-slate-300 group-hover:text-white" />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-[12px] font-bold text-slate-100 leading-tight">Portfolio</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-bold text-slate-500 uppercase">Live</p>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-500 group-hover:translate-y-0.5 transition-transform ml-1" />
          </button>
          
        </div>
      </div>
    </nav>
  );
}

function NavIconButton({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
}
