import React, { useState } from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <nav className="sticky top-0 z-[9000] h-[84px] md:h-[92px] w-full border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-2xl">
      {/* ─── BOTTOM SHIMMER LINE ─── */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative mx-auto h-full max-w-[1700px] px-8 lg:px-14 flex items-center justify-between">
        
        {/* ───────── LEFT: LOGO & AI PULSE ───────── */}
        <div className="flex items-center flex-1">
          <div
            className="flex items-center gap-5 cursor-pointer group"
            onClick={() => setActivePage("ma-chart")}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Zap size={22} className="text-white fill-white" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-[24px] leading-none tracking-tighter">
                  Smart<span className="text-violet-400">Invest</span>
                </span>
                <div className="flex gap-[2px] items-end h-3 mb-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 10, 4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-[2px] bg-violet-400/50 rounded-full"
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[4px] mt-1.5 opacity-70">
                Multi-AI Terminal
              </span>
            </div>
          </div>
        </div>

        {/* ───────── CENTER: SPACIOUS NAV ───────── */}
        <div className="hidden lg:flex flex-[2] justify-center">
          <div className="flex items-center p-2 rounded-2xl bg-slate-950/40 border border-white/[0.05] shadow-2xl">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.page}
                    onMouseEnter={() => setHoveredTab(item.page)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActivePage(item.page)}
                    className={`relative px-7 py-3 rounded-xl text-[13px] font-bold tracking-widest transition-colors duration-300
                      ${isActive ? "text-white" : "text-slate-400 hover:text-slate-100"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-violet-500/10 border border-violet-500/20 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───────── RIGHT: ACTIONS ───────── */}
        <div className="flex items-center flex-1 justify-end gap-8">
          
          <div className="hidden xl:flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-4 pr-8 border-r border-white/[0.08]">
            <NavIconBtn onClick={toggle}>
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
            </NavIconBtn>
            
            <NavIconBtn className="relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-violet-500 rounded-full ring-[4px] ring-[#050810]" />
            </NavIconBtn>
          </div>

          {/* Profile */}
          <button className="flex items-center gap-4 pl-2 pr-5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-violet-500/50">
              <User size={18} className="text-slate-300 group-hover:text-white" />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-[13px] font-bold text-slate-100 leading-none">Portfolio</p>
              <p className="text-[10px] font-black text-violet-400/80 uppercase tracking-tighter mt-1">Pro</p>
            </div>
            <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-all" />
          </button>
          
        </div>
      </div>
    </nav>
  );
}

function NavIconBtn({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
}
