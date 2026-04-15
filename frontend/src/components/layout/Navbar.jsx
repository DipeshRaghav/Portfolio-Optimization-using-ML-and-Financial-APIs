import React, { useState, useEffect, useRef } from "react";
import { Bell, User, ChevronDown, Zap, Sun, Moon, LogIn, LogOut, X, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/** * NAVIGATION CONFIGURATION
 * Defines the links and page identifiers for the central menu
 */
const navItems = [
  { label: "CHART AI", page: "ma-chart" },
  { label: "TECHNICAL", page: "ma-technical" },
  { label: "SENTIMENT", page: "ma-sentiment" },
  { label: "HISTORY", page: "ma-history" },
  { label: "MARKET", page: "ma-market" },
  { label: "REPORT", page: "ma-report" },
];

/** * NOTIFICATION DATA
 * Mocked alerts to display in the Bell dropdown
 */
const mockNotifications = [
  { id: 1, title: "AI Signal", desc: "Bullish divergence detected on BTC/USDT", time: "02:28 AM", type: "ai" },
  { id: 2, title: "Market Alert", desc: "NVDA reached target price of ₹75,000", time: "02:15 AM", type: "alert" },
];

export default function Navbar({ activePage, setActivePage }) {
  // --- STATE HOOKS ---
  const { isDark, toggle } = useTheme(); // Dark mode context
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Controls User menu
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Controls Bell menu
  const [hasNewNotifications, setHasNewNotifications] = useState(true); // Indicator dot state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Modal overlay state
  const [user, setUser] = useState(null); // Simple auth state simulation

  // --- REFS ---
  // Used for "click outside to close" logic
  const profileRef = useRef(null);
  const bellRef = useRef(null);

  /** * CLICK OUTSIDE HANDLER
   * Closes dropdowns if the user clicks anywhere else on the screen
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (bellRef.current && !bellRef.current.contains(event.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- EVENT HANDLERS ---
  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setHasNewNotifications(false); // Clear the notification dot once clicked
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Utsah", email: "utsah@smartinvest.ai" }); // Mock user login
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
  };

  return (
    <>
      {/* MAIN NAVBAR CONTAINER 
          Using backdrop-blur and absolute gradients for a glassmorphism effect 
      */}
      <nav className="sticky top-0 z-[9000] h-[92px] md:h-[110px] w-full border-b border-white/[0.08] bg-[#050810]/80 backdrop-blur-3xl saturate-[180%] overflow-visible">
        {/* Subtle background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] via-transparent to-fuchsia-500/[0.04] pointer-events-none" />
        
        <div className="relative mx-auto h-full max-w-[1850px] px-6 lg:px-12 flex items-center justify-between gap-4">
          
          {/* ───────── LEFT: BRANDING (FIXED WIDTH) ───────── */}
          <div className="flex items-center flex-none w-[280px]">
            <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setActivePage("ma-chart")}>
              {/* Logo Icon with Gradient and Hover Scale */}
              <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform">
                <Zap size={24} className="text-white fill-white" />
              </div>
              {/* Brand Text */}
              <div className="flex flex-col">
                <span className="text-white font-black text-[22px] leading-none tracking-tighter">Smart<span className="text-violet-400">Invest</span></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[4px] mt-1 opacity-60">Multi-AI Terminal</span>
              </div>
            </div>
          </div>

          {/* ───────── CENTER: SPACED NAVIGATION (FLEXIBLE) ───────── */}
          <div className="hidden lg:flex flex-auto justify-center">
            {/* Nav Pill Container */}
            <div className="flex items-center p-1.5 rounded-[24px] bg-slate-950/40 border border-white/[0.05] shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 relative z-10">
                {navItems.map((item) => (
                  <button 
                    key={item.page} 
                    onClick={() => setActivePage(item.page)} 
                    className={`relative px-8 xl:px-10 py-4 rounded-xl text-[12px] font-black tracking-[0.25em] transition-all duration-300 ${activePage === item.page ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
                  >
                    {/* Framer Motion LayoutId handles the "sliding" pill animation between buttons */}
                    {activePage === item.page && (
                      <motion.div layoutId="active-pill" className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent border border-white/[0.12] rounded-xl z-[-1]" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} />
                    )}
                    <span className="relative whitespace-nowrap">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ───────── RIGHT: UTILITIES (LOCKED WIDTH) ───────── */}
          <div className="flex items-center flex-none justify-end gap-6 w-[400px]">
            {/* Theme Toggle and Notifications Group */}
            <div className="flex items-center gap-4 pr-6 border-r border-white/[0.08]">
              {/* Light/Dark Toggle */}
              <NavIconBtn onClick={toggle}>
                {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
              </NavIconBtn>
              
              {/* Notification Bell Component */}
              <div className="relative" ref={bellRef}>
                <NavIconBtn onClick={handleToggleNotifications} className={isNotificationsOpen ? "bg-white/[0.08] text-white" : ""}>
                  <Bell size={20} />
                  {/* Ping Animation Indicator */}
                  {hasNewNotifications && (
                    <div className="absolute top-3.5 right-3.5 flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></span>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                    </div>
                  )}
                </NavIconBtn>

                {/* Notifications Dropdown Menu */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                      className="absolute top-full mt-4 right-0 w-[300px] rounded-3xl bg-[#0a0f1d]/95 border border-white/[0.08] backdrop-blur-2xl shadow-2xl p-4"
                    >
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4 px-1">Live Feed</p>
                      <div className="space-y-2">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors cursor-pointer">
                            <p className="text-[11px] font-bold text-slate-200">{notif.title}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{notif.desc}</p>
                            <p className="text-[8px] font-black text-violet-400/60 uppercase mt-1 tracking-widest">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PROFILE SECTION: Displays Guest or Logged In User */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-4 pl-1.5 pr-4 py-1.5 rounded-2xl transition-all border ${isProfileOpen ? 'bg-violet-500/10 border-violet-500/50' : 'bg-white/[0.03] border-white/[0.06] hover:border-white/20'}`}>
                {/* User Avatar Box */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${user ? "bg-violet-500/20 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]" : "bg-slate-800 border-white/10"}`}>
                  {user ? <span className="text-[14px] font-black text-violet-400 tracking-tighter">US</span> : <User size={18} className="text-slate-300" />}
                </div>
                {/* User Info labels */}
                <div className="hidden xl:flex flex-col text-left">
                  <p className="text-[13px] font-bold text-slate-100 leading-none">{user ? user.name : "Guest"}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{user ? "Live Account" : "Sign In"}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180 text-violet-300' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                    className="absolute top-full mt-4 right-0 w-60 rounded-2xl bg-[#0a0f1d]/95 border border-white/[0.08] backdrop-blur-2xl shadow-2xl p-2"
                  >
                    {!user ? (
                      <DropdownItem icon={<LogIn size={16}/>} label="Sign In / Register" color="text-violet-400" onClick={() => {setIsAuthModalOpen(true); setIsProfileOpen(false);}} />
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-white/[0.05] mb-2 text-left">
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

      {/* AUTH MODAL 
          Full-screen overlay for user login
      */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Dark Overlay Background */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            
            {/* Modal Content Card */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-[32px] bg-[#0d111a] border border-white/[0.1] shadow-2xl p-8 pb-10 overflow-hidden">
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-600" />
                
                {/* Close Button */}
                <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors z-10"><X size={20}/></button>
                
                {/* Header Information */}
                <div className="text-center mb-10 mt-6">
                  <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto mb-5 border border-violet-500/20"><Zap size={32} className="text-violet-500 fill-violet-500" /></div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Access Terminal</h2>
                  <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
                </div>

                {/* Login Form with Floating Labels */}
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
                  {/* Action Button */}
                  <button type="submit" className="w-full h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white font-black text-xl shadow-lg mt-6">Sign In</button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * HELPER COMPONENT: DROPDOWN ITEM
 * Renders individual buttons inside the profile/notification menus
 */
function DropdownItem({ icon, label, onClick, color = "text-slate-300" }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all group">
      <span className={`${color} group-hover:scale-110 transition-transform`}>{icon}</span>
      <span className={`text-[13px] font-medium ${color} group-hover:text-white`}>{label}</span>
    </button>
  );
}

/**
 * HELPER COMPONENT: NAV ICON BTN
 * Standardized button style for theme toggle and notifications
 */
function NavIconBtn({ children, onClick, className = "" }) {
  return (
    <motion.button whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.06)" }} whileTap={{ scale: 0.9 }} onClick={onClick}
      className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-white border border-transparent hover:border-white/10 transition-all duration-200 ${className}`}>
      {children}
    </motion.button>
  );
}
