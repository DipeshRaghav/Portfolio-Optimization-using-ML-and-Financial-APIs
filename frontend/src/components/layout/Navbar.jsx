import React, { useState } from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "CHART AI", page: "ma-chart" },
  { label: "TECHNICAL", page: "ma-technical" },
  { label: "SENTIMENT", page: "ma-sentiment" },
  { label: "HISTORY", page: "ma-history" },
  { label: "MARKET", page: "ma-market" },
  { label: "REPORT", page: "ma-report" },
];

export default function Navbar({ activePage, setActivePage }) {
  const { isDark, toggle } = useTheme();
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <nav className="sticky top-0 z-[9000] h-[88px] md:h-[100px] w-full border-b border-white/[0.08] bg-[#050810]/80 backdrop-blur-3xl saturate-[180%] overflow-hidden">
      
      {/* ─── SPECTRAL LAYER ─── */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.05] via-transparent to-fuchsia-500/[0.05] pointer-events-none" />
      
      {/* ─── BOTTOM SHIMMER ─── */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-white/[0.05]">
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="w-[40%] h-full bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
        />
      </div>

      <div className="relative mx-auto h-full max-w-[1700px] px-8 lg:px-14 flex items-center justify-between gap-12">
        
        {/* ───────── LEFT: BRANDING ───────── */}
        <div className="flex items-center flex-1 min-w-[280px]">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-6 cursor-pointer group"
            onClick={() => setActivePage("ma-chart")}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-violet-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-14 h-14 rounded-[20px] bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-600/30 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                <Zap size={24} className="text-white fill-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-[26px] leading-none tracking-tighter">
                  Smart<span className="text-violet-400">Invest</span>
                </span>
                <div className="flex gap-[3px] items-end h-3 mb-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 4], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-[2.5px] bg-violet-400/80 rounded-full shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[5px] opacity-50">
                Multi-AI Terminal
              </span>
            </div>
          </motion.div>
        </div>

        {/* ───────── CENTER: INTERACTIVE NAV ───────── */}
        <div className="hidden lg:flex flex-[3] justify-center">
          <div className="relative flex items-center p-1.5 rounded-[24px] bg-slate-950/40 border border-white/[0.06] shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-1.5 relative z-10">
              {navItems.map((item) => {
                const isActive = activePage === item.page;
                const isHovered = hoveredTab === item.page;

                return (
                  <button
                    key={item.page}
                    onMouseEnter={() => setHoveredTab(item.page)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActivePage(item.page)}
                    className={`relative px-7 py-3.5 rounded-xl text-[11px] font-black tracking-[0.2em] transition-all duration-300
                      ${isActive ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    {/* Active Background Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-transparent border border-white/[0.15] shadow-xl rounded-xl z-[-1]"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Ghost Hover Pill */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="hover-pill"
                        className="absolute inset-0 bg-white/[0.04] rounded-xl z-[-1]"
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                      />
                    )}
                    
                    <span className="relative whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───────── RIGHT: PREMIUM UTILITIES ───────── */}
        <div className="flex items-center flex-1 justify-end gap-6 min-w-[280px]">
          
          <div className="flex items-center gap-4 pr-8 border-r border-white/[0.1]">
            <NavIconBtn onClick={toggle}>
              {isDark ? (
                <Sun size={22} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
              ) : (
                <Moon size={22} className="text-indigo-400" />
              )}
            </NavIconBtn>
            
            <NavIconBtn className="relative group/bell">
              <Bell size={22} className="group-hover/bell:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-fuchsia-500 rounded-full ring-[4px] ring-[#050810] shadow-[0_0_15px_rgba(217,70,239,0.6)] animate-pulse" />
            </NavIconBtn>
          </div>

          <motion.button 
            whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.06)" }}
            className="flex items-center gap-5 pl-2 pr-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/50 transition-all duration-300 group shadow-lg"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center border border-white/10 group-hover:border-violet-400/40">
              <User size={20} className="text-slate-300 group-hover:text-white transition-colors" />
              <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="hidden xl:flex flex-col text-left">
              <p className="text-[14px] font-bold text-slate-100 leading-none">Portfolio</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LIVE</p>
              </div>
            </div>
            
            <ChevronDown size={16} className="text-slate-500 group-hover:text-white transition-all group-hover:translate-y-0.5" />
          </motion.button>
          
        </div>
      </div>
    </nav>
  );
}

function NavIconBtn({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-300 border border-transparent hover:border-white/10 ${className}`}
    >
      {children}
    </motion.button>
  );
}
