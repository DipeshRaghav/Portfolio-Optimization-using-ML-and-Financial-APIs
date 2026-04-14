import React, { useState, useEffect, useRef } from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon, LogIn, LogOut, X, Mail, Lock } from "lucide-react";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // UPDATED AUTH STATE: Name set to Utsah
  const [user, setUser] = useState(null); 

  const profileRef = useRef(null);

  // Global Keyboard Shortcuts (Alt + 1-6)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key >= "1" && e.key <= "6") {
        e.preventDefault();
        const target = navItems.find(item => item.hotkey === e.key);
        if (target) setActivePage(target.page);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActivePage]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Utsah", email: "utsah@smartinvest.ai" });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-[9000] h-[92px] md:h-[105px] w-full border-b border-white/[0.08] bg-[#050810]/80 backdrop-blur-3xl saturate-[180%] overflow-visible">
        
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] via-transparent to-fuchsia-500/[0.04] pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden bg-white/[0.05]">
          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-[40%] h-full bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
        </div>

        <div className="relative mx-auto h-full max-w-[1800px] px-10 lg:px-16 flex items-center justify-between">
          
          {/* LEFT: BRANDING */}
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setActivePage("ma-chart")}>
              <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform">
                <Zap size={26} className="text-white fill-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-[26px] leading-none tracking-tighter">Smart<span className="text-violet-400">Invest</span></span>
                  <div className="flex gap-[3px] items-end h-4 mb-1">
                    {[1, 2, 3].map((i) => (
                      <motion.div key={i} animate={{ height: [4, 14, 4], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-[2.5px] bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.4)]" />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[6px] opacity-60">Multi-AI Terminal</span>
              </div>
            </div>
          </div>

          {/* CENTER: NAV WITH HOTKEYS */}
          <div className="hidden lg:flex flex-[2] justify-center">
            <div className="flex items-center p-2 rounded-[26px] bg-slate-950/40 border border-white/[0.05] shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 relative z-10">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => setActivePage(item.page)}
                    className={`group relative px-9 py-4 rounded-xl text-[12px] font-black tracking-[0.22em] transition-all duration-300 ${activePage === item.page ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    {activePage === item.page && (
                      <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent border border-white/[0.12] rounded-xl z-[-1]" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />
                    )}
                    <span className="relative flex items-center gap-3">
                      {item.label}
                      <span className="hidden group-hover:flex items-center justify-center w-4 h-4 text-[9px] rounded-[5px] bg-white/10 border border-white/5 text-slate-400 font-bold">
                        {item.hotkey}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: UTILITIES */}
          <div className="flex items-center flex-1 justify-end gap-10">
            <div className="flex items-center gap-6 pr-10 border-r border-white/[0.08]">
              <NavIconBtn onClick={toggle}>
                {isDark ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-indigo-400" />}
              </NavIconBtn>
              <NavIconBtn className="relative">
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-fuchsia-500 rounded-full ring-[4px] ring-[#050810]" />
              </NavIconBtn>
            </div>

            {/* PROFILE SECTION */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-4 pl-2 pr-5 py-2 rounded-2xl transition-all duration-300 border
                  ${isProfileOpen ? 'bg-violet-500/10 border-violet-500/50' : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20'}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300
                  ${user ? "bg-violet-500/20 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]" : "bg-slate-800 border-white/10"}`}>
                  {user ? (
                    <span className="text-[15px] font-black text-violet-400 tracking-tighter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">US</span>
                  ) : (
                    <User size={20} className="text-slate-300" />
                  )}
                </div>
                
                <div className="hidden xl:flex flex-col text-left mr-2">
                  <p className="text-[14px] font-bold text-slate-100 leading-none">{user ? user.name : "Guest"}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5">{user ? "Live Account" : "Sign In"}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute top-full mt-4 right-0 w-64 rounded-2xl bg-[#0a0f1d]/95 border border-white/[0.08] backdrop-blur-2xl shadow-2xl p-2"
                  >
                    {!user ? (
                      <DropdownItem icon={<LogIn size={16}/>} label="Sign In / Register" color="text-violet-400" onClick={() => {setIsAuthModalOpen(true); setIsProfileOpen(false);}} />
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-white/[0.05] mb-2">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated As</p>
                           <p className="text-[13px] font-bold text-white truncate">{user.email}</p>
                        </div>
                        <DropdownItem icon={<LogOut size={16}/>} label="Logout" color="text-rose-400" onClick={handleLogout} />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-[32px] bg-[#0d111a] border border-white/[0.1] shadow-2xl p-8 pb-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-600" />
                <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors z-10"><X size={20}/></button>
                <div className="text-center mb-10 mt-6 relative z-10">
                  <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto mb-5 border border-violet-500/20"><Zap size={32} className="text-violet-500 fill-violet-500" /></div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Access Terminal</h2>
                  <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                    <input type="email" required id="email" placeholder="name@example.com" className="peer w-full h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-14 pr-4 pt-6 text-[15px] font-medium text-white placeholder:opacity-0 focus:placeholder:opacity-100 focus:outline-none focus:border-violet-500/50 transition-all" />
                    <label htmlFor="email" className="absolute left-14 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none transition-all peer-focus:top-4 peer-focus:text-[10px] peer-focus:text-violet-400 peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[10px]">Email Address</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                    <input type="password" required id="password" placeholder="••••••••" className="peer w-full h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-14 pr-4 pt-6 text-[15px] font-medium text-white placeholder:opacity-0 focus:placeholder:opacity-100 focus:outline-none focus:border-violet-500/50 transition-all" />
                    <label htmlFor="password" className="absolute left-14 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none transition-all peer-focus:top-4 peer-focus:text-[10px] peer-focus:text-violet-400 peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[10px]">Password</label>
                  </div>
                  <button type="submit" className="w-full h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-black text-xl shadow-lg mt-6">Sign In</button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownItem({ icon, label, onClick, color = "text-slate-300" }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all group">
      <span className={`${color} group-hover:scale-110 transition-transform`}>{icon}</span>
      <span className={`text-[13px] font-medium ${color} group-hover:text-white`}>{label}</span>
    </button>
  );
}

function NavIconBtn({ children, onClick, className = "" }) {
  return (
    <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.06)" }} whileTap={{ scale: 0.9 }} onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white border border-transparent hover:border-white/10 ${className}`}>
      {children}
    </motion.button>
  );
}
