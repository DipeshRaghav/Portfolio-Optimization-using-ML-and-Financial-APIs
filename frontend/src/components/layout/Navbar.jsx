import { useState } from "react";
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
    <nav className="flex items-center justify-between px-6 py-3 bg-[#050810] border-b border-slate-800/40 z-[9000]">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setActivePage("dashboard")}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div>
          <span className="text-white font-extrabold text-xl leading-none tracking-tight">
            Smart<span className="text-blue-400">Invest</span>
          </span>
          <p className="text-slate-500 text-[9px] tracking-[2px] uppercase leading-none mt-1 font-bold">
            Fintech Terminal
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-900/40 p-1 rounded-xl border border-slate-800/30">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activePage === item.page
                ? "bg-blue-500/15 text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">


        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-900/40 border border-slate-800/40 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a1628] live-dot"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:border-slate-700 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/30">
            <User size={14} className="text-slate-300" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-white text-[11px] font-bold leading-none">Dipesh R.</p>
            <p className="text-slate-500 text-[9px] mt-0.5 leading-none">Pro Plan</p>
          </div>
          <ChevronDown size={12} className="text-slate-600 hidden md:block" />
        </button>
      </div>
    </nav>
  );
}

