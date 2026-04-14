import React from "react";
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

  return (
    <nav className="sticky top-0 z-[9000] h-[72px] md:h-[80px] border-b border-white/[0.08] bg-[#050810]/70 backdrop-blur-2xl shadow-2xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* ───────── LEFT: LOGO ───────── */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          onClick={() => setActivePage("ma-chart")}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={18} className="text-white fill-white" />
            </div>
          </div>

          <div className="leading-tight hidden xs:block">
            <span className="text-white font-bold text-[22px] tracking-tight">
              Smart<span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Invest</span>
            </span>
            <p className="text-slate-500 text-[10px] tracking-[2.5px] uppercase font-bold opacity-80">
              Multi-AI Terminal
            </p>
          </div>
        </motion.div>

        {/* ───────── CENTER: NAV PILL ───────── */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-1 p-1.5 rounded-full border border-white/[0.08] bg-slate-900/40 backdrop-blur-md shadow-inner">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => setActivePage(item.page)}
                  className={`relative h-9 px-5 rounded-full text-[12px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap
                    ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ───────── RIGHT: ACTIONS ───────── */}
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <NavActionIcon onClick={toggle} activeColor="text-amber-400">
              {isDark ? <Sun size={18} /> : <Moon size={18} className="text-indigo-400" />}
            </NavActionIcon>

            {/* Notifications */}
            <NavActionIcon className="relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-fuchsia-500 rounded-full border-2 border-[#050810] animate-pulse" />
            </NavActionIcon>
          </div>

          {/* Profile Component */}
          <button className="group flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-slate-900/50 border border-white/[0.05] hover:border-violet-500/40 hover:bg-slate-800/80 transition-all duration-300 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-white/10 group-hover:border-violet-500/30 transition-colors">
              <User size={16} className="text-slate-300 group-hover:text-white" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-bold text-slate-100 group-hover:text-violet-300 transition-colors">Portfolio</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Live</p>
              </div>
            </div>

            <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300 transition-transform group-hover:rotate-180" />
          </button>

        </div>
      </div>
    </nav>
  );
}

// Reusable Icon Wrapper for Right Side
function NavActionIcon({ children, onClick, className = "", activeColor = "text-violet-400" }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-11 h-11 rounded-xl bg-slate-900/50 border border-white/[0.05] flex items-center justify-center text-slate-400 hover:${activeColor} hover:border-violet-500/20 hover:bg-slate-800/80 transition-all duration-200 ${className}`}
    >
      {children}
    </motion.button>
  );
}
