import React, { useState, useEffect } from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "CHART AI", page: "ma-chart", hotkey: "1" },
  { label: "TECHNICAL", page: "ma-technical", hotkey: "2" },
  { label: "SENTIMENT", page: "ma-sentiment", hotkey: "3" },
  { label: "HISTORY", page: "ma-history", hotkey: "4" },
  { label: "MARKET", page: "ma-market", hotkey: "5" },
  { label: "REPORT", page: "ma-report", hotkey: "6" },
];

export default function Navbar({ activePage, setActivePage }) {
  const { isDark, toggle } = useTheme();
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key >= "1" && e.key <= "6") {
        e.preventDefault();
        const targetItem = navItems.find((item) => item.hotkey === e.key);
        if (targetItem) setActivePage(targetItem.page);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActivePage]);

  return (
    <nav className="sticky top-0 z-[9000] h-[92px] md:h-[105px] w-full border-b border-white/[0.08] bg-[#050810]/80 backdrop-blur-3xl saturate-[180%] overflow-hidden">
      
      {/* ─── SPECTRAL DEPTH ─── */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] via-transparent to-fuchsia-500/[0.04] pointer-events-none" />
      
      {/* ─── BOTTOM SHIMMER ─── */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-white/[0.05]">
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-[40%] h-full bg-gradient-to-r from-transparent via-violet-400/30 to-transparent"
        />
      </div>

      <div className="relative mx-auto h-full max-w-[1800px] px-10 lg:px-16 flex items-center justify-between">
        
        {/* ───────── LEFT: BRANDING ───────── */}
        <div className="flex items-center flex-1">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setActivePage("ma-chart")}>
            <div className="relative w-14 h-14 rounded-[22px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl border border-white/10">
              <Zap size={26} className="text-white fill-white" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-[26px] leading-none tracking-tighter">
                  Smart<span className="text-violet-400">Invest</span>
                </span>
                <div className="flex gap-[3px] items-end h-4 mb-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-[2.5px] bg-violet-400 rounded-full" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[6px] opacity-60">Multi-AI Terminal</span>
            </div>
          </div>
        </div>

        {/* ───────── CENTER: NAVIGATION ───────── */}
        <div className="hidden lg:flex flex-[2] justify-center">
          <div className="flex items-center p-2 rounded-[26px] bg-slate-950/40 border border-white/[0.05] shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 relative z-10">
              {navItems.map((item) => {
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.page}
                    onMouseEnter={() => setHoveredTab(item.page)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActivePage(item.page)}
                    className={`group relative px-9 py-4 rounded-xl text-[12px] font-black tracking-[0.22em] transition-all duration-300
                      ${isActive ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent border border-white/[0.12] rounded-xl z-[-1]" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />
                      )}
                    </AnimatePresence>
                    <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───────── RIGHT: UTILITIES ───────── */}
        <div className="flex items-center flex-1 justify-end gap-10">
          <div className="flex items-center gap-6 pr-10 border-r border-white/[0.08]">
            <NavIconBtn onClick={toggle}>
              {isDark ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-indigo-400" />}
            </NavIconBtn>
            <NavIconBtn className="relative group/bell">
              <Bell size={22} className="group-hover/bell:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-fuchsia-500 rounded-full ring-[4px] ring-[#050810]" />
            </NavIconBtn>
          </div>

          <button className="flex items-center gap-5 pl-2 pr-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/40 transition-all group shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10">
              <User size={20} className="text-slate-300 group-hover:text-white" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <p className="text-[14px] font-bold text-slate-100 leading-none">Portfolio</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-500 group-hover:text-white transition-all" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavIconBtn({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white border border-transparent hover:border-white/10 ${className}`}
    >
      {children}
    </motion.button>
  );
}
